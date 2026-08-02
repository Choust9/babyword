#!/usr/bin/env node
/*
 * verify-appwrite.js — prove the Appwrite link actually works.
 *
 * Runs the same requests the app makes, as an anonymous visitor, so a pass
 * here means the app will work:
 *
 *   1. read a missing document      -> the project/database/collection resolve
 *   2. create a self-test row       -> "any" has create permission
 *   3. read it back                 -> "any" has read permission
 *   4. update it                    -> "any" has update permission
 *   5. query it by babyId           -> the index and query encoding work
 *   6. same round trip on `babies`
 *
 * With APPWRITE_API_KEY also set it additionally checks the schema — that every
 * attribute the app writes exists, with the right type.
 *
 * Usage:
 *   npm run verify:appwrite                 # reads js/config.js
 *   APPWRITE_API_KEY=... npm run verify:appwrite    # also checks the schema
 *
 * The self-test rows use babyId "__selftest__" and are deleted at the end when
 * an API key is available; otherwise they are left behind and named so you can
 * spot and delete them in the console.
 */

const fs = require('fs');
const path = require('path');

/* ---- config ------------------------------------------------------------ */

function loadConfig() {
  const file = path.join(__dirname, '..', 'js', 'config.js');
  const src = fs.readFileSync(file, 'utf8');
  const window = {};
  // The file is a single assignment to window.BABBLR_CONFIG.
  new Function('window', src)(window);
  const cfg = window.BABBLR_CONFIG || {};
  return {
    endpoint: (process.env.APPWRITE_ENDPOINT || cfg.endpoint || '').replace(/\/$/, ''),
    projectId: process.env.APPWRITE_PROJECT || cfg.projectId || '',
    databaseId: process.env.APPWRITE_DATABASE_ID || cfg.databaseId || '',
    babies: process.env.APPWRITE_BABIES_ID || cfg.babiesCollectionId || '',
    progress: process.env.APPWRITE_PROGRESS_ID || cfg.progressCollectionId || '',
  };
}

const cfg = loadConfig();
const API_KEY = process.env.APPWRITE_API_KEY || '';

const missing = Object.entries(cfg).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) {
  console.error(`
js/config.js is not filled in — sync is OFF and nothing is written to Appwrite.

Missing: ${missing.join(', ')}

Run the setup script first, then paste what it prints into js/config.js:

  APPWRITE_ENDPOINT=... APPWRITE_PROJECT=... APPWRITE_API_KEY=... npm run setup:appwrite
`);
  process.exit(1);
}

/* ---- helpers ----------------------------------------------------------- */

let pass = 0;
let fail = 0;
const ok = (msg, extra = '') => { pass++; console.log(`  [32m✓[0m ${msg}${extra ? '  ' + extra : ''}`); };
const bad = (msg, detail) => { fail++; console.log(`  [31m✗[0m ${msg}\n      ${detail}`); };

const docs = (col, id) =>
  `${cfg.endpoint}/databases/${cfg.databaseId}/collections/${col}/documents${id ? '/' + id : ''}`;

