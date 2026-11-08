const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const catalogue = JSON.parse(fs.readFileSync(path.join(root, 'data/projects-brief.json'), 'utf8'));
const context = vm.createContext({ window: {}, URL });
vm.runInContext(fs.readFileSync(path.join(root, 'js/product-status.js'), 'utf8'), context);
const status = context.window.NexoNestProductStatus;
const expectations = {
  p_climora: { editorialId: 'climora', release: 'development-preview', platform: 'Windows', action: 'Read the preview guide', path: 'projects-pages/climora.html#getting-started' },
  p_curvadapt: { editorialId: 'curvadapt', release: 'in-development', platform: 'Rhino', action: 'Explore the plugin', path: 'projects-pages/curvAdapt.html' },
  p_nexorhino: { editorialId: 'nexorhino', release: 'public-release', platform: 'VS Code', action: 'Read installation guidance', path: 'projects-pages/nexoRhino.html#release-1-1' }
};

for (const [id, expected] of Object.entries(expectations)) {
  const authored = catalogue.projects.find(project => project.id === id);
  assert(authored?.product);
  const generated = status.get(id);
  assert.deepEqual(JSON.parse(JSON.stringify(generated.product)), authored.product, `generated shared metadata must match ${id}`);
  assert.equal(generated.release, expected.release);
  assert(generated.platforms.includes(expected.platform));
  assert.equal(status.get(expected.editorialId).id, id);
  assert.equal(status.action(id).url, expected.path);
  assert.equal(status.action(id).label, expected.action);
  assert.match(status.summary(id), /Source reviewed \d{4}-\d{2}-\d{2}/);
  assert.equal(generated.evidence.kind, 'repository', 'source review is not a fresh public release verification');
  assert(['guide', 'details'].includes(generated.primaryAction.kind), 'these representatives offer guidance, not an invented download');
  assert(!status.render(id).includes('download='));
}

const specimen = catalogue.projects.find(project => project.id === 'p_climora');
for (const invalidURL of ['javascript:alert(1)', '//example.com/x', '/somewhere', '../escape.html', 'https:example.com', '#only', '?only', 'data:text/html,test', 'foo\\bar']) {
  const record = { ...specimen, product: { ...specimen.product, primaryAction: { ...specimen.product.primaryAction, url: invalidURL } } };
  assert.throws(() => status.validate(record), /Invalid product action/, invalidURL);
}
for (const change of [{ release: 'released-someday' }, { platforms: [] }, { verifiedOn: '2026-02-30' }, { evidence: { kind: 'repository' } }]) {
  assert.throws(() => status.validate({ ...specimen, product: { ...specimen.product, ...change } }), /Invalid product metadata/);
}
assert.throws(() => status.validate({ ...specimen, product: null }), /Invalid product metadata/);
assert.throws(() => status.validate({ ...specimen, product: { ...specimen.product, primaryAction: { label: 'Download', kind: 'download', url: 'installer.exe' } } }), /Invalid product action/);
const upperCase = { ...specimen, product: { ...specimen.product, primaryAction: { label: 'Details', kind: 'details', url: 'HTTPS://example.com/' } } };
assert.equal(status.action(upperCase, { prefix: '../' }).url, 'HTTPS://example.com/');

const server = http.createServer((request, response) => {
  const file = path.resolve(root, '.' + new URL(request.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return response.writeHead(404).end();
  response.setHeader('Content-Type', ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(response);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const width of [1440, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
      await page.goto(`${base}/nexonest.html`);
      await page.waitForSelector('[data-catalog-state="ready"]');
      for (const [id, expected] of Object.entries(expectations)) {
        const tile = page.locator(`[data-id="${id}"]`);
        assert.match(await tile.getAttribute('aria-label'), new RegExp(expected.platform));
        await tile.click();
        const popup = page.locator(`#popup-product-status [data-product-status="${id}"]`);
        await popup.waitFor();
        const popupText = (await popup.innerText()).replace(/\s+/g, ' ').trim();
        assert.equal(await page.locator('#popup-button').innerText(), expected.action);
        await page.locator('#popup-button').click();
        await page.waitForURL(`${base}/${expected.path}`);
        const panel = page.locator(`#projectPageRoot [data-product-status="${id}"]`);
        await panel.waitFor();
        assert.equal(await panel.evaluate(element => getComputedStyle(element).borderTopStyle), 'dotted', 'Shared status stylesheet loads on editorial pages');
        assert((await panel.innerText()).replace(/\s+/g, ' ').trim().startsWith(popupText), `shared metadata ${id}, width ${width}`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.goto(`${base}/nexonest.html`);
        await page.waitForSelector('[data-catalog-state="ready"]');
      }
      // A late image failure belongs only to the request that inserted that image.
      assert.equal(await page.evaluate(() => {
        const projects = window.projectsData.projects;
        window.openPopup(projects[0]);
        const oldImage = document.querySelector('#popup-image img');
        window.openPopup(projects[1]);
        const newImage = document.querySelector('#popup-image img');
        oldImage.onerror();
        const preserved = document.querySelector('#popup-image img') === newImage;
        window.closePopup();
        return preserved;
      }), true);
      await page.close();
    }
    for (const javaScriptEnabled of [false, true]) {
      const browserContext = await browser.newContext({ javaScriptEnabled });
      const page = await browserContext.newPage();
      await page.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.hostname !== '127.0.0.1' || (javaScriptEnabled && url.pathname === '/js/product-status.js')) return route.abort();
        return route.continue();
      });
      for (const [id, expected] of Object.entries(expectations)) {
        await page.goto(`${base}/${expected.path}`);
        assert.equal(await page.locator(`[data-product-status="${id}"]`).count(), 1, 'static panel survives without shared script');
        assert.match(await page.locator(`[data-product-status="${id}"]`).innerText(), /Source reviewed/);
      }
      await browserContext.close();
    }
    console.log('PASS shared product metadata/action consistency across tiles, popup, pages, script failure and no-JavaScript; URL/schema guards and stale-image isolation.');
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
