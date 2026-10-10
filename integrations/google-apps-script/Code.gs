const USERS = 'Users';
const PRODUCT_SUBSCRIPTIONS = 'ProductSubscriptions';
const NEWSLETTER = 'Newsletter';
const NEXOBREAK = 'NexoBreak';
const TOKEN_VALID_DAYS = 7;

function doPost(event) {
  if (event && event.parameter && event.parameter.service === 'licensing') return licensingPost_(event);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse((event && event.parameter && event.parameter.payload) || '{}');
    if (data.website) return json_({ ok: true });
    const action = clean_(data.action, 40) || 'newsletter_subscribe';
    if (action === 'nexobreak_join') return joinNexoBreak_(data);
    if (action === 'nexobreak_sync') return syncNexoBreak_(data);
    return subscribeNewsletter_(data);
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: error.message });
  } finally {
    lock.releaseLock();
  }
}

function subscribeNewsletter_(data) {
  validateNewsletter_(data);
  const users = sheet_(USERS);
  const newsletter = sheet_(NEWSLETTER);
  const email = email_(data.email);
  const user = upsertUser_(users, email, data.fullName);
  const consentRow = findRow_(newsletter, 3, email);
  if (consentRow) {
    const status = String(newsletter.getRange(consentRow, 6).getValue());
    if (status === 'subscribed') return json_({ ok: true, status: 'already-subscribed' });
    newsletter.deleteRow(consentRow);
  }
  const now = new Date();
  const token = Utilities.getUuid() + Utilities.getUuid();
  newsletter.appendRow([
    'consent_' + Utilities.getUuid(), user.userId, email, 'v1', now, 'pending', '',
    clean_(data.source, 160), clean_(data.educationLevel, 80), clean_(data.fieldOfStudy, 120),
    clean_(data.occupation, 120), clean_(data.organization, 160),
    data.interests.map(function(value) { return clean_(value, 80); }).join(', '),
    clean_(data.currentExploration, 500), token, '', now
  ]);
  sendConfirmation_(data.fullName, email, token);
  return json_({ ok: true, status: 'pending-confirmation' });
}

function joinNexoBreak_(data) {
  const displayName = clean_(data.displayName, 80);
  const email = email_(data.email);
  if (!displayName || data.consent !== true) throw new Error('Display name, email, and Game Club consent are required.');
  const users = sheet_(USERS);
  const subscriptions = sheet_(PRODUCT_SUBSCRIPTIONS);
  const scores = sheet_(NEXOBREAK);
  ensureNexoBreakHeaders_(scores);
  const user = upsertUser_(users, email, displayName);
  upsertProductSubscription_(subscriptions, user.userId, clean_(data.source, 160));

  const row = findRow_(scores, 1, user.userId);
  const token = Utilities.getUuid() + Utilities.getUuid();
  const tokenHash = hash_(token);
  const clientHighScore = nonNegativeInteger_(data.highScore);
  const clientTotalStars = nonNegativeInteger_(data.totalStars);
  const now = new Date();
  let highScore = clientHighScore;
  let totalStars = clientTotalStars;
  let revision = 1;
  if (row) {
    highScore = Math.max(nonNegativeInteger_(scores.getRange(row, 2).getValue()), clientHighScore);
    totalStars = Math.max(nonNegativeInteger_(scores.getRange(row, 3).getValue()), clientTotalStars);
    revision = nonNegativeInteger_(scores.getRange(row, 6).getValue()) + 1;
    scores.getRange(row, 2, 1, 6).setValues([[
      highScore, totalStars, now, clean_(data.pluginVersion, 40), revision, tokenHash
    ]]);
  } else {
    scores.appendRow([user.userId, highScore, totalStars, now, clean_(data.pluginVersion, 40), revision, tokenHash]);
  }
  const gameScores = mergeGameScores_(scores, row || scores.getLastRow(), data);
  return json_({
    ...gameScores,
    ok: true,
    status: row ? 'profile-restored' : 'joined',
    userId: user.userId,
    accessToken: token,
    displayName: displayName,
    email: email,
    highScore: highScore,
    totalStars: totalStars,
    syncRevision: revision
  });
}

