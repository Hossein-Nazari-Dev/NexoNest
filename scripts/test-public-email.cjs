const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

let clock, tables, sent, properties, quota, mailFailure, owner, locked;
class TestDate extends Date {
  constructor(...args) { super(...(args.length ? args : [clock])); }
  static now() { return clock; }
}
class Sheet {
  constructor(headers) { this.rows = headers ? [headers] : []; }
  getLastRow() { return this.rows.length; }
  getLastColumn() { return Math.max(...this.rows.map(row => row.length)); }
  appendRow(row) { this.rows.push([...row]); }
  setFrozenRows() {}
  getRange(row, column, height = 1, width = 1) {
    const read = () => Array.from({length: height}, (_, i) => Array.from({length: width}, (_, j) => this.rows[row - 1 + i]?.[column - 1 + j] ?? ''));
    const write = values => values.forEach((cells, i) => cells.forEach((value, j) => {
      this.rows[row - 1 + i] ||= [];
      this.rows[row - 1 + i][column - 1 + j] = value;
    }));
    return { getValues: read, getDisplayValues: () => read().map(cells => cells.map(String)), getValue: () => read()[0][0],
      setValues: write, setValue: value => write([[value]]), clearContent: () => write([['']]) };
  }
}
const book = {getSheetByName: name => tables[name], insertSheet: name => (tables[name] = new Sheet())};
const ctx = vm.createContext({ console: {log() {}, error() {}}, Date: TestDate,
  LockService: {getScriptLock: () => ({tryLock: () => !locked, waitLock() {}, releaseLock() {}})},
  SpreadsheetApp: {getActiveSpreadsheet: () => book, flush() {}},
  PropertiesService: {getScriptProperties: () => ({getProperty: key => properties[key], setProperty: (key, value) => {properties[key] = value;}})},
  Session: {getActiveUser: () => ({getEmail: () => owner}), getEffectiveUser: () => ({getEmail: () => owner})},
  Utilities: {getUuid: crypto.randomUUID, DigestAlgorithm: {SHA_256: 'sha256'}, Charset: {UTF_8: 'utf8'},
    computeDigest: (_, value) => [...crypto.createHash('sha256').update(value).digest()],
    computeHmacSha256Signature: (value, key) => [...crypto.createHmac('sha256', key).update(value).digest()],
    base64EncodeWebSafe: bytes => Buffer.from(bytes).toString('base64url')},
  MailApp: {getRemainingDailyQuota: () => quota, sendEmail: mail => {sent.push(mail); if (mailFailure) throw Error('unknown provider result');}},
  ScriptApp: {getService: () => ({getUrl: () => 'https://script.example/exec'})},
  ContentService: {MimeType: {JSON: 'json'}, createTextOutput: value => ({setMimeType: () => JSON.parse(value)})},
  HtmlService: {createHtmlOutput: html => html}
});
for (const file of ['Code.gs', 'PublicEmail.gs', 'LicensingProfile.gs', 'Licensing.gs', 'NewsletterDelivery.gs'])
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../integrations/google-apps-script', file), 'utf8'), ctx, {filename: file});
function reset() {
  clock = Date.UTC(2026, 9, 18); quota = 100; mailFailure = false; locked = false;
  owner = 'nexonest.contact@gmail.com'; properties = {}; sent = [];
  tables = Object.fromEntries(['Users', 'ProductSubscriptions', 'NexoBreak', 'Newsletter'].map(name => [name, new Sheet([])]));
  tables.Newsletter.rows[0] = ['ConsentId','UserId','EmailAtConsent','ConsentVersion','ConsentedAt','Status','UnsubscribedAt','Source','EducationLevel','FieldOfStudy','Occupation','Organization','Interests','CurrentExploration','Token','ConfirmedAt','SubmittedAt'];
}
const signup = {fullName: 'Test reader', email: 'reader@example.com', consent: true, interests: ['Research'], occupation: 'Designer', educationLevel: 'Master'};
const game = {displayName: 'Player', email: 'player@example.com', consent: true};
const post = data => ctx.doPost({parameter: {payload: JSON.stringify(data)}});
const record = () => tables.Newsletter.rows[1];
const code = () => sent.at(-1).body.match(/code is (\d{6})/)[1];
let count = 0;
function test(name, fn) { reset(); fn(); count++; console.log('PASS ' + name); }

