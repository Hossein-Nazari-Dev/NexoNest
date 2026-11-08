const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const server = http.createServer((request, response) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return response.writeHead(404).end();
  response.writeHead(200, { 'Content-Type': { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml' }[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(response);
});

(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge', headless:true });
    const page = await browser.newPage({ viewport:{ width:1440, height:900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    await page.addInitScript(() => {
      window.sectionChanges = [];
      document.addEventListener('portfolio:sectionchange', event => window.sectionChanges.push(event.detail.id));
    });
    async function active(id, hash) {
      await page.waitForFunction(({id, hash}) => location.hash === hash && document.querySelectorAll('.portfolio-section.active').length === 1 && document.querySelector('.portfolio-section.active')?.id === id, {id, hash});
      assert.equal(await page.locator('.nav-button.active').count(), 1);
      assert.equal(await page.locator('.nav-button.active').getAttribute('data-section'), id);
      assert.equal(await page.locator('.nav-button[aria-current="true"]').getAttribute('data-section'), id);
    }
    await page.goto(`${base}/portfolio.html`);
    await active('profile', '');
    const initialLength = await page.evaluate(() => history.length);
    await page.locator('[data-section="profile"]').click();
    assert.equal(await page.evaluate(() => history.length), initialLength);
    assert.deepEqual(await page.evaluate(() => window.sectionChanges), ['profile']);
    await page.locator('a[data-section-link][href="#projects"]').click();
    await active('projects', '#projects');
    assert.equal(await page.evaluate(() => history.length), initialLength + 1);
    assert.deepEqual(await page.evaluate(() => window.sectionChanges), ['profile', 'projects']);
    await page.goBack();
    await active('profile', '');
    await page.goForward();
    await active('projects', '#projects');
    assert.deepEqual(await page.evaluate(() => window.sectionChanges), ['profile', 'projects', 'profile', 'projects']);
    await page.locator('[data-section="skills"]').focus();
    await page.keyboard.press('Enter');
    await active('skills', '#skills');
    const length = await page.evaluate(() => history.length);
    await page.locator('[data-section="skills"]').click();
    assert.equal(await page.evaluate(() => history.length), length);
    await page.evaluate(() => { location.hash = 'unknown-section'; });
    await active('profile', '');
    assert.equal(await page.evaluate(() => history.length), length + 1, 'Invalid fragments replace their existing entry');
    await page.goBack();
    await active('skills', '#skills');
    await page.goForward();
    await active('profile', '');
    await page.goto(`${base}/portfolio.html#projects`);
    await active('projects', '#projects');
    await page.goto(`${base}/portfolio.html#%E0%A4%A`);
    await active('profile', '');
    await page.goto(`${base}/portfolio.html#profile`);
    await active('profile', '#profile');
    await page.evaluate(() => { location.hash = ''; });
    await active('profile', '');
    assert.deepEqual(errors, []);
    console.log('Portfolio browser checks passed: direct/valid/invalid/empty fragments, Back/Forward, keyboard, one active control, no duplicate history or section events.');
  } finally {
    await browser?.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
