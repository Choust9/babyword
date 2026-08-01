#!/usr/bin/env node
/*
 * check-data.js — validates the curriculum before committing.
 *
 * Checks:
 *   1. every month 0..36 is present, exactly once, in order
 *   2. every word has all required fields and 2+ activities
 *   3. every word's `focus` resolves to a real phoneme
 *   4. every month's `techniques` resolve to real techniques
 *   5. no American IPA symbols have crept in — this curriculum is British
 *      English (RP/SSBE), see CONTENT-DESIGN.md §3
 *
 * Run with: npm run check
 */

const { MONTHS } = require('../js/data.js');
const { PHONEMES, TECHNIQUES } = require('../js/phonics.js');

const errors = [];
const warn = [];

// American symbols that must not appear in a British transcription.
// /ɪr/ is excluded when followed by ə (that's the British NEAR diphthong /ɪə/).
const AMERICAN = [
  [/oʊ/, 'oʊ — use British /əʊ/ for GOAT (nose /nəʊz/)'],
  [/ɚ|ɝ/, 'ɚ/ɝ — use /ə/ or /ɜː/; British is non-rhotic'],
  [/ɛ/, 'ɛ — British convention is /e/ for DRESS (red /red/)'],
  [/ɹ/, 'ɹ — British convention is /r/'],
  [/ɑːr|ɔːr|ɜːr/, 'vowel+r — British is non-rhotic (car /kɑː/, more /mɔː/)'],
  [/ɪr(?!ə)/, 'ɪr — use /ɪə/ for NEAR (ear /ɪə/)'],
  [/ɛr/, 'ɛr — use /eə/ for SQUARE (chair /tʃeə/)'],
];

const months = MONTHS.map((m) => m.m);
const expected = Array.from({ length: 37 }, (_, i) => i);
if (JSON.stringify(months) !== JSON.stringify(expected)) {
  errors.push(`months must be 0..36 in order, got: ${months.join(',')}`);
}

let words = 0;
let phrases = 0;

for (const plan of MONTHS) {
  const where = `month ${plan.m}`;

  for (const t of plan.techniques || []) {
    if (!TECHNIQUES[t]) errors.push(`${where}: unknown technique "${t}"`);
  }
  if (!plan.words || plan.words.length < 8) {
    warn.push(`${where}: only ${(plan.words || []).length} words (aim for 8+)`);
  }

  for (const w of plan.words || []) {
    words++;
    const at = `${where} "${w.w}"`;
    for (const k of ['w', 'c', 'ipa', 'say', 'focus', 'why', 'acts']) {
      if (!w[k]) errors.push(`${at}: missing "${k}"`);
    }
    if (!Array.isArray(w.acts) || w.acts.length < 2) {
      errors.push(`${at}: needs at least 2 activities`);
    }
    if (w.focus && !PHONEMES[w.focus]) {
      errors.push(`${at}: unknown focus sound "${w.focus}"`);
    }
    if (w.ipa) {
      if (!/^\/.*\/$/.test(w.ipa)) errors.push(`${at}: ipa should be wrapped in slashes`);
      for (const [re, msg] of AMERICAN) {
        if (re.test(w.ipa)) errors.push(`${at}: ${w.ipa} contains ${msg}`);
      }
    }
  }

  for (const p of plan.phrases || []) {
    phrases++;
    for (const k of ['p', 'pattern', 'tip']) {
      if (!p[k]) errors.push(`${where} phrase "${p.p}": missing "${k}"`);
    }
  }
}

for (const w of warn) console.warn(`warn: ${w}`);

if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log(
  `✓ ${MONTHS.length} months · ${words} words · ${phrases} phrases · ` +
  `${Object.keys(PHONEMES).length} phonemes · British English (RP) transcriptions`
);
