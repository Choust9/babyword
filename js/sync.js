/*
 * sync.js — shared, cross-device progress via an Appwrite database.
 *
 * No accounts. The baby's name + date of birth (+ an optional family code) IS
 * the key, so every device that enters the same details shares one record.
 *
 * The database is the source of truth and is designed to be *readable*:
 *
 *   babies    one document per baby     — name, birth, live counts
 *   progress  one document per word     — month, item, status, timestamps
 *             or phrase taught            (this is the audit trail)
 *
 * Every tap you make becomes a visible row, not a line inside an opaque JSON
 * blob. localStorage stays the render source so the app is instant and works
 * offline; Appwrite is what devices reconcile against.
 *
 * Record ids
 *   without a family code:  sophia-2026-01-23        (readable)
 *   with one:               b3f9a1c…                 (SHA-256, unguessable)
 * The family code is typed into the app, never stored in config.js, so it does
 * not appear in the page source.
 *
 * Uses the REST API directly via fetch so the app keeps zero dependencies.
 */

(function () {
  'use strict';

  const cfg = window.BABBLR_CONFIG || {};
  const CONFIGURED = !!(
    cfg.endpoint && cfg.projectId && cfg.databaseId &&
    cfg.babiesCollectionId && cfg.progressCollectionId
  );

  const PULL_INTERVAL_MS = 60000;   // background refresh while the tab is open
  const PUSH_DEBOUNCE_MS = 1200;    // coalesce bursts of taps into one write
  const PAGE = 100;                 // Appwrite's max documents per list page

  let getState = () => null;
  let applyState = () => {};
  const listeners = [];
  let pushTimer = null;
  let started = false;

  // The record we have successfully read at least once. Guards a fresh device
  // from overwriting the shared record before it has seen what is there.
  let pulledFor = null;
  // key -> updatedISO as last seen on the server, so pushes only write rows
  // that actually changed.
  let remoteSeen = {};
  // Cached id, since hashing is async.
  let currentId = null;
  let currentIdInput = null;

  const status = {
    state: CONFIGURED ? 'idle' : 'off',  // off|idle|syncing|ok|error|offline
    lastSyncISO: null,
    error: null,
    recordId: null,
    rows: 0,
  };

  function setStatus(patch) {
    Object.assign(status, patch);
    listeners.forEach((fn) => fn(status));
  }

  /* ---- Ids -------------------------------------------------------------- */

  async function sha256Hex(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  const slug = (s) => String(s || '')
    .trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20);

  // Appwrite ids: [a-zA-Z0-9._-], must not start with a special char, <=36.
  // With a family code we hash, so the id gives nothing away; without one we
  // keep it readable so the console is easy to scan.
  async function resolveRecordId(state) {
    const baby = state && state.baby;
    if (!baby || !baby.birthISO) { currentId = null; currentIdInput = null; return null; }

    const code = (state.familyCode || '').trim().toLowerCase();
    const input = `${code}|${slug(baby.name)}|${baby.birthISO}`;
    if (input === currentIdInput && currentId) return currentId;

    let id;
    if (!code) {
      id = `${slug(baby.name) || 'baby'}-${baby.birthISO}`;
    } else if (window.crypto && crypto.subtle) {
      id = 'b' + (await sha256Hex(input)).slice(0, 32);
    } else {
      // crypto.subtle needs a secure context (https or localhost). Rather than
      // silently sharing a guessable id, refuse and say so.
      setStatus({ state: 'error', error: 'A family code needs HTTPS (secure context) to hash the record id.' });
      return null;
    }

    if (input !== currentIdInput) { pulledFor = null; remoteSeen = {}; }
    currentIdInput = input;
    currentId = id;
    return id;
  }

  // Progress row ids must also fit in 36 chars, so they are hashed too. The
  // row's attributes carry the readable month/item, which is what you scan in
  // the console.
  const rowId = async (babyId, kind, month, item) =>
    'p' + (await sha256Hex(`${babyId}|${kind}|${month}|${item}`)).slice(0, 32);

  /* ---- REST ------------------------------------------------------------- */

  const colUrl = (col, id) =>
    `${cfg.endpoint}/databases/${cfg.databaseId}/collections/${col}/documents${id ? '/' + id : ''}`;

  async function api(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': cfg.projectId,
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try { detail = (await res.json()).message || detail; } catch (_) {}
      const err = new Error(detail);
      err.code = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }

  // Appwrite changed its REST query encoding between versions: newer builds
  // take JSON objects, older ones take strings like equal("k", ["v"]).
  // Try JSON, fall back once, and remember which worked.
  let queryStyle = null;
  function encodeQueries(babyId, offset, style) {
    const q = style === 'legacy'
      ? [`equal("babyId", ["${babyId}"])`, `limit(${PAGE})`, `offset(${offset})`]
      : [
          JSON.stringify({ method: 'equal', attribute: 'babyId', values: [babyId] }),
          JSON.stringify({ method: 'limit', values: [PAGE] }),
          JSON.stringify({ method: 'offset', values: [offset] }),
        ];
    return q.map((s) => `queries[]=${encodeURIComponent(s)}`).join('&');
  }

  async function listRows(babyId) {
    const out = [];
    for (let offset = 0; ; offset += PAGE) {
      let page;
      try {
        page = await api(`${colUrl(cfg.progressCollectionId)}?${encodeQueries(babyId, offset, queryStyle)}`);
        queryStyle = queryStyle || 'json';
      } catch (err) {
        if (queryStyle === null && err.code === 400) {
          queryStyle = 'legacy';
          page = await api(`${colUrl(cfg.progressCollectionId)}?${encodeQueries(babyId, offset, 'legacy')}`);
        } else {
          throw err;
        }
      }
      const docs = page.documents || [];
      out.push(...docs);
      if (docs.length < PAGE) return out;
    }
  }

  /* ---- Shape conversion ------------------------------------------------- */

  const keyOf = (month, item) => `${month}::${item}`;

  // Rows -> the two progress buckets the app renders from.
  function rowsToBuckets(rows) {
    const progress = {};
    const phrases = {};
    for (const r of rows) {
      const rec = { status: r.status, updatedISO: r.updatedAt || '' };
      if (r.startedAt) rec.startedISO = r.startedAt;
      if (r.masteredAt) rec.masteredISO = r.masteredAt;
      (r.kind === 'phrase' ? phrases : progress)[keyOf(r.month, r.item)] = rec;
    }
    return { progress, phrases };
  }

  const touchedAt = (rec) => (rec && (rec.updatedISO || rec.masteredISO || rec.startedISO)) || '';

  function mergeBucket(mine = {}, theirs = {}) {
    const out = { ...mine };
    for (const [key, rec] of Object.entries(theirs)) {
      if (!out[key] || touchedAt(rec) > touchedAt(out[key])) out[key] = rec;
    }
    return out;
  }

  function countStatuses(bucket = {}) {
    let teaching = 0, mastered = 0;
    for (const rec of Object.values(bucket)) {
      if (rec.status === 'teaching') teaching++;
      else if (rec.status === 'mastered') mastered++;
    }
    return { teaching, mastered };
  }

  /* ---- Pull ------------------------------------------------------------- */

  async function pull({ quiet = false } = {}) {
    const state = getState();
    if (!CONFIGURED || !state) return null;
    const id = await resolveRecordId(state);
    if (!id) return null;
    if (!navigator.onLine) { setStatus({ state: 'offline' }); return null; }

    if (!quiet) setStatus({ state: 'syncing', recordId: id });
    try {
      const rows = await listRows(id);
      const remote = rowsToBuckets(rows);

      remoteSeen = {};
      for (const r of rows) remoteSeen[`${r.kind}|${keyOf(r.month, r.item)}`] = r.updatedAt || '';
      pulledFor = id;

      const merged = {
        ...state,
        progress: mergeBucket(state.progress, remote.progress),
        phrases: mergeBucket(state.phrases, remote.phrases),
      };
      // Only apply a merge that changed something, or every poll would save,
      // schedule a push, and the devices would write to each other forever.
      const same =
        JSON.stringify(merged.progress) === JSON.stringify(state.progress) &&
        JSON.stringify(merged.phrases) === JSON.stringify(state.phrases);
      if (!same) applyState(merged);

      setStatus({ state: 'ok', lastSyncISO: new Date().toISOString(), error: null, recordId: id, rows: rows.length });
      return merged;
    } catch (err) {
      setStatus({ state: 'error', error: err.message, recordId: id });
      return null;
    }
  }

  /* ---- Push ------------------------------------------------------------- */

  async function upsert(col, id, data) {
    try {
      await api(colUrl(col, id), { method: 'PATCH', body: JSON.stringify({ data }) });
    } catch (err) {
      if (err.code !== 404) throw err;
      try {
        await api(colUrl(col), { method: 'POST', body: JSON.stringify({ documentId: id, data }) });
      } catch (createErr) {
        // Another device created it in the gap — patch instead.
        if (createErr.code === 409) {
          await api(colUrl(col, id), { method: 'PATCH', body: JSON.stringify({ data }) });
        } else {
          throw createErr;
        }
      }
    }
  }

  async function push({ force = false } = {}) {
    const state = getState();
    if (!CONFIGURED || !state || !state.baby) return;
    const id = await resolveRecordId(state);
    if (!id) return;
    if (!navigator.onLine) { setStatus({ state: 'offline' }); return; }

    // Never write before reading: a freshly onboarded device must merge into
    // the shared record rather than replace it.
    if (!force && pulledFor !== id) {
      await pull({ quiet: true });
      if (pulledFor !== id) return;      // pull failed; retry on the next tick
      return push({ force: true });
    }

    const now = new Date().toISOString();
    try {
      setStatus({ state: 'syncing', recordId: id });

      // One row per changed word/phrase.
      let written = 0;
      for (const [kind, bucket] of [['word', state.progress || {}], ['phrase', state.phrases || {}]]) {
        for (const [key, rec] of Object.entries(bucket)) {
          const seenKey = `${kind}|${key}`;
          const stamp = touchedAt(rec);
          if (remoteSeen[seenKey] === stamp) continue;   // unchanged

          const [month, ...rest] = key.split('::');
          const item = rest.join('::');
          await upsert(cfg.progressCollectionId, await rowId(id, kind, month, item), {
            babyId: id,
            kind,
            month: Number(month),
            item,
            status: rec.status || 'todo',
            startedAt: rec.startedISO || null,
            masteredAt: rec.masteredISO || null,
            updatedAt: stamp || now,
          });
          remoteSeen[seenKey] = stamp;
          written++;
        }
      }

      // The baby row carries live counts so the console shows progress at a
      // glance without opening every row.
      const w = countStatuses(state.progress);
      const p = countStatuses(state.phrases);
      await upsert(cfg.babiesCollectionId, id, {
        name: (state.baby.name || '').slice(0, 128),
        birth: state.baby.birthISO,
        createdAt: state.createdISO || now,
        updatedAt: now,
        wordsTeaching: w.teaching,
        wordsMastered: w.mastered,
        phrasesTeaching: p.teaching,
        phrasesMastered: p.mastered,
      });

      setStatus({
        state: 'ok', lastSyncISO: now, error: null, recordId: id,
        rows: Object.keys(remoteSeen).length,
      });
      return written;
    } catch (err) {
      setStatus({ state: 'error', error: err.message, recordId: id });
    }
  }

  function schedulePush() {
    if (!CONFIGURED) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => push(), PUSH_DEBOUNCE_MS);
  }

  async function syncNow() {
    await pull();
    await push();
  }

  /* ---- Self test -------------------------------------------------------- */

  // Runs the same requests the app makes and reports each step. Worth having
  // in the browser as well as in scripts/verify-appwrite.js, because CORS and
  // the Web platform registration can only fail here.
  async function selfTest() {
    const steps = [];
    const step = (label, okay, detail) => { steps.push({ label, ok: okay, detail }); return okay; };

    if (!CONFIGURED) {
      step('Configured', false, 'js/config.js has a blank field — sync is off');
      return steps;
    }
    step('Configured', true, `${cfg.databaseId} · ${cfg.babiesCollectionId} / ${cfg.progressCollectionId}`);

    // 1. Reachability + CORS. A 404 for a missing document is the success case,
    // so it must not fall into the early return with the genuine failures.
    let reachable = false;
    try {
      await api(colUrl(cfg.progressCollectionId, '__does_not_exist__'));
      reachable = step('Reachable', true, 'endpoint answered');
    } catch (err) {
      const why = `${err.message || ''}`.toLowerCase();
      if (err.code === 404 && /collection/.test(why)) {
        step('Collection exists', false, `"${cfg.progressCollectionId}" not found — run npm run setup:appwrite`);
      } else if (err.code === 404 && /database/.test(why)) {
        step('Database exists', false, `"${cfg.databaseId}" not found — run npm run setup:appwrite`);
      } else if (err.code === 404) {
        reachable = step('Reachable, read allowed', true, 'endpoint and ids resolve');
      } else if (err.code === 401) {
        step('Read permission', false, 'grant read("any") on the collections');
      } else if (!err.code) {
        step('Reachable', false,
          'Blocked before a reply — almost always CORS. Add this site\'s hostname under ' +
          'Project settings → Platforms → Web app.');
      } else {
        step('Reachable', false, err.message);
      }
    }
    if (!reachable) return steps;

    // 2. Write + read back + query, using a clearly-labelled throwaway row.
    const testId = 'p__selftest__browser';
    const stamp = new Date().toISOString();
    try {
      await upsert(cfg.progressCollectionId, testId, {
        babyId: '__selftest__', kind: 'word', month: 0, item: 'Self test',
        status: 'todo', startedAt: null, masteredAt: null, updatedAt: stamp,
      });
      step('Write', true, 'created/updated a test row');
    } catch (err) {
      step('Write', false, err.code === 401 ? 'grant create("any") and update("any")' : err.message);
      return steps;
    }

    try {
      const back = await api(colUrl(cfg.progressCollectionId, testId));
      step('Read back', back.updatedAt === stamp, back.updatedAt === stamp ? 'fields persisted' : 'row read but fields did not persist');
    } catch (err) {
      step('Read back', false, err.message);
    }

    try {
      const found = await listRows('__selftest__');
      step('Query by baby', found.length > 0,
        found.length ? `${found.length} row(s), ${queryStyle} query format` : 'filter matched nothing');
    } catch (err) {
      step('Query by baby', false, err.message);
    }

    // 3. Confirm the real record round-trips too.
    const state = getState();
    const id = await resolveRecordId(state);
    if (id) {
      try {
        const rows = await listRows(id);
        step('Your record', true, `${id} — ${rows.length} row(s) stored`);
      } catch (err) {
        step('Your record', false, err.message);
      }
    }
    return steps;
  }

  /* ---- Lifecycle -------------------------------------------------------- */

  function start(getter, applier) {
    getState = getter;
    applyState = applier;
    if (!CONFIGURED || started) return;
    started = true;

    syncNow();
    setInterval(() => { if (!document.hidden) pull({ quiet: true }); }, PULL_INTERVAL_MS);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) pull({ quiet: true }); });
    window.addEventListener('online', () => syncNow());
    window.addEventListener('offline', () => setStatus({ state: 'offline' }));
  }

  window.Sync = {
    configured: () => CONFIGURED,
    status: () => status,
    resolveRecordId,
    start,
    pull,
    push,
    syncNow,
    selfTest,
    schedulePush,
    // Called when the family code changes: forget what we knew and re-sync.
    reset: () => { pulledFor = null; remoteSeen = {}; currentId = null; currentIdInput = null; },
    onStatus: (fn) => { listeners.push(fn); },
  };
})();
