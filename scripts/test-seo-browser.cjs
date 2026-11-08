const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'tmp', 'seo-check');
fs.mkdirSync(out, {recursive:true});
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  const type = {'.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg'}[path.extname(file)] || 'application/octet-stream';
  res.writeHead(200, {'Content-Type':type});
  fs.createReadStream(file).pipe(res);
});
(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge', headless:true});
    const live = await browser.newContext({viewport:{width:1440,height:1000}, reducedMotion:'reduce'});
    const staticContext = await browser.newContext({javaScriptEnabled:false});
    for (const context of [live, staticContext]) await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    const page = await live.newPage();
    const plain = await staticContext.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push({url:page.url(), message:error.message}));
    const files = fs.readdirSync(path.join(root, 'projects-pages')).filter(f => f.endsWith('.html'));
    for (const file of files) {
      const url = `${base}/projects-pages/${file}`;
      await plain.goto(url);
      await page.goto(url);
      assert.equal(await plain.locator('h1').count(), 1, file);
      assert.equal(await page.locator('h1').count(), 1, file);
      assert.equal(await plain.locator('h1').textContent(), await page.locator('h1').textContent(), file);
      assert.equal(await plain.locator('.project-lead').textContent(), await page.locator('.project-lead').textContent(), file);
      assert.equal(await plain.locator('.content-section').count(), await page.locator('.content-section').count(), file);
      assert.equal(await page.locator('#projectStructuredData').count(), 1, file);
      const data = await page.locator('#projectStructuredData').textContent();
      assert.equal(JSON.parse(data).url, `https://nexonest.com/projects-pages/${file}`);
      assert.equal(await plain.locator('meta[name="description"]').getAttribute('content'), await page.locator('meta[name="description"]').getAttribute('content'), file);
      if (['climora.html', 'curvAdapt.html', 'nexoRhino.html'].includes(file)) {
        assert.equal(await page.locator('[data-product-status]').count(), 1, file);
        assert.equal(await plain.locator('[data-product-status]').textContent(), await page.locator('[data-product-status]').textContent(), file);
      }
      if (file === 'climora.html') {
        for (const view of [plain, page]) {
          const text = await view.locator('#projectPageRoot').textContent();
          assert.match(text, /49 source-linked responses/);
          assert.match(text, /full annual EPW reference/);
          assert.match(text, /filters mask observations without rescaling/);
          assert.match(text, /up to 30 entries/);
          assert.match(text, /Development preview/);
          assert.match(text, /no public installer/i);
          for (const id of ['getting-started', 'palette-legend', 'project-files', 'methods', 'shortcuts', 'development'])
            assert.equal(await view.locator(`#${id}`).count(), 1);
        }
      }
    }
    assert.deepEqual(errors, [], 'Editorial pages must have no runtime errors');
    const observations = [];
    await plain.goto(`${base}/nexonest.html`);
    assert.equal(await plain.locator('#project-directory a').count(), 20);
    assert.equal(await plain.locator('#project-directory a[href="projects-pages/climora.html"]').textContent(), 'ClimaNest');
    for (const width of [1440,820,390,320]) {
      await page.setViewportSize({width,height:900});
      await plain.setViewportSize({width,height:900});
      for (const file of ['index.html','nexonest.html','portfolio.html','newsletter.html','projects-pages/climora.html']) {
        await page.goto(`${base}/${file}`);
        await page.waitForTimeout(350);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        assert.equal(overflow, false, `${file} at ${width}px`);
        observations.push({file,width,overflow});
        await page.screenshot({path:path.join(out, `${width}-${file.replaceAll('/','-')}.png`),fullPage:false});
      }
      await plain.goto(`${base}/projects-pages/climora.html`);
      assert.equal(await plain.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Static ClimaNest at ${width}px`);
      await plain.screenshot({path:path.join(out, `${width}-climanest-no-js.png`),fullPage:false});
    }
    await live.route('**/js/product-status.js*', route => route.abort());
    await page.goto(`${base}/projects-pages/climora.html`);
    assert.equal(await page.locator('[data-product-status]').count(), 1, 'Missing helper preserves generated product facts');
    assert.match(await page.locator('[data-product-status]').textContent(), /Development preview/);
    assert.equal(await page.locator('.product-primary-action').getAttribute('href'), '../projects-pages/climora.html#getting-started');
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({projects:files.length,browserErrors:errors,observations},null,2));
  } finally {
    await browser?.close();
    server.close();
  }
})().catch(error => {console.error(error); process.exitCode=1;});
