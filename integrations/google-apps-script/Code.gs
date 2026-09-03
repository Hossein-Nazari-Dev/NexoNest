const SHEET_NAME = 'Subscribers';
const TOKEN_VALID_DAYS = 7;
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
  const html = '<div style="max-width:560px;margin:auto;padding:36px;font-family:monospace;color:#222;background:#f3f7f6">' +
    '<p style="font-size:11px;letter-spacing:.12em;color:#4b7c6e">NEXONEST / FIELD NOTES</p>' +
    '<h1>Confirm your subscription.</h1>' +
    '<p>Hello ' + escape_(clean_(name, 120)) + ', confirm that you would like to receive occasional NexoNest notes.</p>' +
    '<p style="margin:30px 0"><a href="' + url + '" style="padding:14px 18px;border:1px solid #4b7c6e;color:#222;text-decoration:none">Confirm subscription →</a></p>' +
    '<p style="font-size:10px;color:#6b7280">This link expires in 7 days. Ignore this email if you did not request it.</p></div>';
  MailApp.sendEmail({
    to: email,
    subject: 'Confirm your NexoNest Field Notes subscription',
    body: 'Confirm your subscription: ' + url,
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
