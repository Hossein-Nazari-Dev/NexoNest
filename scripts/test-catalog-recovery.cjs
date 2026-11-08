const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'data/projects-brief.json'), 'utf8'));
const output = path.join(root, 'tmp/catalog-recovery');
fs.mkdirSync(output, { recursive: true });

async function testLoader() {
  const requests = [];
  const context = vm.createContext({
    window: {}, URL, document: { baseURI: 'http://localhost/' },
    fetch: (url, options) => new Promise(resolve => requests.push({ resolve, options }))
  });
  vm.runInContext(fs.readFileSync(path.join(root, 'js/product-status.js'), 'utf8'), context);
  vm.runInContext(source, context);
  const load = context.window.loadProjectsData;
  const first = load();
  assert.equal(load(), first, 'ordinary concurrent callers share the request');
  assert.equal(requests.length, 1);
  const failed = assert.rejects(first, /503/);
  requests[0].resolve({ ok: false, status: 503 });
  await failed;
  assert.equal(context.window.projectsData, undefined, 'failure is not an empty catalogue');
  const recovered = load();
  assert.equal(requests.length, 2, 'failure is evicted from the promise cache');
  requests[1].resolve({ ok: true, json: async () => catalogue });
  assert.equal(await recovered, catalogue);
  assert.equal(load(), recovered, 'successful data remains cached');
  assert.equal(requests[1].options.cache, 'no-store');

  const older = load({ force: true });
  const newer = load({ force: true });
  const freshData = { ...catalogue, projects: [] };
  requests[3].resolve({ ok: true, json: async () => freshData });
  await newer;
  requests[2].resolve({ ok: true, json: async () => catalogue });
  await older;
  assert.equal(context.window.projectsData, freshData, 'late old responses cannot replace newer data');
  assert.equal(load(), newer);

  const olderFailure = load({ force: true });
  const rejected = assert.rejects(olderFailure, /500/);
  const newest = load({ force: true });
  requests[5].resolve({ ok: true, json: async () => catalogue });
  await newest;
  requests[4].resolve({ ok: false, status: 500 });
  await rejected;
  assert.equal(load(), newest, 'stale failures cannot evict a newer successful promise');

  for (const invalid of [
    { projects: [] },
    { ...catalogue, projects: [{ ...catalogue.projects[0], title: null }] },
    { ...catalogue, projects: [{ ...catalogue.projects[0], url: 'javascript:alert(1)' }] },
    { ...catalogue, projects: [{ ...catalogue.projects[0], categories: ['missing'] }] },
    { ...catalogue, projects: [catalogue.projects[0], catalogue.projects[0]] },
    { ...catalogue, projects: [{ ...catalogue.projects[0], categories: ['education'] }] }
  ]) {
    const pending = load({ force: true });
    const invalidResult = assert.rejects(pending, /Invalid project catalogue/);
    requests.at(-1).resolve({ ok: true, json: async () => invalid });
    await invalidResult;
    assert.equal(context.window.projectsData, catalogue, 'invalid data is never published');
  }
}

