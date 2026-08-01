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

- **Word of the Day** picked for your baby's current developmental stage, with:
  - the target word and its **phonetics** (IPA + a plain "sounds like" hint),
  - **why** the word suits this stage,
  - **how to teach it today** — 2–3 concrete activities written for the baby's
    actual ability (e.g. a 6-month-old can't repeat, so we coach narration;
    a 2-year-old can, so we coach turn-taking).
- **Stages grounded in speech-and-language milestones** (7 stages, newborn → 36
  months), each with a plain-language summary of what's happening and the
  milestones many babies hit around then.
- **Progress tracking / gamification** — mark a word *To start → Teaching →
  Mastered*. The Progress tab is your checklist and shows how much of the
  library you've covered, so you never lose track or wonder if you're repeating
  yourself.
- **Library** — browse every word in every stage, look ahead or revisit.
- **Shared between two devices, no account needed** — progress is saved
  locally and synced to a small Netlify Blobs-backed endpoint
  (`netlify/functions/sync.mts`) so both parents see the same baby's
  progress. Export / import your progress as a JSON file too, for a manual
  backup or a one-off device move.
- **Installable & offline** — it's a PWA: "Add to Home Screen" on an iPhone and
  it runs full-screen with no browser chrome, even with no signal.

## The curriculum

| Stage | Age | Focus |
|---|---|---|
| Newborn | 0–3 mo | Voice/melody exposure, parentese, routine words |
| Cooing | 3–6 mo | Turn-taking, first sound-to-meaning links |
| Babbling | 6–9 mo | ba-ba/da-da, colours, body parts, animal sounds |
| First words | 9–12 mo | Pointing, single real words, following simple directions |
| One-word | 12–18 mo | 5–50 words, feelings, opposites, everyday objects |
| Combos | 18–24 mo | Word explosion, two-word phrases, verbs, describing words |
| Sentences | 24–36 mo | Short sentences, questions, prepositions, categories |

Word data lives in [`js/data.js`](js/data.js) — it's a plain, framework-free
data file so it's easy to review, extend, or hand to a content/SLT reviewer.

## Run it locally

No build step, no dependencies. Any static server works:

```bash
python3 -m http.server 8099
# then open http://localhost:8099
```

Regenerate the app icons (pure-Python, no libraries needed):

```bash
python3 scripts/make_icons.py
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
  data.js                The curriculum (stages + words) — the app's "spine"
  storage.js             localStorage persistence (the one module you swap for native)
  app.js                 Controller: age→stage→word-of-the-day logic + rendering
icons/                   Generated PNG app icons
scripts/make_icons.py    Dependency-free icon generator
MIGRATION.md             How to take this from GitHub to the App Store
```

## Turning this into a real iOS app

See **[MIGRATION.md](MIGRATION.md)** for two concrete paths (a fast Capacitor
wrapper that reuses this code as-is, and a native SwiftUI rewrite), plus the
App Store checklist, data-model portability notes, and a phased roadmap.

## Roadmap ideas

- Daily local notification ("Today's word is ready 👶")
- Audio pronunciation for each word
- Photos: let parents snap the real-world object they pointed at
- Multiple children / profiles
- Bilingual mode
- Content reviewed by a certified speech-language therapist
- iCloud sync across a couple's devices
