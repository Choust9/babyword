/*
 * storage.js — persistence layer over localStorage.
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
 */

// Deliberately keeps the original key across the rename to Babbler —
// changing it would orphan every existing user's saved progress.
const STORAGE_KEY = 'babyWordOfTheDay.v2';
const LEGACY_KEY = 'babyWordOfTheDay.v1';

// User-configurable settings. `bannerDismissed` holds a YYYY-MM-DD stamp so the
// daily reminder shows once per day and stays gone once dismissed.
const DEFAULT_SETTINGS = {
  dailyBanner: true,
  bannerTime: '09:00',
  bannerDismissed: null,
};

const DEFAULT_STATE = {
  baby: null,          // { name, birthISO }
  // Optional shared secret that scopes the sync record. Stays on this device
  // and is never synced — it is the key, so uploading it would defeat it.
  familyCode: '',
  progress: {},        // word key -> record
  phrases: {},         // phrase key -> record
  history: {},         // dateISO -> word key surfaced that day
  settings: null,      // filled from DEFAULT_SETTINGS on load
  createdISO: null,
};

function freshState() {
  return {
    ...DEFAULT_STATE,
    progress: {}, phrases: {}, history: {},
    settings: { ...DEFAULT_SETTINGS },
    createdISO: new Date().toISOString(),
  };
}

// Merge stored state over the defaults, and settings separately so a state
// saved before a new setting existed still picks up that setting's default.
function hydrate(stored) {
  const base = freshState();
  return { ...base, ...stored, settings: { ...DEFAULT_SETTINGS, ...(stored.settings || {}) } };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return hydrate(JSON.parse(raw));

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

const saveListeners = [];

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Could not save state.', err);
  }
  saveListeners.forEach((fn) => { try { fn(state); } catch (e) { console.warn(e); } });
}

// Called after every save — used by sync.js to schedule a debounced push.
function onSave(fn) { saveListeners.push(fn); }

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
  // `updatedISO` is stamped on EVERY write, including a reset back to 'todo'.
  // Cross-device merging is per-entry last-write-wins on this field, so
  // without it a reset would be resurrected by a stale copy from elsewhere.
  const next = { ...existing, status, updatedISO: now };
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

function setSetting(state, key, value) {
  state.settings = { ...state.settings, [key]: value };
  saveState(state);
  return state.settings;
}

function exportState(state) { return JSON.stringify(state, null, 2); }

function importState(json) {
  const merged = hydrate(JSON.parse(json));
  saveState(merged);
  return merged;
}

function resetState() {
  const fresh = freshState();
  saveState(fresh);
  return fresh;
}

window.Store = {
  loadState, saveState, onSave, wordKey,
  getProgress, getPhrase, setStatus, setPhraseStatus,
  summarise, monthProgress, setSetting,
  exportState, importState, resetState,
};
