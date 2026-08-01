/*
 * app.js — the controller.
 *
 * Ties the month-by-month curriculum (data.js), the phonics engine
 * (phonics.js) and persistence (storage.js) to the DOM. Deliberately
 * framework-free so the rules below port directly to Swift:
 *
 *   ageInMonths(birth)          whole months between two dates
 *   planForMonth(months)        the month plan (clamped to 0..36)
 *   wordOfTheDay(plan, date)    deterministic per-day pick, skipping mastered
 */

(function () {
  'use strict';

  const { MONTHS, STAGE_BANDS, PHONEMES, TECHNIQUES, BAND_LABEL, Store } = window;
  let state = Store.loadState();
  const MAX_MONTH = MONTHS[MONTHS.length - 1].m;

  // ---- Age & plan selection ---------------------------------------------

  function ageInMonths(birthISO, on = new Date()) {
    const birth = new Date(birthISO);
    let months = (on.getFullYear() - birth.getFullYear()) * 12 + (on.getMonth() - birth.getMonth());
    if (on.getDate() < birth.getDate()) months -= 1;
    return Math.max(0, months);
  }

  function ageLabel(birthISO) {
    const m = ageInMonths(birthISO);
    if (m < 1) {
      const days = Math.floor((Date.now() - new Date(birthISO).getTime()) / 86400000);
      const weeks = Math.floor(days / 7);
      if (days < 14) return `${Math.max(0, days)} day${days === 1 ? '' : 's'} old`;
      return `${weeks} weeks old`;
    }
    if (m < 24) return `${m} month${m === 1 ? '' : 's'} old`;
    const years = Math.floor(m / 12);
    const rem = m % 12;
    return rem ? `${years} yr ${rem} mo` : `${years} years old`;
  }

  const planForMonth = (m) => MONTHS[Math.min(Math.max(m, 0), MAX_MONTH)];

  function bandFor(m) {
    return STAGE_BANDS.find((b) => m >= b.min && m < b.max) || STAGE_BANDS[STAGE_BANDS.length - 1];
  }

  // ---- Word of the day ---------------------------------------------------

  const dayIndex = (d = new Date()) =>
    Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000);

  // Prefer a word not yet mastered so the app keeps surfacing fresh material,
  // rotating deterministically by calendar day.
  function wordOfTheDay(plan, date = new Date()) {
    const unmastered = plan.words.filter((w) => Store.getProgress(state, plan.m, w.w).status !== 'mastered');
    const pool = unmastered.length ? unmastered : plan.words;
    return pool[dayIndex(date) % pool.length];
  }

  // ---- Tiny DOM helper ---------------------------------------------------

  const app = document.getElementById('app');

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined) continue;
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v);
    }
    for (const c of children.flat()) {
      if (c === null || c === undefined || c === false) continue;
      node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    }
    return node;
  }

  const svgEl = (tag, attrs = {}) => {
    const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  };

  // ---- View state --------------------------------------------------------

  let activeTab = 'today';
  let browseMonth = null;

  function render() {
    const scroll = window.scrollY;
    app.innerHTML = '';
    app.appendChild(state.baby ? renderHome() : renderOnboarding());
    window.scrollTo(0, scroll);
  }

  // ---- Onboarding --------------------------------------------------------

  function renderOnboarding() {
    let name = '';
    let birthISO = '';

    const nameInput = el('input', { type: 'text', placeholder: "Baby's name (optional)", class: 'field',
      oninput: (e) => (name = e.target.value.trim()) });
    const dateInput = el('input', { type: 'date', class: 'field', max: new Date().toISOString().slice(0, 10),
      oninput: (e) => { birthISO = e.target.value; dateInput.classList.remove('field-error'); } });

    const start = el('button', { class: 'btn btn-primary btn-block', onclick: () => {
      if (!birthISO) return dateInput.classList.add('field-error');
      state.baby = { name: name || 'Baby', birthISO };
      state.createdISO = state.createdISO || new Date().toISOString();
      Store.saveState(state);
      render();
    } }, 'Start learning →');

    return el('section', { class: 'onboard' },
      el('div', { class: 'onboard-hero' },
        el('div', { class: 'logo-badge', 'aria-hidden': 'true' }, '🍼'),
        el('h1', { class: 'onboard-title' }, 'Baby Word of the Day'),
        el('p', { class: 'onboard-sub' },
          'A daily, age-appropriate word to teach your little one — with the ' +
          'phonics to pronounce it and simple ways to bring it to life.')),
      el('div', { class: 'card onboard-card' },
        el('label', { class: 'label' }, "Your baby's name"), nameInput,
        el('label', { class: 'label' }, 'Date of birth'), dateInput,
        el('p', { class: 'hint' }, 'We use this to pick the right month plan. Everything stays on your device.'),
        start),
      el('p', { class: 'foot-note' }, `${MONTHS.length} monthly plans · ${MONTHS.reduce((n, m) => n + m.words.length, 0)} words · grounded in speech-development research`));
  }

  // ---- Shared pieces -----------------------------------------------------

  function statusPill(status) {
    const map = { todo: ['To start', 'pill-todo'], teaching: ['Teaching', 'pill-teaching'], mastered: ['Mastered', 'pill-mastered'] };
    const [label, cls] = map[status] || map.todo;
    return el('span', { class: `pill ${cls}` }, label);
  }

  const nextStatus = (s) => (s === 'todo' ? 'teaching' : s === 'teaching' ? 'mastered' : 'todo');

  // The phonics coaching block — the heart of "how do I actually say this?".
  function renderPhonics(word) {
    const p = PHONEMES[word.focus];
    if (!p) return null;
    return el('div', { class: 'phonics' },
      el('div', { class: 'phonics-head' },
        el('h3', { class: 'how-title' }, '🗣️ How to say it'),
        el('span', { class: `band band-${p.band}` }, BAND_LABEL[p.band])),
      el('div', { class: 'say-row' },
        el('div', { class: 'say-big' }, word.say),
        el('div', { class: 'say-ipa' }, word.ipa)),
      el('div', { class: 'ph-target' },
        el('div', { class: 'ph-target-label' }, 'Focus sound'),
        el('div', { class: 'ph-target-name' }, `${p.ipa} — ${p.name}`),
        el('div', { class: 'ph-target-age' }, `Most children say this clearly ${p.byAge}`)),
      el('div', { class: 'ph-how' },
        el('div', { class: 'ph-how-title' }, 'What your mouth does'),
        el('p', { class: 'ph-how-body' }, p.how),
        el('div', { class: 'ph-mouth' }, p.mouth)),
      p.contrast && p.contrast.length
        ? el('div', { class: 'ph-tip' }, el('strong', {}, 'Try this: '), p.contrast[0])
        : null);
  }

  function renderTechniques(plan) {
    return el('div', { class: 'card' },
      el('h3', { class: 'how-title' }, '🎯 Techniques that matter this month'),
      el('div', { class: 'tech-list' },
        plan.techniques.map((key) => {
          const t = TECHNIQUES[key];
          if (!t) return null;
          let open = false;
          const body = el('p', { class: 'tech-detail hidden' }, t.detail);
          const cite = el('div', { class: 'tech-cite hidden' }, `Evidence: ${t.cite}`);
          return el('div', { class: 'tech', onclick: () => {
            open = !open;
            body.classList.toggle('hidden', !open);
            cite.classList.toggle('hidden', !open);
          } },
            el('div', { class: 'tech-head' },
              el('span', { class: 'tech-icon' }, t.icon),
              el('div', {},
                el('div', { class: 'tech-name' }, t.name),
                el('div', { class: 'tech-short' }, t.short)),
              el('span', { class: 'tech-chev' }, '›')),
            body, cite);
        })));
  }

  function renderWordCard(plan, word, opts = {}) {
    const status = Store.getProgress(state, plan.m, word.w).status || 'todo';
    const cycle = () => { Store.setStatus(state, plan.m, word.w, nextStatus(status)); render(); };
    const actionLabel = status === 'todo' ? '✋ Start teaching this' : status === 'teaching' ? '✓ Mark as mastered' : '↺ Reset';

    return el('article', { class: `card word-card ${opts.featured ? 'featured' : ''}` },
      opts.featured ? el('div', { class: 'featured-tag' }, "⭐ Today's word") : null,
      el('div', { class: 'word-head' },
        el('div', {},
          el('h2', { class: 'word-title' }, word.w),
          !opts.featured ? el('div', { class: 'say-inline' }, `${word.say} · ${word.ipa}`) : null),
        statusPill(status)),
      el('div', { class: 'chips' },
        el('span', { class: 'chip' }, word.c),
        el('span', { class: 'chip chip-ghost' }, `Month ${plan.m}`),
        PHONEMES[word.focus] ? el('span', { class: 'chip chip-sound' }, PHONEMES[word.focus].ipa) : null),
      el('p', { class: 'word-why' }, word.why),
      opts.featured ? renderPhonics(word) : null,
      opts.featured
        ? el('div', { class: 'how' },
            el('h3', { class: 'how-title' }, '👶 Do this today'),
            el('ul', { class: 'activities' }, word.acts.map((a) => el('li', {}, a))))
        : null,
      el('div', { class: 'word-actions' },
        el('button', { class: `btn ${status === 'mastered' ? 'btn-ghost' : 'btn-primary'}`, onclick: cycle }, actionLabel)));
  }

  function renderPhraseCard(plan, phrase) {
    const status = Store.getPhrase(state, plan.m, phrase.p).status || 'todo';
    const cycle = () => { Store.setPhraseStatus(state, plan.m, phrase.p, nextStatus(status)); render(); };
    return el('div', { class: 'card phrase-card' },
      el('div', { class: 'word-head' },
        el('div', {},
          el('div', { class: 'phrase-text' }, `“${phrase.p}”`),
          el('div', { class: 'phrase-pattern' }, phrase.pattern)),
        statusPill(status)),
      el('p', { class: 'word-why' }, phrase.tip),
      el('button', { class: `btn btn-block ${status === 'mastered' ? 'btn-ghost' : 'btn-primary'}`, onclick: cycle },
        status === 'todo' ? '✋ Start modelling this' : status === 'teaching' ? '✓ They said it!' : '↺ Reset'));
  }

  // ---- Home shell --------------------------------------------------------

  function renderHome() {
    const months = ageInMonths(state.baby.birthISO);
    const plan = planForMonth(months);
    if (browseMonth === null) browseMonth = plan.m;

    const header = el('header', { class: 'top' },
      el('div', {},
        el('div', { class: 'greeting' }, state.baby.name),
        el('div', { class: 'age' }, `${ageLabel(state.baby.birthISO)} · ${bandFor(months).label}`)),
      el('button', { class: 'icon-btn', title: 'Settings', onclick: () => { activeTab = 'settings'; render(); } }, '⚙️'));

    const TABS = [['today', 'Today'], ['dashboard', 'Dashboard'], ['plan', 'Plan'], ['library', 'Library']];
    const tabs = el('nav', { class: 'tabs' },
      TABS.map(([id, label]) =>
        el('button', { class: `tab ${activeTab === id ? 'tab-active' : ''}`, onclick: () => { activeTab = id; render(); } }, label)));

    const views = {
      today: () => renderToday(plan),
      dashboard: () => renderDashboard(months, plan),
      plan: () => renderPlan(plan),
      library: () => renderLibrary(),
      settings: () => renderSettings(),
    };
    return el('div', { class: 'home' }, header, tabs, (views[activeTab] || views.today)());
  }

  // ---- Today -------------------------------------------------------------

  function renderToday(plan) {
    const word = wordOfTheDay(plan);
    return el('div', { class: 'tab-body' },
      renderWordCard(plan, word, { featured: true }),
      el('div', { class: 'card stage-card' },
        el('div', { class: 'month-badge' }, `Month ${plan.m}`),
        el('div', { class: 'stage-headline' }, plan.title),
        el('div', { class: 'stage-focus' }, plan.focus),
        el('p', { class: 'stage-summary' }, plan.summary),
        el('div', { class: 'milestones' },
          el('div', { class: 'milestones-title' }, 'Around now, many babies…'),
          el('ul', {}, plan.milestones.map((m) => el('li', {}, m))))),
      renderTechniques(plan));
  }

  // ---- Dashboard ---------------------------------------------------------

  function ring(pct, label, sub) {
    const R = 52, C = 2 * Math.PI * R;
    const svg = svgEl('svg', { viewBox: '0 0 120 120', class: 'ring' });
    svg.appendChild(svgEl('circle', { cx: 60, cy: 60, r: R, class: 'ring-bg', fill: 'none', 'stroke-width': 11 }));
    svg.appendChild(svgEl('circle', {
      cx: 60, cy: 60, r: R, class: 'ring-fg', fill: 'none', 'stroke-width': 11, 'stroke-linecap': 'round',
      'stroke-dasharray': C, 'stroke-dashoffset': C * (1 - pct / 100), transform: 'rotate(-90 60 60)',
    }));
    return el('div', { class: 'ring-wrap' }, svg,
      el('div', { class: 'ring-label' }, el('div', { class: 'ring-pct' }, `${pct}%`), el('div', { class: 'ring-sub' }, label)),
      sub ? el('div', { class: 'ring-caption' }, sub) : null);
  }

  function statTile(num, label, hint, cls) {
    return el('div', { class: `tile ${cls || ''}` },
      el('div', { class: 'tile-num' }, String(num)),
      el('div', { class: 'tile-label' }, label),
      hint ? el('div', { class: 'tile-hint' }, hint) : null);
  }

  function renderDashboard(months, plan) {
    const s = Store.summarise(state, MONTHS, PHONEMES);
    const mp = Store.monthProgress(state, plan);
    const monthPct = mp.total ? Math.round((mp.mastered / mp.total) * 100) : 0;

    // Age card
    const ageCard = el('div', { class: 'card hero-card' },
      el('div', { class: 'hero-left' },
        el('div', { class: 'hero-age' }, ageLabel(state.baby.birthISO)),
        el('div', { class: 'hero-plan' }, `Month ${plan.m} · ${plan.title}`),
        el('div', { class: 'hero-band' }, bandFor(months).headline)),
      ring(monthPct, 'this month', `${mp.mastered} of ${mp.total} words mastered`));

    // The four headline numbers.
    const tiles = el('div', { class: 'tiles' },
      statTile(s.wordsTeaching, 'Learning now', 'words on the go', 'tile-amber'),
      statTile(s.wordsMastered, 'Words mastered', `of ${s.wordsTotal} in the library`, 'tile-mint'),
      statTile(s.phrasesTeaching + s.phrasesMastered, 'Phrases & sentences', `${s.phrasesMastered} they can say`, 'tile-violet'),
      statTile(s.soundsPractised, 'Speech sounds', `of ${s.soundsTotal} practised`, 'tile-coral'));

    // Overall library bar
    const overallPct = s.wordsTotal ? Math.round((s.wordsMastered / s.wordsTotal) * 100) : 0;
    const overall = el('div', { class: 'card' },
      el('h3', { class: 'how-title' }, 'Whole library'),
      el('div', { class: 'bar-row' },
        el('div', { class: 'progress-wrap' },
          // Keep a visible sliver once anything is mastered, so a rounded-down
          // 0% never reads as "nothing done".
          el('div', { class: 'progress-bar', style: `width:${s.wordsMastered ? Math.max(overallPct, 2) : 0}%` })),
        el('div', { class: 'bar-pct' }, `${overallPct}%`)),
      el('p', { class: 'hint' }, `${s.wordsMastered} mastered · ${s.wordsTeaching} in progress · ${s.wordsTotal - s.wordsMastered - s.wordsTeaching} still to start`));

    // Category breakdown — only categories that have been touched.
    const cats = Object.entries(s.byCategory)
      .filter(([, v]) => v.mastered + v.teaching > 0)
      .sort((a, b) => (b[1].mastered + b[1].teaching) - (a[1].mastered + a[1].teaching))
      .slice(0, 8);
    const catCard = cats.length
      ? el('div', { class: 'card' },
          el('h3', { class: 'how-title' }, 'Where you are focusing'),
          cats.map(([name, v]) => {
            const pct = Math.round((v.mastered / v.total) * 100);
            return el('div', { class: 'cat-row' },
              el('div', { class: 'cat-head' },
                el('span', { class: 'cat-name' }, name),
                el('span', { class: 'cat-count' }, `${v.mastered}/${v.total}`)),
              el('div', { class: 'cat-track' }, el('div', { class: 'cat-fill', style: `width:${pct}%` })));
          }))
      : null;

    // Speech-sound coverage, grouped by developmental band.
    const bands = { early: [], middle: [], later: [], latest: [] };
    for (const [key, rec] of Object.entries(s.sounds)) {
      const p = PHONEMES[key];
      if (p && bands[p.band]) bands[p.band].push({ key, p, rec });
    }
    const soundCard = el('div', { class: 'card' },
      el('h3', { class: 'how-title' }, 'Speech sounds covered'),
      el('p', { class: 'hint' }, 'Sounds you have started practising, grouped by when children typically master them.'),
      Object.entries(bands).map(([band, list]) =>
        list.length
          ? el('div', { class: 'sound-band' },
              el('div', { class: 'sound-band-label' }, BAND_LABEL[band]),
              el('div', { class: 'sound-chips' },
                list.sort((a, b) => b.rec.started - a.rec.started).map(({ p, rec }) =>
                  el('span', { class: `sound-chip ${rec.started ? 'sound-on' : ''}`, title: p.name }, p.ipa))))
          : null));

    // Recent activity
    const recent = s.recent.slice(0, 6);
    const recentCard = recent.length
      ? el('div', { class: 'card' },
          el('h3', { class: 'how-title' }, 'Recently worked on'),
          recent.map((r) =>
            el('div', { class: 'prog-row' },
              el('span', { class: 'prog-word' },
                r.kind === 'phrase' ? `“${r.label}”` : r.label,
                el('span', { class: 'prog-month' }, ` · month ${r.month}`)),
              statusPill(r.status))))
      : el('div', { class: 'card' },
          el('p', { class: 'empty' }, 'Nothing started yet. Tap “Start teaching this” on today’s word and your dashboard will fill up. 🌱'));

    return el('div', { class: 'tab-body' }, ageCard, tiles, overall, catCard, soundCard, recentCard);
  }

  // ---- This month's plan -------------------------------------------------

  function renderPlan(plan) {
    const mp = Store.monthProgress(state, plan);
    return el('div', { class: 'tab-body' },
      el('div', { class: 'card stage-card' },
        el('div', { class: 'month-badge' }, `Month ${plan.m}`),
        el('div', { class: 'stage-headline' }, plan.title),
        el('div', { class: 'stage-focus' }, plan.focus),
        el('p', { class: 'stage-summary' }, plan.summary),
        el('div', { class: 'bar-row' },
          el('div', { class: 'progress-wrap' },
            el('div', { class: 'progress-bar', style: `width:${mp.total ? (mp.mastered / mp.total) * 100 : 0}%` })),
          el('div', { class: 'bar-pct' }, `${mp.mastered}/${mp.total}`))),
      el('h3', { class: 'section-title' }, `This month's words (${plan.words.length})`),
      plan.words.map((w) => renderWordCard(plan, w)),
      plan.phrases && plan.phrases.length
        ? el('div', {},
            el('h3', { class: 'section-title' }, 'Phrases to model'),
            el('p', { class: 'section-note' }, 'Say these back to your child with one extra word added. Mark one off when they use it themselves.'),
            plan.phrases.map((p) => renderPhraseCard(plan, p)))
        : null);
  }

  // ---- Library -----------------------------------------------------------

  function renderLibrary() {
    const plan = planForMonth(browseMonth);
    const picker = el('div', { class: 'month-picker' },
      MONTHS.map((p) =>
        el('button', { class: `mpill ${browseMonth === p.m ? 'mpill-active' : ''}`,
          onclick: () => { browseMonth = p.m; render(); } }, String(p.m))));

    return el('div', {},
      el('div', { class: 'picker-label' }, 'Browse by month'),
      picker,
      el('div', { class: 'tab-body' },
        el('div', { class: 'card stage-card' },
          el('div', { class: 'month-badge' }, `Month ${plan.m} · ${bandFor(plan.m).label}`),
          el('div', { class: 'stage-headline' }, plan.title),
          el('div', { class: 'stage-focus' }, plan.focus)),
        plan.words.map((w) => renderWordCard(plan, w)),
        (plan.phrases || []).map((p) => renderPhraseCard(plan, p))));
  }

  // ---- Settings ----------------------------------------------------------

  function renderSettings() {
    const fileInput = el('input', { type: 'file', accept: 'application/json', class: 'hidden-file',
      onchange: (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try { state = Store.importState(reader.result); activeTab = 'today'; browseMonth = null; render(); }
          catch { alert('That file could not be read.'); }
        };
        reader.readAsText(file);
      } });

    return el('div', { class: 'tab-body' },
      el('div', { class: 'card' },
        el('h3', { class: 'how-title' }, 'Baby profile'),
        el('p', { class: 'hint' }, `${state.baby.name} · born ${new Date(state.baby.birthISO).toLocaleDateString()} · ${ageLabel(state.baby.birthISO)}`),
        el('button', { class: 'btn btn-ghost btn-block', onclick: () => { state.baby = null; Store.saveState(state); render(); } },
          'Edit baby details')),
      el('div', { class: 'card' },
        el('h3', { class: 'how-title' }, 'Your data'),
        el('p', { class: 'hint' }, 'Saved on this device and shared automatically with the other device using this app — no account needed. Back it up or move it to a new device here.'),
        el('button', { class: 'btn btn-ghost btn-block', onclick: () => {
          const blob = new Blob([Store.exportState(state)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = el('a', { href: url, download: 'baby-word-progress.json' });
          document.body.appendChild(a); a.click(); a.remove();
          URL.revokeObjectURL(url);
        } }, '⬇️ Export progress (backup)'),
        el('button', { class: 'btn btn-ghost btn-block', onclick: () => fileInput.click() }, '⬆️ Import progress'),
        fileInput),
      el('div', { class: 'card' },
        el('h3', { class: 'how-title' }, 'About'),
        el('p', { class: 'hint' },
          `${MONTHS.length} monthly plans · ${MONTHS.reduce((n, m) => n + m.words.length, 0)} words · ` +
          `${MONTHS.reduce((n, m) => n + (m.phrases || []).length, 0)} phrase patterns.`),
        el('p', { class: 'hint' },
          'Teaching techniques are drawn from research on speech and language development in infancy. ' +
          'Guidance is general and is not a substitute for advice from your paediatrician or a speech-language therapist.'),
        el('button', { class: 'btn btn-danger btn-block', onclick: () => {
          if (confirm('Reset everything, including your baby’s profile and all progress?')) {
            state = Store.resetState(); activeTab = 'today'; browseMonth = null; render();
          }
        } }, 'Reset app')));
  }

  // ---- Boot --------------------------------------------------------------

  render();

  // Pick up whatever the other person's device last saved, then re-render if
  // it changed anything. Re-check whenever the app is reopened/resumed too,
  // since a PWA is far more often resumed from the background than reloaded.
  function resync() {
    Store.syncOnLoad(state).then((next) => {
      if (next !== state) {
        state = next;
        render();
      }
    });
  }
  resync();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') resync();
  });

  // Register the service worker for offline / installable behaviour.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }
})();
