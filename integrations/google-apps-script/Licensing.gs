// Add this file to the existing newsletter Apps Script project.
const LICENSE_OWNER = 'nexonest.contact@gmail.com';
const LICENSE_PRODUCT = 'nexosolve';
// This existing ledger belongs exclusively to NexoSolve. Future products use separate prefixes.
const LICENSE_STORAGE_PREFIX = 'License_';
const LICENSE_DAY = 86400000;
const LICENSE_TABLES = ['Accounts', 'Devices', 'Licenses', 'Vouchers', 'Sessions', 'LoginCodes', 'Rates', 'Events'];

function setupLicensing() {
  licenseAdmin_();
  LICENSE_TABLES.forEach(name => licenseTable_(name));
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('LICENSE_TOKEN_SECRET')) props.setProperty('LICENSE_TOKEN_SECRET', Utilities.getUuid() + Utilities.getUuid());
  if (!props.getProperty('NEWSLETTER_EMAIL_RESERVE')) props.setProperty('NEWSLETTER_EMAIL_RESERVE', '20');
}

function licenseAdmin_() {
  // Execute-as-owner web requests also have the owner as effective user. Require the active user too.
  if (Session.getActiveUser().getEmail().toLowerCase() !== LICENSE_OWNER || Session.getEffectiveUser().getEmail().toLowerCase() !== LICENSE_OWNER) throw new Error('Run administration as ' + LICENSE_OWNER + '.');
}

function licenseTable_(name) {
  const file = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = LICENSE_STORAGE_PREFIX + name;
  let sheet = file.getSheetByName(sheetName);
  if (!sheet) {
    sheet = file.insertSheet(sheetName);
    sheet.appendRow(['Key', 'JSON']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function licenseRows_(name) {
  const sheet = licenseTable_(name);
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues().map((row, index) => ({ row: index + 2, key: String(row[0]), value: JSON.parse(row[1]) }));
}

function licenseGet_(name, key) {
  const found = licenseRows_(name).find(item => item.key === key);
  return found ? found.value : null;
}

function licensePut_(name, key, value) {
  const sheet = licenseTable_(name);
  const found = licenseRows_(name).find(item => item.key === key);
  sheet.getRange(found ? found.row : sheet.getLastRow() + 1, 1, 1, 2).setValues([[key, JSON.stringify(value)]]);
}

function licenseHash_(text) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8).map(byte => ('0' + ((byte + 256) % 256).toString(16)).slice(-2)).join('');
}

function licenseRandom_() {
  const key = PropertiesService.getScriptProperties().getProperty('LICENSE_TOKEN_SECRET');
  if (!key) throw new Error('Licensing has not been configured.');
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(Utilities.getUuid() + Utilities.getUuid(), key)).replace(/=+$/, '');
}

function licenseFail_(code, message, retryable) {
  const error = new Error(message); error.code = code; error.retryable = !!retryable; throw error;
}

function licenseEmail_(value) {
  let email = String(value || '').trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) licenseFail_('invalid_email', 'Enter a valid email address.');
  // Gmail aliases represent the same mailbox.
  if (/@(gmail|googlemail)\.com$/.test(email)) email = email.split('@')[0].split('+')[0].replace(/\./g, '') + '@gmail.com';
  return email;
}

function licenseDevice_(hash, now) {
  if (!/^[a-f0-9]{64}$/.test(String(hash))) licenseFail_('invalid_device', 'Invalid device identity.');
  let device = licenseGet_('Devices', hash);
  if (!device) {
    device = { hash: hash, startedAt: now, trialAccount: '', lastLeaseUntil: 0 };
    licensePut_('Devices', hash, device);
  }
  return device;
}

function licenseRate_(key, now, maximum, cooldown) {
  let rate = licenseGet_('Rates', key);
  if (!rate || now - rate.startedAt >= LICENSE_DAY) rate = { startedAt: now, count: 0, lastAt: 0 };
  if (rate.count >= maximum || now - rate.lastAt < cooldown) licenseFail_('rate_limit', 'Too many requests. Please try later.', true);
  rate.count++; rate.lastAt = now; licensePut_('Rates', key, rate);
}

