#!/usr/bin/env node
/*
 * setup-appwrite.js — create and configure Babblr's database in one command.
 *
 * Creates:
 *   database    "Babblr"
 *   collection  "babies"    one row per baby, with live counts
 *   collection  "progress"  one row per word or phrase taught (the audit trail)
 * plus every attribute, an index for the lookups the app makes, and the
 * permissions that let the app work without accounts.
 *
 * Safe to re-run: anything that already exists is left alone.
 *
 * Usage:
 *   APPWRITE_ENDPOINT="https://fra.cloud.appwrite.io/v1" \
 *   APPWRITE_PROJECT="your-project-id" \
 *   APPWRITE_API_KEY="your-api-key" \
 *   npm run setup:appwrite
 *
 * The API key needs the databases.read / databases.write scopes. Create it in
 * the Appwrite console under Project settings -> API keys. It is used only by
 * this script and never ships in the app.
 */

const ENDPOINT = (process.env.APPWRITE_ENDPOINT || '').replace(/\/$/, '');
const PROJECT = process.env.APPWRITE_PROJECT || '';
const API_KEY = process.env.APPWRITE_API_KEY || '';

const DB_ID = process.env.APPWRITE_DATABASE_ID || 'babblr';
const BABIES = process.env.APPWRITE_BABIES_ID || 'babies';
const PROGRESS = process.env.APPWRITE_PROGRESS_ID || 'progress';

if (!ENDPOINT || !PROJECT || !API_KEY) {
  console.error(`
Missing configuration. Set these and re-run:

  APPWRITE_ENDPOINT   e.g. https://fra.cloud.appwrite.io/v1
  APPWRITE_PROJECT    your project id
  APPWRITE_API_KEY    an API key with databases.read + databases.write

Example:
  APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1 \\
  APPWRITE_PROJECT=abc123 \\
  APPWRITE_API_KEY=standard_xxx \\
  npm run setup:appwrite
`);
  process.exit(1);
}

// The app talks to Appwrite as an anonymous visitor, so the collections must
// allow the "any" role to read, create and update. Delete is deliberately not
// granted: a reset writes status "todo" rather than removing history.
const PERMS = ['create("any")', 'read("any")', 'update("any")'];

async function api(method, path, body) {
  const res = await fetch(`${ENDPOINT}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT,
      'X-Appwrite-Key': API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (_) {}
  if (!res.ok) {
    const err = new Error((json && json.message) || `HTTP ${res.status}`);
    err.code = res.status;
    throw err;
  }
  return json;
}

// Treat "already exists" as success so the script is safe to re-run.
async function ensure(label, fn) {
  try {
    await fn();
    console.log(`  created  ${label}`);
  } catch (err) {
    if (err.code === 409) console.log(`  exists   ${label}`);
    else throw new Error(`${label}: ${err.message}`);
  }
}

const str = (col, key, size, required = false) =>
  ensure(`${col}.${key} (string)`, () =>
    api('POST', `/databases/${DB_ID}/collections/${col}/attributes/string`,
      { key, size, required, default: required ? undefined : null }));

const int = (col, key) =>
  ensure(`${col}.${key} (integer)`, () =>
    api('POST', `/databases/${DB_ID}/collections/${col}/attributes/integer`,
      { key, required: false, default: 0 }));

// Attributes are created asynchronously; indexes fail if they are not ready.
async function waitForAttributes(col, keys) {
  for (let attempt = 0; attempt < 30; attempt++) {
    const list = await api('GET', `/databases/${DB_ID}/collections/${col}/attributes`);
    const byKey = Object.fromEntries((list.attributes || []).map((a) => [a.key, a.status]));
    if (keys.every((k) => byKey[k] === 'available')) return;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`attributes on ${col} did not become available in time`);
}

(async () => {
  console.log(`\nBabblr → Appwrite setup\n  ${ENDPOINT}  project ${PROJECT}\n`);

  console.log('Database');
  await ensure(`database "${DB_ID}"`, () =>
    api('POST', '/databases', { databaseId: DB_ID, name: 'Babblr' }));

  console.log('\nCollections');
  await ensure(`collection "${BABIES}"`, () =>
    api('POST', `/databases/${DB_ID}/collections`,
      { collectionId: BABIES, name: 'Babies', permissions: PERMS, documentSecurity: false }));
  await ensure(`collection "${PROGRESS}"`, () =>
    api('POST', `/databases/${DB_ID}/collections`,
      { collectionId: PROGRESS, name: 'Progress', permissions: PERMS, documentSecurity: false }));

  console.log('\nAttributes — babies');
  await str(BABIES, 'name', 128);
  await str(BABIES, 'birth', 32);
  await str(BABIES, 'createdAt', 32);
  await str(BABIES, 'updatedAt', 32);
  await int(BABIES, 'wordsTeaching');
  await int(BABIES, 'wordsMastered');
  await int(BABIES, 'phrasesTeaching');
  await int(BABIES, 'phrasesMastered');

  console.log('\nAttributes — progress');
  await str(PROGRESS, 'babyId', 64);
  await str(PROGRESS, 'kind', 16);        // 'word' | 'phrase'
  await int(PROGRESS, 'month');
  await str(PROGRESS, 'item', 128);
  await str(PROGRESS, 'status', 16);      // 'todo' | 'teaching' | 'mastered'
  await str(PROGRESS, 'startedAt', 32);
  await str(PROGRESS, 'masteredAt', 32);
  await str(PROGRESS, 'updatedAt', 32);

  console.log('\nWaiting for attributes to become available…');
  await waitForAttributes(BABIES, ['name', 'birth', 'updatedAt']);
  await waitForAttributes(PROGRESS, ['babyId', 'kind', 'month', 'item', 'status', 'updatedAt']);

  console.log('\nIndexes');
  // The app's only query: every row for one baby.
  await ensure(`${PROGRESS}.babyId (key)`, () =>
    api('POST', `/databases/${DB_ID}/collections/${PROGRESS}/indexes`,
      { key: 'byBaby', type: 'key', attributes: ['babyId'], orders: ['ASC'] }));
  // Handy in the console: newest activity first.
  await ensure(`${PROGRESS}.updatedAt (key)`, () =>
    api('POST', `/databases/${DB_ID}/collections/${PROGRESS}/indexes`,
      { key: 'byUpdated', type: 'key', attributes: ['updatedAt'], orders: ['DESC'] }));
  await ensure(`${PROGRESS}.status (key)`, () =>
    api('POST', `/databases/${DB_ID}/collections/${PROGRESS}/indexes`,
      { key: 'byStatus', type: 'key', attributes: ['status'], orders: ['ASC'] }));

  console.log(`
Done. Paste these into js/config.js:

window.BABBLR_CONFIG = {
  endpoint: '${ENDPOINT}',
  projectId: '${PROJECT}',
  databaseId: '${DB_ID}',
  babiesCollectionId: '${BABIES}',
  progressCollectionId: '${PROGRESS}',
};

One manual step left: in the Appwrite console go to
Project settings -> Platforms -> Add platform -> Web app and register the
hostname you serve the site from. Without it the browser blocks the requests
with a CORS error.
`);
})().catch((err) => {
  console.error(`\nFailed: ${err.message}\n`);
  process.exit(1);
});
