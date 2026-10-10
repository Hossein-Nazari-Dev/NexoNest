// Product support view; private ledgers are hidden, not removed.
const LICENSE_ADMIN_SHEET = 'AS_nexosolve';

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('NexoSolve Admin')
    .addItem('Refresh accounts', 'refreshLicenseAdminSheet')
    .addSubMenu(ui.createMenu('Activate license now')
      .addItem('1 month', 'adminGrantOneMonth').addItem('3 months', 'adminGrantThreeMonths')
      .addItem('6 months', 'adminGrantSixMonths').addItem('12 months', 'adminGrantTwelveMonths'))
    .addSubMenu(ui.createMenu('Vouchers')
      .addItem('Selected account: 1 month', 'adminVoucherOneMonth')
      .addItem('Selected account: 3 months', 'adminVoucherThreeMonths')
      .addItem('Selected account: 6 months', 'adminVoucherSixMonths')
      .addItem('Selected account: 12 months', 'adminVoucherTwelveMonths')
      .addItem('Course codes: 1 month', 'adminCourseOneMonth')
      .addItem('Course codes: 3 months', 'adminCourseThreeMonths')
      .addItem('Course codes: 6 months', 'adminCourseSixMonths')
      .addItem('Course codes: 12 months', 'adminCourseTwelveMonths'))
    .addSeparator()
    .addItem('Repair sign-in', 'adminSignOutAccount')
    .addItem('Disable account', 'adminDisableAccount').addItem('Enable account', 'adminEnableAccount')
    .addItem('Transfer to another device', 'adminReleaseDevice')
    .addItem('Delete all NexoSolve account records', 'adminDeleteAccount')
    .addSeparator()
    .addItem('Show technical license tables', 'adminShowTechnicalTables')
    .addItem('Hide technical license tables', 'adminHideTechnicalTables').addToUi();
}

function setupLicenseAdminSheet() {
  licenseAdmin_(); setupLicensing(); refreshLicenseAdminSheet(); adminHideTechnicalTables();
}

function licenseAdminView_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(LICENSE_ADMIN_SHEET);
  if (!sheet) {
    sheet = book.getSheetByName('License_Admin');
    if (sheet) sheet.setName(LICENSE_ADMIN_SHEET);
    else sheet = book.insertSheet(LICENSE_ADMIN_SHEET);
  }
  return sheet;
}

function refreshLicenseAdminSheet() {
  licenseAdmin_();
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    licenseRefreshAdminView_();
  } finally { lock.releaseLock(); }
}

// Internal callers already hold the script lock. Never expose this as an API action.
function licenseRefreshAdminView_() {
    const sheet = licenseAdminView_(), now = Date.now();
    const rows = licenseRows_('Accounts').map(row => {
      const a = row.value, access = licenseEntitlement_(a, now);
      return [licenseAdminText_(a.displayName || 'Not set'), licenseAdminText_(a.email),
        a.disabled ? 'Disabled' : a.deletedAt ? 'Needs sign-in' : 'Enabled',
        access.endsAt <= now ? 'Expired' : access.kind === 'license' ? 'License' : '90-day trial',
        licenseAdminDate_(access.endsAt), a.device ? 'Activated' : a.bindAfter > now ? 'Transfer pending' : 'Not activated'];
    }).sort((a, b) => a[1].localeCompare(b[1]));
    sheet.clearContents();
    sheet.getRange(1, 1, 1, 6).setValues([['Name', 'Email', 'Status', 'Access', 'Expires (UTC)', 'Device']]).setFontWeight('bold');
    if (rows.length) sheet.getRange(2, 1, rows.length, 6).setValues(rows);
    sheet.setFrozenRows(1); sheet.autoResizeColumns(1, 6);
}

function licenseRefreshAdminSafely_() {
  try { licenseRefreshAdminView_(); }
  catch (_) {
    // The ledger is authoritative; a presentation failure must not invalidate a successful activation.
    console.error('License admin view refresh failed. Use Refresh accounts to rebuild the view.');
  }
}

function licenseAdminDate_(value) { return value ? new Date(value).toISOString().replace('T', ' ').slice(0, 16) : ''; }
function licenseAdminText_(value) { return /^[=+@-]/.test(value) ? "'" + value : value; }