function licensingPost_(event) {
  const lock = LockService.getScriptLock();
  let locked = false;
  try {
    locked = lock.tryLock(10000);
    if (!locked) licenseFail_('busy', 'The service is busy. Try again shortly.', true);
    const raw = event.parameter.payload || (event.postData && event.postData.contents) || '{}';
    if (raw.length > 8192) licenseFail_('invalid_request', 'Request is too large.');
    const request = JSON.parse(raw);
    if (request.product !== LICENSE_PRODUCT) licenseFail_('invalid_product', 'Unknown product.');
    const props = PropertiesService.getScriptProperties();
    if (!props.getProperty('LICENSE_PRIVATE_KEY') || !props.getProperty('LICENSE_TOKEN_SECRET')) licenseFail_('unconfigured', 'License service is not configured.', true);
    const now = Date.now();
    const device = licenseDevice_(request.device, now);
    let result;
    switch (request.action) {
      case 'guest':
        result = { lease: licenseLease_(device, null, now) }; break;
      case 'send_code':
        result = licenseSendCode_(request, now); break;
      case 'verify_code':
        result = licenseVerifyCode_(request, device, now); break;
      case 'check':
      case 'profile':
      case 'redeem': {
        const account = licenseSession_(request, now);
        if (account.device !== device.hash) licenseFail_('device_limit', 'This account is activated on another device. Contact support to transfer it.');
        if (request.action === 'profile') licenseSaveProfile_(request, account, now);
        if (request.action === 'redeem') licenseRedeem_(request, account, now);
        result = { lease: licenseLease_(device, account, now) }; break;
      }
      case 'logout': {
        licenseSession_(request, now);
        const key = licenseHash_(request.session);
        const session = licenseGet_('Sessions', key); session.revoked = true;
        licensePut_('Sessions', key, session); result = {}; break;
      }
      default: licenseFail_('invalid_action', 'Unknown request.');
    }
    if (['verify_code', 'profile', 'redeem'].includes(request.action)) licenseRefreshAdminSafely_();
    return json_(Object.assign({ ok: true }, result));
  } catch (error) {
    if (!error.code) console.error('License service failure. Inspect execution diagnostics without logging request credentials.');
    return json_({ ok: false, code: error.code || 'service_error', error: error.code ? error.message : 'Service unavailable. Please try again later.', retryable: error.code ? error.retryable : true });
  } finally { if (locked) lock.releaseLock(); }
}

function licenseSendCode_(request, now) {
  const email = licenseEmail_(request.email);
  const challenge = request.challenge || licenseRandom_();
  if (!/^[a-zA-Z0-9_-]{20,100}$/.test(challenge)) licenseFail_('invalid_request', 'Invalid sign-in request.');
  const key = licenseHash_(challenge), previous = licenseGet_('LoginCodes', key);
  // A retry must recover the same code request, not send a second email.
  if (previous) {
    if (previous.email !== email || previous.device !== request.device) licenseFail_('invalid_request', 'Invalid sign-in request.');
    if (previous.used || now >= previous.expiresAt) licenseFail_('invalid_code', 'Request a new code.');
    return { challenge: challenge, deliveryStatus: previous.deliveryStatus || 'accepted', retryAfterSeconds: Math.max(0, Math.ceil(((previous.createdAt || now) + 60000 - now) / 1000)) };
  }
  if (MailApp.getRemainingDailyQuota() < 1) licenseFail_('email_quota', 'Email capacity is temporarily exhausted. Please try later.', true);
  // Check both limits before committing either counter.
  const keys = ['email:' + licenseHash_(email), 'device:' + request.device];
  keys.forEach(rateKey => {
    const rate = licenseGet_('Rates', rateKey);
    if (rate && now - rate.startedAt < LICENSE_DAY) {
      if (rate.count >= 5) licenseFail_('daily_email_limit', 'You have requested five codes today. Try tomorrow or contact support.', true);
      if (now - rate.lastAt < 60000) licenseFail_('code_cooldown', 'Please wait 60 seconds before requesting another code.', true);
    }
  });
  const code = String(parseInt(licenseHash_(licenseRandom_()).slice(0, 12), 16) % 1000000).padStart(6, '0');
  const record = { email: email, device: request.device, digest: licenseHash_(challenge + ':' + code), createdAt: now,
    expiresAt: now + 10 * 60000, attempts: 0, used: false, deliveryStatus: 'unknown' };
  licensePut_('LoginCodes', key, record);
  keys.forEach(rateKey => licenseRate_(rateKey, now, 5, 60000));
  // Mail acceptance is not inbox delivery. Never resend after an ambiguous provider failure.
  try {
    MailApp.sendEmail(licenseCodeEmail_(email, code));
    record.deliveryStatus = 'accepted';
    try { licensePut_('LoginCodes', key, record); }
    catch (error) { console.error('Mail acceptance status could not be saved. No resend will occur.'); }
  } catch (error) { console.error('Mail acceptance is uncertain. No credentials logged or automatic resend attempted.'); }
  return { challenge: challenge, deliveryStatus: record.deliveryStatus, retryAfterSeconds: 60 };
}

