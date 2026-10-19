// Dedicated module for the bound NexoNest spreadsheet. Never route admin functions publicly.
const WORKSHOP_BOOK = '1V3-9pdWyaSNJXYUTJqsqESKI-G9JrCiggMaW3M16Bls';
const WORKSHOP_OWNER = 'nexonest.contact@gmail.com';
const WORKSHOP_FOLDER = '1hb740CcyVYDRTJyD857Ee2pS44bOf1bo';
const WORKSHOP_TAB = 'Workshop_Registrations';
const WORKSHOP_HEADERS = ['کد پیگیری','زمان ثبت','نام و نام خانوادگی','ایمیل','شماره تماس','مقطع تحصیلی','تجربه راینو','تجربه گرس‌هاپر','نوع ثبت‌نام','مبلغ ـ تومان','دانشگاه','کد خبرنامه','گواهینامه','رضایت انتشار در سایت','نسخه قوانین','پذیرش قوانین','فیش واریزی','وضعیت','بررسی‌کننده','زمان بررسی','یادداشت مدیر','ایمیل دریافت','ایمیل تأیید','شناسه درخواست'];

function workshopOwner_() {
  if (Session.getActiveUser().getEmail().toLowerCase() !== WORKSHOP_OWNER) throw new Error('این عملیات فقط برای مدیر مجاز است.');
}
function workshopMenu_() {
  SpreadsheetApp.getUi().createMenu('ثبت‌نام کارگاه')
    .addItem('آماده‌سازی جدول ثبت‌نام', 'setupWorkshop')
    .addItem('تأیید ثبت‌نام انتخاب‌شده', 'approveWorkshopRegistration')
    .addItem('رد درخواست انتخاب‌شده', 'rejectWorkshopRegistration').addToUi();
}
function workshopSheet_(course) {
  const sheet = SpreadsheetApp.openById(WORKSHOP_BOOK).getSheetByName(course ? course.sheet : WORKSHOP_TAB);
  if (!sheet || JSON.stringify(sheet.getRange(1,1,1,WORKSHOP_HEADERS.length).getValues()[0]) !== JSON.stringify(WORKSHOP_HEADERS)) throw new Error('جدول ثبت‌نام آماده نیست.');
  return sheet;
}
function setupWorkshop() {
  workshopOwner_();
  const book = SpreadsheetApp.openById(WORKSHOP_BOOK);
  if (!book.getSheetByName(WORKSHOP_TAB)) {
    const sheet = book.insertSheet(WORKSHOP_TAB);
    sheet.getRange(1,1,1,WORKSHOP_HEADERS.length).setValues([WORKSHOP_HEADERS]).setBackground('#171717').setFontColor('#f7f5ef').setFontWeight('bold');
    sheet.setFrozenRows(1); sheet.setRightToLeft(true); sheet.setColumnWidths(1,WORKSHOP_HEADERS.length,150);
    sheet.setColumnWidth(3,200); sheet.setColumnWidth(4,240); sheet.setColumnWidth(17,300);
    sheet.getRange(2,1,sheet.getMaxRows()-1,WORKSHOP_HEADERS.length).setNumberFormat('@');
    sheet.hideColumns(24);
  }
  workshopSheet_();
}
function workshopText_(value, max) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text || text.length > max || /[\x00-\x1f]/.test(text)) throw new Error('اطلاعات فرم ناقص یا نامعتبر است.');
  return text;
}
function workshopChoice_(value, allowed) {
  if (!Object.prototype.hasOwnProperty.call(allowed,value)) throw new Error('گزینهٔ انتخاب‌شده معتبر نیست.');
  return allowed[value];
}
function workshopValidate_(data, course) {
  const name = workshopText_(data.fullName,120), email = workshopText_(data.email,160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('ایمیل معتبر وارد کنید.');
  const phone = workshopText_(data.phone,20).replace(/[۰-۹٠-٩]/g,c => String('۰۱۲۳۴۵۶۷۸۹'.includes(c) ? '۰۱۲۳۴۵۶۷۸۹'.indexOf(c) : '٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[\s()-]/g,'');
  if (!/^\+?[0-9]{10,15}$/.test(phone)) throw new Error('شماره تماس معتبر وارد کنید.');
  if (!/^[a-f0-9-]{36}$/i.test(data.requestId || '') || data.website || data.rulesVersion !== (course ? course.rulesVersion : '2026-10-v3') || data.rulesAccepted !== true || data.certificateAccepted !== true || typeof data.websiteConsent !== 'boolean') throw new Error('پذیرش قوانین و اطلاعات فرم را بررسی کنید.');
  const type = workshopChoice_(data.registrationType,{standard:'عمومی',student:'دانشجویی',newsletter:'عضو خبرنامه'});
  const fee = (course ? course.fees : {standard:2900000,student:2610000,newsletter:2320000})[data.registrationType];
  const education = workshopChoice_(data.educationLevel,{school:'دیپلم و پیش‌دانشگاهی',associate:'کاردانی',bachelor:'کارشناسی',master:'کارشناسی ارشد',doctorate:'دکتری',other:'سایر'});
  const levels = {none:'بدون تجربه',beginner:'مقدماتی',intermediate:'متوسط',advanced:'پیشرفته'};
  const rhino = workshopChoice_(data.rhinoExperience,levels), gh = workshopChoice_(data.grasshopperExperience,levels);
  const certificate = workshopChoice_(data.certificateType,{attendance:'حضور',completion:'پایان دوره'});
  const university = data.registrationType === 'student' ? workshopText_(data.university,160) : '';
  const code = data.registrationType === 'newsletter' ? workshopText_(data.newsletterCode,80) : '';
  return {name,email,phone,type,fee,education,rhino,gh,certificate,university,code};
}
function workshopReceipt_(receipt) {
  if (!receipt || typeof receipt.base64 !== 'string' || receipt.base64.length > 6990508 || !/^[A-Za-z0-9+/]+={0,2}$/.test(receipt.base64)) throw new Error('فایل فیش معتبر نیست.');
  const bytes = Utilities.base64Decode(receipt.base64), unsigned = bytes.slice(0,8).map(b => (b+256)%256);
  const types = {'image/jpeg':{ext:'jpg',sig:[255,216,255]},'image/png':{ext:'png',sig:[137,80,78,71,13,10,26,10]},'application/pdf':{ext:'pdf',sig:[37,80,68,70,45]}};
  const format = types[receipt.type];
  if (!format || bytes.length < 5 || bytes.length > 5*1024*1024 || !format.sig.every((v,i)=>unsigned[i]===v)) throw new Error('فیش باید JPG، PNG یا PDF و حداکثر ۵ مگابایت باشد.');
  return {bytes,type:receipt.type,ext:format.ext};
}
function workshopSafe_(value) { return typeof value === 'string' && /^[=+@\-\t\r]/.test(value) ? "'"+value : value; }
function workshopPost_(event) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return json_({ok:false,error:'سامانه مشغول است؛ دوباره تلاش کنید.'});
  try {
    if (Session.getEffectiveUser().getEmail().toLowerCase() !== WORKSHOP_OWNER) throw new Error('حساب اجرایی ثبت‌نام نیاز به تنظیم دارد.');
    const raw = event && event.parameter && event.parameter.payload;
    if (!raw || raw.length > 7100000) throw new Error('حجم درخواست معتبر نیست.');
    const data = JSON.parse(raw), course = workshopResolveCourse_(data.courseId), valid = workshopValidate_(data, course), sheet = workshopSheet_(course);
    const rows = sheet.getLastRow()>1 ? sheet.getRange(2,1,sheet.getLastRow()-1,24).getValues() : [];
    const previous = rows.find(row => String(row[23]) === data.requestId);
    if (previous) return json_({ok:true,trackingCode:previous[0],emailStatus:previous[21]});
    if (course.state !== 'open' || (course.id === 'workshop-2026-10' && PropertiesService.getScriptProperties().getProperty('WORKSHOP_ENABLED') !== 'true')) throw new Error('ثبت‌نام هنوز فعال نیست. فعلاً وجهی واریز نکنید.');
    if (rows.some(row=>String(row[3]).toLowerCase()===valid.email)) throw new Error('برای این ایمیل قبلاً درخواست ثبت شده است. برای پیگیری با پشتیبانی تماس بگیرید.');
    // Hard quotas bound public-upload abuse; this is not a replacement for CAPTCHA at larger scale.
    if (rows.length >= course.capacity || rows.filter(row=>String(row[1]).slice(0,10)===new Date().toISOString().slice(0,10)).length>=course.dailyLimit) throw new Error('ظرفیت دریافت درخواست فعلاً تکمیل است؛ با پشتیبانی تماس بگیرید.');
    const receipt = valid.fee > 0 ? workshopReceipt_(data.receipt) : null;
    const tracking = 'NN-'+Utilities.getUuid().replace(/-/g,'').slice(0,16).toUpperCase();
    let receiptUrl = '';
    if (receipt) {
      const folder = DriveApp.getFolderById(WORKSHOP_FOLDER);
      if (folder.getSharingAccess() !== DriveApp.Access.PRIVATE) throw new Error('ذخیره‌سازی امن فیش در حال بررسی است.');
      const file = folder.createFile(Utilities.newBlob(receipt.bytes,receipt.type,tracking+'.'+receipt.ext));
      file.setSharing(DriveApp.Access.PRIVATE,DriveApp.Permission.NONE);
      receiptUrl = file.getUrl();
    }
    // Preserve receipt on uncertain sheet-write outcome; the owner can reconcile an orphan.
    sheet.appendRow([tracking,new Date().toISOString(),valid.name,valid.email,valid.phone,valid.education,valid.rhino,valid.gh,valid.type,valid.fee,valid.university,valid.code,valid.certificate,data.websiteConsent?'بله':'خیر',data.rulesVersion,'بله',receiptUrl,'در انتظار بررسی','','','','pending','pending',data.requestId].map(workshopSafe_));
    const row=sheet.getLastRow(); SpreadsheetApp.flush();
    workshopMail_(sheet,row,22,valid.email,'دریافت درخواست ثبت‌نام کارگاه',valid.name+' عزیز،\nدرخواست شما برای '+course.name+' دریافت شد.\nکد پیگیری: '+tracking+'\nثبت‌نام در انتظار بررسی فیش و اطلاعات است و هنوز قطعی نیست. نتیجه از طریق ایمیل اعلام می‌شود.\nآکادمی نکسونست');
    return json_({ok:true,trackingCode:tracking,emailStatus:sheet.getRange(row,22).getValue()});
  } catch(error) {
    console.error('Workshop request failed: '+error.message);
    const publicMessage = /^[\u0600-\u06ff]/.test(error.message) ? error.message : 'ثبت درخواست کامل نشد. با همین فرم دوباره تلاش کنید؛ در صورت تکرار با پشتیبانی تماس بگیرید.';
    return json_({ok:false,error:publicMessage});
  } finally { lock.releaseLock(); }
}
function workshopMail_(sheet,row,column,email,subject,body) {
  if (sheet.getRange(row,column).getValue() !== 'pending') return;
  // Persist before sending. Unknown outcomes must be checked manually, never auto-retried.
  sheet.getRange(row,column).setValue('unknown'); SpreadsheetApp.flush();
  try {
    MailApp.sendEmail({to:email,subject,body,name:'آکادمی نکسونست',replyTo:WORKSHOP_OWNER});
    sheet.getRange(row,column).setValue('accepted'); SpreadsheetApp.flush();
  } catch(error) { console.error('Workshop mail needs review at row '+row); }
}
function approveWorkshopRegistration() { workshopReview_(true); }
function rejectWorkshopRegistration() { workshopReview_(false); }
function workshopReview_(approve) {
  workshopOwner_();
  const active = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = active.getActiveSheet(), range = sheet.getActiveRange();
  if (active.getId() !== WORKSHOP_BOOK || sheet.getName() !== WORKSHOP_TAB || !range || range.getRow()<2 || range.getNumRows()!==1) throw new Error('یک ثبت‌نام را در جدول کارگاه انتخاب کنید.');
  workshopSheet_();
  const row=range.getRow(), tracking=sheet.getRange(row,1).getValue();
  if (!tracking) throw new Error('ردیف خالی است.');
  const ui=SpreadsheetApp.getUi();
  const prompt=ui.prompt(approve?'تأیید ثبت‌نام':'رد درخواست','کد '+tracking+'\nفیش، مبلغ و در صورت نیاز دانشگاه و کد خبرنامه را بررسی کنید. یادداشت بررسی را وارد کنید.',ui.ButtonSet.OK_CANCEL);
  if(prompt.getSelectedButton()!==ui.Button.OK) return;
  const note=workshopText_(prompt.getResponseText(),500);
  const lock=LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const values=sheet.getRange(row,1,1,24).getValues()[0];
    if(values[0]!==tracking || values[17]!=='در انتظار بررسی') throw new Error('این درخواست قبلاً بررسی شده یا جای آن تغییر کرده است.');
    const video=PropertiesService.getScriptProperties().getProperty('WORKSHOP_VIDEO_URL') || '';
    if(video && !/^https:\/\/[^\s]+$/.test(video)) throw new Error('نشانی ویدئوی آمادگی معتبر نیست.');
    sheet.getRange(row,18,1,4).setValues([[approve?'تأیید شده':'رد شده',WORKSHOP_OWNER,new Date().toISOString(),workshopSafe_(note)]]); SpreadsheetApp.flush();
    if(approve) workshopMail_(sheet,row,23,values[3],'تأیید ثبت‌نام کارگاه نکسونست',values[2]+' عزیز،\nثبت‌نام شما تأیید شد.\nکد پیگیری: '+tracking+'\nگواهینامهٔ انتخاب‌شده: '+values[12]+'\n'+(video?'ویدئوی آمادگی و راهنمای نصب:\n'+video:'راهنمای نصب و آمادگی دوره در ادامه برای شما ارسال خواهد شد.')+'\nکارگاه: پنجشنبه و جمعه ۷ و ۸ آبان ۱۴۰۵، ساعت ۱۷ تا ۲۱. کرکسیون: سه‌شنبه ۱۲ آبان، ساعت ۱۷ تا ۲۱. تحویل نهایی: جمعه ۱۵ آبان. همهٔ ساعت‌ها به وقت تهران است.\nآکادمی نکسونست');
  } finally {lock.releaseLock();}
}
