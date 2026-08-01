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
    // flat(Infinity): callers nest arrays of nodes freely (lists inside lists).
    for (const c of children.flat(Infinity)) {
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

  // Which collapsed word cards are currently open. Keyed the same way as
  // progress ("12::Mummy") so it survives the full re-render on every change.
  const expandedWords = new Set();

  // A small stack so drilling from a speech sound into one of its words can be
  // stepped back out of. Entries: {type:'sound'|'word'|'phrase', ...}
  let modalStack = [];
  let savedScroll = 0;
  const openModal = (m) => {
    if (!modalStack.length) savedScroll = window.scrollY;
    modalStack.push(m);
    render();
  };
  const backModal = () => { modalStack.pop(); render(); };
  const closeModals = () => { modalStack = []; render(); };

  // ---- Daily reminder banner ---------------------------------------------

  const localDate = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const minutesNow = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

  function minutesOf(hhmm) {
    const [h, m] = String(hhmm || '09:00').split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  // Show once per day, from the chosen time onwards, until dismissed.
  function bannerDue() {
    const s = state.settings || {};
    if (!s.dailyBanner) return false;
    if (s.bannerDismissed === localDate()) return false;
    return minutesNow() >= minutesOf(s.bannerTime);
  }

  function dismissBanner() {
    Store.setSetting(state, 'bannerDismissed', localDate());
    render();
  }

  function renderBanner(plan) {
    if (!bannerDue()) return null;
    const word = wordOfTheDay(plan);
    const open = () => { activeTab = 'today'; dismissBanner(); };

    return el('div', { class: 'banner-wrap', role: 'status' },
      el('div', { class: 'banner' },
        el('button', {
          class: 'banner-main', onclick: open,
          'aria-label': `Today's word is ${word.w}. Open it.`,
        },
          el('div', { class: 'banner-icon' }, logoMark(40)),
          el('div', { class: 'banner-text' },
            el('div', { class: 'banner-title' }, "Today's word is ready"),
            el('div', { class: 'banner-word' }, `${word.w} · ${word.say}`),
            el('div', { class: 'banner-sub' }, `Month ${plan.m} · tap to open`))),
        el('button', { class: 'banner-x', onclick: dismissBanner, 'aria-label': 'Dismiss for today' }, '✕')));
  }

  function render() {
    // The page behind the sheet is scroll-locked, so remember where the user
    // was and put them back there when the sheet closes.
    const wasOpen = document.body.classList.contains('modal-open');
    const scroll = wasOpen ? savedScroll : window.scrollY;

    app.innerHTML = '';
    app.appendChild(state.baby ? renderHome() : renderOnboarding());
    const sheet = renderModal();
    if (sheet) app.appendChild(sheet);
    if (state.baby && !modalStack.length) {
      const banner = renderBanner(planForMonth(ageInMonths(state.baby.birthISO)));
      if (banner) app.appendChild(banner);
    }

    const isOpen = modalStack.length > 0;
    document.body.classList.toggle('modal-open', isOpen);
    if (!isOpen) window.scrollTo(0, scroll);
  }

  // ---- Brand -------------------------------------------------------------

  // The app mark, matching icons/ exactly: a speech bubble rising from a
  // baby's head. Inline SVG so it stays crisp at any size and needs no request.
  let logoSeq = 0;
  function logoMark(size = 84) {
    // Unique gradient id per instance: two marks can share a page (onboarding
    // and the banner), and duplicate ids are invalid.
    const gid = `babblerGrad${++logoSeq}`;
    const svg = svgEl('svg', { viewBox: '0 0 100 100', width: size, height: size, class: 'logo-svg', 'aria-hidden': 'true' });
    const defs = svgEl('defs');
    const grad = svgEl('linearGradient', { id: gid, x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(svgEl('stop', { offset: '0', 'stop-color': '#ffcf5c' }));
    grad.appendChild(svgEl('stop', { offset: '1', 'stop-color': '#ff8a5c' }));
    defs.appendChild(grad);
    svg.appendChild(defs);

    svg.appendChild(svgEl('rect', { width: 100, height: 100, rx: 30, fill: `url(#${gid})` }));
    // Speech bubble: body, then the tail pointing down-left at the baby.
    svg.appendChild(svgEl('rect', { x: 42, y: 13, width: 48, height: 34, rx: 11, fill: '#fff' }));
    svg.appendChild(svgEl('polygon', { points: '50,44 46,55 60,46', fill: '#fff' }));
    // Baby: head, curl, ear.
    svg.appendChild(svgEl('circle', { cx: 32, cy: 71.5, r: 16.5, fill: '#fff' }));
    svg.appendChild(svgEl('circle', { cx: 32.5, cy: 55.2, r: 4.9, fill: '#fff' }));
    svg.appendChild(svgEl('circle', { cx: 15.8, cy: 72.2, r: 5, fill: '#fff' }));
    // The babble.
    for (const cx of [55, 66, 77]) svg.appendChild(svgEl('circle', { cx, cy: 30, r: 3.7, fill: '#7c6cf0' }));
    return svg;
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
        el('div', { class: 'logo-badge' }, logoMark(84)),
        el('h1', { class: 'onboard-title' }, 'Babbler'),
        el('p', { class: 'onboard-tag' }, 'Baby word of the day'),
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

  /*
   * One card, three modes:
   *   featured   — today's word: always open, carries the star tag
   *   full       — always open, no tag (used inside a modal sheet)
   *   expandable — collapsed summary that opens on tap (Plan / Library)
   * Anything else renders as a plain always-open card.
   */
  function renderWordCard(plan, word, opts = {}) {
    const key = Store.wordKey(plan.m, word.w);
    const status = Store.getProgress(state, plan.m, word.w).status || 'todo';
    const open = !opts.expandable || expandedWords.has(key);
    const toggle = () => {
      if (expandedWords.has(key)) expandedWords.delete(key);
      else expandedWords.add(key);
      render();
    };
    const cycle = (e) => {
      if (e) e.stopPropagation();
      Store.setStatus(state, plan.m, word.w, nextStatus(status));
      render();
    };
    const actionLabel = status === 'todo' ? '✋ Start teaching this' : status === 'teaching' ? '✓ Mark as mastered' : '↺ Reset';

    const summary = el('div', { class: 'word-head' },
      el('div', { class: 'word-head-main' },
        el('h2', { class: 'word-title' }, word.w),
        !opts.featured ? el('div', { class: 'say-inline' }, `${word.say} · ${word.ipa}`) : null),
      statusPill(status));

    const chips = el('div', { class: 'chips' },
      el('span', { class: 'chip' }, word.c),
      el('span', { class: 'chip chip-ghost' }, `Month ${plan.m}`),
      PHONEMES[word.focus] ? el('span', { class: 'chip chip-sound' }, PHONEMES[word.focus].ipa) : null);

    const why = el('p', { class: 'word-why' }, word.why);

    // In expandable mode the whole summary block is the tap target.
    const header = opts.expandable
      ? el('div', {
          class: 'tap-region', role: 'button', tabindex: '0',
          'aria-expanded': String(open),
          'aria-label': `${word.w} — ${open ? 'hide' : 'show'} pronunciation and activities`,
          onclick: toggle,
          onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } },
        }, summary, chips, why)
      : el('div', {}, summary, chips, why);

    return el('article', { class: `card word-card ${opts.featured ? 'featured' : ''} ${open ? 'is-open' : ''}` },
      opts.featured ? el('div', { class: 'featured-tag' }, "⭐ Today's word") : null,
      header,
      open ? renderPhonics(word) : null,
      open
        ? el('div', { class: 'how' },
            el('h3', { class: 'how-title' }, opts.featured ? '👶 Do this today' : '👶 Ways to teach it'),
            el('ul', { class: 'activities' }, word.acts.map((a) => el('li', {}, a))))
        : null,
      opts.expandable
        ? el('button', { class: 'disclosure', onclick: toggle },
            open ? '▴ Hide details' : '▾ How to say it & ways to teach it')
        : null,
      el('div', { class: 'word-actions' },
        el('button', { class: `btn ${status === 'mastered' ? 'btn-ghost' : 'btn-primary'}`, onclick: cycle }, actionLabel)));
  }

  function renderPhraseCard(plan, phrase, opts = {}) {
    const status = Store.getPhrase(state, plan.m, phrase.p).status || 'todo';
    const cycle = (e) => {
      if (e) e.stopPropagation();
      Store.setPhraseStatus(state, plan.m, phrase.p, nextStatus(status));
      render();
    };
    const key = `p:${Store.wordKey(plan.m, phrase.p)}`;
    const open = !opts.expandable || expandedWords.has(key);
    const toggle = () => {
      if (expandedWords.has(key)) expandedWords.delete(key);
      else expandedWords.add(key);
      render();
    };

    const summary = el('div', {},
      el('div', { class: 'word-head' },
        el('div', { class: 'word-head-main' },
          el('div', { class: 'phrase-text' }, `“${phrase.p}”`),
          el('div', { class: 'phrase-pattern' }, phrase.pattern)),
        statusPill(status)));

    const header = opts.expandable
      ? el('div', {
          class: 'tap-region', role: 'button', tabindex: '0', 'aria-expanded': String(open),
          'aria-label': `${phrase.p} — ${open ? 'hide' : 'show'} how to model it`,
          onclick: toggle,
          onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } },
        }, summary)
      : summary;

    return el('div', { class: `card phrase-card ${open ? 'is-open' : ''}` },
      header,
      open ? el('p', { class: 'word-why' }, phrase.tip) : null,
      opts.expandable
        ? el('button', { class: 'disclosure', onclick: toggle }, open ? '▴ Hide details' : '▾ How to model it')
        : null,
      el('button', { class: `btn btn-block ${status === 'mastered' ? 'btn-ghost' : 'btn-primary'}`, onclick: cycle },
        status === 'todo' ? '✋ Start modelling this' : status === 'teaching' ? '✓ They said it!' : '↺ Reset'));
  }

  // ---- Modal sheet -------------------------------------------------------

  // Find the month plan a word/phrase belongs to.
  const planOf = (m) => MONTHS.find((p) => p.m === m);

  // Every word across the curriculum that practises a given sound.
  function wordsForSound(focus) {
    const out = [];
    for (const plan of MONTHS) {
      for (const w of plan.words) if (w.focus === focus) out.push({ plan, w });
    }
    return out;
  }

  function soundSheetBody(focus) {
    const p = PHONEMES[focus];
    const list = wordsForSound(focus);
    const done = list.filter(({ plan, w }) => Store.getProgress(state, plan.m, w.w).status === 'mastered').length;
    const going = list.filter(({ plan, w }) => Store.getProgress(state, plan.m, w.w).status === 'teaching').length;

    return el('div', {},
      el('div', { class: 'sheet-sound-head' },
        el('div', { class: 'sheet-ipa' }, p.ipa),
        el('div', {},
          el('div', { class: 'sheet-sound-name' }, p.name),
          el('div', { class: 'sheet-sound-age' }, `${BAND_LABEL[p.band]} · most children say this clearly ${p.byAge}`))),
      el('div', { class: 'ph-how' },
        el('div', { class: 'ph-how-title' }, 'What your mouth does'),
        el('p', { class: 'ph-how-body' }, p.how),
        el('div', { class: 'ph-mouth' }, p.mouth)),
      p.contrast && p.contrast.length
        ? el('div', { class: 'ph-tip' }, el('strong', {}, 'Try this: '), p.contrast[0])
        : null,
      el('div', { class: 'sheet-count' },
        `${list.length} word${list.length === 1 ? '' : 's'} practise this sound · ${done} mastered · ${going} in progress`),
      el('div', { class: 'sheet-list' },
        list.map(({ plan, w }) => {
          const st = Store.getProgress(state, plan.m, w.w).status || 'todo';
          return el('button', {
            class: 'sheet-row',
            onclick: () => openModal({ type: 'word', month: plan.m, word: w.w }),
          },
            el('div', { class: 'sheet-row-main' },
              el('div', { class: 'sheet-row-word' }, w.w),
              el('div', { class: 'sheet-row-sub' }, `${w.say} · month ${plan.m} · ${w.c}`)),
            statusPill(st),
            el('span', { class: 'sheet-chev' }, '›'));
        })));
  }

  function renderModal() {
    const top = modalStack[modalStack.length - 1];
    if (!top) return null;

    let title = '';
    let body = null;

    if (top.type === 'sound') {
      const p = PHONEMES[top.focus];
      if (!p) return null;
      // `label` covers the two entries whose `ipa` is a notation, not a symbol.
      title = `Words with ${p.label || p.ipa}`;
      body = soundSheetBody(top.focus);
    } else if (top.type === 'word') {
      const plan = planOf(top.month);
      const word = plan && plan.words.find((w) => w.w === top.word);
      if (!word) return null;
      title = `Month ${plan.m} · ${plan.title}`;
      body = renderWordCard(plan, word, { full: true });
    } else if (top.type === 'phrase') {
      const plan = planOf(top.month);
      const phrase = plan && (plan.phrases || []).find((p) => p.p === top.phrase);
      if (!phrase) return null;
      title = `Month ${plan.m} · phrase to model`;
      body = renderPhraseCard(plan, phrase);
    }

    const sheet = el('div', { class: 'sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      el('div', { class: 'sheet-bar' },
        modalStack.length > 1
          ? el('button', { class: 'sheet-btn', onclick: backModal, 'aria-label': 'Back' }, '‹ Back')
          : el('span', { class: 'sheet-spacer' }),
        el('div', { class: 'sheet-title' }, title),
        el('button', { class: 'sheet-btn', onclick: closeModals, 'aria-label': 'Close' }, '✕')),
      el('div', { class: 'sheet-body' }, body));

    const backdrop = el('div', { class: 'sheet-backdrop' }, sheet);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeModals(); });
    return backdrop;
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
      el('p', { class: 'hint' }, 'Grouped by when children typically master them. Tap a sound to see every word that practises it.'),
      Object.entries(bands).map(([band, list]) =>
        list.length
          ? el('div', { class: 'sound-band' },
              el('div', { class: 'sound-band-label' }, BAND_LABEL[band]),
              el('div', { class: 'sound-chips' },
                list.sort((a, b) => b.rec.started - a.rec.started).map(({ key, p, rec }) =>
                  el('button', {
                    class: `sound-chip ${rec.started ? 'sound-on' : ''}`,
                    title: `${p.name} — ${rec.started} of ${rec.total} words started`,
                    onclick: () => openModal({ type: 'sound', focus: key }),
                  }, p.ipa))))
          : null));

    // Recent activity
    const recent = s.recent.slice(0, 6);
    const recentCard = recent.length
      ? el('div', { class: 'card' },
          el('h3', { class: 'how-title' }, 'Recently worked on'),
          el('p', { class: 'hint' }, 'Tap any of these to reopen its card.'),
          recent.map((r) =>
            el('button', {
              class: 'prog-row prog-row-tap',
              onclick: () => openModal(r.kind === 'phrase'
                ? { type: 'phrase', month: r.month, phrase: r.label }
                : { type: 'word', month: r.month, word: r.label }),
            },
              el('span', { class: 'prog-word' },
                r.kind === 'phrase' ? `“${r.label}”` : r.label,
                el('span', { class: 'prog-month' }, ` · month ${r.month}`)),
              statusPill(r.status),
              el('span', { class: 'sheet-chev' }, '›'))))
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
      el('p', { class: 'section-note' }, 'Tap a word for how to say it and ways to teach it.'),
      plan.words.map((w) => renderWordCard(plan, w, { expandable: true })),
      plan.phrases && plan.phrases.length
        ? el('div', {},
            el('h3', { class: 'section-title' }, 'Phrases to model'),
            el('p', { class: 'section-note' }, 'Say these back to your child with one extra word added. Mark one off when they use it themselves.'),
            plan.phrases.map((p) => renderPhraseCard(plan, p, { expandable: true })))
        : null);
  }

  // ---- Library -----------------------------------------------------------

  // Filters apply across the whole library; with none set we show one month.
  let libQuery = '';
  let libCategory = 'all';
  let libSound = 'all';
  const libFiltered = () => libQuery.trim() !== '' || libCategory !== 'all' || libSound !== 'all';

  function libraryMatches() {
    const q = libQuery.trim().toLowerCase();
    const out = [];
    for (const plan of MONTHS) {
      for (const w of plan.words) {
        if (libCategory !== 'all' && w.c !== libCategory) continue;
        if (libSound !== 'all' && w.focus !== libSound) continue;
        if (q && !(w.w.toLowerCase().includes(q) || w.c.toLowerCase().includes(q) || w.say.toLowerCase().includes(q))) continue;
        out.push({ plan, w });
      }
    }
    return out;
  }

  function renderLibrary() {
    const categories = [...new Set(MONTHS.flatMap((p) => p.words.map((w) => w.c)))].sort();

    const search = el('input', {
      type: 'search', class: 'field field-search', placeholder: 'Search all 365 words…',
      value: libQuery,
      oninput: (e) => {
        libQuery = e.target.value;
        // Re-render on the next tick so the input keeps focus and caret.
        const pos = e.target.selectionStart;
        render();
        const box = document.querySelector('.field-search');
        if (box) { box.focus(); box.setSelectionRange(pos, pos); }
      },
    });

    const catSel = el('select', { class: 'field field-select', onchange: (e) => { libCategory = e.target.value; render(); } },
      el('option', { value: 'all' }, 'All categories'),
      categories.map((c) => el('option', { value: c, selected: libCategory === c ? 'selected' : null }, c)));

    const soundSel = el('select', { class: 'field field-select', onchange: (e) => { libSound = e.target.value; render(); } },
      el('option', { value: 'all' }, 'All sounds'),
      Object.entries(PHONEMES).map(([k, p]) =>
        el('option', { value: k, selected: libSound === k ? 'selected' : null }, `${p.ipa} — ${p.name}`)));

    const controls = el('div', { class: 'lib-controls' },
      search,
      el('div', { class: 'lib-selects' }, catSel, soundSel),
      libFiltered()
        ? el('button', { class: 'btn btn-ghost btn-block', onclick: () => { libQuery = ''; libCategory = 'all'; libSound = 'all'; render(); } },
            '✕ Clear filters')
        : null);

    // Filtered view: results from across every month.
    if (libFiltered()) {
      const hits = libraryMatches();
      return el('div', {}, controls,
        el('div', { class: 'tab-body' },
          el('h3', { class: 'section-title' }, `${hits.length} match${hits.length === 1 ? '' : 'es'}`),
          hits.length
            ? [el('p', { class: 'section-note' }, 'Tap a word for how to say it and ways to teach it.'),
               hits.map(({ plan, w }) => renderWordCard(plan, w, { expandable: true }))]
            : el('p', { class: 'empty' }, 'No words match. Try a different search or clear the filters.')));
    }

    // Default view: browse a single month.
    const plan = planForMonth(browseMonth);
    const picker = el('div', { class: 'month-picker' },
      MONTHS.map((p) =>
        el('button', { class: `mpill ${browseMonth === p.m ? 'mpill-active' : ''}`,
          onclick: () => { browseMonth = p.m; render(); } }, String(p.m))));

    return el('div', {}, controls,
      el('div', { class: 'picker-label' }, 'Browse by month'),
      picker,
      el('div', { class: 'tab-body' },
        el('div', { class: 'card stage-card' },
          el('div', { class: 'month-badge' }, `Month ${plan.m} · ${bandFor(plan.m).label}`),
          el('div', { class: 'stage-headline' }, plan.title),
          el('div', { class: 'stage-focus' }, plan.focus)),
        el('p', { class: 'section-note' }, 'Tap a word for how to say it and ways to teach it.'),
        plan.words.map((w) => renderWordCard(plan, w, { expandable: true })),
        (plan.phrases || []).map((p) => renderPhraseCard(plan, p, { expandable: true }))));
  }

  // ---- Settings ----------------------------------------------------------

  function renderReminderSettings() {
    const s = state.settings || {};
    const on = !!s.dailyBanner;

    const toggle = el('button', {
      class: `switch ${on ? 'switch-on' : ''}`, role: 'switch', 'aria-checked': String(on),
      'aria-label': 'Daily reminder',
      onclick: () => {
        Store.setSetting(state, 'dailyBanner', !on);
        // Turning it back on should let today's reminder appear again.
        if (!on) Store.setSetting(state, 'bannerDismissed', null);
        render();
      },
    }, el('span', { class: 'switch-knob' }));

    const time = el('input', {
      type: 'time', class: 'field field-time', value: s.bannerTime || '09:00',
      onchange: (e) => {
        Store.setSetting(state, 'bannerTime', e.target.value || '09:00');
        Store.setSetting(state, 'bannerDismissed', null);
        render();
      },
    });

    const showAgain = s.bannerDismissed === localDate()
      ? el('button', { class: 'btn btn-ghost btn-block', onclick: () => { Store.setSetting(state, 'bannerDismissed', null); render(); } },
          '↺ Show today’s reminder again')
      : null;

    return el('div', { class: 'card' },
      el('div', { class: 'set-row' },
        el('div', { class: 'set-label' },
          el('h3', { class: 'how-title set-title' }, '🔔 Daily reminder'),
          el('p', { class: 'hint set-hint' }, 'A banner when you open the app, once a day, with the word of the day.')),
        toggle),
      on
        ? el('div', { class: 'set-sub' },
            el('label', { class: 'label' }, 'Show from'),
            time,
            el('p', { class: 'hint' },
              'The banner appears the first time you open the app after this time each day. ' +
              'It cannot ring or appear on your lock screen — a web app on iOS has no way to ' +
              'schedule that. Lock-screen reminders arrive with the native build (see MIGRATION.md).'),
            showAgain)
        : null);
  }

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
      renderReminderSettings(),
      el('div', { class: 'card' },
        el('h3', { class: 'how-title' }, 'Your data'),
        el('p', { class: 'hint' }, 'Everything is stored privately on this device. Back it up or move it to a new device here.'),
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

  // Escape steps back out of the sheet, one level at a time.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalStack.length) backModal();
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }
})();