async function call(method, url, body, useKey = false) {
  const headers = { 'Content-Type': 'application/json', 'X-Appwrite-Project': cfg.projectId };
  if (useKey && API_KEY) headers['X-Appwrite-Key'] = API_KEY;
  let res;
  try {
    res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch (err) {
    const e = new Error(`cannot reach ${url} — ${err.message}`);
    e.network = true;
    throw e;
  }
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (_) {}
  return { status: res.status, json, url };
}

const q = (obj) => `queries[]=${encodeURIComponent(JSON.stringify(obj))}`;
const STAMP = new Date().toISOString();
const TEST_BABY = '__selftest__';

/* ---- schema (needs an API key) ----------------------------------------- */

const EXPECTED = {
  babies: {
    name: 'string', birth: 'string', createdAt: 'string', updatedAt: 'string',
    wordsTeaching: 'integer', wordsMastered: 'integer',
    phrasesTeaching: 'integer', phrasesMastered: 'integer',
  },
  progress: {
    babyId: 'string', kind: 'string', month: 'integer', item: 'string',
    status: 'string', startedAt: 'string', masteredAt: 'string', updatedAt: 'string',
  },
};

async function checkSchema(label, col, expected) {
  const r = await call('GET', `${cfg.endpoint}/databases/${cfg.databaseId}/collections/${col}/attributes`, null, true);
  if (r.status !== 200) {
    bad(`${label}: could not read schema`, `HTTP ${r.status} ${(r.json && r.json.message) || ''}`);
    return;
  }
  const got = Object.fromEntries((r.json.attributes || []).map((a) => [a.key, a]));
  for (const [key, type] of Object.entries(expected)) {
    const a = got[key];
    if (!a) bad(`${label}.${key} missing`, 'run: npm run setup:appwrite');
    else if (a.type !== type) bad(`${label}.${key} wrong type`, `expected ${type}, found ${a.type}`);
    else if (a.status !== 'available') bad(`${label}.${key} not ready`, `status ${a.status}`);
    else ok(`${label}.${key}`, `(${type})`);
  }
  const extra = Object.keys(got).filter((k) => !expected[k]);
  if (extra.length) console.log(`      note: extra attributes present — ${extra.join(', ')}`);
}

/* ---- round trip -------------------------------------------------------- */

async function roundTrip(label, col, docId, data) {
  // 1. missing document -> 404 proves the ids resolve and read is permitted.
  // Appwrite distinguishes a missing document from a missing collection or
  // database, so read the reason rather than treating every 404 as fine.
  const miss = await call('GET', docs(col, '__does_not_exist__'));
  const why = `${(miss.json && (miss.json.type || '')) } ${(miss.json && miss.json.message) || ''}`.toLowerCase();
  if (miss.status === 404 && /collection/.test(why)) {
    return bad(`${label}: collection "${col}" does not exist`, 'run: npm run setup:appwrite, or fix the id in js/config.js');
  }
  if (miss.status === 404 && /database/.test(why)) {
    return bad(`${label}: database "${cfg.databaseId}" does not exist`, 'run: npm run setup:appwrite, or fix databaseId in js/config.js');
  }
  if (miss.status === 404 && /project/.test(why)) {
    return bad(`${label}: project "${cfg.projectId}" not found`, 'check projectId in js/config.js');
  }
  if (miss.status === 404) ok(`${label}: reachable, read permitted`);
  else if (miss.status === 401) return bad(`${label}: read denied`, 'grant read("any") on the collection');
  else if (miss.status === 200) ok(`${label}: reachable`);
  else return bad(`${label}: unexpected response`, `HTTP ${miss.status} ${(miss.json && miss.json.message) || ''}\n      ${miss.url}`);

  // 2. create
  let create = await call('POST', docs(col), { documentId: docId, data });
  if (create.status === 409) {
    // left over from a previous run — patch instead
    create = await call('PATCH', docs(col, docId), { data });
  }
  if (create.status === 201 || create.status === 200) ok(`${label}: create/update permitted`);
  else return bad(`${label}: cannot write`, `HTTP ${create.status} ${(create.json && create.json.message) || ''}`);

  // 3. read back and confirm the fields survived
  const read = await call('GET', docs(col, docId));
  if (read.status !== 200) return bad(`${label}: cannot read back`, `HTTP ${read.status}`);
  const wrong = Object.entries(data).filter(([k, v]) => v !== null && read.json[k] !== v);
  if (wrong.length) bad(`${label}: fields did not persist`, wrong.map(([k, v]) => `${k}: sent ${JSON.stringify(v)}, got ${JSON.stringify(read.json[k])}`).join('\n      '));
  else ok(`${label}: all fields persisted`);

  // 4. update
  const upd = await call('PATCH', docs(col, docId), { data: { updatedAt: STAMP } });
  if (upd.status === 200) ok(`${label}: update permitted`);
  else bad(`${label}: cannot update`, `HTTP ${upd.status} ${(upd.json && upd.json.message) || ''}`);
}

async function checkQuery() {
  const url = `${docs(cfg.progress)}?${q({ method: 'equal', attribute: 'babyId', values: [TEST_BABY] })}&${q({ method: 'limit', values: [10] })}`;
  const r = await call('GET', url);
  if (r.status === 200) {
    const n = (r.json.documents || []).length;
    if (n > 0) ok('progress: query by babyId works', `(${n} row${n === 1 ? '' : 's'} found, JSON query format)`);
    else bad('progress: query returned nothing', 'the row exists but the filter matched nothing — check the babyId attribute');
    return;
  }
  // Older Appwrite builds take the string form instead.
  const legacy = `${docs(cfg.progress)}?queries[]=${encodeURIComponent(`equal("babyId", ["${TEST_BABY}"])`)}`;
  const r2 = await call('GET', legacy);
  if (r2.status === 200) ok('progress: query works (legacy string format)', 'the app falls back to this automatically');
  else bad('progress: queries fail', `JSON form HTTP ${r.status}, legacy form HTTP ${r2.status}\n      ${(r.json && r.json.message) || ''}`);
}

async function cleanup(col, id) {
  if (!API_KEY) return { done: false, why: 'no API key' };
  const r = await call('DELETE', docs(col, id), null, true);
  if (r.status === 204 || r.status === 200) return { done: true };
  return { done: false, why: `HTTP ${r.status} ${(r.json && r.json.message) || ''}`.trim() };
}

/* ---- run --------------------------------------------------------------- */

(async () => {
  console.log(`\nBabblr → Appwrite verification`);
  console.log(`  ${cfg.endpoint}`);
  console.log(`  project ${cfg.projectId} · database ${cfg.databaseId}`);
  console.log(`  collections: ${cfg.babies}, ${cfg.progress}\n`);

  if (API_KEY) {
    console.log('Schema');
    await checkSchema('babies', cfg.babies, EXPECTED.babies);
    await checkSchema('progress', cfg.progress, EXPECTED.progress);
    console.log('');
  } else {
    console.log('Schema check skipped (set APPWRITE_API_KEY to include it)\n');
  }

  console.log('Round trip as the app sees it');
  await roundTrip('babies', cfg.babies, TEST_BABY, {
    name: 'Self test', birth: '2000-01-01', createdAt: STAMP, updatedAt: STAMP,
    wordsTeaching: 0, wordsMastered: 0, phrasesTeaching: 0, phrasesMastered: 0,
  });
  await roundTrip('progress', cfg.progress, `${TEST_BABY}_row`, {
    babyId: TEST_BABY, kind: 'word', month: 0, item: 'Self test',
    status: 'todo', startedAt: null, masteredAt: null, updatedAt: STAMP,
  });
  await checkQuery();

  console.log('\nCleanup');
  const a = await cleanup(cfg.babies, TEST_BABY);
  const b = await cleanup(cfg.progress, `${TEST_BABY}_row`);
  if (a.done && b.done) {
    ok('self-test rows removed');
  } else {
    const why = a.why || b.why;
    console.log(`  self-test rows left behind (${why}).`);
    console.log(`      Delete "${TEST_BABY}" from ${cfg.babies} and "${TEST_BABY}_row" from ${cfg.progress}`);
    console.log('      in the console when you are done. They are harmless.');
  }

  console.log(`\n${fail === 0 ? '[32mAll checks passed' : `[31m${fail} check${fail === 1 ? '' : 's'} failed`}[0m — ${pass} passed, ${fail} failed\n`);
  if (fail === 0) {
    console.log('The app will read and write correctly from Node. One thing this cannot');
    console.log('test: CORS. Open the app in a browser and use Settings → Shared');
    console.log('progress → "Test connection" to confirm the browser is allowed too.\n');
  }
  process.exit(fail === 0 ? 0 : 1);
})().catch((err) => {
  console.error(`\n[31mFailed[0m: ${err.message}\n`);
  if (err.network) {
    console.error('Check the endpoint URL in js/config.js — it should end in /v1 and have no trailing slash.\n');
  }
  process.exit(1);
});
