/*
 * sync.js — shared, cross-device progress via an Appwrite database.
 *
 * The idea: no accounts, no logins. The baby's name + date of birth IS the
 * key. Everyone who types "Sophia" and 23/01/2026 lands on the same document,
 * on any device.
 *
 *   recordId('Sophia', '2026-01-23')  ->  'sophia-2026-01-23'
 *
 * localStorage stays the source of truth for rendering (so the app is instant
 * and works offline); Appwrite is the shared copy that devices reconcile
 * against. Every write is debounced and pushed; pulls happen at startup, when
 * the tab regains focus, and on a slow timer.
 *
 * Only the shared parts of state are synced — baby, progress and phrases.
 * `settings` stay local on purpose: a reminder dismissed on one parent's phone
 * should not silence it on the other's.
 *
 * Uses the REST API directly via fetch so the app keeps zero dependencies.
 */

(function () {
  'use strict';

  const cfg = window.BABBLER_CONFIG || {};
  const CONFIGURED = !!(cfg.endpoint && cfg.projectId && cfg.databaseId && cfg.collectionId);

  const PULL_INTERVAL_MS = 60000;   // background refresh while the tab is open
  const PUSH_DEBOUNCE_MS = 1200;    // coalesce bursts of taps into one write

  let getState = () => null;
  let applyState = () => {};
  let listeners = [];
  let pushTimer = null;
  let started = false;
  // The record id we have successfully read (or confirmed absent) at least
  // once. Guards against a fresh device overwriting the shared record with its
  // own empty progress before it has seen what is already there.
  let pulledFor = null;

  const status = {
    state: CONFIGURED ? 'idle' : 'off',  // off|idle|syncing|ok|error|offline
    lastSyncISO: null,
    error: null,
    recordId: null,
  };

  function setStatus(patch) {
    Object.assign(status, patch);
    listeners.forEach((fn) => fn(status));
  }

  /* ---- Record identity -------------------------------------------------- */

  // Deterministic, human-readable document id. Appwrite ids allow
  // [a-zA-Z0-9._-], must not start with a special character, max 36 chars.
  function recordId(baby) {
    if (!baby || !baby.birthISO) return null;
    const slug = String(baby.name || '')
      .trim().toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // strip accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 20);
    return `${slug || 'baby'}-${baby.birthISO}`;
  }

  /* ---- REST helpers ----------------------------------------------------- */

  const docUrl = (id) =>
    `${cfg.endpoint}/databases/${cfg.databaseId}/collections/${cfg.collectionId}/documents${id ? '/' + id : ''}`;

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
      let detail = `${res.status}`;
      try { detail = (await res.json()).message || detail; } catch (_) {}
      const err = new Error(detail);
      err.code = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }

  /* ---- Merge ------------------------------------------------------------ */

  // Every progress record carries `updatedISO`, so merging is a per-entry
  // last-write-wins. That keeps a reset (which clears the other timestamps)
  // from being resurrected by a stale copy.
  const touchedAt = (rec) =>
    (rec && (rec.updatedISO || rec.masteredISO || rec.startedISO)) || '';

  function mergeBucket(mine = {}, theirs = {}) {
    const out = { ...mine };
    for (const [key, rec] of Object.entries(theirs)) {
      if (!out[key] || touchedAt(rec) > touchedAt(out[key])) out[key] = rec;
    }
    return out;
  }

  function mergeStates(local, remote) {
    if (!remote) return local;
    return {
      ...local,
      // Keep whichever profile was created first; they describe the same baby.
      createdISO: [local.createdISO, remote.createdISO].filter(Boolean).sort()[0] || local.createdISO,
      progress: mergeBucket(local.progress, remote.progress),
      phrases: mergeBucket(local.phrases, remote.phrases),
    };
  }

  /* ---- Pull / push ------------------------------------------------------ */

  function sharedPayload(state) {
    return {
      progress: state.progress || {},
      phrases: state.phrases || {},
      createdISO: state.createdISO || null,
    };
  }

  async function pull({ quiet = false } = {}) {
    const state = getState();
    const id = recordId(state && state.baby);
    if (!CONFIGURED || !id) return null;
    if (!navigator.onLine) { setStatus({ state: 'offline' }); return null; }

    if (!quiet) setStatus({ state: 'syncing', recordId: id });
    try {
      const doc = await api(docUrl(id));
      let remote = null;
      try { remote = JSON.parse(doc.data || '{}'); } catch (_) { remote = null; }

      pulledFor = id;
      const merged = mergeStates(state, remote);
      // Only hand the merge back if it actually changed something. Applying
      // unconditionally would save -> schedule a push on every poll, so the
      // two devices would ping-pong writes forever with nothing to say.
      if (JSON.stringify(sharedPayload(merged)) !== JSON.stringify(sharedPayload(state))) {
        applyState(merged);
      }
      setStatus({ state: 'ok', lastSyncISO: new Date().toISOString(), error: null, recordId: id });
      return merged;
    } catch (err) {
      if (err.code === 404) {
        // No shared record yet — this device creates it.
        pulledFor = id;
        setStatus({ state: 'ok', lastSyncISO: new Date().toISOString(), error: null, recordId: id });
        await push({ force: true });
        return null;
      }
      setStatus({ state: 'error', error: err.message, recordId: id });
      return null;
    }
  }

  async function push({ force = false } = {}) {
    const state = getState();
    const id = recordId(state && state.baby);
    if (!CONFIGURED || !id) return;
    if (!navigator.onLine) { setStatus({ state: 'offline' }); return; }

    // First write for this record on this device? Read the shared copy first
    // and merge, so we add to it rather than replace it. This is what stops a
    // second phone, freshly onboarded, from wiping the first phone's progress.
    if (!force && pulledFor !== id) {
      await pull({ quiet: true });
      if (pulledFor !== id) return;   // pull failed; try again on the next tick
      return push({ force: true });
    }

    const data = {
      name: (state.baby.name || '').slice(0, 128),
      birth: state.baby.birthISO,
      data: JSON.stringify(sharedPayload(state)),
      updatedAt: new Date().toISOString(),
    };

    if (!force) setStatus({ state: 'syncing', recordId: id });
    try {
      await api(docUrl(id), { method: 'PATCH', body: JSON.stringify({ data }) });
      setStatus({ state: 'ok', lastSyncISO: new Date().toISOString(), error: null, recordId: id });
    } catch (err) {
      if (err.code === 404) {
        try {
          await api(docUrl(), { method: 'POST', body: JSON.stringify({ documentId: id, data }) });
          setStatus({ state: 'ok', lastSyncISO: new Date().toISOString(), error: null, recordId: id });
          return;
        } catch (createErr) {
          // 409 means another device created it between our GET and POST.
          if (createErr.code === 409) return push({ force: true });
          setStatus({ state: 'error', error: createErr.message, recordId: id });
          return;
        }
      }
      setStatus({ state: 'error', error: err.message, recordId: id });
    }
  }

  function schedulePush() {
    if (!CONFIGURED) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => push(), PUSH_DEBOUNCE_MS);
  }

  // Pull, then push, so a device that has been offline both receives and
  // contributes. Used at startup and by the manual "Sync now" button.
  async function syncNow() {
    await pull();
    await push();
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
    recordId,
    start,
    pull,
    push,
    syncNow,
    schedulePush,
    onStatus: (fn) => { listeners.push(fn); },
    // exported for tests
    _merge: mergeStates,
  };
})();