function licenseCodeEmail_(email, code) {
  const html = '<!doctype html><html><body style="margin:0;background:#EDF5FB;font-family:Arial,sans-serif;color:#17344F">' +
    '<table role="presentation" width="100%"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="480" style="width:100%;max-width:480px;background:#ffffff;border-radius:16px">' +
    '<tr><td style="padding:32px"><img src="cid:productLogo" width="48" height="48" alt="NexoSolve" style="display:block;margin-bottom:18px"><div style="font-size:14px;color:#456B8C">NEXONEST / NEXOSOLVE</div>' +
    '<h1 style="font-size:26px;margin:16px 0">Your sign-in code</h1><p style="line-height:1.6">Enter this code in NexoSolve to sign in securely.</p>' +
    '<div style="background:#DFEDF8;border:1px solid #A7C9E2;border-radius:12px;padding:22px;text-align:center;font-size:36px;font-weight:bold;letter-spacing:8px;color:#245D86">' + code + '</div>' +
    '<p style="font-size:13px;color:#526F88;line-height:1.7">Select and copy the six digits, then paste them into NexoSolve.<br>This code expires in <strong>10 minutes</strong>.</p>' +
    '<hr style="border:0;border-top:1px solid #D8E7F2;margin:24px 0"><p style="font-size:12px;line-height:1.7;color:#526F88">Never share this code. If you did not request it, ignore this email.<br>Need help? <a href="mailto:nexonest.contact@gmail.com" style="color:#356C96">Contact NexoNest</a></p>' +
    '</td></tr></table></td></tr></table></body></html>';
  return { to: email, subject: 'Your NexoSolve sign-in code', name: 'NexoNest', replyTo: LICENSE_OWNER,
    body: 'Your NexoNest sign-in code is ' + code + '.\n\nIt expires in 10 minutes. Do not share this code. If you did not request it, ignore this email.\n\nNexoNest',
    htmlBody: html, inlineImages: { productLogo: Utilities.newBlob(Utilities.base64Decode(LICENSE_EMAIL_LOGO), 'image/png', 'nexosolve.png') } };
}

function licenseVerifyCode_(request, device, now) {
  const key = licenseHash_(String(request.challenge || ''));
  const code = licenseGet_('LoginCodes', key);
  if (!code || code.used || now >= code.expiresAt || code.device !== device.hash || code.attempts >= 5) licenseFail_('invalid_code', 'The code has expired or is invalid. Request another code.');
  code.attempts++; licensePut_('LoginCodes', key, code);
  if (code.digest !== licenseHash_(request.challenge + ':' + request.code)) licenseFail_('invalid_code', 'Incorrect code.');
  let account = licenseGet_('Accounts', licenseHash_(code.email));
  if (account && account.disabled) licenseFail_('account_disabled', 'This account is disabled. Contact support.');
  if (account && account.device && account.device !== device.hash) licenseFail_('device_limit', 'One device is allowed. Contact support to transfer your activation.');
  if (account && now < (account.bindAfter || 0)) licenseFail_('transfer_pending', 'The previous offline activation must expire before transferring this account.');
  const accountId = account ? account.id : licenseHash_('account:' + code.email);
  if (!account) account = { id: accountId, email: code.email, device: device.hash, trialStart: device.startedAt, trialEnd: device.trialAccount && device.trialAccount !== accountId ? now : device.startedAt + 90 * LICENSE_DAY, disabled: false };
  // A new mailbox on an already used device gets no new account trial.
  if (!device.trialAccount) { device.trialAccount = account.id; licensePut_('Devices', device.hash, device); }
  account.device = device.hash;
  delete account.deletedAt;
  licensePut_('Accounts', licenseHash_(account.email), account);
  code.used = true; licensePut_('LoginCodes', key, code);
  const token = licenseRandom_();
  licensePut_('Sessions', licenseHash_(token), { account: licenseHash_(account.email), device: device.hash, expiresAt: now + 180 * LICENSE_DAY, revoked: false });
  return { session: token, lease: licenseLease_(device, account, now) };
}

function licenseSession_(request, now) {
  const session = licenseGet_('Sessions', licenseHash_(String(request.session || '')));
  if (!session || session.revoked || now >= session.expiresAt || session.device !== request.device) licenseFail_('session_expired', 'Sign in again to continue.');
  const account = licenseGet_('Accounts', session.account);
  if (!account || account.disabled) licenseFail_('account_disabled', 'This account is disabled. Contact support.');
  return account;
}

function licenseEntitlement_(account, now) {
  let result = { kind: 'account_trial', endsAt: account.trialEnd };
  licenseRows_('Licenses').map(row => row.value).concat(licenseRows_('Vouchers').map(row => row.value))
    .filter(grant => grant.account === account.id && grant.product === LICENSE_PRODUCT && !grant.revoked && grant.startsAt <= now)
    .forEach(grant => { if (grant.endsAt > result.endsAt) result = { kind: 'license', endsAt: grant.endsAt }; });
  return result;
}

