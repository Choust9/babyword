/*
 * storage.js — persistence layer over localStorage, plus a shared
 * cross-device sync layer (netlify/functions/sync.mts + Netlify Blobs).
 *
 * Everything the app remembers lives under one namespaced key so the whole
 * state exports as a single JSON blob. When this migrates to native iOS this
 * is the one module you swap: the data shape stays identical, only the backing
 * store changes (UserDefaults, Core Data, or CloudKit for cross-device sync).
 *
 * Progress is keyed by MONTH rather than by stage, matching the month-by-month
 * curriculum:
 *   words:   "12::Mummy"   ->  { status, startedISO, masteredISO }
 *   phrases: "18::Daddy go" -> { status, startedISO, masteredISO }
 *
 * status is one of: 'todo' | 'teaching' | 'mastered'
 *
 * Sync model: both partners' devices read and write one shared record on the
 * backend (there's no per-user login). `updatedISO` is a last-write-wins
 * clock — whichever device saved most recently wins a sync, so this favours
 * simplicity over conflict resolution. Fine for a couple taking turns marking
 * words; a genuine concurrent edit on both phones at the same instant would
 * have the later one win outright.
 */

const STORAGE_KEY = 'babyWordOfTheDay.v2';
const LEGACY_KEY = 'babyWordOfTheDay.v1';
const SYNC_ENDPOINT = '/api/sync';
const SYNC_PUSH_DELAY_MS = 1500;

const DEFAULT_STATE = {
  baby: null,          // { name, birthISO }
  progress: {},        // word key -> record
  phrases: {},         // phrase key -> record
  history: {},         // dateISO -> word key surfaced that day
  createdISO: null,
  updatedISO: null, // last time this state was saved, anywhere — drives sync
};

function freshState() {
  return { ...DEFAULT_STATE, progress: {}, phrases: {}, history: {}, createdISO: new Date().toISOString() };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...freshState(), ...JSON.parse(raw) };

    // One-time migration from the quarter-based v1 layout. v1 keys looked like
    // "babbling::Red"; we keep the baby profile and drop the stage-keyed
    // progress, since words are now keyed by month.
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const old = JSON.parse(legacy);
      const migrated = freshState();
      if (old.baby) migrated.baby = old.baby;
      if (old.createdISO) migrated.createdISO = old.createdISO;
      saveState(migrated);
      return migrated;
    }
    return freshState();
  } catch (err) {
    console.warn('Could not read saved state, starting fresh.', err);
    return freshState();
  }
}

function saveState(state, { skipPush } = {}) {
  state.updatedISO = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Could not save state.', err);
  }
  if (!skipPush) schedulePush(state);
}

// ---- Cross-device sync (shared state, last-write-wins by updatedISO) ------

let pushTimer = null;

function pushRemote(state) {
  fetch(SYNC_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  }).catch((err) => console.warn('Could not sync to the other device.', err));
}

function schedulePush(state) {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => pushRemote(state), SYNC_PUSH_DELAY_MS);
}

async function pullRemote() {
  try {
    const res = await fetch(SYNC_ENDPOINT);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Could not reach the other device\'s data.', err);
    return null;
  }
}

// Call once at boot, and again whenever the app resumes (e.g. reopened from
// the home screen), to pick up anything saved from the other person's device.
// Returns the state that should now be considered current.
async function syncOnLoad(state) {
  const remote = await pullRemote();
  if (!remote) return state;
  if (!state.updatedISO || (remote.updatedISO && remote.updatedISO > state.updatedISO)) {
    const merged = { ...DEFAULT_STATE, ...remote };
    saveState(merged, { skipPush: true });
    return merged;
  }
  if (remote.updatedISO !== state.updatedISO) pushRemote(state);
  return state;
}

const wordKey = (month, word) => `${month}::${word}`;

function getProgress(state, month, word) {
  return state.progress[wordKey(month, word)] || { status: 'todo' };
}

function getPhrase(state, month, phrase) {
  return state.phrases[wordKey(month, phrase)] || { status: 'todo' };
}

