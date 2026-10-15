const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
const path=require('node:path');
const modulePath=fs.existsSync(path.join(__dirname,'Workshop.gs')) ? path.join(__dirname,'Workshop.gs') : path.join(__dirname,'../integrations/google-apps-script/Workshop.gs');
const code=fs.readFileSync(modulePath,'utf8');
let rows=[],mails=0,files=0,enabled=true,failMail=false,owner='nexonest.contact@gmail.com';
let privateFolder=true;
const sheet={
 getLastRow:()=>rows.length+1,
 appendRow:row=>rows.push(row),
 getName:()=> 'Workshop_Registrations',
 getActiveRange:()=>({getRow:()=>2,getNumRows:()=>1}),
 getRange:(r,c,n=1,width=1)=>({getValues:()=>r===1?[vm.runInContext('WORKSHOP_HEADERS',ctx)]:rows.slice(r-2,r-2+n).map(row=>row.slice(c-1,c-1+width)),getValue:()=>rows[r-2][c-1],setValue:v=>{rows[r-2][c-1]=v;},setValues:values=>{values.forEach((cells,i)=>cells.forEach((v,j)=>rows[r-2+i][c-1+j]=v));}})
};
const ctx=vm.createContext({console,Date,JSON,Object,String,Error,Session:{getActiveUser:()=>({getEmail:()=>owner})},LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock:()=>{}})},PropertiesService:{getScriptProperties:()=>({getProperty:()=>enabled?'true':'false'})},SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet}),flush:()=>{}},Utilities:{getUuid:()=>require('node:crypto').randomUUID(),base64Decode:s=>[...Buffer.from(s,'base64')],newBlob:(...a)=>a},DriveApp:{Access:{PRIVATE:'private'},Permission:{NONE:'none'},getFolderById:()=>({getSharingAccess:()=>privateFolder?'private':'anyone',createFile:()=>{files++;return {setSharing:()=>{},getUrl:()=>`https://drive.google.com/file/d/test-${files}`};}})},MailApp:{sendEmail:()=>{mails++;if(failMail)throw new Error('delivery outcome unknown');}},json_:v=>v});
vm.runInContext(code,ctx);
ctx.Session.getEffectiveUser=()=>({getEmail:()=>owner});
const base={fullName:'آزمون',email:'test@example.com',phone:'۰۹۱۲۱۲۳۴۵۶۷',requestId:'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',educationLevel:'master',rhinoExperience:'beginner',grasshopperExperience:'none',registrationType:'standard',certificateType:'attendance',rulesAccepted:true,certificateAccepted:true,websiteConsent:false,rulesVersion:'2026-10-v1',receipt:{type:'application/pdf',base64:Buffer.from('%PDF-1.7 test').toString('base64')}};
let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
function post(data){return ctx.workshopPost_({parameter:{payload:JSON.stringify(data)}});}
function reset(){rows=[];mails=0;files=0;enabled=true;failMail=false;privateFolder=true;}
test('server calculates all prices',()=>{for(const [type,fee] of Object.entries({standard:2900000,student:2610000,newsletter:2320000}))assert.equal(ctx.workshopValidate_({...base,registrationType:type,university:'دانشگاه',newsletterCode:'TEST',fee:1}).fee,fee);});
test('Persian phone digits normalize',()=>assert.equal(ctx.workshopValidate_(base).phone,'09121234567'));
test('all consents enforced',()=>{for(const k of ['rulesAccepted','certificateAccepted'])assert.throws(()=>ctx.workshopValidate_({...base,[k]:false}));});
test('unknown enums rejected',()=>{for(const k of ['educationLevel','rhinoExperience','grasshopperExperience','registrationType','certificateType'])assert.throws(()=>ctx.workshopValidate_({...base,[k]:'__proto__'}));});
test('conditional required fields enforced',()=>{assert.throws(()=>ctx.workshopValidate_({...base,registrationType:'student'}));assert.throws(()=>ctx.workshopValidate_({...base,registrationType:'newsletter'}));});
test('invalid email rejected',()=>assert.throws(()=>ctx.workshopValidate_({...base,email:'bad'})));
test('rules version enforced',()=>assert.throws(()=>ctx.workshopValidate_({...base,rulesVersion:'old'})));
test('receipt signature checked',()=>assert.throws(()=>ctx.workshopReceipt_({type:'image/png',base64:base.receipt.base64})));
test('oversize receipt rejected',()=>assert.throws(()=>ctx.workshopReceipt_({type:'application/pdf',base64:'A'.repeat(6990510)})));
test('formula injection escaped',()=>assert.equal(ctx.workshopSafe_('=IMPORTXML("x")'),'\'=IMPORTXML("x")'));
test('closed registration has no side effects',()=>{reset();enabled=false;assert.equal(post(base).ok,false);assert.equal(files+mails+rows.length,0);});
test('private receipt and idempotent retry',()=>{reset();const a=post(base),b=post(base);assert.equal(a.ok,true);assert.equal(a.trackingCode,b.trackingCode);assert.match(a.trackingCode,/^NN-[A-F0-9]{16}$/);assert.equal(files,1);assert.equal(rows.length,1);assert.equal(mails,1);});
test('retry survives closing registration',()=>{enabled=false;assert.equal(post(base).ok,true);assert.equal(mails,1);});
test('same email new request rejected',()=>{enabled=true;assert.equal(post({...base,requestId:'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'}).ok,false);assert.equal(files,1);});
test('non-private folder rejected',()=>{reset();privateFolder=false;assert.equal(post(base).ok,false);assert.equal(files,0);});
test('uncertain email does not duplicate on retry',()=>{reset();failMail=true;const a=post(base);assert.equal(a.ok,true);assert.equal(a.emailStatus,'unknown');post(base);assert.equal(mails,1);});
test('admin identity checked',()=>{owner='other@example.com';assert.throws(()=>ctx.workshopOwner_());owner='nexonest.contact@gmail.com';ctx.workshopOwner_();});
test('daily quota enforced',()=>{reset();rows=Array.from({length:30},(_,i)=>['OLD'+i,new Date().toISOString(),'','other'+i+'@example.com']);assert.equal(post(base).ok,false);assert.equal(files,0);});
ctx.SpreadsheetApp.getActiveSpreadsheet=()=>({getId:()=> '1V3-9pdWyaSNJXYUTJqsqESKI-G9JrCiggMaW3M16Bls',getActiveSheet:()=>sheet});
ctx.SpreadsheetApp.getUi=()=>({ButtonSet:{OK_CANCEL:1},Button:{OK:1},prompt:()=>({getSelectedButton:()=>1,getResponseText:()=> 'فیش و کد بررسی شد'})});
ctx.LockService.getScriptLock=()=>({tryLock:()=>true,waitLock:()=>{},releaseLock:()=>{}});
ctx.PropertiesService.getScriptProperties=()=>({getProperty:key=>key==='WORKSHOP_ENABLED'?(enabled?'true':'false'):''});
test('approval is recorded and confirmation sends once',()=>{reset();post(base);ctx.approveWorkshopRegistration();assert.equal(rows[0][17],'تأیید شده');assert.equal(rows[0][22],'accepted');assert.equal(mails,2);assert.throws(()=>ctx.approveWorkshopRegistration());assert.equal(mails,2);});
test('rejection keeps record and sends no confirmation',()=>{reset();post(base);ctx.rejectWorkshopRegistration();assert.equal(rows[0][17],'رد شده');assert.equal(mails,1);assert.throws(()=>ctx.approveWorkshopRegistration());});
console.log(`${count} backend checks passed. No external calls or real email.`);
