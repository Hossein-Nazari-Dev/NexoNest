// Quota-aware campaign delivery; existing newsletter records remain in Code.gs.
function sendNewsletterBatch_(campaign) {
  licenseAdmin_();
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return 0;
  try {
    const sheet = sheet_(NEWSLETTER);
    if (sheet.getLastRow() < 2) return 0;
    const values = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
    const headers = values[0].map(value => nbNormalizeHeader_(value));
    const emailIndex = nbHeaderIndex_(headers, ['email', 'email address', 'emailatconsent', 'email at consent']);
    const statusIndex = nbHeaderIndex_(headers, ['status', 'subscription status']);
    const nameIndex = nbHeaderIndex_(headers, ['full name', 'name', 'display name']);
    if (emailIndex < 0 || statusIndex < 0) throw new Error('Newsletter email/status column missing.');
    const reserve = Number(PropertiesService.getScriptProperties().getProperty('NEWSLETTER_EMAIL_RESERVE') || '20');
    if (!Number.isInteger(reserve) || reserve < 0) throw new Error('Invalid newsletter email reserve.');
    const started = Date.now(); let sent = 0;
    for (let i = 1; i < values.length; i++) {
      const row = values[i], email = nbClean_(row[emailIndex], 254).toLowerCase();
      if (nbClean_(row[statusIndex], 80).toLowerCase() !== 'subscribed' || !nbValidEmail_(email)) continue;
      const key = licenseHash_(campaign + ':' + email);
      if (licenseGet_('NewsletterDeliveries', key)) continue;
      if (MailApp.getRemainingDailyQuota() <= reserve || Date.now() - started > 5000) break;
      licensePut_('NewsletterDeliveries', key, { status: 'sending', at: Date.now() });
      try {
        sendNexoBreakCampaignEmail_(nameIndex >= 0 ? row[nameIndex] : 'there', email);
        licensePut_('NewsletterDeliveries', key, { status: 'sent', at: Date.now() }); sent++;
      } catch (error) {
        licensePut_('NewsletterDeliveries', key, { status: 'review', at: Date.now() }); throw error;
      }
    }
    return sent;
  } finally { lock.releaseLock(); }
}