function setStatusIn(bucket, key, status) {
  const now = new Date().toISOString();
  const existing = bucket[key] || {};
  const next = { ...existing, status };
  if (status === 'teaching' && !existing.startedISO) next.startedISO = now;
  if (status === 'mastered') {
    if (!next.startedISO) next.startedISO = now;
    if (!existing.masteredISO) next.masteredISO = now;
  }
  if (status === 'todo') {
    delete next.startedISO;
    delete next.masteredISO;
  }
  bucket[key] = next;
  return next;
}

function setStatus(state, month, word, status) {
  const next = setStatusIn(state.progress, wordKey(month, word), status);
  saveState(state);
  return next;
}

function setPhraseStatus(state, month, phrase, status) {
  const next = setStatusIn(state.phrases, wordKey(month, phrase), status);
  saveState(state);
  return next;
}

/* ---- Aggregates used by the dashboard --------------------------------- */

// Roll the whole library up into the numbers the dashboard displays.
function summarise(state, months, phonemes) {
  const out = {
    wordsMastered: 0, wordsTeaching: 0, wordsTotal: 0,
    phrasesMastered: 0, phrasesTeaching: 0, phrasesTotal: 0,
    byCategory: {},        // category -> { mastered, teaching, total }
    sounds: {},            // phoneme key -> { mastered, total }
    soundsPractised: 0,    // distinct phonemes with >=1 word started
    recent: [],            // most recently touched entries, newest first
  };

  for (const plan of months) {
    for (const word of plan.words) {
      const rec = getProgress(state, plan.m, word.w);
      out.wordsTotal++;
      const cat = (out.byCategory[word.c] = out.byCategory[word.c] || { mastered: 0, teaching: 0, total: 0 });
      cat.total++;
      const snd = (out.sounds[word.focus] = out.sounds[word.focus] || { mastered: 0, started: 0, total: 0 });
      snd.total++;

      if (rec.status === 'mastered') { out.wordsMastered++; cat.mastered++; snd.mastered++; snd.started++; }
      else if (rec.status === 'teaching') { out.wordsTeaching++; cat.teaching++; snd.started++; }

      if (rec.startedISO) {
        out.recent.push({ kind: 'word', label: word.w, month: plan.m, status: rec.status, at: rec.masteredISO || rec.startedISO });
      }
    }
    for (const phrase of plan.phrases || []) {
      const rec = getPhrase(state, plan.m, phrase.p);
      out.phrasesTotal++;
      if (rec.status === 'mastered') out.phrasesMastered++;
      else if (rec.status === 'teaching') out.phrasesTeaching++;
      if (rec.startedISO) {
        out.recent.push({ kind: 'phrase', label: phrase.p, month: plan.m, status: rec.status, at: rec.masteredISO || rec.startedISO });
      }
    }
  }

  out.soundsPractised = Object.values(out.sounds).filter((s) => s.started > 0).length;
  out.soundsTotal = Object.keys(phonemes || {}).length;
  out.recent.sort((a, b) => String(b.at).localeCompare(String(a.at)));
  return out;
}

// Progress for one month's plan only — drives the ring on the dashboard.
function monthProgress(state, plan) {
  let mastered = 0, teaching = 0;
  for (const word of plan.words) {
    const s = getProgress(state, plan.m, word.w).status;
    if (s === 'mastered') mastered++;
    else if (s === 'teaching') teaching++;
  }
  return { mastered, teaching, total: plan.words.length };
}

function exportState(state) { return JSON.stringify(state, null, 2); }

function importState(json) {
  const merged = { ...freshState(), ...JSON.parse(json) };
  saveState(merged);
  return merged;
}

function resetState() {
  const fresh = freshState();
  saveState(fresh);
  return fresh;
}

window.Store = {
  loadState, saveState, wordKey,
  getProgress, getPhrase, setStatus, setPhraseStatus,
  summarise, monthProgress,
  exportState, importState, resetState,
  syncOnLoad,
};
