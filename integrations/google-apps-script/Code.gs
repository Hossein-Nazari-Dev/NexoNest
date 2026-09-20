const SHEET_NAME = 'Subscribers';
const TOKEN_VALID_DAYS = 7;
const NEXOBREAK_URL = 'https://www.food4rhino.com/en/browse?searchText=nexobreak&form_build_count=1&sort_by=fs_field_rating';
const HEADERS = [
  'Submitted At', 'Status', 'Confirmed At', 'Full Name', 'Email',
  'Education Level', 'Field of Study', 'Occupation', 'Organization',
  'Interests', 'Current Exploration', 'Consent', 'Token', 'Source'
];

function setupSheet() {
  const sheet = getSheet_();
  ensureHeaders_(sheet);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(event.parameter.payload || '{}');
    validate_(data);
    if (data.website) return json_({ ok: true });

    const sheet = getSheet_();
    const email = clean_(data.email, 254).toLowerCase();
    const existing = findEmailRow_(sheet, email);
    if (existing && sheet.getRange(existing, 2).getValue() === 'Confirmed') {
      return json_({ ok: true, status: 'already-confirmed' });
    }
    if (existing) sheet.deleteRow(existing);

    const token = Utilities.getUuid() + Utilities.getUuid();
    sheet.appendRow([
      new Date(), 'Pending', '', clean_(data.fullName, 120), email,
      clean_(data.educationLevel, 80), clean_(data.fieldOfStudy, 120),
      clean_(data.occupation, 120), clean_(data.organization, 160),
      data.interests.map(value => clean_(value, 80)).join(', '),
      clean_(data.currentExploration, 500), 'Yes', token, clean_(data.source, 160)
    ]);
    sendConfirmation_(data.fullName, email, token);
    return json_({ ok: true, status: 'pending-confirmation' });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: error.message });
  } finally {
    lock.releaseLock();
  }
}

function doGet(event) {
  const token = clean_(event.parameter.confirm, 100);
  if (!token) return page_('Invalid link', 'This confirmation link is incomplete.', false);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet_();
    if (sheet.getLastRow() < 2) return page_('Link not found', 'This confirmation link is not valid.', false);
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
    const index = rows.findIndex(row => String(row[12]) === token);
    if (index < 0) return page_('Link not found', 'This link may already have been used.', false);

    const row = index + 2;
    const age = Date.now() - new Date(rows[index][0]).getTime();
    if (age > TOKEN_VALID_DAYS * 86400000) {
      sheet.getRange(row, 2).setValue('Expired');
      return page_('Link expired', 'Return to NexoNest and subscribe again.', false);
    }
    sheet.getRange(row, 2).setValue('Confirmed');
    sheet.getRange(row, 3).setValue(new Date());
    sheet.getRange(row, 13).clearContent();
    return page_('Subscription confirmed', 'You are now part of NexoNest Field Notes.', true);
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const file = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = file.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = file.insertSheet(SHEET_NAME);
  ensureHeaders_(sheet);
  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    return;
  }

  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getDisplayValues()[0];
  const hasHeaders = firstRow[0] === HEADERS[0] && firstRow[4] === HEADERS[4];
  if (!hasHeaders) {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  }
}

function findEmailRow_(sheet, email) {
  if (sheet.getLastRow() < 2) return 0;
  const values = sheet.getRange(2, 5, sheet.getLastRow() - 1, 1).getDisplayValues();
  const index = values.findIndex(row => row[0].trim().toLowerCase() === email);
  return index < 0 ? 0 : index + 2;
}