function syncNexoBreak_(data) {
  const userId = clean_(data.userId, 80);
  const accessToken = clean_(data.accessToken, 160);
  if (!userId || !accessToken) throw new Error('Game Club identity is missing.');
  const scores = sheet_(NEXOBREAK);
  ensureNexoBreakHeaders_(scores);
  const row = findRow_(scores, 1, userId);
  if (!row || String(scores.getRange(row, 7).getValue()) !== hash_(accessToken))
    throw new Error('Game Club session is invalid. Sign out and join again.');

  const highScore = Math.max(nonNegativeInteger_(scores.getRange(row, 2).getValue()), nonNegativeInteger_(data.highScore));
  const totalStars = Math.max(nonNegativeInteger_(scores.getRange(row, 3).getValue()), nonNegativeInteger_(data.totalStars));
  const revision = nonNegativeInteger_(scores.getRange(row, 6).getValue()) + 1;
  scores.getRange(row, 2, 1, 5).setValues([[
    highScore, totalStars, new Date(), clean_(data.pluginVersion, 40), revision
  ]]);
  const userRow = findRow_(sheet_(USERS), 1, userId);
  if (userRow) sheet_(USERS).getRange(userRow, 6).setValue(new Date());
  return json_({ ...mergeGameScores_(scores, row, data), ok: true, status: 'synced', highScore: highScore, totalStars: totalStars, syncRevision: revision });
}

function doGet(event) {
  const token = clean_(event && event.parameter && event.parameter.confirm, 100);
  if (!token) return page_('NexoNest data service', 'The NexoNest data service is online.', true);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const newsletter = sheet_(NEWSLETTER);
    const row = findRow_(newsletter, 15, token);
    if (!row) return page_('Link not found', 'This link may already have been used.', false);
    const submittedAt = newsletter.getRange(row, 17).getValue();
    if (Date.now() - new Date(submittedAt).getTime() > TOKEN_VALID_DAYS * 86400000) {
      newsletter.getRange(row, 6).setValue( 'expired');
      return page_('Link expired', 'Return to NexoNest and subscribe again.', false);
    }
    newsletter.getRange(row, 6).setValue('subscribed');
    newsletter.getRange(row, 15).clearContent();
    newsletter.getRange(row, 16).setValue(new Date());
    return page_('Subscription confirmed', 'You are now part of NexoNest Field Notes.', true);
  } finally {
    lock.releaseLock();
  }
}

function upsertUser_(users, email, displayName) {
  const row = findRow_(users, 3, email);
  const now = new Date();
  if (row) {
    users.getRange(row, 4).setValue(clean_(displayName, 120));
    users.getRange(row, 6).setValue(now);
    users.getRange(row, 7).setValue('active');
    return { userId: String(users.getRange(row, 1).getValue()), row: row };
  }
  const userId = 'usr_' + Utilities.getUuid();
  users.appendRow([userId, '', email, clean_(displayName, 120), now, now, 'active']);
  return { userId: userId, row: users.getLastRow() };
}

function upsertProductSubscription_(subscriptions, userId, source) {
  if (subscriptions.getLastRow() >= 2) {
    const values = subscriptions.getRange(2, 1, subscriptions.getLastRow() - 1, 7).getValues();
    const index = values.findIndex(function(row) {
      return String(row[1]) === userId && String(row[2]).toLowerCase() === 'nexobreak';
    });
    if (index >= 0) {
      const row = index + 2;
      subscriptions.getRange(row, 5).setValue('active');
      subscriptions.getRange(row, 6).clearContent();
      subscriptions.getRange(row, 7).setValue(source);
      return;
    }
  }
  subscriptions.appendRow(['sub_' + Utilities.getUuid(), userId, 'NexoBreak', new Date(), 'active', '', source]);
}

