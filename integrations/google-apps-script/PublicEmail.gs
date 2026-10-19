// Public email controls. Call mutations while holding the shared script lock.
function publicEmailState_(key, value) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName('PublicEmailState');
  if (!sheet) {
    sheet = book.insertSheet('PublicEmailState');
    sheet.appendRow(['Key', 'JSON']);
    sheet.setFrozenRows(1);
  }
  const row = findRow_(sheet, 1, key);
  if (value === undefined) return row ? JSON.parse(sheet.getRange(row, 2).getValue()) : null;
  sheet.getRange(row || sheet.getLastRow() + 1, 1, 1, 2).setValues([[key, JSON.stringify(value)]]);
  return value;
}

function publicEmailError_(message) {
  const error = new Error(message);
  error.publicMessage = message;
  throw error;
}

function reservePublicMail_(purpose, email) {
  const now = Date.now(), day = 86400000;
  const props = PropertiesService.getScriptProperties();
  const reserve = Number(props.getProperty('NEWSLETTER_EMAIL_RESERVE') || '20');
  const maximum = Number(props.getProperty('PUBLIC_EMAIL_DAILY_LIMIT') || '30');
  if (!Number.isInteger(reserve) || reserve < 0 || !Number.isInteger(maximum) || maximum < 1)
    throw new Error('Invalid public mail configuration.');
  const mailboxEmail = /@(gmail|googlemail)\.com$/.test(email) ?
    email.split('@')[0].split('+')[0].replace(/\./g, '') + '@gmail.com' : email;
  const key = 'mail:' + purpose + ':' + hash_(mailboxEmail);
  const fresh = () => ({ startedAt: now, lastAt: 0, count: 0 });
  let mailbox = publicEmailState_(key), global = publicEmailState_('mail:global');
  if (!mailbox || now - mailbox.startedAt >= day) mailbox = fresh();
  if (!global || now - global.startedAt >= day) global = fresh();
  if (mailbox.count >= 3 || (mailbox.count && now - mailbox.lastAt < 60000))
    publicEmailError_('Please wait at least one minute between emails. Up to three requests are allowed per day.');
  if (global.count >= maximum || MailApp.getRemainingDailyQuota() <= reserve)
    publicEmailError_('Email requests are temporarily unavailable. Please try later.');
  // Reserve before sending. An uncertain send consumes capacity; no automatic retry.
  mailbox.count++; mailbox.lastAt = now;
  global.count++; global.lastAt = now;
  publicEmailState_('mail:global', global);
  publicEmailState_(key, mailbox);
  SpreadsheetApp.flush();
}

function requestGameClubCode_(data) {
  const email = email_(data.email);
  const key = 'game:' + hash_(email), now = Date.now();
  let challenge = publicEmailState_(key);
  if (challenge && challenge.expiresAt > now && challenge.attempts < 5) {
    // Never invalidate an unused code through an unauthenticated resend request.
    publicEmailError_('A code was already requested. Use it or wait ten minutes before requesting another.');
  }
  reservePublicMail_('gameclub', email);
  const code = String(parseInt(Utilities.getUuid().replace(/-/g, '').slice(0, 12), 16) % 1000000).padStart(6, '0');
  challenge = { digest: hash_(email + ':' + code), expiresAt: now + 600000, attempts: 0 };
  publicEmailState_(key, challenge);
  SpreadsheetApp.flush();
  MailApp.sendEmail(gameClubCodeMessage_(email, code));
  return json_({ ok: true, status: 'verification-required' });
}

function verifyGameClubCode_(email, code) {
  const key = 'game:' + hash_(email), challenge = publicEmailState_(key);
  if (!challenge || challenge.expiresAt <= Date.now() || challenge.attempts >= 5)
    publicEmailError_('Request a Game Club verification code before joining or restoring your account.');
  challenge.attempts++;
  const valid = /^\d{6}$/.test(String(code || '')) && challenge.digest === hash_(email + ':' + code);
  if (valid) challenge.expiresAt = 0;
  publicEmailState_(key, challenge);
  SpreadsheetApp.flush();
  if (!valid) publicEmailError_('The verification code is invalid.');
}

function newsletterSignature_(consentId, initialize) {
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty('NEWSLETTER_TOKEN_SECRET');
  if (!secret) {
    if (!initialize) return '';
    secret = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty('NEWSLETTER_TOKEN_SECRET', secret);
  }
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature('unsubscribe:' + consentId, secret)).replace(/=+$/, '');
}

function newsletterUnsubscribeUrl_(record) {
  return ScriptApp.getService().getUrl() + '?unsubscribe=' + encodeURIComponent(record[0]) +
    '&signature=' + encodeURIComponent(newsletterSignature_(record[0], true));
}

function newsletterUnsubscribe_(parameters, commit) {
  const consent = clean_(parameters.unsubscribe, 100), signature = clean_(parameters.signature, 100);
  if (!consent || !signature || signature !== newsletterSignature_(consent))
    return page_('Invalid link', 'Use the unsubscribe link in your most recent newsletter email.', false);
  const sheet = sheet_(NEWSLETTER), row = findRow_(sheet, 1, consent);
  if (!row) return page_('Link not found', 'This subscription no longer exists.', false);
  if (commit) {
    // Clear confirmation first, so a cancelled pending request cannot reactivate.
    sheet.getRange(row, 15).clearContent();
    sheet.getRange(row, 6, 1, 2).setValues([['unsubscribed', new Date()]]);
    SpreadsheetApp.flush();
    return page_('Unsubscribed', 'You will no longer receive NexoNest Newsletter emails. Product sign-in and registration emails are unaffected.', true);
  }
  // GET is read-only: email security scanners must not unsubscribe recipients.
  return HtmlService.createHtmlOutput('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="referrer" content="no-referrer"><title>Unsubscribe | NexoNest</title><body style="font-family:monospace;max-width:560px;margin:60px auto;padding:20px">' +
    '<h1>Unsubscribe from NexoNest Newsletter?</h1><p>This does not affect product access or registration emails.</p>' +
    '<form method="post" target="_top" action="' + escape_(ScriptApp.getService().getUrl()) + '">' +
    '<input type="hidden" name="action" value="newsletter_unsubscribe">' +
    '<input type="hidden" name="unsubscribe" value="' + escape_(consent) + '">' +
    '<input type="hidden" name="signature" value="' + escape_(signature) + '">' +
    '<button type="submit">Unsubscribe</button></form></body></html>');
}
