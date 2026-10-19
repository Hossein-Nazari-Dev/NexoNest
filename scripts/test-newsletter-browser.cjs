// Requires Playwright from the local development environment; all mail/API traffic is mocked.
const {chromium} = require('playwright');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404).end(); return;
  }
  const types = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml'};
  let body = fs.readFileSync(file);
  if (pathname === '/newsletter.html') body = Buffer.from(body.toString().replace(/(<meta name="newsletter-endpoint" content=")[^"]+/, '$1https://newsletter.test/submit'));
  response.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'}).end(body);
});
async function run() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? {channel: process.env.PLAYWRIGHT_CHANNEL} : {})});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let scenario, requests = 0;
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname === '127.0.0.1') return route.continue();
      if (url.hostname !== 'newsletter.test') return route.abort();
      requests++;
      if (scenario === 'network') return route.abort();
      if (scenario === 'json') return route.fulfill({contentType: 'text/plain', body: 'not-json'});
      if (scenario === 'http') return route.fulfill({status: 503, body: 'Unavailable'});
      return route.fulfill({contentType: 'application/json', body: JSON.stringify(scenario === 'rejected' ?
        {ok: false, error: 'Please wait before retrying.'} : {ok: true, status: scenario})});
    });
    for (const result of ['pending-confirmation', 'already-subscribed', 'rejected', 'network', 'json', 'http', 'unexpected']) {
      scenario = result;
      await page.goto(`http://127.0.0.1:${server.address().port}/newsletter.html`);
      await page.locator('[name="fullName"]').fill('Test reader');
      await page.locator('[name="email"]').fill('reader@example.com');
      await page.locator('[name="occupation"]').selectOption({label: 'Student'});
      await page.locator('.choice-line label').filter({hasText: 'Undergraduate'}).click();
      await page.locator('[name="fieldOfStudy"]').selectOption({label: 'Architecture'});
      await page.locator('.interest-option').first().click();
      await page.locator('.consent').click();
      await page.locator('button[type="submit"]').click();
      await page.waitForFunction(() => !document.querySelector('button[type="submit"]').disabled);
      assert.equal(await page.locator('[name="email"]').inputValue(), 'reader@example.com');
      if (['pending-confirmation', 'already-subscribed'].includes(result)) {
        assert.equal(await page.locator('#submission-next').isVisible(), true);
        assert.equal(await page.locator('.confirmation-steps').isVisible(), result === 'pending-confirmation');
        assert.equal(await page.locator('#newsletter-form').isVisible(), false);
        await page.locator('#change-email').click();
        assert.equal(await page.locator('#newsletter-form').isVisible(), true);
        assert.equal(await page.locator('[name="email"]').inputValue(), 'reader@example.com');
      } else {
        assert.equal(await page.locator('#newsletter-form').isVisible(), true);
        assert.equal(await page.locator('#submission-next').isVisible(), false);
        assert.equal(await page.locator('#form-status').getAttribute('data-state'), 'error');
      }
      console.log('PASS newsletter browser: ' + result);
    }
    await page.setViewportSize({width: 390, height: 844});
    assert.equal(await page.title(), 'NexoNest Newsletter');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    fs.mkdirSync(path.join(root, 'tmp'), {recursive: true});
    await page.screenshot({path: path.join(root, 'tmp/newsletter-mobile.png'), fullPage: true});
    assert.deepEqual(errors, []);
    assert.equal(requests, 7);
    console.log('PASS mobile overflow/title and no browser errors. No external calls or real email.');
  } finally { await browser.close(); }
}
run().catch(error => {console.error(error); process.exitCode = 1;}).finally(() => server.close());