function mergeGameScores_(sheet, row, data) {
  const keys = ['starCatcherHighScore', 'totalCaughtStars', 'duckHuntHighScore', 'totalDuckHits'];
  const previous = sheet.getRange(row, 8, 1, 4).getValues()[0];
  const merged = keys.map(function(key, index) { return Math.max(nonNegativeInteger_(previous[index]), nonNegativeInteger_(data[key])); });
  sheet.getRange(row, 8, 1, 4).setValues([merged]);
  const result = {};
  keys.forEach(function(key, index) { result[key] = merged[index]; });
  return result;
}

function ensureNexoBreakHeaders_(sheet) {
  const headers = ['UserId', 'HighScore', 'TotalStars', 'LastSyncAt', 'PluginVersion', 'SyncRevision', 'AccessTokenHash', 'StarCatcherHighScore', 'TotalCaughtStars', 'DuckHuntHighScore', 'TotalDuckHits'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.setFrozenRows(1);
}

function sheet_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Required sheet is missing: ' + name);
  return sheet;
}

function findRow_(sheet, column, value) {
  if (sheet.getLastRow() < 2) return 0;
  const values = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getDisplayValues();
  const expected = String(value).trim().toLowerCase();
  const index = values.findIndex(function(row) { return String(row[0]).trim().toLowerCase() === expected; });
  return index < 0 ? 0 : index + 2;
}

function validateNewsletter_(data) {
  const minimalSignup = data.subscriptionType === 'nexobreak_newsletter';
  if (!data.fullName || data.consent !== true || (!minimalSignup && (!data.occupation || !data.educationLevel)))
    throw new Error('Required information is missing.');
  if (!Array.isArray(data.interests) || !data.interests.length) throw new Error('Interests are missing.');
  email_(data.email);
}

function email_(value) {
  const email = clean_(value, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email.');
  return email;
}

function nonNegativeInteger_(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.floor(number);
}

function hash_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value), Utilities.Charset.UTF_8);
  return Utilities.base64EncodeWebSafe(bytes);
}

function sendConfirmation_(name, email, token) {
  const url = ScriptApp.getService().getUrl() + '?confirm=' + encodeURIComponent(token);
  const html = '<div style="max-width:560px;margin:auto;padding:36px;font-family:monospace;color:#222;background:#f3f7f6">' +
    '<p style="font-size:11px;letter-spacing:.12em;color:#4b7c6e">NEXONEST / FIELD NOTES</p>' +
    '<h1>Confirm your subscription.</h1><p>Hello ' + escape_(clean_(name, 120)) + ', confirm that you would like to receive occasional NexoNest notes.</p>' +
    '<p style="margin:30px 0"><a href="' + url + '" style="padding:14px 18px;border:1px solid #4b7c6e;color:#222;text-decoration:none">Confirm subscription →</a></p>' +
    '<p style="font-size:10px;color:#6b7280">This link expires in 7 days. Ignore this email if you did not request it.</p></div>';
  MailApp.sendEmail({to: email, subject: 'Confirm your NexoNest Field Notes subscription', body: 'Confirm your subscription: ' + url, htmlBody: html, name: 'NexoNest'});
}

