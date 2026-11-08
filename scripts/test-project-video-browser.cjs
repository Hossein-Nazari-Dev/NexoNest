const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname,'..');
const fixture = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Project video lifecycle fixture</title>
<style>dialog{width:420px;max-width:80vw}video{width:100%}</style>
<button class="project-video-button" id="first" data-video="/assets/videos/printerra/fifthtry1.mp4" data-video-title="First">Open first</button>
<dialog id="projectVideoDialog"><h2 id="projectVideoTitle">Animation</h2><button class="project-video-close">Close</button>
<video controls playsinline class="project-video-player"></video>
<button class="project-video-button" id="second" data-video="/assets/videos/printerra/seventhtry1.mp4" data-video-title="Second">Switch video</button></dialog>
<script src="/js/project-page.js"></script><script>initProjectVideo(document)();</script></html>`;
const server = http.createServer((req,res)=>{
  const name = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(name==='/video-fixture.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(fixture);return;}
  const file = path.resolve(root,'.'+name);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
  const total=fs.statSync(file).size, range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  const start=range?Number(range[1]):0,end=range&&range[2]?Math.min(Number(range[2]),total-1):total-1;
  if(start>=total||end<start){res.writeHead(416,{'Content-Range':`bytes */${total}`}).end();return;}
  res.writeHead(range?206:200,{'Content-Type':path.extname(file)==='.js'?'text/javascript':'video/mp4','Accept-Ranges':'bytes','Content-Length':end-start+1,...(range?{'Content-Range':`bytes ${start}-${end}/${total}`}:{})});
  fs.createReadStream(file,{start,end}).pipe(res);
});

(async()=>{
  let browser;
  try {
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const base=`http://127.0.0.1:${server.address().port}`;
    browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'msedge',headless:true});
    const page=await browser.newPage();
    await page.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(base+'/video-fixture.html');
    const playing=()=>page.waitForFunction(()=>{
      const v=document.querySelector('video');return !v.paused&&v.readyState>=2&&v.currentTime>0.1;
    });
    const released=()=>page.waitForFunction(()=>{
      const d=document.querySelector('dialog'),v=document.querySelector('video');
      // Edge may retain the last currentSrc string after load() unloads media.
      // The source attribute is absent and the decoded media state is empty.
      return !d.open&&v.paused&&!v.hasAttribute('src')&&v.readyState===0;
    });
    const routes=['button','backdrop','Escape','programmatic'];
    for(const exit of routes){
      await page.locator('#first').click();await playing();
      if(exit==='button')await page.locator('.project-video-close').click();
      else if(exit==='backdrop')await page.mouse.click(2,2);
      else if(exit==='Escape')await page.keyboard.press('Escape');
      else await page.locator('dialog').evaluate(dialog=>dialog.close());
      await released();
    }
    await page.locator('#first').click();await playing();
    await page.locator('#second').click();await playing();
    assert.match(await page.locator('video').evaluate(video=>video.currentSrc),/seventhtry1\.mp4$/);
    assert.equal(await page.locator('#projectVideoTitle').textContent(),'Second');
    await page.locator('.project-video-close').click();await released();
    await page.evaluate(()=>{document.querySelector('#first').click();document.querySelector('.project-video-close').click();document.querySelector('#first').click();});
    await playing();
    await page.keyboard.press('Escape');await released();
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({fixture:'production initProjectVideo with local archive MP4s',realPlayback:true,exits:routes,reopen:true,switch:true,queuedClose:true,pageErrors:errors}));
  } finally {await browser?.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
