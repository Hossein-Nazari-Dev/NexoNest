// Verified account onboarding; newsletter consent is independent of license access.
function licenseSaveProfile_(request, account, now) {
  const name = String(request.displayName || '').trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 80 || /[\x00-\x1f\x7f<>]/.test(name))
    licenseFail_('invalid_name', 'Enter a display name with 2 to 80 characters.');
  if (typeof request.newsletterOptIn !== 'boolean')
    licenseFail_('invalid_consent', 'Choose whether to receive NexoNest Field Notes.');
  // The first explicit choice is recorded once. Retrying a lost response cannot resubscribe someone.
  if (!account.profileCompletedAt && request.newsletterOptIn)
    licenseNewsletterConsent_(account.email, name, now);
  if (!account.profileCompletedAt) {
    account.newsletterOptIn = request.newsletterOptIn;
    account.profileCompletedAt = now;
  }
  account.displayName = name;
  licensePut_('Accounts', licenseHash_(account.email), account);
}

function licenseNewsletterConsent_(email, name, now) {
  const newsletter = sheet_(NEWSLETTER);
  const user = upsertUser_(sheet_(USERS), email, name);
  const row = findRow_(newsletter, 3, email);
  if (row && String(newsletter.getRange(row, 6).getValue()) === 'subscribed') return;
  const time = new Date(now);
  const consent = ['consent_' + Utilities.getUuid(), user.userId, email, 'nexosolve-profile-v1', time,
    'subscribed', '', 'nexosolve-desktop', '', '', '', '', 'NexoSolve', '', '', time, time];
  if (row) {
    const previous = newsletter.getRange(row, 1, 1, consent.length).getValues()[0];
    // A prior profile consent can outlive an interrupted account write or a later opt-out.
    if (previous[3] === 'nexosolve-profile-v1') return;
    // Preserve the reader's existing education, occupation and interests.
    for (let column = 8; column <= 13; column++) consent[column] = previous[column];
    consent[16] = previous[16] || time;
  }
  // Email was just verified by the account flow; no second confirmation email is required.
  newsletter.getRange(row || newsletter.getLastRow() + 1, 1, 1, consent.length).setValues([consent]);
}
