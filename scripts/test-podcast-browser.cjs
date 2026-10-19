const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname, '..');
const out=path.join(root, 'tmp', 'podcast-check');
fs.mkdirSync(out, {recursive:true});
const server=http.createServer((req,res)=>{
 const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const file=path.resolve(root,'.'+name);
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
 const total=fs.statSync(file).size;
 const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.mp3':'audio/mpeg','.ttf':'font/ttf','.json':'application/json'}[path.extname(file)]||'application/octet-stream';
 const match=req.headers.range?.match(/bytes=(\d+)-(\d*)/);
 const start=match?Number(match[1]):0;
 const end=match&&match[2]?Math.min(Number(match[2]),total-1):total-1;
 res.writeHead(match?206:200,{'Content-Type':mime,'Accept-Ranges':'bytes','Content-Length':end-start+1,...(match?{'Content-Range':`bytes ${start}-${end}/${total}`}:{})});
 fs.createReadStream(file,{start,end}).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];const media=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().endsWith('.mp3'))media.push(r.url());});
  await page.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  await page.goto(base+'/archicast/season-01.html');
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('audio').count(),3);
  assert.equal(media.length,0,'No initial audio download');
  assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
  await page.screenshot({path:path.join(out,'podcast-desktop.png'),fullPage:true});
  const durations=[];
  for(let i=0;i<3;i++){
   durations.push(await page.locator('audio').nth(i).evaluate(p=>new Promise((resolve,reject)=>{p.addEventListener('loadedmetadata',()=>resolve(p.duration),{once:true});p.addEventListener('error',()=>reject(Error('Audio decode failure')),{once:true});p.load();})));
  }
  await page.locator('audio').nth(0).evaluate(p=>p.play());
  await page.locator('audio').nth(1).evaluate(p=>p.play());
  assert.equal(await page.locator('audio').nth(0).evaluate(p=>p.paused),true);
  await page.locator('audio').nth(1).evaluate(p=>p.pause());
  await page.locator('a[href="#episode-03"]').first().click();
  assert.equal(new URL(page.url()).hash,'#episode-03');
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/archicast/season-01.html');
  await page.evaluate(()=>document.fonts.ready);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No mobile overflow');
  await page.screenshot({path:path.join(out,'podcast-mobile.png'),fullPage:true});
  await page.goto(base+'/nexonest.html');
  await page.locator('[data-category="podcast"]').click();
  await page.locator('[data-subcategory="archicast-season-01"]').click();
  assert.equal(await page.locator('.project-icon.active').count(),1);
  await page.locator('[data-id="p_archicast_season_01"]').click();
  await page.locator('#popup-button').click();
  await page.waitForURL('**/archicast/season-01.html');
  await page.waitForTimeout(800); // Let the site's existing view transition finish.
  await page.goto(base+'/index.html');
  assert.equal(await page.locator('a[href="archicast/season-01.html"]').count(),0);
  await page.screenshot({path:path.join(out,'podcast-home-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);
  const nojs=await browser.newPage({javaScriptEnabled:false});
  await nojs.goto(base+'/archicast/season-01.html');
  assert.equal(await nojs.locator('audio[controls]').count(),3);
  assert.equal(await nojs.locator('.episode h2').count(),3);
  fs.writeFileSync(path.join(out,'podcast-check-results.json'),JSON.stringify({durations},null,2));
  console.log(JSON.stringify({pass:true,durations,checks:['Desktop/mobile rendering','No initial audio requests','Three real MP3 metadata decodes','Audio playback and mutual pause','Direct episode links','Podcast and season catalogue filters','Popup navigation','No homepage podcast shortcut','No-JS content and native controls','No page errors']},null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});

