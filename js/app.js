/*
 * app.js — the controller. Ties the curriculum (data.js) and the persistence
 * layer (storage.js) to the DOM. No framework, so the logic stays portable:
 * the age→stage→word-of-the-day rules below are exactly what you'd re-implement
 * in Swift when going native.
 */

(function () {
  'use strict';

  const CURRICULUM = window.CURRICULUM;
  const Store = window.Store;
  let state = Store.loadState();

  // ---- Age & stage maths -------------------------------------------------

  function ageInMonths(birthISO, on = new Date()) {
    const birth = new Date(birthISO);
    let months =
      (on.getFullYear() - birth.getFullYear()) * 12 +
      (on.getMonth() - birth.getMonth());
    if (on.getDate() < birth.getDate()) months -= 1;
    return Math.max(0, months);
  }

  function ageLabel(birthISO) {
    const m = ageInMonths(birthISO);
    if (m < 1) {
      const days = Math.floor(
        (Date.now() - new Date(birthISO).getTime()) / 86400000
      );
      return `${Math.max(0, days)} day${days === 1 ? '' : 's'} old`;
    }
    if (m < 24) return `${m} month${m === 1 ? '' : 's'} old`;
    const years = Math.floor(m / 12);
    const rem = m % 12;
    return rem ? `${years}y ${rem}m old` : `${years} year${years === 1 ? '' : 's'} old`;
  }

  function stageForMonths(months) {
    // Find the stage whose window contains the age; clamp to the last stage
    // for older toddlers so the app keeps working past 36 months.
    for (const stage of CURRICULUM) {
      if (months >= stage.minMonths && months < stage.maxMonths) return stage;
    }
    return CURRICULUM[CURRICULUM.length - 1];
  }

  // ---- Word of the day ---------------------------------------------------

  // A deterministic day index so "today's word" is stable across reloads and
  // advances by one each calendar day.
  function dayIndex(date = new Date()) {
    return Math.floor(
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() /
        86400000
    );
  }

  // Pick the day's word: prefer a not-yet-mastered word in the current stage so
  // the app keeps surfacing fresh material, cycling deterministically by day.
  function wordOfTheDay(stage, date = new Date()) {
    const idx = dayIndex(date);
    const words = stage.words;
    const unmastered = words.filter((w) => {
      const p = Store.getProgress(state, stage.id, w.word);
      return p.status !== 'mastered';
    });
    const pool = unmastered.length ? unmastered : words;
    // Rotate through the pool by day so consecutive days differ.
    const chosen = pool[idx % pool.length];
    return chosen;
  }

  // ---- Rendering ---------------------------------------------------------

  const app = document.getElementById('app');

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') {
        node.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (v !== null && v !== undefined) {
        node.setAttribute(k, v);
      }
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined) continue;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  }

  function render() {
    app.innerHTML = '';
    if (!state.baby) {
      app.appendChild(renderOnboarding());
    } else {
      app.appendChild(renderHome());
    }
  }

  // ---- Onboarding --------------------------------------------------------

  function renderOnboarding() {
    let name = '';
    let birthISO = '';

    const nameInput = el('input', {
      type: 'text',
      placeholder: "Baby's name (optional)",
      class: 'field',
      oninput: (e) => (name = e.target.value.trim()),
    });

    const dateInput = el('input', {
      type: 'date',
      class: 'field',
      max: new Date().toISOString().slice(0, 10),
      oninput: (e) => (birthISO = e.target.value),
    });

    const start = el(
      'button',
      {
        class: 'btn btn-primary btn-block',
        onclick: () => {
          if (!birthISO) {
            dateInput.classList.add('field-error');
            return;
          }
          state.baby = { name: name || 'Baby', birthISO };
          if (!state.createdISO) state.createdISO = new Date().toISOString();
          Store.saveState(state);
          render();
        },
      },
      'Start learning →'
    );

    return el(
      'section',
      { class: 'onboard' },
      el('div', { class: 'onboard-hero' },
        el('div', { class: 'logo-badge', 'aria-hidden': 'true' }, '🍼'),
        el('h1', { class: 'onboard-title' }, 'Baby Word of the Day'),
        el('p', { class: 'onboard-sub' },
          'A daily, age-appropriate word to teach your little one — with ' +
          'simple ways to bring it to life, grounded in how babies actually ' +
          'learn to talk.')
      ),
      el('div', { class: 'card onboard-card' },
        el('label', { class: 'label' }, "Your baby's name"),
        nameInput,
        el('label', { class: 'label' }, "Date of birth"),
        dateInput,
        el('p', { class: 'hint' },
          'We use this only to pick the right words for their stage. ' +
          'Everything stays on your device.'),
        start
      )
    );
  }

  // ---- Home --------------------------------------------------------------

  function statusPill(status) {
    const map = {
      todo: ['To start', 'pill-todo'],
      teaching: ['Teaching', 'pill-teaching'],
      mastered: ['Mastered', 'pill-mastered'],
    };
    const [label, cls] = map[status] || map.todo;
    return el('span', { class: `pill ${cls}` }, label);
  }

  function renderWordCard(stage, word, opts = {}) {
    const progress = Store.getProgress(state, stage.id, word.word);
    const status = progress.status || 'todo';

    const cycle = () => {
      const next =
        status === 'todo' ? 'teaching' : status === 'teaching' ? 'mastered' : 'todo';
      Store.setStatus(state, stage.id, word.word, next);
      render();
    };

    const activities = el(
      'ul',
      { class: 'activities' },
      word.activities.map((a) => el('li', {}, a))
    );

    const actionLabel =
      status === 'todo'
        ? '✋ Start teaching this'
        : status === 'teaching'
        ? '✓ Mark as mastered'
        : '↺ Reset';

    return el(
      'article',
      { class: `card word-card ${opts.featured ? 'featured' : ''}` },
      opts.featured ? el('div', { class: 'featured-tag' }, '⭐ Today’s word') : null,
      el('div', { class: 'word-head' },
        el('div', {},
          el('h2', { class: 'word-title' }, word.word),
          el('div', { class: 'word-phon' },
            el('span', { class: 'ipa' }, word.ipa),
            el('span', { class: 'say' }, `“${word.say}”`))
        ),
        statusPill(status)
      ),
      el('div', { class: 'chips' },
        el('span', { class: 'chip' }, word.category),
        el('span', { class: 'chip chip-ghost' }, stage.label)
      ),
      el('p', { class: 'word-why' }, word.why),
      opts.featured
        ? el('div', { class: 'how' },
            el('h3', { class: 'how-title' }, `How to teach it (${ageLabel(state.baby.birthISO)})`),
            activities)
        : null,
      el('div', { class: 'word-actions' },
        el('button',
          { class: `btn ${status === 'mastered' ? 'btn-ghost' : 'btn-primary'}`, onclick: cycle },
          actionLabel)
      )
    );
  }

  function renderStats() {
    const all = CURRICULUM.flatMap((s) => s.words.map((w) => ({ s, w })));
    let teaching = 0;
    let mastered = 0;
    for (const { s, w } of all) {
      const p = Store.getProgress(state, s.id, w.word);
      if (p.status === 'teaching') teaching++;
      if (p.status === 'mastered') mastered++;
    }
    const total = all.length;
    const pct = Math.round((mastered / total) * 100);

    return el('div', { class: 'stats card' },
      el('div', { class: 'stat' },
        el('div', { class: 'stat-num' }, String(mastered)),
        el('div', { class: 'stat-label' }, 'Mastered')),
      el('div', { class: 'stat' },
        el('div', { class: 'stat-num' }, String(teaching)),
        el('div', { class: 'stat-label' }, 'Teaching')),
      el('div', { class: 'stat' },
        el('div', { class: 'stat-num' }, `${pct}%`),
        el('div', { class: 'stat-label' }, 'of library')),
      el('div', { class: 'progress-wrap' },
        el('div', { class: 'progress-bar', style: `width:${pct}%` }))
    );
  }

  let activeTab = 'today';
  let browseStageId = null;

  function renderHome() {
    const months = ageInMonths(state.baby.birthISO);
    const stage = stageForMonths(months);
    if (!browseStageId) browseStageId = stage.id;
    const todaysWord = wordOfTheDay(stage);

    const header = el('header', { class: 'top' },
      el('div', {},
        el('div', { class: 'greeting' }, `${state.baby.name}`),
        el('div', { class: 'age' }, `${ageLabel(state.baby.birthISO)} · ${stage.label}`)
      ),
      el('button', { class: 'icon-btn', title: 'Settings', onclick: () => (activeTab = 'settings', render()) }, '⚙️')
    );

    const tabs = el('nav', { class: 'tabs' },
      ['today', 'library', 'progress'].map((t) =>
        el('button',
          { class: `tab ${activeTab === t ? 'tab-active' : ''}`, onclick: () => (activeTab = t, render()) },
          t[0].toUpperCase() + t.slice(1))
      )
    );

    let body;
    if (activeTab === 'settings') body = renderSettings();
    else if (activeTab === 'progress') body = renderProgressTab();
    else if (activeTab === 'library') body = renderLibraryTab();
    else body = renderTodayTab(stage, todaysWord);

    return el('div', { class: 'home' }, header, tabs, body);
  }

  function renderTodayTab(stage, word) {
    const stageCard = el('div', { class: 'card stage-card' },
      el('div', { class: 'stage-headline' }, stage.headline),
      el('p', { class: 'stage-summary' }, stage.summary),
      el('div', { class: 'milestones' },
        el('div', { class: 'milestones-title' }, 'Around now, many babies…'),
        el('ul', {}, stage.milestones.map((m) => el('li', {}, m)))
      )
    );

    return el('div', { class: 'tab-body' },
      renderWordCard(stage, word, { featured: true }),
      stageCard
    );
  }

  function renderLibraryTab() {
    const selector = el('div', { class: 'stage-picker' },
      CURRICULUM.map((s) =>
        el('button',
          { class: `spill ${browseStageId === s.id ? 'spill-active' : ''}`, onclick: () => (browseStageId = s.id, render()) },
          s.label)
      )
    );
    const stage = CURRICULUM.find((s) => s.id === browseStageId) || CURRICULUM[0];
    const list = el('div', { class: 'tab-body' },
      stage.words.map((w) => renderWordCard(stage, w))
    );
    return el('div', {}, selector, list);
  }

  function renderProgressTab() {
    const rows = [];
    for (const stage of CURRICULUM) {
      const started = stage.words
        .map((w) => ({ w, p: Store.getProgress(state, stage.id, w.word) }))
        .filter(({ p }) => p.status && p.status !== 'todo');
      if (!started.length) continue;
      rows.push(
        el('div', { class: 'prog-stage' },
          el('div', { class: 'prog-stage-label' }, stage.label),
          started.map(({ w, p }) =>
            el('div', { class: 'prog-row' },
              el('span', { class: 'prog-word' }, w.word),
              statusPill(p.status))
          )
        )
      );
    }
    const body = rows.length
      ? rows
      : [el('p', { class: 'empty' }, 'No words started yet. Tap “Start teaching this” on today’s word to begin your checklist! 🌱')];

    return el('div', { class: 'tab-body' }, renderStats(), ...body);
  }

  function renderSettings() {
    const exportBtn = el('button',
      { class: 'btn btn-ghost btn-block', onclick: () => {
        const blob = new Blob([Store.exportState(state)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = el('a', { href: url, download: 'baby-word-progress.json' });
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
      } },
      '⬇️ Export progress (backup)');

    const fileInput = el('input', { type: 'file', accept: 'application/json', class: 'hidden-file',
      onchange: (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try { state = Store.importState(reader.result); activeTab = 'today'; render(); }
          catch { alert('That file could not be read.'); }
        };
        reader.readAsText(file);
      } });
    const importBtn = el('button',
      { class: 'btn btn-ghost btn-block', onclick: () => fileInput.click() },
      '⬆️ Import progress');

    const resetBtn = el('button',
      { class: 'btn btn-danger btn-block', onclick: () => {
        if (confirm('Reset everything, including your baby’s profile and all progress?')) {
          state = Store.resetState(); activeTab = 'today'; browseStageId = null; render();
        }
      } },
      'Reset app');

    return el('div', { class: 'tab-body' },
      el('div', { class: 'card' },
        el('h3', { class: 'how-title' }, 'Baby profile'),
        el('p', { class: 'hint' }, `${state.baby.name} · born ${new Date(state.baby.birthISO).toLocaleDateString()}`),
        el('button', { class: 'btn btn-ghost btn-block', onclick: () => {
          state.baby = null; Store.saveState(state); render();
        } }, 'Edit baby details')
      ),
      el('div', { class: 'card' },
        el('h3', { class: 'how-title' }, 'Your data'),
        el('p', { class: 'hint' }, 'Everything is stored privately on this device. Back it up or move it to a new device here.'),
        exportBtn, importBtn, fileInput
      ),
      el('div', { class: 'card' },
        el('h3', { class: 'how-title' }, 'About'),
        el('p', { class: 'hint' }, 'A structured, milestone-based head start for teaching your baby to talk. Guidance is general and not a substitute for advice from your paediatrician or speech-language therapist.'),
        resetBtn
      )
    );
  }

  // ---- Boot --------------------------------------------------------------

  render();

  // Register the service worker for offline / installable behaviour.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    });
  }
})();
