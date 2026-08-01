# Content design — how Babbler's curriculum was built

This document explains *why* the words, the monthly structure and the coaching
advice are the way they are, and where the evidence comes from. It is intended
for anyone reviewing or extending the word bank — including a speech-language
therapist doing a clinical review before release.

---

## 1. Why months, not quarters

The first version grouped words into broad stages (0–3, 3–6, 6–9 months…).
That was too coarse to act on: a parent of a 7-month-old and a parent of an
8-month-old got an identical, three-month-wide bucket.

The curriculum is now **one plan per month, 0 to 36** — 37 plans in total. Each
month gives a small, current, achievable set (8–12 words) plus its own focus,
milestones and teaching techniques.

The broader stage bands still exist (`STAGE_BANDS` in `js/data.js`) but only
supply narrative context — "Babbling", "First words", "Word combos". The
month is the unit the app actually teaches from.

Ages beyond 36 months clamp to the month-36 plan rather than falling off the
end.

---

## 2. The evidence behind the teaching techniques

The delivery techniques in `js/phonics.js` (`TECHNIQUES`) are not folklore.
Each is drawn from research on how the infant brain actually processes speech,
with the primary source being:

> Kujala, T., Partanen, E., Virtala, P., & Winkler, I. (2023).
> **Prerequisites of language acquisition in the newborn brain.**
> *Trends in Neurosciences*, 46(9), 726–737.
> https://doi.org/10.1016/j.tins.2023.05.011 (open access, CC BY)

That review establishes that newborns already possess the core auditory
machinery for language. Six findings shaped the app directly:

| Finding in the literature | What the app does with it |
|---|---|
| Newborns extract wordforms from continuous speech using **transitional probabilities alone** — statistical learning — and can do so within ~40 minutes of exposure. | The **"Same word, many sentences"** technique. Activities deliberately coach varied sentence contexts ("here is the ball… the ball is red… roll the ball") rather than bare repetition, because the statistics only work when the word stays constant and the surroundings vary. |
| **Prosodic boundary cues** (pauses, pitch drops) are among the strongest signals a newborn has for finding where words start and stop. | The **"Frame it with pauses"** technique, and activities that place the target word at the end of a short phrase followed by a pause. |
| Neonates distinguish **infant-directed from adult-directed speech**, and it signals that the message is meant for them. | The **"Use parentese"** technique, emphasised most heavily in months 0–5 where exposure is the entire job. |
| The infant brain **predicts the next sound and flags violations** (mismatch response / prediction error). | The **"Pause and let them predict"** technique. Peekaboo, "ready… steady… GO!", and the held pause before a tickle are treated as neurologically motivated, not just fun. |
| **Phrase-level prosody can override word order** in newborns; slow rhythmic cues reach the fetus in the womb. | The **"Lean on rhythm"** technique — songs, rhymes and beat-matched chanting are presented as genuinely easier routes into a word, especially early on. |
| Infants **segregate competing sound streams**, but it costs effort. | The **"Cut the background noise"** technique. |

