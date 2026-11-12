// Event-only double opt-in. Never adds newsletter consent, products or licenses.
const WEBINAR_EVENT_ID = 'sustainable-development-introduction';
const WEBINAR_CONSENT_VERSION = 'webinar-prereg-v1';
const WEBINAR_HEADERS = ['RegistrationId','EventId','Email','FullName','ConsentVersion','Status','Token','SubmittedAt','ConfirmedAt','MailState'];

function webinarInfo_() {
  return json_({ok:true, service:'webinar', eventId:WEBINAR_EVENT_ID, consentVersion:WEBINAR_CONSENT_VERSION});
}

function webinarTable_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let table = book.getSheetByName('WebinarRegistrations');
  if (!table) {
    table = book.insertSheet('WebinarRegistrations');
    table.appendRow(WEBINAR_HEADERS);
    table.setFrozenRows(1);
  }
  const header = table.getRange(1,1,1,WEBINAR_HEADERS.length).getValues()[0];
  if (header.join('|') !== WEBINAR_HEADERS.join('|')) throw new Error('Unexpected webinar schema.');
  return table;
}

function webinarPost_(event) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json_({ok:false,error:'سامانه مشغول است؛ کمی بعد دوباره تلاش کنید.'});
  try {
    const raw = event && event.parameter && event.parameter.payload;
    if (typeof raw !== 'string' || raw.length > 4000) throw new Error('Invalid payload.');
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid request.');
    if (data.website) return json_({ok:true,status:'pending-confirmation'});
    if (data.eventId !== WEBINAR_EVENT_ID || data.consentVersion !== WEBINAR_CONSENT_VERSION || data.consent !== true)
      throw new Error('Invalid event or consent.');
    const email = email_(data.email);
    if (typeof data.fullName !== 'string' || !data.fullName.trim() || data.fullName.length > 120) throw new Error('Invalid name.');
    const name = data.fullName.trim();
    const table = webinarTable_();
    let row = 0;
    if (table.getLastRow() > 1) {
      const records = table.getRange(2,1,table.getLastRow()-1,WEBINAR_HEADERS.length).getValues();
      const match = records.findIndex(record => record[1] === WEBINAR_EVENT_ID && String(record[2]).toLowerCase() === email);
      if (match >= 0) row = match + 2;
    }
    if (row) {
      const previous = table.getRange(row,1,1,WEBINAR_HEADERS.length).getValues()[0];
      if (previous[5] === 'confirmed') return json_({ok:true,status:'already-confirmed'});
      const age = Date.now() - new Date(previous[7]).getTime();
      if (previous[5] === 'pending' && age >= 0 && age < 7*86400000)
        return json_({ok:true,status:'pending-confirmation',mailState:String(previous[9])});
    }
    reservePublicMail_('webinar',email);
    const token = Utilities.getUuid() + Utilities.getUuid();
    row = row || table.getLastRow()+1;
    table.getRange(row,1,1,WEBINAR_HEADERS.length).setValues([[
      'web_' + Utilities.getUuid(),WEBINAR_EVENT_ID,email,sheetText_(name),WEBINAR_CONSENT_VERSION,
      'pending',token,new Date(),'', 'sending'
    ]]);
    SpreadsheetApp.flush();
    try {
      MailApp.sendEmail(webinarMessage_(name,email,token));
      table.getRange(row,10).setValue('sent');
    } catch (error) {
      // Delivery may have happened. Preserve the challenge and do not resend on retry.
      table.getRange(row,10).setValue('unknown');
    }
    SpreadsheetApp.flush();
    return json_({ok:true,status:'pending-confirmation',mailState:table.getRange(row,10).getValue()});
  } catch (error) {
    console.error('Webinar pre-registration failed.');
    return json_({ok:false,error:error.publicMessage || 'درخواست ثبت نشد؛ اطلاعات را بررسی کنید یا کمی بعد تلاش کنید.'});
  } finally { lock.releaseLock(); }
}

function webinarMessage_(name,email,token) {
  const url = ScriptApp.getService().getUrl() + '?webinarConfirm=' + encodeURIComponent(token);
  const title = 'درآمدی بر توسعهٔ پایدار در محیط ساخته‌شده';
  return {to:email,name:'NexoNest',subject:'تأیید پیش‌ثبت‌نام وبینار | توسعهٔ پایدار',
    body:'سلام ' + name + '\nبرای تأیید پیش‌ثبت‌نام «' + title + '» این لینک را باز کنید:\n' + url +
      '\nاین لینک هفت روز اعتبار دارد. جزئیات برگزاری پس از نهایی‌شدن با ایمیل اطلاع داده می‌شود. پیش‌ثبت‌نام به معنی رزرو قطعی یا پرداخت نیست. اگر درخواست را شما نفرستاده‌اید، این ایمیل را نادیده بگیرید.',
    htmlBody:'<div dir="rtl" style="max-width:560px;margin:auto;padding:32px;background:#f3f7f6;color:#10123c;font-family:Tahoma,Arial,sans-serif;line-height:1.9">' +
      '<p dir="ltr" style="font-size:12px;letter-spacing:2px;color:#315e52">NEXONEST / UPCOMING EVENT</p>' +
      '<h1 style="font-size:26px">تأیید پیش‌ثبت‌نام</h1><p>سلام ' + escape_(name) + '</p><p>' + title + '</p>' +
      '<p style="margin:30px 0"><a href="' + escape_(url) + '" style="display:inline-block;background:#10123c;color:white;padding:12px 22px;text-decoration:none">تأیید نشانی ایمیل و پیش‌ثبت‌نام</a></p>' +
      '<p>جزئیات برگزاری پس از نهایی‌شدن با ایمیل اطلاع داده می‌شود. پیش‌ثبت‌نام به معنی رزرو قطعی یا پرداخت نیست.</p>' +
      '<p style="font-size:12px;color:#66706e">این لینک هفت روز اعتبار دارد. اگر درخواست را شما نفرستاده‌اید، این ایمیل را نادیده بگیرید.</p></div>'};
}

function webinarConfirm_(token) {
  if (typeof token !== 'string' || !/^[a-f0-9-]{72}$/i.test(token)) return page_('Invalid confirmation link','Please use the link in your webinar email.',false);
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return page_('Please try again','The service is busy. Open this link again shortly.',false);
  try {
    const table = webinarTable_();
    const row = findRow_(table,7,token);
    if (!row) return page_('Link not found','Please check the link in your webinar email.',false);
    const record = table.getRange(row,1,1,WEBINAR_HEADERS.length).getValues()[0];
    if (record[1] !== WEBINAR_EVENT_ID) return page_('Link not found','Invalid event.',false);
    if (record[5] === 'confirmed') return page_('Pre-registration confirmed','Your email is already confirmed. Event details will be emailed when available.',true);
    const age = Date.now() - new Date(record[7]).getTime();
    if (!Number.isFinite(age) || age < 0 || age >= 7*86400000) return page_('Link expired','Return to nexonest.com/events/?event=sustainable-development-introduction and pre-register again.',false);
    table.getRange(row,6).setValue('confirmed');
    table.getRange(row,9).setValue(new Date());
    SpreadsheetApp.flush();
    return page_('Pre-registration confirmed','Your email is confirmed for Introduction to Sustainable Development. Event details will be emailed when available. This is not a paid booking.',true);
  } catch (error) {
    return page_('Please try again','We could not confirm your pre-registration. Open the same link again later.',false);
  } finally { lock.releaseLock(); }
}
