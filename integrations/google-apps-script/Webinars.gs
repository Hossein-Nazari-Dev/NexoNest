// Event-only double opt-in. Never adds newsletter consent, products or licenses.
const WEBINAR_EVENT_ID = 'sustainable-development-introduction';
const WEBINAR_CONSENT_VERSION = 'webinar-prereg-v1';
const WEBINAR_HEADERS = ['RegistrationId','EventId','Email','FullName','ConsentVersion','Status','Token','SubmittedAt','ConfirmedAt','MailState','Occupation','SustainabilityFamiliarity','NewsletterOptIn','NewsletterRequestedAt','Phone','EducationLevel'];

function webinarEvent_(id) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let table = book.getSheetByName('WebinarEvents');
  const headers = ['EventId','TitleFa','TitleEn','SubtitleFa','Presenter','Status','PageUrl','ConsentVersion','UpdatedAt'];
  if (!table) { table=book.insertSheet('WebinarEvents'); table.appendRow(headers); table.setFrozenRows(1); }
  if (table.getRange(1,1,1,headers.length).getValues()[0].join('|') !== headers.join('|')) throw new Error('Unexpected event schema.');
  if (!findRow_(table,1,WEBINAR_EVENT_ID)) table.appendRow([WEBINAR_EVENT_ID,'درآمدی بر توسعهٔ پایدار','Introduction to Sustainable Development','در محیط ساخته‌شده','Hossein Nazari','upcoming','https://nexonest.com/events/?event='+WEBINAR_EVENT_ID,WEBINAR_CONSENT_VERSION,new Date()]);
  const row=findRow_(table,1,id);
  if (!row) return null;
  const v=table.getRange(row,1,1,headers.length).getValues()[0];
  return {id:v[0],titleFa:v[1],titleEn:v[2],subtitleFa:v[3],presenter:v[4],status:v[5],pageUrl:v[6],consentVersion:v[7]};
}