function validate_(data) {
  if (!data.fullName || !data.occupation || !data.educationLevel || !data.consent) {
    throw new Error('Required information is missing.');
  }
  if (!Array.isArray(data.interests) || !data.interests.length) throw new Error('Interests are missing.');
  const email = clean_(data.email, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email.');
}

function sendConfirmation_(name, email, token) {
  const url = ScriptApp.getService().getUrl() + '?confirm=' + encodeURIComponent(token);
  const safeName = escape_(clean_(name, 120));
  const safeUrl = escape_(url);
  const html = '<div style="margin:0;padding:0;background:#e8f1f0;color:#1f2a27;font-family:monospace">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#e8f1f0"><tr><td align="center" style="padding:36px 18px">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;border-collapse:collapse;background:#f7faf9;border:1px solid #bdd2cc">' +
    '<tr><td style="padding:34px 34px 18px;border-bottom:1px dotted #8fb1a8">' +
    '<p style="margin:0 0 18px;font-size:11px;line-height:1.5;letter-spacing:.12em;text-transform:uppercase;color:#4b7c6e">NexoNest / Field Notes</p>' +
    '<h1 style="margin:0;max-width:430px;font-size:34px;line-height:1.05;font-weight:600;color:#1f2a27">Confirm your subscription.</h1>' +
    '</td></tr>' +
    '<tr><td style="padding:30px 34px 8px">' +
    '<p style="margin:0 0 18px;font-size:14px;line-height:1.75;color:#33413d">Hello ' + safeName + ',</p>' +
    '<p style="margin:0 0 18px;font-size:14px;line-height:1.75;color:#33413d">Thanks for joining NexoNest Field Notes. Please confirm that you would like to receive occasional notes on computational design, environmental performance, research methods, and tools for the built environment.</p>' +
    '<p style="margin:0 0 26px;font-size:14px;line-height:1.75;color:#33413d">No fixed schedule, no promotional noise. Just useful updates when the work reaches a point worth sharing.</p>' +
    '<p style="margin:30px 0"><a href="' + safeUrl + '" style="display:inline-block;padding:15px 19px;border:1px solid #4b7c6e;color:#1f2a27;text-decoration:none;font-size:13px;font-weight:600">Confirm subscription</a></p>' +
    '<p style="margin:0 0 24px;font-size:12px;line-height:1.7;color:#67736f">This confirmation link expires in 7 days. If you did not request this, you can ignore this email.</p>' +
    '</td></tr>' +
    '<tr><td style="padding:22px 34px 32px;border-top:1px dotted #8fb1a8">' +
    '<p style="margin:0;font-size:11px;line-height:1.7;color:#67736f">NexoNest<br>Curious by design.</p>' +
    '</td></tr>' +
    '</table>' +
    '</td></tr></table>' +
    '</div>';
  MailApp.sendEmail({
    to: email,
    subject: 'Confirm your NexoNest Field Notes subscription',
    body: 'Hello ' + clean_(name, 120) + ',\n\nThanks for joining NexoNest Field Notes. Confirm your subscription here:\n' + url + '\n\nThis link expires in 7 days. If you did not request this, you can ignore this email.\n\nNexoNest',
    htmlBody: html,
    name: 'NexoNest'
  });
}

function sendNexoBreakTest(testEmail) {
  const email = clean_(testEmail, 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid test email.');
  sendNexoBreakEmail_('Hossein', email);
}

function sendNexoBreakTestToOwner() {
  const email = Session.getActiveUser().getEmail();
  if (!email) throw new Error('Could not detect the active user email. Use sendNexoBreakTest with an email address instead.');
  sendNexoBreakTest(email);
}

function sendNexoBreakAnnouncement() {
  const sheet = getSheet_();
  if (sheet.getLastRow() < 2) return 0;

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
  let sent = 0;
  rows.forEach(row => {
    const status = String(row[1] || '').trim();
    const name = clean_(row[3], 120);
    const email = clean_(row[4], 254);
    if (status !== 'Confirmed' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    sendNexoBreakEmail_(name, email);
    sent += 1;
  });
  return sent;
}

function sendNexoBreakEmail_(name, email) {
  const safeName = escape_(clean_(name, 120) || 'there');
  const safeUrl = escape_(NEXOBREAK_URL);
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
    '<ul style="margin:0 0 24px;padding:0;list-style:none;border-top:1px dotted #8fb1a8">' +
    '<li style="padding:12px 0;border-bottom:1px dotted #8fb1a8;font-size:13px;line-height:1.65;color:#33413d"><strong>Plan up to five daily tasks</strong><br><span style="color:#67736f">Set estimates, switch focus, and track progress while you work.</span></li>' +
    '<li style="padding:12px 0;border-bottom:1px dotted #8fb1a8;font-size:13px;line-height:1.65;color:#33413d"><strong>Understand your working time</strong><br><span style="color:#67736f">Review local reports with task timing, actual duration, application activity, and idle periods.</span></li>' +
    '<li style="padding:12px 0;border-bottom:1px dotted #8fb1a8;font-size:13px;line-height:1.65;color:#33413d"><strong>Take short guided breaks</strong><br><span style="color:#67736f">Use stretch routines, visual tracking, Vector Vision, Star Catcher, or Duck Hunt inside Rhino.</span></li>' +
    '<li style="padding:12px 0;border-bottom:1px dotted #8fb1a8;font-size:13px;line-height:1.65;color:#33413d"><strong>Keep versioned backups</strong><br><span style="color:#67736f">Create timestamped snapshots of your Rhino model and active Grasshopper definition beside your saved model.</span></li>' +
    '</ul>' +
    '<p style="margin:0 0 24px;font-size:14px;line-height:1.75;color:#33413d">Core task, activity, report, and model data stay on your computer. Optional Game Club features share account identity and game scores only.</p>' +
    '<p style="margin:30px 0"><a href="' + safeUrl + '" style="display:inline-block;padding:15px 19px;border:1px solid #4b7c6e;color:#1f2a27;text-decoration:none;font-size:13px;font-weight:600">Download NexoBreak on food4Rhino</a></p>' +
    '<p style="margin:0 0 24px;font-size:12px;line-height:1.7;color:#67736f">Requirements: Windows, Rhino 8.34 or later, and Rhino running .NET 8. NexoBreak is proprietary software and currently free on food4Rhino.</p>' +
    '<p style="margin:0 0 24px;font-size:12px;line-height:1.7;color:#67736f">You are receiving this because you subscribed to NexoNest Field Notes.</p>' +
    '</td></tr>' +
    '<tr><td style="padding:22px 34px 32px;border-top:1px dotted #8fb1a8">' +
    '<p style="margin:0;font-size:11px;line-height:1.7;color:#67736f">NexoNest<br>Curious by design.</p>' +
    '</td></tr>' +
    '</table>' +
    '</td></tr></table>' +
    '</div>';
  const body = 'Hello ' + (clean_(name, 120) || 'there') + ',\n\n' +
    'NexoBreak, our new focus and break companion for Rhino, is now available on food4Rhino.\n\n' +
    'It brings daily task planning, time tracking, guided breaks, local reports, and versioned backups into the modeling workspace, so you can structure the day without leaving Rhino.\n\n' +
    'What it helps with:\n' +
    '- Plan up to five daily tasks, set estimates, switch focus, and track progress.\n' +
    '- Review local reports with task timing, actual duration, application activity, and idle periods.\n' +
    '- Take short guided breaks with stretch routines, visual tracking, Vector Vision, Star Catcher, or Duck Hunt.\n' +
    '- Keep timestamped snapshots of your Rhino model and active Grasshopper definition beside your saved model.\n\n' +
    'Core task, activity, report, and model data stay on your computer. Optional Game Club features share account identity and game scores only.\n\n' +
    'Download NexoBreak on food4Rhino:\n' + NEXOBREAK_URL + '\n\n' +
    'Requirements: Windows, Rhino 8.34 or later, and Rhino running .NET 8. NexoBreak is proprietary software and currently free on food4Rhino.\n\n' +
    'You are receiving this because you subscribed to NexoNest Field Notes.\n\n' +
    'NexoNest\nCurious by design.';
  MailApp.sendEmail({
    to: email,
    subject,
    body,
    htmlBody: html,
    name: 'NexoNest'
  });
}

function page_(title, message, success) {
  const color = success ? '#4b7c6e' : '#8b4e4e';
  const html = '<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + escape_(title) + ' | NexoNest</title>' +
    '<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#e8f1f0;color:#222;font-family:monospace">' +
    '<main style="width:min(560px,calc(100% - 40px));border-top:1px solid ' + color + ';padding:28px 0">' +
    '<p style="font-size:10px;color:#4b7c6e;letter-spacing:.12em">NEXONEST / FIELD NOTES</p>' +
    '<h1 style="font-size:42px;line-height:1">' + escape_(title) + '</h1><p>' + escape_(message) + '</p>' +
    '<a href="https://nexonest.com" style="display:inline-block;margin-top:30px;color:#4b7c6e">Return to NexoNest →</a></main></body>';
  return HtmlService.createHtmlOutput(html);
}

function clean_(value, limit) {
  return String(value || '').trim().slice(0, limit);
}

function escape_(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
