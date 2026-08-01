/*
 * storage.js — a tiny persistence layer over localStorage.
 *
 * Everything the app remembers (baby profile + word progress) lives under a
 * single namespaced key so the whole state can be exported/imported as one
 * JSON blob. When this app is migrated to native iOS, this is the one module
 * you swap: the shape of the data stays identical, only the backing store
 * changes (UserDefaults, a Core Data store, or CloudKit for cross-device sync).
 */

const STORAGE_KEY = 'babyWordOfTheDay.v1';

const DEFAULT_STATE = {
  baby: null, // { name, birthISO }
  // progress maps "stageId::word" -> { status, startedISO, masteredISO, note }
  // status is one of: 'todo' | 'teaching' | 'mastered'
  progress: {},
  history: {}, // dateISO -> "stageId::word" that was surfaced that day
  createdISO: null,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE, createdISO: new Date().toISOString() };
    const parsed = JSON.parse(raw);
    // Merge to tolerate older/newer shapes gracefully.
    return { ...DEFAULT_STATE, ...parsed };
  } catch (err) {
    console.warn('Could not read saved state, starting fresh.', err);
    return { ...DEFAULT_STATE, createdISO: new Date().toISOString() };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Could not save state.', err);
  }
}

// Stable key for a word within a stage.
function wordKey(stageId, word) {
  return `${stageId}::${word}`;
}

function getProgress(state, stageId, word) {
  return state.progress[wordKey(stageId, word)] || { status: 'todo' };
}

function setStatus(state, stageId, word, status) {
  const key = wordKey(stageId, word);
  const now = new Date().toISOString();
  const existing = state.progress[key] || {};
  const next = { ...existing, status };
  if (status === 'teaching' && !existing.startedISO) next.startedISO = now;
  if (status === 'mastered' && !existing.masteredISO) next.masteredISO = now;
  if (status === 'todo') {
    delete next.startedISO;
    delete next.masteredISO;
  }
  state.progress[key] = next;
  saveState(state);
  return next;
}

function setNote(state, stageId, word, note) {
  const key = wordKey(stageId, word);
  const existing = state.progress[key] || { status: 'todo' };
  state.progress[key] = { ...existing, note };
  saveState(state);
}

// Export the whole state as a downloadable JSON string (backup / device move).
function exportState(state) {
  return JSON.stringify(state, null, 2);
}

function importState(json) {
  const parsed = JSON.parse(json);
  const merged = { ...DEFAULT_STATE, ...parsed };
  saveState(merged);
  return merged;
}

function resetState() {
  const fresh = { ...DEFAULT_STATE, createdISO: new Date().toISOString() };
  saveState(fresh);
  return fresh;
}

window.Store = {
  loadState,
  saveState,
  wordKey,
  getProgress,
  setStatus,
  setNote,
  exportState,
  importState,
  resetState,
};