test('new Game Club account requires mailbox verification without writes', () => {
  assert.equal(post({...game, action: 'nexobreak_join'}).ok, false);
  assert.equal(tables.Users.rows.length, 1);
});
test('verified join and restore; email alone cannot rotate the token', () => {
  assert.equal(post({...game, action: 'nexobreak_request_code'}).ok, true);
  const joined = post({...game, code: code(), action: 'nexobreak_join'});
  assert.equal(joined.ok, true);
  const before = JSON.stringify(tables.NexoBreak.rows);
  assert.equal(post({...game, action: 'nexobreak_join'}).ok, false);
  assert.equal(JSON.stringify(tables.NexoBreak.rows), before);
  assert.equal(post({action: 'nexobreak_sync', userId: joined.userId, accessToken: joined.accessToken, highScore: 9}).ok, true);
  clock += 60001;
  post({...game, action: 'nexobreak_request_code'});
  const restored = post({...game, code: code(), action: 'nexobreak_join'});
  assert.equal(restored.userId, joined.userId);
  assert.notEqual(restored.accessToken, joined.accessToken);
  assert.equal(post({action: 'nexobreak_sync', userId: joined.userId, accessToken: joined.accessToken}).ok, false);
});
test('Game Club codes expire, reject replay, and bound guesses', () => {
  post({...game, action: 'nexobreak_request_code'});
  const valid = code();
  for (let i = 0; i < 5; i++) assert.equal(post({...game, action: 'nexobreak_join', code: 'invalid'}).ok, false);
  assert.equal(post({...game, action: 'nexobreak_join', code: valid}).ok, false);
  clock += 600001;
  post({...game, action: 'nexobreak_request_code'});
  clock += 600001;
  assert.equal(post({...game, action: 'nexobreak_join', code: code()}).ok, false);
});
test('code resend does not invalidate a still-valid challenge', () => {
  post({...game, action: 'nexobreak_request_code'});
  const valid = code(); clock += 60001;
  assert.equal(post({...game, action: 'nexobreak_request_code'}).ok, false);
  assert.equal(sent.length, 1);
  assert.equal(post({...game, action: 'nexobreak_join', code: valid}).ok, true);
  assert.equal(post({...game, action: 'nexobreak_join', code: valid}).ok, false);
});
test('pending newsletter retry preserves token, consent, timestamp and demographics', () => {
  assert.equal(post(signup).ok, true);
  const before = [...record()];
  assert.equal(post(signup).ok, false);
  clock += 60001;
  assert.equal(post({...signup, fullName: 'Attacker', interests: ['Other']}).ok, true);
  assert.deepEqual(record(), before);
  assert.equal(sent.length, 2);
  assert.match(ctx.doGet({parameter: {confirm: record()[14]}}), /Subscription confirmed/);
  assert.equal(record()[5], 'subscribed');
  assert.equal(post(signup).status, 'already-subscribed');
  assert.equal(sent.length, 2);
});
test('expired newsletter token is renewed in place', () => {
  post(signup); const old = record()[14]; clock += 8 * 86400000;
  assert.equal(post(signup).ok, true);
  assert.equal(tables.Newsletter.rows.length, 2);
  assert.notEqual(record()[14], old);
  assert.match(ctx.doGet({parameter: {confirm: old}}), /Link not found/);
});
test('per-mailbox cap, global cap and reserved quota stop new mail', () => {
  for (let i = 0; i < 3; i++) {assert.equal(post(signup).ok, true); clock += 60001;}
  assert.equal(post(signup).ok, false);
  properties.PUBLIC_EMAIL_DAILY_LIMIT = '3';
  assert.equal(post({...signup, email: 'other@example.com'}).ok, false);
  clock += 86400001; quota = 20;
  assert.equal(post({...signup, email: 'other@example.com'}).ok, false);
  assert.equal(sent.length, 3);
});
test('uncertain mail outcome retains pending token and prevents immediate resend', () => {
  mailFailure = true;
  assert.equal(post(signup).ok, false);
  const token = record()[14];
  mailFailure = false;
  assert.equal(post(signup).ok, false);
  assert.equal(record()[14], token);
  assert.equal(sent.length, 1);
});
test('Gmail aliases share the mailbox sending limit', () => {
  assert.equal(post({...signup, email: 'test.reader+one@gmail.com'}).ok, true);
  assert.equal(post({...signup, email: 'testreader+two@googlemail.com'}).ok, false);
  assert.equal(sent.length, 1);
});
test('unsubscribe GET is read-only; signed POST cancels and prevents later confirmation', () => {
  post(signup); const token = record()[14];
  const url = new URL(ctx.newsletterUnsubscribeUrl_(record()));
  const parameters = Object.fromEntries(url.searchParams);
  assert.match(ctx.doGet({parameter: parameters}), /<form/);
  assert.equal(record()[5], 'pending');
  assert.match(ctx.doGet({parameter: {...parameters, signature: 'forged'}}), /Invalid link/);
  assert.match(ctx.doPost({parameter: {...parameters, action: 'newsletter_unsubscribe'}}), /Unsubscribed/);
  assert.equal(record()[5], 'unsubscribed');
  assert.ok(record()[6]);
  assert.equal(record()[14], '');
  assert.match(ctx.doGet({parameter: {confirm: token}}), /Link not found/);
});
test('desktop profile cannot override an unsubscribe; campaign skips it', () => {
  post(signup); record()[5] = 'unsubscribed';
  ctx.licenseNewsletterConsent_(signup.email, 'Reader', clock);
  assert.equal(record()[5], 'unsubscribed');
  assert.equal(ctx.sendNewsletterBatch_('test-campaign'), 0);
  assert.equal(sent.length, 1);
});
test('unsubscribe retries are safe; fresh consent rejects an old preference link', () => {
  post(signup);
  const parameters = {...Object.fromEntries(new URL(ctx.newsletterUnsubscribeUrl_(record())).searchParams), action: 'newsletter_unsubscribe'};
  ctx.doPost({parameter: parameters});
  assert.match(ctx.doPost({parameter: parameters}), /Unsubscribed/);
  clock += 60001;
  post(signup);
  assert.equal(record()[5], 'pending');
  assert.match(ctx.doPost({parameter: parameters}), /Link not found/);
  assert.equal(record()[5], 'pending');
});
test('campaign and confirmation mail contain signed unsubscribe links in both bodies', () => {
  post(signup);
  assert.match(sent[0].body, /unsubscribe=/);
  assert.match(sent[0].htmlBody, /Cancel request \/ unsubscribe/);
  record()[5] = 'subscribed';
  assert.equal(ctx.sendNewsletterBatch_('test-campaign'), 1);
  assert.match(sent[1].body, /Unsubscribe: https:/);
  assert.match(sent[1].htmlBody, />Unsubscribe</);
  assert.equal(ctx.sendNewsletterBatch_('test-campaign'), 0);
});
test('invalid/oversized/unknown requests and lock contention fail closed', () => {
  for (const data of [null, [], {...signup, action: 'typo'}, {...signup, fullName: 'x'.repeat(13000)}])
    assert.equal(post(data).ok, false);
  locked = true;
  assert.equal(post(signup).ok, false);
  assert.equal(sent.length, 0);
});
console.log(`${count} public email checks passed. No external calls or real email.`);
