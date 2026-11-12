const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto'),path=require('path');
const site=path.resolve(__dirname,'..');
let now=Date.UTC(2026,10,12),mail=[],fail=false,locked=false,tables={};
class MockDate extends Date{constructor(...a){super(...(a.length?a:[now]));}static now(){return now;}}
class Sheet{constructor(){this.rows=[];}getLastRow(){return this.rows.length;}appendRow(r){this.rows.push([...r]);}setFrozenRows(){}getRange(r,c,h=1,w=1){const read=()=>Array.from({length:h},(_,i)=>Array.from({length:w},(_,j)=>this.rows[r-1+i]?.[c-1+j]??''));const write=v=>v.forEach((cells,i)=>cells.forEach((v,j)=>{this.rows[r-1+i]??=[];this.rows[r-1+i][c-1+j]=v;}));return{getValues:read,getDisplayValues:()=>read().map(r=>r.map(String)),getValue:()=>read()[0][0],setValues:write,setValue:v=>write([[v]])};}}
let reservations=0,quotaFailure=false;
const ctx=vm.createContext({console:{error(){}},Date:MockDate,LockService:{getScriptLock:()=>({tryLock:()=>!locked,releaseLock(){}})},SpreadsheetApp:{getActiveSpreadsheet:()=>({getSheetByName:n=>tables[n],insertSheet:n=>(tables[n]=new Sheet())}),flush(){}},Utilities:{getUuid:crypto.randomUUID},MailApp:{sendEmail:m=>{mail.push(m);if(fail)throw Error('uncertain');}},ScriptApp:{getService:()=>({getUrl:()=> 'https://script.example/exec'})},reservePublicMail_:()=>{if(quotaFailure)throw Error('quota');reservations++;},json_:o=>JSON.parse(JSON.stringify(o)),page_:(title,message,success)=>({title,message,success}),email_:v=>{if(typeof v!=='string'||!/^\S+@\S+\.\S+$/.test(v))throw Error('email');return v.trim().toLowerCase();},sheetText_:v=>/^[=+@\-\t\r]/.test(v)?"'"+v:v,escape_:v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),findRow_:(t,c,v)=>t.rows.findIndex((r,i)=>i>0&&r[c-1]===v)+1});
vm.runInContext(fs.readFileSync(path.join(site,'integrations/google-apps-script/Webinars.gs'),'utf8'),ctx);
const data={eventId:'sustainable-development-introduction',consentVersion:'webinar-prereg-v1',fullName:'Test User',email:'test@example.org',consent:true};
const post=d=>ctx.webinarPost_({parameter:{payload:JSON.stringify(d)}});let count=0;const check=(truth)=>{assert(truth);count++;};
check(post({...data,consent:false}).ok===false);check(post({...data,eventId:'unknown'}).ok===false);check(post({...data,email:'bad'}).ok===false);check(post({...data,fullName:''}).ok===false);check(mail.length===0);
check(post(data).status==='pending-confirmation');check(mail.length===1);check(tables.WebinarRegistrations.rows.length===2);const token=tables.WebinarRegistrations.rows[1][6];check(mail[0].body.includes(token));check(!mail[0].subject.includes('Newsletter'));
check(post(data).status==='pending-confirmation');check(mail.length===1);check(ctx.webinarConfirm_(token).success);check(tables.WebinarRegistrations.rows[1][5]==='confirmed');check(ctx.webinarConfirm_(token).success);check(post(data).status==='already-confirmed');check(mail.length===1);
check(!ctx.webinarConfirm_('not-a-token').success);check(!ctx.webinarConfirm_(crypto.randomUUID()+crypto.randomUUID()).success);
fail=true;check(post({...data,email:'uncertain@example.org'}).mailState==='unknown');check(post({...data,email:'uncertain@example.org'}).mailState==='unknown');check(mail.length===2);fail=false;
now+=8*86400000;check(!ctx.webinarConfirm_(tables.WebinarRegistrations.rows[2][6]).success);check(post({...data,email:'uncertain@example.org'}).mailState==='sent');check(mail.length===3);
check(post({...data,fullName:'=FORMULA',email:'formula@example.org'}).ok);check(tables.WebinarRegistrations.rows[3][3]==="'=FORMULA");
quotaFailure=true;check(post({...data,email:'quota@example.org'}).ok===false);check(mail.length===4);quotaFailure=false;
locked=true;check(post(data).ok===false);locked=false;
check(post({...data,website:'bot'}).ok);check(mail.length===4);
const oldHeader=tables.WebinarRegistrations.rows[0][0];tables.WebinarRegistrations.rows[0][0]='unexpected';check(post(data).ok===false);tables.WebinarRegistrations.rows[0][0]=oldHeader;
check(ctx.webinarInfo_().eventId===data.eventId);
new vm.Script(fs.readFileSync(path.join(site,'integrations/google-apps-script/Code.gs'),'utf8'));
new vm.Script(fs.readFileSync(path.join(site,'js/events.js'),'utf8'));
console.log(JSON.stringify({checks:count,mail:'mock only',result:'passed'}));