function licenseSelectedEmail_() {
  licenseAdmin_();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(), range = sheet.getActiveRange();
  if (sheet.getName() !== LICENSE_ADMIN_SHEET || !range || range.getRow() < 2 || range.getNumRows() !== 1)
    throw new Error('Select one account row in AS_nexosolve first.');
  const email = licenseEmail_(String(sheet.getRange(range.getRow(), 2).getValue()).replace(/^'/, ''));
  if (!licenseGet_('Accounts', licenseHash_(email))) throw new Error('Account not found. Refresh accounts first.');
  return email;
}

function licenseAdminConfirm_(email, action) {
  const ui = SpreadsheetApp.getUi();
  return ui.alert(action, email + '\n\nExisting offline access may remain valid for up to seven days. Continue?', ui.ButtonSet.YES_NO) === ui.Button.YES;
}

function licenseAdminAction_(label, operation) {
  licenseAdmin_();
  try {
    const email = licenseSelectedEmail_();
    if (!licenseAdminConfirm_(email, label)) return;
    const result = operation(email); refreshLicenseAdminSheet();
    SpreadsheetApp.getUi().alert(result || 'Updated. Use Check license in NexoSolve to see changes.');
  } catch (error) { SpreadsheetApp.getUi().alert(String(error.message || 'Administration failed.')); }
}

function adminGrantOneMonth() { licenseAdminAction_('Activate one month immediately (no voucher)', email => { grantLicense(email, 1); }); }
function adminGrantThreeMonths() { licenseAdminAction_('Activate three months immediately (no voucher)', email => { grantLicense(email, 3); }); }
function adminGrantSixMonths() { licenseAdminAction_('Activate six months immediately (no voucher)', email => { grantLicense(email, 6); }); }
function adminGrantTwelveMonths() { licenseAdminAction_('Activate twelve months immediately (no voucher)', email => { grantLicense(email, 12); }); }
function adminDisableAccount() { licenseAdminAction_('Disable account', email => disableLicenseAccount(email, true)); }
function adminEnableAccount() { licenseAdminAction_('Enable account', email => disableLicenseAccount(email, false)); }
function adminSignOutAccount() { licenseAdminAction_('Repair sign-in; request a new email code afterward', email => resetLicenseAccount(email, false)); }
function adminReleaseDevice() { licenseAdminAction_('Transfer device', email => 'Another device can activate after ' + releaseLicenseDevice(email)); }

function licenseAdminPrompt_(title, message) {
  const ui = SpreadsheetApp.getUi(), response = ui.prompt(title, message, ui.ButtonSet.OK_CANCEL);
  return response.getSelectedButton() === ui.Button.OK ? response.getResponseText().trim() : null;
}

function adminDeleteAccount() {
  licenseAdmin_();
  const email = licenseSelectedEmail_();
  const typed = licenseAdminPrompt_('Permanent NexoSolve deletion',
    'This permanently deletes this account\'s NexoSolve licenses, vouchers, sessions, trial and device history. It permits a fresh trial. Newsletter and other products remain.\n\nType the exact email to confirm: ' + email);
  if (typed !== email) return;
  if (!licenseAdminConfirm_(email, 'PERMANENT deletion: all NexoSolve records; cannot undo')) return;
  deleteLicenseAccount(email); refreshLicenseAdminSheet();
  SpreadsheetApp.getUi().alert('NexoSolve records deleted. The user can create the account again. Previously issued offline access may last until its expiry.');
}

function adminVoucherOneMonth() { licenseCreateVoucherUi_(1, true); }
function adminVoucherThreeMonths() { licenseCreateVoucherUi_(3, true); }
function adminCourseOneMonth() { licenseCreateVoucherUi_(1, false); }
function adminCourseThreeMonths() { licenseCreateVoucherUi_(3, false); }
function adminVoucherSixMonths() { licenseCreateVoucherUi_(6, true); }
function adminVoucherTwelveMonths() { licenseCreateVoucherUi_(12, true); }
function adminCourseSixMonths() { licenseCreateVoucherUi_(6, false); }
function adminCourseTwelveMonths() { licenseCreateVoucherUi_(12, false); }

function licenseCreateVoucherUi_(months, assigned) {
  licenseAdmin_();
  const email = assigned ? licenseSelectedEmail_() : '';
  let count = 1;
  if (!assigned) {
    const answer = licenseAdminPrompt_('Course vouchers: ' + months + ' months', 'How many codes? Enter 1 to 100. Each code can be used once; redeem within one year.');
    if (answer === null) return;
    count = Number(answer || '1');
  } else if (!licenseAdminConfirm_(email, 'Create one ' + months + '-month voucher for this account; activates when entered in the app')) return;
  const codes = createAssignedLicenseVouchers(months, count, email);
  // Codes use a fixed prefix/hex alphabet; text outside it is HTML-escaped.
  const html = HtmlService.createHtmlOutput('<p>' + months + '-month codes. ' + (email ? 'Only ' + escape_(email) + ' can redeem this code.' : 'One code per participant.') +
    '</p><p>Send the code to the participant. They sign in and enter it in Account &amp; License. Copy now; codes cannot be recovered after closing. Redeem within one year.</p>' +
    '<textarea readonly style="width:100%;height:240px">' + codes.join('\n') + '</textarea>').setWidth(560).setHeight(370);
  SpreadsheetApp.getUi().showModalDialog(html, 'NexoSolve vouchers');
}

function adminShowTechnicalTables() { licenseAdmin_(); LICENSE_TABLES.forEach(name => licenseTable_(name).showSheet()); }
function adminHideTechnicalTables() {
  licenseAdmin_();
  const book = SpreadsheetApp.getActiveSpreadsheet(); book.setActiveSheet(licenseAdminView_());
  LICENSE_TABLES.forEach(name => licenseTable_(name).hideSheet());
}