function webinarInfo_() {
  const lock=LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json_({ok:false,error:'Service busy.'});
  try { const event=webinarEvent_(WEBINAR_EVENT_ID); return json_({ok:true,service:'webinar',eventId:event.id,consentVersion:event.consentVersion,event:event}); }
  finally { lock.releaseLock(); }
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
  const blank=header.findIndex(value=>value==='');
  const populated=blank<0 ? header.length : blank;
  if (populated<10 || header.slice(0,populated).join('|')!==WEBINAR_HEADERS.slice(0,populated).join('|') || !header.slice(populated).every(value=>value==='')) throw new Error('Unexpected webinar schema.');
  if (populated<WEBINAR_HEADERS.length) table.getRange(1,populated+1,1,WEBINAR_HEADERS.length-populated).setValues([WEBINAR_HEADERS.slice(populated)]);

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
    if (typeof data.eventId !== 'string' || !/^[a-z0-9-]{1,80}$/.test(data.eventId)) throw new Error('Invalid event.');
    const webinar=webinarEvent_(data.eventId);
    if (!webinar || webinar.status !== 'upcoming' || data.consentVersion !== webinar.consentVersion || data.consent !== true) throw new Error('Invalid event or consent.');
    const email = email_(data.email);
    if (typeof data.fullName !== 'string' || !data.fullName.trim() || data.fullName.length > 120) throw new Error('Invalid name.');
    const occupation=data.occupation || '', familiarity=data.sustainabilityFamiliarity || '';
    if (!['','architect','student','researcher','other'].includes(occupation) || !['','new','some','experienced'].includes(familiarity)) throw new Error('Invalid profile choices.');
    if (data.newsletterConsent != null && typeof data.newsletterConsent !== 'boolean') throw new Error('Invalid newsletter choice.');
    if (data.phone != null && typeof data.phone !== 'string') throw new Error('Invalid phone.');
    const phone=String(data.phone || '').trim().replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632));
    const education=data.educationLevel || '';
    if (phone.length>32 || !/^[+()0-9 \-]*$/.test(phone) || !['','diploma','associate','bachelor','master','doctorate','other'].includes(education)) throw new Error('Invalid optional profile.');
    const name = data.fullName.trim();
    const table = webinarTable_();
    let row = 0;
    if (table.getLastRow() > 1) {
      const records = table.getRange(2,1,table.getLastRow()-1,WEBINAR_HEADERS.length).getValues();
      const match = records.findIndex(record => record[1] === webinar.id && String(record[2]).toLowerCase() === email);
      if (match >= 0) row = match + 2;
    }
    let pending;
    if (row) {
      table.getRange(row,11,1,6).setValues([[occupation,familiarity,data.newsletterConsent === true,data.newsletterConsent === true ? new Date() : '',sheetText_(phone),education]]);
      const previous = table.getRange(row,1,1,WEBINAR_HEADERS.length).getValues()[0];
      if (previous[5] === 'confirmed') return json_({ok:true,status:'already-confirmed'});
      const age = Date.now() - new Date(previous[7]).getTime();
      if (previous[5] === 'pending' && age >= 0 && age < 7*86400000) {
        if (data.resend !== true) return json_({ok:true,status:'pending-confirmation',mailState:String(previous[9])});
        pending=previous;
      }
    }
    reservePublicMail_('webinar',email);
    const token = pending ? pending[6] : Utilities.getUuid() + Utilities.getUuid();
    row = row || table.getLastRow()+1;
    if (!pending) table.getRange(row,1,1,WEBINAR_HEADERS.length).setValues([[
      'web_' + Utilities.getUuid(),webinar.id,email,sheetText_(name),webinar.consentVersion,
      'pending',token,new Date(),'', 'sending',occupation,familiarity,data.newsletterConsent === true,data.newsletterConsent === true ? new Date() : '',sheetText_(phone),education
    ]]);
    table.getRange(row,10).setValue('sending');
    SpreadsheetApp.flush();
    try {
      MailApp.sendEmail(webinarMessage_(name,email,token,webinar));
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

function webinarMessage_(name,email,token,event) {
  const url=ScriptApp.getService().getUrl()+'?webinarConfirm='+encodeURIComponent(token);
  const safe=value=>escape_(String(value));
  const title=event.titleFa+' '+event.subtitleFa;
  const html='<!doctype html><html><body style="margin:0;background:#e7efed"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 12px">'+
    '<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#f3f7f6;color:#10123c;font-family:Tahoma,Arial,sans-serif">'+
    '<tr><td style="padding:28px 30px 16px;font-size:13px;letter-spacing:2px;color:#315e52" dir="ltr">NEXONEST <span style="float:right;font-size:11px">UPCOMING EVENT</span></td></tr>'+
    '<tr><td><img src="https://nexonest.com/assets/webinars/sustainable-development/email-cover.png" width="600" alt="زمین، اکوسیستم و محیط ساخته‌شده" style="display:block;width:100%;height:auto;border:0"></td></tr>'+
    '<tr><td dir="rtl" style="padding:22px 32px 32px;text-align:right;font-size:17px;line-height:1.95">'+
    '<h1 style="font-size:29px;line-height:1.6;margin:0;font-weight:bold">'+safe(event.titleFa)+'</h1><p style="margin:2px 0 12px;color:#315e52;font-size:20px">'+safe(event.subtitleFa)+'</p>'+
    '<p dir="ltr" style="font-size:18px;line-height:1.5;margin:0 0 28px;font-weight:bold;text-align:right">'+safe(event.titleEn)+'</p>'+
    '<p style="margin:0 0 14px">سلام '+safe(name)+'،</p><p style="margin:0 0 24px">درخواستت دریافت شد. برای تأیید نشانی ایمیل و تکمیل پیش‌ثبت‌نام، دکمهٔ زیر را بزن.</p>'+
    '<table role="presentation" cellspacing="0" cellpadding="0"><tr><td bgcolor="#10123c" style="padding:14px 24px"><a href="'+safe(url)+'" style="font-family:Tahoma,Arial,sans-serif;font-size:18px;font-weight:bold;color:#ffffff;text-decoration:none;display:inline-block">تأیید پیش‌ثبت‌نام ←</a></td></tr></table>'+
    '<p style="margin:26px 0 12px;padding-top:20px;border-top:1px solid #bfd5ce">جزئیات برگزاری را پس از نهایی‌شدن با ایمیل اطلاع می‌دهیم.</p><p style="font-size:14px;color:#596761;margin:0">این لینک هفت روز اعتبار دارد. پیش‌ثبت‌نام به معنی پرداخت یا رزرو قطعی نیست. اگر این درخواست را نفرستاده‌ای، ایمیل را نادیده بگیر.</p>'+
    '<p dir="ltr" style="font-size:12px;color:#596761;text-align:left;margin:28px 0 0">NEXONEST · EVENTS</p></td></tr></table></td></tr></table></body></html>';
  return {to:email,name:'NexoNest',subject:'تأیید پیش‌ثبت‌نام وبینار | '+event.titleFa,body:'سلام '+name+'\nبرای تأیید پیش‌ثبت‌نام «'+title+'» این لینک را باز کنید:\n'+url+'\nاین لینک هفت روز اعتبار دارد. جزئیات برگزاری پس از نهایی‌شدن با ایمیل اطلاع داده می‌شود. پیش‌ثبت‌نام به معنی پرداخت یا رزرو قطعی نیست.',htmlBody:html};
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
    const event=webinarEvent_(String(record[1]));
    if (!event) return page_('Link not found','Invalid event.',false);
    if (record[5] === 'confirmed') return page_('Pre-registration confirmed','Your email is already confirmed. Event details will be emailed when available.',true);
    const age = Date.now() - new Date(record[7]).getTime();
    if (!Number.isFinite(age) || age < 0 || age >= 7*86400000) return page_('Link expired','Return to nexonest.com/events/?event=sustainable-development-introduction and pre-register again.',false);
    table.getRange(row,6).setValue('confirmed');
    table.getRange(row,9).setValue(new Date());
    SpreadsheetApp.flush();
    return page_('Pre-registration confirmed','Your email is confirmed for '+event.titleEn+'. Event details will be emailed when available. This is not a paid booking.',true);
  } catch (error) {
    return page_('Please try again','We could not confirm your pre-registration. Open the same link again later.',false);
  } finally { lock.releaseLock(); }
}