// Paid renewals must accumulate even when a longer trial supplies effective access.
function licensePaidEnd_(account, now) {
  return licenseRows_('Licenses').concat(licenseRows_('Vouchers'))
    .map(row => row.value)
    .filter(grant => grant.account === account.id && grant.product === LICENSE_PRODUCT && !grant.revoked && grant.startsAt <= now)
    .reduce((end, grant) => Math.max(end, grant.endsAt), now);
}

function licenseLease_(device, account, now) {
  const entitlement = account ? licenseEntitlement_(account, now) : { kind: 'guest_trial', endsAt: device.startedAt + 14 * LICENSE_DAY };
  const allowed = entitlement.endsAt > now && (!account || !account.disabled);
  const reason = allowed ? '' : account && account.disabled ? 'account_disabled' :
    account && entitlement.kind === 'account_trial' && device.trialAccount && device.trialAccount !== account.id
      ? 'device_trial_used' : 'entitlement_expired';
  const until = allowed ? Math.min(entitlement.endsAt, now + 7 * LICENSE_DAY) : now;
  const payload = JSON.stringify({ schema: 1, product: LICENSE_PRODUCT, device: device.hash, account: account ? account.id : '', email: account ? account.email : '', displayName: account ? account.displayName || '' : '', profileComplete: !!(account && account.profileCompletedAt && account.displayName), newsletterOptIn: !!(account && account.newsletterOptIn), kind: entitlement.kind, allowed: allowed, reason: reason, issuedAt: now, expiresAt: until, entitlementEndsAt: entitlement.endsAt });
  const key = PropertiesService.getScriptProperties().getProperty('LICENSE_PRIVATE_KEY').replace(/\\n/g, '\n');
  const signature = Utilities.base64Encode(Utilities.computeRsaSha256Signature(payload, key, Utilities.Charset.UTF_8));
  device.lastLeaseUntil = Math.max(device.lastLeaseUntil || 0, until); licensePut_('Devices', device.hash, device);
  return { payload: payload, signature: signature };
}

function licenseAddMonths_(time, months) {
  const date = new Date(time), day = date.getUTCDate();
  date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + months);
  const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, last)); return date.getTime();
}

function licenseRedeem_(request, account, now) {
  licenseRate_('voucher:' + account.id, now, 10, 1000);
  const key = licenseHash_(String(request.voucher || '').trim().toUpperCase());
  const voucher = licenseGet_('Vouchers', key);
  if (!voucher || voucher.revoked || voucher.product !== LICENSE_PRODUCT) licenseFail_('invalid_voucher', 'Invalid voucher.');
  if (voucher.assignedAccount && voucher.assignedAccount !== account.id) licenseFail_('voucher_account', 'This voucher belongs to another account.');
  // Idempotent retry after a lost response: the existing grant is returned, never extended again.
  if (voucher.account === account.id) return;
  if (voucher.account || now >= voucher.redeemBy) licenseFail_('used_voucher', 'This voucher has been used or has expired.');
  const start = licensePaidEnd_(account, now);
  Object.assign(voucher, { account: account.id, usedAt: now, startsAt: now, endsAt: licenseAddMonths_(start, voucher.months) });
  // The consumed voucher is the grant. A single row write avoids a cross-table double grant.
  licensePut_('Vouchers', key, voucher);
  licenseEvent_('voucher_redeemed', account.id, key, now);
}

function licenseEvent_(action, account, reference, now) {
  // An audit failure must not turn a committed grant into a failed client request.
  try { licensePut_('Events', Utilities.getUuid(), { action: action, account: account, reference: reference, at: now }); }
  catch (error) { console.error('License audit write failed: ' + error.message); }
}



// Embedded public product icon; no image hosting, tracking or extra mail scopes.
const LICENSE_EMAIL_LOGO = "iVBORw0KGgoAAAANSUhEUgAABOAAAATgCAYAAABeuz1wAAAACXBIWXMAACxKAAAsSgF3enRNAAAgAElEQVR4nOzdTW4b2dmw4SdBhgHkbwVizwuwakKgRqJXYL0rsHoDbL0raPYKomQDZlYQ9wqaPSKQSakBzk2v4LUAzvsbsJRWTP/opw5P/VwXIHTHsamn3XZC33pOnT/9/vvvAQAAAACk8efcAwAAAADAkAlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQAAcAAAAACQlwAAAAAJCQ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AhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhxCxhTpAAAEWUlEQVQAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAAAEBBAhwAAAAAFCTAAQAA/P/t2LEAAAAAwCB/61HsK4wAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgJOAAAAAAYCTgAAAAAGAk4AAAAABgFKZaI+fhd2uBAAAAAElFTkSuQmCC";
