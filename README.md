# 🍼 Baby Word of the Day

A daily, age-appropriate word to teach your baby — with simple, concrete ways
to bring it to life, plus a checklist so you always know which words you've
started and which you haven't.

Built for parents who want **a little structure** instead of winging it. You
enter your baby's date of birth once; the app maps their age to a
developmental **stage** and serves a word each day that suits where their
brain actually is — from newborn "parentese" exposure, through babbling and
first words, all the way to sentences and "why?".

> **Not medical advice.** Guidance here is general and milestone-based. Every
> baby develops at their own pace — check with your paediatrician or a
> speech-language therapist if you have concerns.

---

## What it does

**A plan for every month, 0–36.** Not broad quarters — 37 monthly plans, each
with its own focus, 8–12 target words, the milestones many babies hit around
then, and the teaching techniques that matter most at that age.

**Word of the Day**, picked from your baby's current month plan, with:

- **Real phonics coaching, in British English** — the stressed syllable
  ("buh-NAH-nuh"), the IPA, the specific sound the word practises, *what your
  mouth actually does* to make it ("lips press together, voice on, air out
  through the nose"), and a minimal-pair game to sharpen it.
- **When to expect it back** — every sound is tagged Early / Middle / Later /
  Latest, so you know "wabbit" for "rabbit" at three is completely normal.
- **Why** the word suits this month, and **2–3 things to do today**, written
  for what the baby can actually do (a 6-month-old can't repeat, so we coach
  narration; a 2-year-old can, so we coach turn-taking).

**A dashboard** showing age and current plan, a ring for this month's progress,
and four headline numbers: *Learning now*, *Words mastered*, *Phrases &
sentences*, and *Speech sounds practised* — plus a category breakdown so you
can see where you're focusing and what you're neglecting, and which speech
sounds you've covered grouped by when children typically master them.

**Phrases and sentences.** From month 15, plans add word-combination patterns
to model (`more + noun`, `person + verb`, `because + clause`), tracked
separately. You mark one off when *they* say it.

**Progress tracking / gamification** — every word and phrase cycles *To start →
Teaching → Mastered*, so you never lose track or wonder whether you're
repeating yourself.

**Library** — browse all 37 months; look ahead or revisit.

**Private by default** — everything stays on the device. Export/import your
progress as JSON to back it up or move devices.

**Installable & offline** — it's a PWA: "Add to Home Screen" on an iPhone and
it runs full-screen with no browser chrome, even with no signal.

## The curriculum

**365 words · 66 phrase patterns · 37 monthly plans · 27 categories**, grouped
into these narrative bands:

| Band | Age | Focus |
|---|---|---|
| Newborn | 0–2 mo | Voice, melody, parentese, face-to-face exposure |
| Cooing | 3–5 mo | Turn-taking, reaching, first food words |
| Babbling | 6–8 mo | ba-ba/da-da, colours, animal sounds, body parts |
| First words | 9–11 mo | Pointing, action words, around the house |
| Single words | 12–17 mo | Dressing, feelings, colours, bedtime routine |
| Word combos | 18–23 mo | Verb explosion, opposites, position words, counting |
| Sentences | 24–36 mo | Pronouns, questions, categories, storytelling |

**Pronunciation is British English throughout** — Received Pronunciation /
Standard Southern British. Transcriptions are non-rhotic (`car` is `/kɑː/`
with no r sound, but `carry` keeps it), the BATH set takes `/ɑː/` (`bath`
`/bɑːθ/`, `grass` `/ɡrɑːs/`), and LOT takes `/ɒ/` (`hot` `/hɒt/`, `dog`
`/dɒɡ/`). Respellings assume a British reader: `more` is "MAW", `car` is
"KAH". `npm run check` fails the build if an American symbol creeps in.

Content lives in two framework-free data files, easy to review or hand to an
SLT reviewer:

- [`js/data.js`](js/data.js) — the 37 monthly plans, words and phrase patterns
- [`js/phonics.js`](js/phonics.js) — the phoneme table (articulation, age
  bands, minimal pairs) and the evidence-based teaching techniques

**[CONTENT-DESIGN.md](CONTENT-DESIGN.md)** explains why the curriculum is built
the way it is, maps each teaching technique to the research it comes from, and
lists the known gaps — including that it still needs a speech-language
therapist's review.

## Run it locally

No build step, no dependencies. Any static server works:

```bash
npm start          # python3 -m http.server 8099
# then open http://localhost:8099
```

Validate the curriculum after editing content (checks required fields, phoneme
keys, and that transcriptions stay British English):

```bash
npm run check
```

Regenerate the app icons (pure-Python, no libraries needed):

```bash
npm run icons      # python3 scripts/make_icons.py
```

## Add it to an iPhone home screen (today, no App Store)

1. Host the folder somewhere over HTTPS (GitHub Pages, Netlify, Vercel — all
   free) **or** run the local server above and open it on the phone via your
   computer's IP.
2. Open the URL in **Safari** on the iPhone.
3. Tap the **Share** icon → **Add to Home Screen**.
4. Launch it from the new icon — it opens full-screen like a native app and
   works offline.

## Project structure

```
index.html               App shell + iOS meta tags
manifest.webmanifest     PWA manifest (name, icons, standalone display)
service-worker.js        Offline caching, installability
css/styles.css           Warm, rounded, light+dark design
js/
  phonics.js             Phoneme table (articulation, age bands) + teaching techniques
  data.js                The 37 monthly plans — words and phrase patterns
  storage.js             localStorage persistence + dashboard aggregates
  app.js                 Controller: age→month→word-of-the-day logic + rendering
icons/                   Generated PNG app icons
scripts/
  make_icons.py          Dependency-free icon generator
  check-data.js          Curriculum validation (npm run check)
CONTENT-DESIGN.md        Why the curriculum is built this way + the evidence
MIGRATION.md             How to take this from GitHub to the App Store
```

## Turning this into a real iOS app

See **[MIGRATION.md](MIGRATION.md)** for two concrete paths (a fast Capacitor
wrapper that reuses this code as-is, and a native SwiftUI rewrite), plus the
App Store checklist, data-model portability notes, and a phased roadmap.

## Roadmap ideas

- **Review by a certified speech-language therapist** — the most important
  step before this reaches other parents (see CONTENT-DESIGN.md §6)
- Recorded audio for each word and each focus sound, in a British voice
- Regional pronunciations — currently Southern British only, so Northern
  English (`bath` /bæθ/), Scottish, Irish, American and Australian speakers
  will find some transcriptions don't match their own accent
- Daily local notification ("Today's word is ready 👶")
- Red-flag guidance: when to seek professional advice
- Photos: let parents snap the real-world object they pointed at
- Multiple children / profiles
- Bilingual households mode
- iCloud sync across a couple's devices
