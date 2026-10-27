#!/usr/bin/env node
// Generate crawler-visible editorial HTML using the existing browser renderer.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const mode = process.argv[2];
assert(['--write', '--check'].includes(mode), 'Use --write or --check');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('js/project-page.js');
const boundary = source.indexOf('function renderProjectPage(');
const templateStart = source.indexOf('  root.innerHTML = `', boundary);
const templateEnd = source.indexOf('\n  const projectShowcase', templateStart);
assert(boundary > 0 && templateStart > boundary && templateEnd > templateStart, 'Renderer contract changed');
const context = vm.createContext({});
vm.runInContext(source.slice(0, boundary), context, {timeout: 1000});
const render = source.slice(templateStart, templateEnd).replace('  root.innerHTML = ', '');
let changes = 0;
function save(file, content) {
  if (read(file) === content) return;
  changes++;
  if (mode === '--write') fs.writeFileSync(path.join(root, file), content);
  else console.error(`Stale SEO output: ${file}`);
}
function meta(html, name, content, property = false) {
  const key = property ? 'property' : 'name';
  const tag = `<meta ${key}="${name}" content="${escape(content)}">`;
  const pattern = new RegExp(`<meta\\s+${key}="${name}"[^>]*>`, 'i');
  return pattern.test(html) ? html.replace(pattern, () => tag) : html.replace('</head>', `${tag}\n</head>`);
}
function escape(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'}[ch]));
}
const files = ['index.html', 'nexonest.html', 'portfolio.html', 'newsletter.html', 'curvadapt-wiki.html',
  'licenses/nexorhino.html', 'archicast/season-01.html', 'nexorhino/geometry.html',
  ...fs.readdirSync(path.join(root, 'projects-pages')).filter(f => f.endsWith('.html')).sort().map(f => `projects-pages/${f}`)];
const urls = [];
const titles = new Set();
const descriptions = new Set();
const catalogue = JSON.parse(read('data/projects-brief.json')).projects;
for (const file of files) {
  let html = read(file);
  if (file === 'nexonest.html') {
    // Keep the existing no-JavaScript route directory complete without changing the interactive design.
    const links = catalogue.map(project => {
      assert(project.url && !project.url.startsWith('/') && !project.url.includes('..'), `Invalid catalogue route: ${project.id}`);
      assert(fs.existsSync(path.join(root, project.url)), `Missing catalogue page: ${project.url}`);
      return `                        <li><a href="${escape(project.url)}">${escape(project.title)}</a></li>`;
    }).join('\n');
    const fallback = /(<noscript>[\s\S]*?<ul>)[\s\S]*?(<\/ul>[\s\S]*?<\/noscript>)/;
    assert(fallback.test(html), 'Missing catalogue fallback');
    html = html.replace(fallback, (_, open, close) => `${open}\n${links}\n                    ${close}`);
  }
  assert(!/name="robots"[^>]*noindex/i.test(html), `Unexpected index exclusion: ${file}`);
  const url = `https://nexonest.com/${file === 'index.html' ? '' : file}`;
  const canonical = html.match(/rel="canonical" href="([^"]+)"/);
  assert.equal(canonical?.[1], url, `Canonical mismatch: ${file}`);
  urls.push(url);
  const id = html.match(/data-project="([^"]+)"/)?.[1];
  if (id) {
    context.projectId = id;
    vm.runInContext('this.project = PROJECT_PAGE_DATA[projectId]', context);
    assert(context.project, `Unknown project: ${id}`);
    const rendered = vm.runInContext(render, context, {timeout: 1000}).replace(/[ \t]+$/gm, '');
    const marker = '<!-- seo-content:end -->';
    const start = /(<div class="project-content" id="projectPageRoot">)(?:<!-- seo-content:start -->[\s\S]*?<!-- seo-content:end -->|(?:(?!<div)[\s\S])*?)(<\/div>)/;
    assert(start.test(html), `Missing generated root: ${file}`);
    html = html.replace(start, (_, open, close) => `${open}<!-- seo-content:start -->${rendered}${marker}${close}`);
    const data = {'@context':'https://schema.org', '@type':'CreativeWork', name:context.project.title,
      description: context.project.lead.replace(/<[^>]*>/g, '').trim(), url,
      author:{'@type':'Person', name:'Hossein Nazari'},
      isPartOf:{'@type':'WebSite', name:'NexoNest', url:'https://nexonest.com/'}};
    const json = `<script type="application/ld+json" id="projectStructuredData">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
    html = /<script type="application\/ld\+json" id="projectStructuredData">[\s\S]*?<\/script>/.test(html)
      ? html.replace(/<script type="application\/ld\+json" id="projectStructuredData">[\s\S]*?<\/script>/, () => json)
      : html.replace('</head>', `${json}\n</head>`);
  }
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  assert(title && description, `Missing title/description: ${file}`);
  assert(!titles.has(title), `Duplicate search title: ${file}`);
  assert(!descriptions.has(description), `Duplicate search description: ${file}`);
  titles.add(title);
  descriptions.add(description);
  // Existing descriptions are already HTML-escaped; avoid double encoding them.
  const decode = value => value.replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, '&');
  html = meta(html, 'og:title', decode(title), true);
  html = meta(html, 'og:description', decode(description), true);
  html = meta(html, 'og:url', url, true);
  html = meta(html, 'og:site_name', 'NexoNest', true);
  html = meta(html, 'og:locale', /<html[^>]*lang="fa"/.test(html) ? 'fa_IR' : 'en_US', true);
  if (!/property="og:type"/.test(html)) html = meta(html, 'og:type', 'website', true);
  const image = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  // Social cards need a raster image. Use the existing author portrait when only an SVG logo exists.
  const socialImage = image && !/\.svg(?:\?|$)/i.test(image) ? image : 'https://nexonest.com/assets/profile-formal-v2.png';
  assert(fs.existsSync(path.join(root, new URL(socialImage).pathname)), `Missing social image: ${file}`);
  html = meta(html, 'og:image', socialImage, true);
  html = meta(html, 'og:image:alt', 'Hossein Nazari — computational design and research', true);
  html = meta(html, 'twitter:card', 'summary');
  html = meta(html, 'twitter:title', decode(title));
  html = meta(html, 'twitter:description', decode(description));
  html = meta(html, 'twitter:image', socialImage);
  html = meta(html, 'twitter:image:alt', 'Hossein Nazari — computational design and research');
  save(file, html);
}
let template = read('project-template.html');
if (!/name="robots"/.test(template)) template = template.replace('</head>', '<meta name="robots" content="noindex, follow">\n</head>');
save('project-template.html', template);
save('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`);
if (mode === '--check' && changes) process.exitCode = 1;
console.log(`${files.length} indexable pages; ${changes} ${mode === '--write' ? 'updated files' : 'stale files'}.`);
