(() => {
  'use strict';
  const form = document.querySelector('#registration');
  const $ = (id) => document.getElementById(id);
  const endpoint = document.querySelector('meta[name="workshop-endpoint"]').content.trim();
  const fees = {standard:2900000,student:2610000,newsletter:2320000};
  const button = form.querySelector('[type=submit]');
  const status = $('form-status');
  let busy = false;
  // Keep the same id for retries; no personal information is persisted.
  let requestId;
  try { requestId = sessionStorage.getItem('workshop-request-id'); } catch { /* Storage can be disabled. */ }
  if (!requestId) {
    requestId = crypto.randomUUID();
    try { sessionStorage.setItem('workshop-request-id', requestId); } catch { /* In-memory retries remain safe. */ }
  }
  const money = (value) => new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
  function updateType() {
    const type = form.elements.registrationType.value;
    $('fee').textContent = money(fees[type]);
    $('payment-fee').textContent = money(fees[type]);
    [['student','university','university-field'],['newsletter','newsletterCode','newsletter-field']].forEach(([kind,name,id]) => {
      $(id).hidden = type !== kind;
      form.elements[name].disabled = type !== kind;
      form.elements[name].required = type === kind;
    });
  }
  form.addEventListener('change', updateType);
  $('receipt').addEventListener('change', () => { $('file-name').textContent = $('receipt').files[0]?.name || 'تصویر یا فایل PDF · حداکثر ۵ مگابایت'; });
  $('copy-card').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('6037997322977977'); $('copy-card').textContent = 'کپی شد'; }
    catch { status.textContent = 'کپی خودکار ممکن نشد؛ شماره کارت را انتخاب و کپی کنید.'; }
  });
  const digits = (s) => s.replace(/[۰-۹٠-٩]/g, c => String('۰۱۲۳۴۵۶۷۸۹'.includes(c) ? '۰۱۲۳۴۵۶۷۸۹'.indexOf(c) : '٠١٢٣٤٥٦٧٨٩'.indexOf(c)));
  function validate() {
    form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    let first;
    for (const field of form.elements) {
      if (field.willValidate && !field.validity.valid) { field.setAttribute('aria-invalid','true'); first ||= field; }
    }
    if (first) { first.focus(); throw new Error('لطفاً همهٔ فیلدهای الزامی، نوع گواهینامه و پذیرش قوانین را کامل کنید. ایمیل باید معتبر باشد.'); }
    if (!/^\+?[0-9]{10,15}$/.test(digits(form.elements.phone.value).replace(/[\s()-]/g,''))) throw new Error('شماره تماس معتبر وارد کنید.');
    const file = $('receipt').files[0];
    if (!file || !['image/jpeg','image/png','application/pdf'].includes(file.type) || file.size < 1 || file.size > 5*1024*1024) throw new Error('فیش باید تصویر JPG یا PNG یا فایل PDF و حداکثر ۵ مگابایت باشد.');
    return file;
  }
  function readBase64(file) {
    return new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result.split(',')[1]); reader.onerror = () => reject(new Error('خواندن فایل ممکن نشد. دوباره انتخاب کنید.')); reader.readAsDataURL(file); });
  }
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (busy || !endpoint) return;
    status.textContent = '';
    try {
      const file = validate(); busy = true; button.disabled = true; button.textContent = 'در حال ارسال؛ لطفاً صبر کنید…';
      const values = Object.fromEntries(new FormData(form));
      const payload = {...values,requestId,rulesVersion:'2026-10-v1',rulesAccepted:form.elements.rulesAccepted.checked,certificateAccepted:form.elements.certificateAccepted.checked,websiteConsent:form.elements.websiteConsent.checked,receipt:{type:file.type,base64:await readBase64(file)}};
      const response = await fetch(endpoint, {method:'POST',body:new URLSearchParams({service:'workshop',payload:JSON.stringify(payload)}),signal:AbortSignal.timeout(90000)});
      if (!response.ok) throw new Error('پاسخ سرور دریافت نشد.');
      const result = await response.json();
      if (!result.ok || !/^NN-[A-F0-9]{16}$/.test(result.trackingCode || '')) throw new Error(result.error || 'پاسخ ثبت‌نام معتبر نبود.');
      $('tracking').textContent = result.trackingCode;
      $('mail-status').textContent = result.emailStatus === 'accepted' ? 'ایمیل دریافت درخواست ارسال شده است؛ پوشهٔ هرزنامه را هم بررسی کنید.' : 'درخواست ثبت شده، اما ارسال ایمیل نیاز به بررسی دارد. کد پیگیری را نگه دارید.';
      form.hidden = true; $('success').hidden = false; $('success').focus();
      try { sessionStorage.removeItem('workshop-request-id'); } catch { /* No data is stored in restricted browsers. */ }
    } catch(error) {
      status.textContent = (error.name === 'TimeoutError' || error instanceof TypeError) ? 'ارتباط کامل نشد؛ ممکن است درخواست ثبت شده باشد. با همین صفحه دوباره ارسال کنید؛ کد درخواست برای جلوگیری از ثبت تکراری حفظ می‌شود.' : error.message;
    } finally { busy = false; button.disabled = !endpoint; button.innerHTML = 'ارسال درخواست ثبت‌نام <span>←</span>'; }
  });
  if (endpoint) { $('availability').textContent = 'ثبت‌نام پس از بررسی فیش و اطلاعات شما قطعی خواهد شد.'; button.disabled = false; }
  updateType();
})();