function page_(title, message, success) {
  const color = success ? '#4b7c6e' : '#8b4e4e';
  return HtmlService.createHtmlOutput('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + escape_(title) + ' | NexoNest</title><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#e8f1f0;color:#222;font-family:monospace"><main style="width:min(560px,calc(100% - 40px));border-top:1px solid ' + color + ';padding:28px 0"><p style="font-size:10px;color:#4b7c6e;letter-spacing:.12em">NEXONEST / DATA SERVICE</p><h1 style="font-size:42px;line-height:1">' + escape_(title) + '</h1><p>' + escape_(message) + '</p><a href="https://nexonest.com" style="display:inline-block;margin-top:30px;color:#4b7c6e">Return to NexoNest →</a></main></body>');
}

function clean_(value, limit) { return String(value || '').trim().slice(0, limit); }
function escape_(value) { return String(value).replace(/[&<>"']/g, function(char) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]; }); }
function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }

// --- NexoBreak campaign sender ---
const NB_NEXOBREAK_URL = 'https://www.food4rhino.com/en/browse?searchText=nexobreak&form_build_count=1&sort_by=fs_field_rating';
const NB_NEXOBREAK_PAGE_URL = 'https://nexonest.com/projects-pages/nexoBreak.html';
const NB_NEXOBREAK_DASHBOARD_IMAGE = 'https://nexonest.com/assets/images/projects/nexobreak/dashboard.png';
const NB_NEXOBREAK_BACKUPS_IMAGE = 'https://nexonest.com/assets/images/projects/nexobreak/settings-backups.png';

function sendNexoBreakTestToOwner() {
  licenseAdmin_();
  const email = Session.getActiveUser().getEmail();
  if (!email) throw new Error('Could not detect the active user email.');
  sendNexoBreakCampaignEmail_('Hossein', email);
  return 'Sent NexoBreak test to ' + email;
}

function sendNexoBreakAnnouncement() { return sendNewsletterBatch_('nexobreak-v1'); }
function sendNexoBreakCampaignEmail_(name, email) {
  const safeName = nbEscape_(nbClean_(name, 120) || 'there');
  const safeFood4RhinoUrl = nbEscape_(NB_NEXOBREAK_URL);
  const safePageUrl = nbEscape_(NB_NEXOBREAK_PAGE_URL);
  const safeDashboardImage = nbEscape_(NB_NEXOBREAK_DASHBOARD_IMAGE);
  const safeBackupsImage = nbEscape_(NB_NEXOBREAK_BACKUPS_IMAGE);
  const subject = 'NexoBreak: plan, focus, and recover inside Rhino';
  const html = '<div style="margin:0;padding:0;background:#e8f1f0;color:#1f2a27;font-family:monospace">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#e8f1f0"><tr><td align="center" style="padding:36px 18px">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:collapse;background:#f7faf9;border:1px solid #bdd2cc">' +
    '<tr><td style="padding:34px 34px 18px;border-bottom:1px dotted #8fb1a8">' +
    '<p style="margin:0 0 18px;font-size:11px;line-height:1.5;letter-spacing:.12em;text-transform:uppercase;color:#4b7c6e">NexoNest / Field Notes</p>' +
    '<h1 style="margin:0;max-width:500px;font-size:34px;line-height:1.05;font-weight:600;color:#1f2a27">Plan. Focus. Recover. Meet NexoBreak.</h1>' +
    '</td></tr>' +
    '<tr><td style="padding:30px 34px 8px">' +
    '<p style="margin:0 0 18px;font-size:14px;line-height:1.75;color:#33413d">Hello ' + safeName + ',</p>' +
    '<p style="margin:0 0 18px;font-size:14px;line-height:1.75;color:#33413d"><strong>NexoBreak</strong>, our new focus and break companion for Rhino, is now available on food4Rhino.</p>' +
    '<p style="margin:0 0 18px;font-size:14px;line-height:1.75;color:#33413d">It brings daily task planning, time tracking, guided breaks, local reports, and versioned backups into the modeling workspace, so you can structure the day without leaving Rhino.</p>' +
    '<p style="margin:24px 0 8px"><img src="' + safeDashboardImage + '" alt="NexoBreak dashboard inside Rhino" style="display:block;width:100%;max-width:572px;border:1px solid #bdd2cc"></p>' +
    '<p style="margin:0 0 24px;font-size:11px;line-height:1.6;color:#67736f">Daily planning, focus tracking, break controls, reports, and settings stay close to the Rhino workspace.</p>' +
    '<ul style="margin:0 0 24px;padding:0;list-style:none;border-top:1px dotted #8fb1a8">' +
    '<li style="padding:12px 0;border-bottom:1px dotted #8fb1a8;font-size:13px;line-height:1.65;color:#33413d"><strong>Plan up to five daily tasks</strong><br><span style="color:#67736f">Set estimates, switch focus, and track progress while you work.</span></li>' +
    '<li style="padding:12px 0;border-bottom:1px dotted #8fb1a8;font-size:13px;line-height:1.65;color:#33413d"><strong>Understand your working time</strong><br><span style="color:#67736f">Review local reports with task timing, actual duration, application activity, and idle periods.</span></li>' +
    '<li style="padding:12px 0;border-bottom:1px dotted #8fb1a8;font-size:13px;line-height:1.65;color:#33413d"><strong>Take short guided breaks</strong><br><span style="color:#67736f">Use stretch routines, visual tracking, Vector Vision, Star Catcher, or Duck Hunt inside Rhino.</span></li>' +
    '<li style="padding:12px 0;border-bottom:1px dotted #8fb1a8;font-size:13px;line-height:1.65;color:#33413d"><strong>Keep versioned backups</strong><br><span style="color:#67736f">Create timestamped snapshots of your Rhino model and active Grasshopper definition beside your saved model.</span></li>' +
    '</ul>' +
    '<p style="margin:24px 0 8px"><img src="' + safeBackupsImage + '" alt="NexoBreak safety backup settings" style="display:block;width:100%;max-width:572px;border:1px solid #bdd2cc"></p>' +
    '<p style="margin:0 0 24px;font-size:11px;line-height:1.6;color:#67736f">Autosave-style versioned backups create timestamped copies without moving or renaming your working file.</p>' +
    '<p style="margin:0 0 24px;font-size:14px;line-height:1.75;color:#33413d">Core task, activity, report, and model data stay on your computer. Optional Game Club features share account identity and game scores only.</p>' +
    '<p style="margin:30px 0"><a href="' + safeFood4RhinoUrl + '" style="display:inline-block;padding:15px 19px;border:1px solid #4b7c6e;color:#1f2a27;text-decoration:none;font-size:13px;font-weight:600">Download NexoBreak on food4Rhino</a> <a href="' + safePageUrl + '" style="display:inline-block;margin-left:8px;padding:15px 19px;border:1px dotted #4b7c6e;color:#1f2a27;text-decoration:none;font-size:13px;font-weight:600">View product page</a></p>' +
    '<p style="margin:0 0 24px;font-size:12px;line-height:1.7;color:#67736f">Requirements: Windows, Rhino 8.34 or later, and Rhino running .NET 8. NexoBreak is proprietary software and currently free on food4Rhino.</p>' +
    '<p style="margin:0 0 24px;font-size:12px;line-height:1.7;color:#67736f">You are receiving this because you subscribed to NexoNest Field Notes.</p>' +
    '</td></tr>' +
    '<tr><td style="padding:22px 34px 32px;border-top:1px dotted #8fb1a8">' +
    '<p style="margin:0;font-size:11px;line-height:1.7;color:#67736f">NexoNest<br>Curious by design.</p>' +
    '</td></tr></table></td></tr></table></div>';
  const body = 'Hello ' + (nbClean_(name, 120) || 'there') + ',\n\n' +
    'NexoBreak, our new focus and break companion for Rhino, is now available on food4Rhino.\n\n' +
    'It brings daily task planning, time tracking, guided breaks, local reports, and versioned backups into the modeling workspace, so you can structure the day without leaving Rhino.\n\n' +
    'Download NexoBreak on food4Rhino:\n' + NB_NEXOBREAK_URL + '\n\n' +
    'Product page:\n' + NB_NEXOBREAK_PAGE_URL + '\n\n' +
    'Requirements: Windows, Rhino 8.34 or later, and Rhino running .NET 8.\n\n' +
    'You are receiving this because you subscribed to NexoNest Field Notes.\n\nNexoNest\nCurious by design.';
  MailApp.sendEmail({ to: email, subject: subject, body: body, htmlBody: html, name: 'NexoNest' });
}

function nbHeaderIndex_(headers, candidates) {
  for (let i = 0; i < headers.length; i += 1) if (candidates.indexOf(headers[i]) >= 0) return i;
  return -1;
}
function nbNormalizeHeader_(value) { return String(value || '').trim().toLowerCase().replace(/\s+/g, ' '); }
function nbClean_(value, limit) { return String(value || '').trim().slice(0, limit); }
function nbValidEmail_(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim()); }
function nbEscape_(value) { return String(value).replace(/[&<>"']/g, function (char) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]; }); }
