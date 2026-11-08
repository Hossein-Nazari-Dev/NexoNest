// All content is local; external requests are blocked. No plugin or service executes.
const {chromium} = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const expected = ['nexo-variable','custom-variable','nexo-output','nexo-shape','nexo-screenshot','connector','results-analysis','nexosolve-club'];
const server = http.createServer((req,res) => {
  const file = path.resolve(root, '.' + new URL(req.url,'http://localhost').pathname);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return res.writeHead(404).end();
  res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.js':'text/javascript',
    '.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webm':'video/webm'})[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
    const base = 'http://127.0.0.1:' + server.address().port;
    browser = await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge',headless:true});
    for (const javaScriptEnabled of [true,false]) for (const width of [1440,390,320]) {
      const page = await browser.newPage({javaScriptEnabled,reducedMotion:'reduce',viewport:{width,height:960}});
      const errors = [];
      page.on('pageerror',error => errors.push(error.message));
      await page.route('**/*',route => route.request().url().startsWith(base) ? route.continue() : route.abort());
      await page.goto(base + '/projects-pages/nexoSolve.html');
      assert.equal(await page.locator('.component-group').count(),3);
      assert.equal(await page.locator('a.component-card').count(),8);
      await page.locator('a.component-card img').evaluateAll(async images => { for(const image of images) {image.loading='eager'; await image.decode();} });
      assert.equal(await page.locator('.component-docs, .component-formula, details.component-card').count(),0);
      assert.equal(await page.locator('.sidebar-secondary a[href*="curvadapt-wiki"]').count(),0);
      assert.equal(await page.locator('#section-18 .project-docs-button').getAttribute('href'),'../nexosolve-wiki.html');
      for (const id of ['components',...Array.from({length:18},(_,i)=>'section-'+(i+1))])
        assert.equal(await page.locator('#'+id).count(),1);
      const hrefs = await page.locator('a.component-card').evaluateAll(links => links.map(link => link.getAttribute('href')));
      assert.deepEqual(hrefs,expected.map(id => '../nexosolve-wiki.html#'+id));
      const targets = width === 1440 ? expected : ['nexo-variable','connector','nexosolve-club'];
      for (const id of targets) {
        const card = page.locator(`a.component-card[href$="#${id}"]`);
        await card.locator('img').click();
        await page.waitForURL(base + '/nexosolve-wiki.html#'+id);
        const entry = page.locator('.wiki-tool#'+id);
        assert.equal(await entry.count(),1);
        assert((await entry.locator('.wiki-formula').innerText()).length > 20);
        assert.equal(await entry.locator('dl dt').allTextContents().then(items=>items.join('/')),'Inputs/Outputs');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true);
        assert.equal(await entry.evaluate(node => node.getBoundingClientRect().top >= -1 && node.getBoundingClientRect().top < innerHeight),true);
        if (id==='connector' && javaScriptEnabled && width===390)
          await page.screenshot({path:path.join(root,'tmp/nexosolve-wiki-mobile.png')});
        await page.goBack();
        await page.waitForURL(base + '/projects-pages/nexoSolve.html');
      }
      const first = page.locator('a.component-card').first();
      await first.focus(); await page.keyboard.press('Enter');
      await page.waitForURL(base+'/nexosolve-wiki.html#nexo-variable');
      assert.equal(await page.locator('.wiki-tool').count(),8);
      assert.equal(await page.locator('[id]').evaluateAll(nodes => new Set(nodes.map(n=>n.id)).size===nodes.length),true);
      await page.locator('.wiki-header a[href="projects-pages/nexoSolve.html"]').first().click();
      await page.waitForURL(base+'/projects-pages/nexoSolve.html');
      if (javaScriptEnabled && width===1440) {
        await page.locator('#components').scrollIntoViewIfNeeded();
        await page.locator('a.component-card img').evaluateAll(async images => { for(const image of images) {image.loading='eager'; await image.decode();} });
        await page.screenshot({path:path.join(root,'tmp/nexosolve-linked-components.png')});
      }
      await page.locator('#section-18 .project-docs-button').click();
      await page.waitForURL(base+'/nexosolve-wiki.html');
      assert.equal(await page.locator('.wiki-formula').count(),10);
      assert.match(await page.locator('#study-plan').innerText(), /N = ∏ᵢ nᵢ/);
      assert.match(await page.locator('#legacy').innerText(), /hidden compatibility/);
      assert.match(await page.locator('#legacy').innerText(), /not current desktop modes/);
      const video = page.locator('.wiki-demo video');
      assert.equal(await video.getAttribute('autoplay'),null);
      assert.equal(await video.getAttribute('preload'),'none');
      if (javaScriptEnabled && width===1440) {
        await video.scrollIntoViewIfNeeded(); await video.evaluate(node=>node.play());
        await page.waitForFunction(()=>document.querySelector('.wiki-demo video').currentTime>0.3);
        await video.evaluate(node=>node.pause());
        await page.screenshot({path:path.join(root,'tmp/nexosolve-wiki-demo.png')});
      }
      await page.locator('.wiki-tool img').evaluateAll(async images => { for(const image of images) {image.loading='eager'; await image.decode();} });

      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true);
      assert.deepEqual(errors,[]);
      await page.close();
    }
    console.log('PASS: 8 active NexoSolve component anchors, 18 retained section anchors, Wiki workflow/logic, hidden-component limits, bottom CTA, keyboard/history and real schematic playback; JS/no-JS at 1440/390/320 without overflow or page errors.');
  } finally { await browser?.close(); server.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