const server = http.createServer((request, response) => {
  const file = path.resolve(root, '.' + new URL(request.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(response);
});

async function testBrowser(browser, base) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  let requestCount = 0;
  let finishRetry;
  await page.route('**/data/projects-brief.json', async route => {
    requestCount += 1;
    if (requestCount === 1) return route.fulfill({ status: 503, body: 'Unavailable' });
    finishRetry = () => route.fulfill({ json: catalogue });
  });
  await page.goto(`${base}/nexonest.html`);
  await page.waitForSelector('[data-catalog-state="error"]');
  assert.equal(requestCount, 1, 'one request serves initialization');
  assert.equal(await page.locator('.project-icon, .project-placeholder').count(), 0);
  assert.equal(await page.locator('[data-category]:enabled').count(), 0);
  assert.equal(await page.locator('#project-directory').isVisible(), true);
  assert.match(await page.locator('#catalog-message').innerText(), /could not be loaded/);
  await page.screenshot({ path: path.join(output, 'failed-390.png'), fullPage: true });
  // Resolve a label before data exists to catch maps that permanently cache emptiness.
  await page.evaluate(() => window._filterHelpers.toSubId('Simulation and Analysis'));
  await page.locator('#catalog-retry').evaluate(button => { button.click(); button.click(); button.dispatchEvent(new Event('click')); });
  await page.waitForFunction(() => document.querySelector('[data-catalog-state]').dataset.catalogState === 'loading');
  await page.waitForTimeout(60);
  assert.equal(requestCount, 2, 'repeated Retry clicks share one recovery attempt');
  assert.equal(await page.locator('#project-directory').isVisible(), true);
  assert.equal(await page.locator('[data-category]:enabled').count(), 0);
  await finishRetry();
  await page.waitForSelector('[data-catalog-state="ready"]');
  assert.equal(await page.locator('#project-directory').isVisible(), false);
  assert.equal(await page.locator('.project-placeholder').count(), 6);
  assert.equal(await page.locator('.project-placeholder:not([aria-hidden="true"]), .project-placeholder[tabindex]').count(), 0, 'future slots remain decorative');
  assert.equal(await page.evaluate(() => window._filterHelpers.toSubId('Simulation and Analysis')), 'sim-analysis');
  await page.locator('[data-category="products"]').click();
  await page.locator('[data-subcategory="windows-apps"]').click();
  assert.deepEqual((await page.locator('.project-icon.active').evaluateAll(nodes => nodes.map(node => node.dataset.id))).sort(), ['p_climora', 'p_nexosolve']);
  assert.equal(await page.locator('[data-subcategory="windows-apps"]').getAttribute('aria-pressed'), 'true');
  await page.locator('[data-id="p_climora"]').click();
  assert.equal(await page.locator('#popup-title').innerText(), 'ClimaNest');
  await page.locator('#popup-close').click();
  await page.locator('.filter-reset').click();
  assert.equal(await page.locator('.project-icon.dimmed').count(), 0);
  assert.deepEqual(errors, []);
  await page.screenshot({ path: path.join(output, 'recovered-390.png'), fullPage: true });
  await page.close();

  for (const [name, response] of [
    ['malformed-json', { body: '{broken', contentType: 'application/json' }],
    ['invalid-schema', { json: { categories: [], subcategories: [], projects: [{ id: 'bad' }] } }],
    ['empty', { json: { categories: [], subcategories: [], projects: [] } }]
  ]) {
    const check = await browser.newPage({ viewport: { width: 320, height: 568 } });
    await check.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    await check.route('**/data/projects-brief.json', route => route.fulfill(response));
    await check.goto(`${base}/nexonest.html`);
    await check.waitForSelector(`[data-catalog-state="${name === 'empty' ? 'empty' : 'error'}"]`);
    assert.equal(await check.locator('.project-icon, .project-placeholder').count(), 0, name);
    assert.equal(await check.locator('#project-directory').isVisible(), true, name);
    assert.equal(await check.locator('#catalog-retry').isVisible(), name !== 'empty', name);
    assert.equal(await check.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, name);
    await check.close();
  }

  const noScript = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 568 } });
  const direct = await noScript.newPage();
  await direct.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await direct.goto(`${base}/nexonest.html`);
  assert.equal(await direct.locator('#project-directory a').count(), 20, 'independent catalogue inventory assertion');
  assert.equal(await direct.locator('#project-directory').isVisible(), true);
  const lastLink = direct.locator('#project-directory a').last();
  await lastLink.scrollIntoViewIfNeeded();
  await lastLink.click();
  assert.match(direct.url(), /\/projects-pages\/codeJunkyardSession00\.html$/);
  await noScript.close();
}

(async () => {
  await testLoader();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    await testBrowser(browser, `http://127.0.0.1:${server.address().port}`);
    console.log('PASS catalogue cache/retry/stale ordering, validation, malformed/empty states, recovered filters/popup, and no-JavaScript direct navigation.');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