Two further techniques come from the broader developmental literature the
review situates itself in: time spent **watching a speaker's mouth** predicts
later language ability (*"Let them watch your mouth"*), and language is learned
in **social exchange** — labelling what the child is already attending to
rather than redirecting them (*"Name what they look at"*, *"Say it back, plus
one"*).

Each technique carries a short `cite` tag which the app surfaces in the UI, so
parents can see the guidance is evidence-led.

### What the paper does *not* support

Worth stating plainly, because it constrains the copy:

- The review is about **newborn/neonatal** capacities. It does not license
  claims about accelerating vocabulary, "boosting IQ", or hitting milestones
  earlier. No such claims appear in the app.
- Milestone ranges are drawn from general developmental guidance (ASHA, CDC
  "Learn the Signs"), not from this paper.
- The app deliberately says "many babies" rather than "your baby should".

---

## 3. Phonics: how pronunciation coaching works

Parents asked for the app to coach them through *what is actually required* to
produce a word. That is handled by a lookup table rather than repeating advice
on all 365 words.

`PHONEMES` in `js/phonics.js` holds every target sound with:

- **`ipa` / `name`** — `/ʃ/`, "the shh sound"
- **`how`** — an articulation script in plain language: *"Lips push forward
  into a small round shape, tongue pulls back a little, and you blow a wide,
  soft stream."*
- **`mouth`** — a one-line summary chip: *"Lips rounded forward · wide
  airstream · voiceless"*
- **`band` / `byAge`** — when most children *produce* the sound accurately
- **`contrast`** — a minimal-pair game (*"chip vs ship"*)

Every word declares a `focus` key naming the sound it was chosen to practise,
and the app renders the coaching from the table. This keeps the word bank
compact and the advice consistent.

### Pronunciation variety: British English

All 365 transcriptions are **British English — Received Pronunciation /
Standard Southern British**, and the plain respellings assume a British reader.
Three features of that choice shape the data:

- **Non-rhotic.** `/r/` is written only where it is actually pronounced, which
  in British English means *before a vowel only*. So `car` is `/kɑː/` with no
  `/r/` at all, `farm` is `/fɑːm/`, and `water` is `/ˈwɔː.tə/` — but
  intervocalic `/r/` is retained, so `story` is `/ˈstɔː.ri/`, `sorry` is
  `/ˈsɒr.i/` and `tomorrow` is `/təˈmɒr.əʊ/`. This is a genuine trap when
  converting from American sources: a blanket "drop the r" rule silently
  deletes the `/r/` in exactly those words.
- **The BATH/TRAP split.** BATH-set words take `/ɑː/` — `bath` `/bɑːθ/`,
  `grass` `/ɡrɑːs/`, `ask` `/ɑːsk/`, `fast` `/fɑːst/`, `after` `/ˈɑːf.tə/`,
  `banana` `/bəˈnɑː.nə/` — while TRAP words keep `/æ/` (`cat`, `hand`,
  `splash`). Note `pasta` goes the *other* way: `/ˈpæs.tə/` in British English.
- **LOT vs CLOTH vs PALM.** LOT words take `/ɒ/` (`hot` `/hɒt/`, `wash`
  `/wɒʃ/`, `what` `/wɒt/`), and several words American English gives `/ɔː/`
  are `/ɒ/` here too (`dog` `/dɒɡ/`, `song` `/sɒŋ/`, `soft` `/sɒft/`, `cross`
  `/krɒs/`, `off` `/ɒf/`). PALM words keep `/ɑː/` (`calm`, `pyjamas`
  `/pəˈdʒɑː.məz/`, and the babble syllables `ma-ma`, `ba-ba`).

Other British conventions used: `/e/` rather than `/ɛ/` for DRESS (`red`
`/red/`), `/əʊ/` rather than `/oʊ/` for GOAT (`nose` `/nəʊz/`), `/ɪə/` and
`/eə/` for NEAR and SQUARE (`ear` `/ɪə/`, `chair` `/tʃeə/`), and `/r/` rather
than `/ɹ/` for the r symbol.

Respellings follow suit: `more` is "MAW" not "MOR", `car` is "KAH", `dog` is
"DOG" not "DAWG". Where a British reader would naturally read a spelling
correctly ("BATH", "GRASS", "FAST", "WAW-ter"), the respelling is left in the
familiar form rather than made phonetically exotic.

The `r` entry in `PHONEMES` also carries the non-rhotic rule explicitly, since
it genuinely affects how a parent should model the sound: *"there is no 'r'
sound in 'car' or 'farm', but there is one in 'carry' and 'rabbit'."*

### Age-of-acquisition bands

Bands follow widely used English consonant norms (Sander, 1972; Crowe &
McLeod, 2020):

| Band | Sounds | Typically produced |
|---|---|---|
| Early | m, b, p, n, d, w, h | by ~2 years |
| Middle | t, k, g, f, ŋ, j | by ~3 years |
| Later | s, z, l, ʃ, tʃ, dʒ, v | by ~4 years |
| Latest | r, θ, ð, ʒ | often 5–6 years |

**These describe production, not comprehension.** Babies understand words
containing late sounds long before they can say them, so the curriculum
deliberately includes "later" sounds early — a 10-month-old is given "throw"
(`/θ/`) with the explicit note that the "th" will not come back for years.
Showing the band prevents a parent from worrying that a normal substitution
("wabbit", "fum") is a problem.

---

## 4. Word selection principles

Each of the 365 words was chosen against these rules:

1. **Concrete before abstract.** Things the baby can see, hold or feel come
   before qualities and relations. Colours arrive at month 6 as pointing
   targets, but are not expected to be *produced* for a long time.
2. **Frequency in the child's actual day.** A word the parent will naturally
   say twenty times ("fridge", "shoe", "up") beats a word they must
   manufacture opportunities for.
3. **Motivation.** Food, favourite people and beloved objects are learned
   fastest, so they cluster early.
4. **Phonetic progression.** Early months lean on reduplicated syllables
   (ma-ma, ba-ba) — the newborn brain groups repeated units into a single
   chunk, making these the easiest wordforms of all — then early consonants,
   then progressively later sounds.
5. **Syllable stretch.** Word length grows across the curriculum: one syllable
   early, three and four syllables ("elephant", "beautiful", "vegetables") in
   the third year.
6. **Routine anchoring.** Words are attached to events that already repeat
   daily — dressing, meals, bath, bedtime — so repetition costs the parent
   nothing.

Categories (27 in total) exist so the dashboard can show *where* a parent is
focusing and reveal blind spots.

---

## 5. Phrases and sentences

From **month 15**, plans add `phrases`: two- and three-word patterns to model,
tracked separately from single words.

Each is stored as a **pattern**, not just an example — `"more milk"` is tagged
`more + noun`, so the parent understands they should swap the noun rather than
drill the exact phrase. Patterns progress:

- **15–17 mo** — two-word combos (`more + noun`, `describing + noun`)
- **18–23 mo** — person + verb, verb + noun, position + noun
- **24–30 mo** — pronoun + verb + noun, question forms
- **31–36 mo** — connectors (`because`, `and`, `but`, `so`), past tense,
  joined sentences

The app frames the parent's job as **expansion**: repeat what the child said
and add one element. Marking a phrase "mastered" means *the child used it
themselves*, which is why the button reads "They said it!" rather than
"Mastered".

---

## 6. Known gaps and review needs

Honest list of what this content still needs before a public release:

- **No SLT sign-off yet.** The curriculum is structured and evidence-informed
  but has not been reviewed by a certified speech-language therapist. That
  review is the single most important step before shipping.
- **Southern British English only.** Transcriptions are RP/SSBE. They do not
  cover American, Scottish, Irish, Northern English, Welsh or Australian
  pronunciation, and several differ meaningfully — a Northern English speaker
  says `bath` `/bæθ/` and `cup` `/kʊp/`, and American English is rhotic
  throughout. A locale-aware pronunciation set is needed before shipping
  outside the south of England.
- **English monolingual.** No bilingual or ESL guidance yet, despite bilingual
  households being extremely common.
- **Milestones are population ranges.** They are presented as "many babies"
  and must never be reframed as a checklist a child is failing.
- **No red-flag guidance.** A future version should say plainly when to seek
  professional advice (e.g. no babbling by 12 months, no words by 16 months,
  loss of previously acquired speech) and route to a professional rather than
  to more app content.
- **Activities are untested at scale.** They are plausible and grounded, but
  have not been trialled with a real cohort of parents.

---

## 7. Extending the word bank

To add a word, append to the relevant month's `words` array in `js/data.js`:

```js
{
  w: 'Kettle',            // the word
  c: 'Home',              // category (reuse an existing one where possible)
  ipa: '/ˈket.əl/',       // broad transcription, British English (RP)
  say: 'KET-ul',          // plain respelling, stressed syllable in caps
  focus: 'k',             // key into PHONEMES — drives the coaching block
  why: '…',               // one line: why this word suits this month
  acts: ['…', '…'],       // 2–3 concrete things to do today
}
```

`focus` must be an existing key in `PHONEMES`. Run the data check before
committing — it validates required fields, the `focus` key, and flags any
American IPA symbols that have crept in:

```bash
npm run check      # or: node scripts/check-data.js
```

---

## References

- Kujala, T., Partanen, E., Virtala, P., & Winkler, I. (2023). Prerequisites of
  language acquisition in the newborn brain. *Trends in Neurosciences*, 46(9),
  726–737.
- Sander, E. K. (1972). When are speech sounds learned? *Journal of Speech and
  Hearing Disorders*, 37(1), 55–63.
- Crowe, K., & McLeod, S. (2020). Children's English consonant acquisition in
  the United States: A review. *American Journal of Speech-Language Pathology*,
  29(4), 2155–2169.
- American Speech-Language-Hearing Association — communication milestones.
- CDC, "Learn the Signs. Act Early." — developmental milestone checklists.
