#!/usr/bin/env node
// Refresh deterministic reference facts; architecture prose is reviewed manually.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const guidePath = path.join(root, 'PROJECT_GUIDE.md');
const start = '<!-- generated-reference:start -->';
const end = '<!-- generated-reference:end -->';
const mode = process.argv[2];
if (!['--write', '--check'].includes(mode) || process.argv.length !== 3) {
  console.error('Usage: node scripts/update-project-guide.cjs --write|--check');
  process.exit(2);
}

function read(relative) { return fs.readFileSync(path.join(root, relative), 'utf8'); }
function cell(value) { return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' '); }
function link(file) { return `[${file}](${file})`; }
function filesIn(directory = '') {
  const files = [];
  for (const item of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    if (item.name.startsWith('.') || ['tmp', 'tmp-gp8-extract'].includes(item.name)) continue;
    const file = directory ? `${directory}/${item.name}` : item.name;
    if (item.isDirectory()) files.push(...filesIn(file));
    else if (item.isFile()) files.push(file);
  }
  return files.sort();
}

function digest(file) {
  const hash = crypto.createHash('sha256');
  const buffer = Buffer.alloc(1024 * 1024);
  const descriptor = fs.openSync(path.join(root, file), 'r');
  try {
    let length;
    while ((length = fs.readSync(descriptor, buffer, 0, buffer.length, null)) > 0) hash.update(buffer.subarray(0, length));
  } finally { fs.closeSync(descriptor); }
  return hash.digest('hex');
}

function generate() {
  const files = filesIn();
  // Exclude the guide and its entry/rules files to avoid a self-referential digest.
  const inputs = files.filter(file => !['PROJECT_GUIDE.md', 'README.md', 'AGENTS.md'].includes(file));
  const snapshot = crypto.createHash('sha256');
  for (const file of inputs) snapshot.update(file + '\0' + digest(file) + '\n');
  const fingerprint = snapshot.digest('hex');
  const source = read('js/project-page.js');
  const boundary = source.indexOf('const escapeHtml');
  if (boundary < 0) throw new Error('Editorial data boundary changed; update this extractor.');
  const context = Object.create(null);
  vm.runInNewContext(source.slice(0, boundary) + '\nthis.pages = PROJECT_PAGE_DATA; this.order = PROJECT_PAGE_ORDER;', context, { timeout: 1000 });
  const brief = JSON.parse(read('data/projects-brief.json'));
  const shells = files.filter(file => file.startsWith('projects-pages/') && file.endsWith('.html'));
  const routes = new Map(shells.map(file => [read(file).match(/data-project="([^"]+)"/)?.[1], file]));
  const lines = [
    '### Source snapshot', '',
    `SHA-256 of ${inputs.length} application/configuration/integration/tool/asset files:`, '',
    `\`${fingerprint}\``, '',
    'Includes current working-tree bytes, including local backend changes and media.',
    'Excludes this guide, root README/AGENTS, hidden internals and scratch directories.',
    'This is a content fingerprint, not a Git commit or deployment identifier.', '',
    '### Catalogue and editorial route map', '',
    '| Catalogue ID | Editorial ID | Page | Categories / subcategories |',
    '| --- | --- | --- | --- |'
  ];
  for (const project of brief.projects) {
    if (!fs.existsSync(path.join(root, project.url))) throw new Error(`Missing project route: ${project.url}`);
    const id = read(project.url).match(/data-project="([^"]+)"/)?.[1];
    if (!context.pages[id]) throw new Error(`No editorial record for ${project.url}`);
    lines.push(`| ${cell(project.id)} | ${cell(id)} | ${link(project.url)} | ${cell(project.categories.join(', '))} / ${cell(project.subcategories.join(', '))} |`);
  }
  lines.push('', `Editorial navigation order: ${context.order.map(id => '\`' + id + '\`').join(' → ')}.`, '',
    '### Every editorial project and section', '',
    'Statuses below quote the current website content; they are not independent product release checks.', '');
  for (const [id, project] of Object.entries(context.pages)) {
    if (!routes.has(id)) throw new Error(`Missing HTML shell for ${id}`);
    lines.push(`#### ${project.title}`, '',
      `Source key: \`${id}\`; shell: ${link(routes.get(id))}; printed page label: \`${project.page}\`.`, '',
      `**Published content status:** ${project.status}.`, '',
      `**Purpose:** ${project.subtitle}`, '',
      `**Role / period:** ${project.role} / ${project.period}.`, '',
      `**Stack:** ${Array.isArray(project.stack) ? project.stack.join(', ') : project.stack}.`, '',
      '| Section | Renderer kind |', '| --- | --- |');
    for (const section of project.sections) lines.push(`| ${cell(section.title)} | \`${cell(section.kind)}\` |`);
    lines.push('');
  }
  lines.push('### Complete source and asset inventory', '',
    'All non-hidden, non-scratch repository files are listed. Inventory inclusion does not mean a file is used at runtime.', '',
    '| File | Bytes |', '| --- | --- |');
  for (const file of files.filter(file => !['PROJECT_GUIDE.md', 'README.md', 'AGENTS.md'].includes(file))) {
    lines.push(`| ${link(file)} | ${fs.statSync(path.join(root, file)).size} |`);
  }
  lines.push('', 'Root handoff files excluded from the fingerprint: [README.md](README.md), [AGENTS.md](AGENTS.md), [PROJECT_GUIDE.md](PROJECT_GUIDE.md).');
  return lines.join('\n');
}

function checkLinks(text) {
  const failures = [];
  const headings = new Set([...text.matchAll(/^#{1,6} (.+)$/gm)].map(match => match[1].toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu, '').trim().replace(/\s/g, '-')));
  for (const match of text.matchAll(/\[[^\]\n]*\]\(([^)\n]+)\)/g)) {
    const target = match[1];
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    if (target.startsWith('#')) {
      if (!headings.has(target.slice(1))) failures.push(`Unknown heading: ${target}`);
      continue;
    }
    const file = decodeURIComponent(target.split('#')[0]);
    if (!fs.existsSync(path.join(root, file))) failures.push(`Missing local link: ${target}`);
  }
  if (failures.length) throw new Error(failures.join('\n'));
}

try {
  const original = read('PROJECT_GUIDE.md');
  const first = original.indexOf(start);
  const last = original.indexOf(end);
  if (first < 0 || last <= first || original.indexOf(start, first + start.length) >= 0 || original.indexOf(end, last + end.length) >= 0) throw new Error('Expected exactly one generated-reference block.');
  const expected = original.slice(0, first + start.length) + '\n' + generate() + '\n' + original.slice(last);
  checkLinks(expected);
  if (mode === '--write') {
    fs.writeFileSync(guidePath, expected, 'utf8');
    console.log('Updated generated project guide reference. Review prose separately.');
  } else if (original !== expected) {
    console.error('Project guide reference is stale. Review affected prose, then run --write.');
    process.exitCode = 1;
  } else {
    console.log('PASS: guide source fingerprint, file coverage, project mapping, sections and local links.');
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
