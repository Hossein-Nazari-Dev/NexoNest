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
const browser=await chromium.launch({channel:'msedge',headless:true});
try{const page=await browser.newPage();await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
for(const [width,height] of [[1440,900],[820,900],[390,844],[320,568]]){
await page.setViewportSize({width,height});await page.goto(`http://127.0.0.1:${server.address().port}/nexonest.html`);await page.waitForSelector('.project-placeholder');
const result=await page.evaluate(()=>{const tiles=[...document.querySelectorAll('.projects-grid > *')].map(x=>{const r=x.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}});return {count:tiles.length,placeholders:document.querySelectorAll('.project-placeholder').length,overlap:tiles.some((a,i)=>tiles.slice(i+1).some(b=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h)),outside:tiles.some(a=>a.x<0||a.x+a.w>innerWidth||a.y<0||a.y+a.h>document.documentElement.scrollHeight)}});
assert.equal(result.overlap,false,JSON.stringify({width,result}));assert.equal(result.outside,false,JSON.stringify({width,result}));assert.equal(result.placeholders,6);await page.screenshot({path:path.join(out,`grid-${width}.png`)});
const position=()=>page.locator('.project-icon').first().evaluate(el=>[el.offsetLeft,el.offsetTop]);const before=await position();await page.locator('[data-category="products"]').click();assert.deepEqual(await position(),before);
const productGroups = {
 'grasshopper-plugins': ['p_nexosolve','p_octomass','p_octoland','p_octocity'],
 'rhino-plugins': ['p_nexobreak','p_curvadapt'],
 'data-analytics': ['p_octoland','p_octocity','p_tectotrack'],
 'windows-apps': ['p_nexosolve'],
 'developer-tools': ['p_nexorhino','p_design_suite']
};
assert.deepEqual(await page.locator('#subfilter-bar button').allTextContents(), ['Grasshopper Plugins','Rhino Plugins','Data Analytics','Windows Apps','Developer Tools']);
assert.equal(await page.locator('.project-icon.active').count(),10);
for (const [group, ids] of Object.entries(productGroups)) {
 const chip=page.locator(`[data-subcategory="${group}"]`);
 await chip.scrollIntoViewIfNeeded();
 await chip.click();
 assert.deepEqual((await page.locator('.project-icon.active').evaluateAll(els=>els.map(el=>el.dataset.id))).sort(), [...ids].sort(), `${width}: ${group}`);
 assert.equal(await page.locator('#subfilter-bar [aria-pressed="true"]').count(),1);
 assert.equal(await chip.getAttribute('aria-pressed'),'true');
 assert.deepEqual(await position(),before);
}
await page.locator('.filter-reset').click();
assert.equal(await page.locator('.project-icon.dimmed').count(),0);
assert.equal(await page.locator('#subfilter-bar').isVisible(),false);
await page.locator('[data-category="projects"]').click();
await page.locator('[data-subcategory="sim-analysis"]').click();
assert.deepEqual((await page.locator('.project-icon.active').evaluateAll(els=>els.map(el=>el.dataset.id))).sort(),['p_alignment','p_tectotrack']);
await page.locator('[data-category="products"]').click();
assert.equal(await page.locator('#subfilter-bar [aria-pressed="true"]').count(),0);
await page.locator('[data-subcategory="developer-tools"]').click();
await page.locator('[data-id="p_nexorhino"]').click();
assert.match(await page.locator('#popup-categories').innerText(),/Developer Tools/);
assert.equal(await page.locator('#popup-title').innerText(),'NexoRhino');
await page.locator('#popup-close').click();
await page.waitForFunction(()=>getComputedStyle(document.querySelector('#popup-overlay')).opacity==='0');
await page.screenshot({path:path.join(out,`product-groups-${width}.png`),fullPage:true});
console.log(width,result);
}
}finally{await browser.close();server.close()}})().catch(e=>{console.error(e);server.close();process.exitCode=1});


