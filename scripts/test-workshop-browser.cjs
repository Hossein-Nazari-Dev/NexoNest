const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return response.writeHead(404).end();
  response.writeHead(200, { 'Content-Type': { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml' }[path.extname(file)] || 'application/octet-stream' });
  if (url.pathname === '/CTworkshop01.html' && url.searchParams.has('mock')) {
    return response.end(fs.readFileSync(file, 'utf8').replace('name="workshop-endpoint" content=""', 'name="workshop-endpoint" content="/mock-workshop"'));
  }
  fs.createReadStream(file).pipe(response);
});

(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await chromium.launch({ channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge', headless:true });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    let responder;
    await page.route('**/mock-workshop', route => responder(route));
    async function fill() {
      await page.locator('[name="fullName"]').fill('آزمون');
      await page.locator('[name="email"]').fill('test@example.com');
      await page.locator('[name="phone"]').fill('۰۹۱۲۱۲۳۴۵۶۷');
      await page.locator('[name="educationLevel"]').selectOption('master');
      await page.locator('[name="rhinoExperience"]').selectOption('beginner');
      await page.locator('[name="grasshopperExperience"]').selectOption('none');
      await page.locator('[name="certificateType"][value="attendance"]').check();
      await page.locator('[name="rulesAccepted"]').check();
      await page.locator('[name="certificateAccepted"]').check();
      await page.locator('#receipt').setInputFiles({ name:'receipt.pdf', mimeType:'application/pdf', buffer:Buffer.from('%PDF-1.7 test') });
    }
    const submit = page.locator('#registration [type="submit"]');
    await page.goto(`${base}/CTworkshop01.html`);
    assert.equal(await submit.isDisabled(), true, 'The checked-in endpoint remains disabled');
    await page.goto(`${base}/CTworkshop01.html?mock=1`);
    await fill();
    const attempts = [];
    let retryArrived;
    const retry = new Promise(resolve => { retryArrived = resolve; });
    responder = async route => {
      attempts.push(JSON.parse(new URLSearchParams(route.request().postData()).get('payload')));
      if (attempts.length === 1) await route.abort('failed');
      else retryArrived(route);
    };
    await submit.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('#form-status').textContent.includes('نتیجهٔ ارسال روشن نیست'));
    assert.equal(await page.locator('[name="email"]').isDisabled(), true);
    assert.equal(await page.locator('[name="fullName"]').inputValue(), 'آزمون');
    assert.equal(await page.locator('#receipt').evaluate(element => element.files[0].name), 'receipt.pdf');
    await page.evaluate(() => {
      document.querySelector('[name="email"]').value = 'unsaved@example.com';
      const form = document.querySelector('#registration');
      form.dispatchEvent(new Event('submit', { bubbles:true, cancelable:true }));
      form.dispatchEvent(new Event('submit', { bubbles:true, cancelable:true }));
    });
    const route = await retry;
    assert.equal(attempts.length, 2, 'Repeated retry while busy sends one request');
    assert.deepEqual(attempts[1], attempts[0], 'Uncertain retry sends the exact original payload and UUID');
    await route.fulfill({ json:{ ok:true, trackingCode:'NN-0123456789ABCDEF', emailStatus:'unknown' } });
    await page.locator('#success').waitFor({ state:'visible' });
    assert.equal(await page.locator('#tracking').innerText(), 'NN-0123456789ABCDEF');
    assert.equal(await page.evaluate(() => sessionStorage.getItem('workshop-request-id')), null);

    await page.goto(`${base}/CTworkshop01.html?mock=1`);
    await fill();
    responder = route => route.fulfill({ json:{ ok:false, code:'request_conflict', error:'تغییرات فعلی ذخیره نشده است؛ با پشتیبانی تماس بگیرید.' } });
    await submit.click();
    await page.waitForFunction(() => document.querySelector('#form-status').textContent.includes('ذخیره نشده'));
    assert.equal(await page.locator('#success').isVisible(), false);
    assert.equal(await page.locator('[name="email"]').isDisabled(), true);

    await page.goto(`${base}/CTworkshop01.html?mock=1`);
    await fill();
    responder = route => route.fulfill({ json:{ ok:false, code:'request_rejected', error:'فیش پذیرفته نشد.' } });
    await submit.click();
    await page.waitForFunction(() => document.querySelector('#form-status').textContent === 'فیش پذیرفته نشد.');
    assert.equal(await page.locator('[name="email"]').isEnabled(), true);
    assert.equal(await page.locator('[name="university"]').isDisabled(), true, 'Conditional disabled state is restored');
    assert.equal(await page.locator('[name="fullName"]').inputValue(), 'آزمون');
    assert.equal(await page.locator('#receipt').evaluate(element => element.files.length), 1);
    assert.deepEqual(errors, []);
    console.log('Workshop browser checks passed: disabled real endpoint; keyboard submit; uncertain outcome locks fields and replays exact payload; overlapping retry deduplicates; conflict never shows success; definite rejection preserves editable input. All submissions mocked.');
  } finally {
    await browser?.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
