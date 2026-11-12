(() => {
  const form=document.querySelector('#event-form');
  if(!form)return;
  const status=document.querySelector('#form-status'),button=form.querySelector('button');
  const endpoint=document.querySelector('meta[name="webinar-endpoint"]').content;
  const eventId=document.querySelector('meta[name="event-id"]').content;
  const requested=new URLSearchParams(location.search).get('event');
  if(requested && requested!==eventId){form.hidden=true;status.textContent='پیش‌ثبت‌نامِ این لینک برای رویداد جاری نیست. برای اطلاع از رویداد قبلی با ما تماس بگیرید.';return;}
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(button.disabled||!form.reportValidity())return;
    const fields=new FormData(form);
    const data={eventId,consentVersion:'webinar-prereg-v1',fullName:String(fields.get('fullName')||'').trim(),email:String(fields.get('email')||'').trim(),consent:fields.get('consent')==='on',website:String(fields.get('website')||'')};
    if(!data.fullName){form.elements.fullName.focus();return;}
    button.disabled=true;status.dataset.state='pending';status.textContent='در حال ثبت درخواست…';
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);
    try{
      const response=await fetch(endpoint,{method:'POST',mode:'cors',credentials:'omit',signal:controller.signal,headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:new URLSearchParams({service:'webinar',payload:JSON.stringify(data)})});
      if(!response.ok)throw new Error('unconfirmed');
      const result=await response.json();
      if(result.ok!==true){status.dataset.state='error';status.textContent=result.error||'درخواست ثبت نشد؛ کمی بعد دوباره تلاش کنید.';return;}
      if(!['pending-confirmation','already-confirmed'].includes(result.status))throw new Error('unconfirmed');
      status.dataset.state='success';
      status.textContent=result.status==='already-confirmed'?'پیش‌ثبت‌نام این ایمیل قبلاً تأیید شده است؛ جزئیات برگزاری را با ایمیل اطلاع می‌دهیم.':result.mailState==='unknown'?'درخواست ذخیره شد، اما ارسال ایمیل قطعی نیست. صندوق ورودی و Spam را بررسی کنید؛ اگر ایمیلی نرسید با ما تماس بگیرید.':'درخواست ثبت شد. لینک تأیید را در ایمیلت باز کن تا پیش‌ثبت‌نام تأیید شود. پوشهٔ Spam را هم بررسی کن.';
    }catch(error){status.dataset.state='error';status.textContent='نتیجهٔ درخواست مشخص نیست؛ ممکن است ثبت شده باشد. قبل از تلاش دوباره ایمیل و Spam را بررسی کن. اطلاعات فرم حفظ شده است.';}
    finally{clearTimeout(timer);button.disabled=false;}
  });
})();
