# Babblr

**Baby word of the day.** A daily, age-appropriate word to teach your baby — with simple, concrete ways
to bring it to life, plus a checklist so you always know which words you've
started and which you haven't.

Built for parents who want **a little structure** instead of winging it. You
enter your baby's date of birth once; the app maps their age to a **monthly
plan** and serves a word each day that suits where their brain actually is —
from newborn "parentese" exposure, through babbling and first words, all the
way to sentences and "why?".

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

**A daily reminder banner** — an iOS-style banner when you open the app, once a
day, showing the word of the day. Switch it on/off in Settings and choose the
time it starts appearing from. (It's an in-app banner, not a lock-screen
notification — see the note below.)

**Library with search and filters** — browse all 37 months, or search all 365
words and filter by category or speech sound. This is the fastest answer to
"have I already done *dog*?" — results show which month each word belongs to
and whether you've taught it.

**Every word opens up** — cards in Plan and Library start collapsed and expand
on tap to the full pronunciation coaching and activities. On the Dashboard,
tapping a speech sound lists every word that practises it, and tapping anything
in "recently worked on" reopens its card.

**Shared across devices, optionally** — by default everything stays on the one
device. Run `npm run setup:appwrite` and the baby's **name + date of birth (+ a
family code) becomes the key**: everyone entering the same details sees and
updates one record, on any phone, with no accounts or logins. Merging is
per-entry, so two parents ticking off different words both count.

The database is designed to be **read**, not just written: a `babies` row per
child with live counts, and a `progress` row per word taught — month, item,
status and timestamps — so you can watch progress land in the Appwrite console
and treat it as the source of truth. See **[SYNC.md](SYNC.md)**, including the
security trade-off of having no accounts.

**Private by default** — with sync off, nothing leaves the device. Export/import
your progress as JSON to back it up or move devices either way.

**Installable & offline** — it's a PWA: "Add to Home Screen" on an iPhone and
it runs full-screen with no browser chrome, even with no signal.

> **On the daily reminder:** a web app on iOS cannot schedule a notification
> that fires while it is closed — there is no local-notification API, and the
> Notification Triggers proposal never shipped. So the reminder is an in-app
> banner: it appears the first time you open the app after your chosen time.
> A real lock-screen reminder needs the native build, which is a few lines with
> Capacitor's Local Notifications plugin — see [MIGRATION.md](MIGRATION.md).
> The settings the banner already stores (`dailyBanner`, `bannerTime`) are
> exactly what that scheduler needs.

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

Create the Appwrite database for shared progress (safe to re-run):

```bash
APPWRITE_ENDPOINT=... APPWRITE_PROJECT=... APPWRITE_API_KEY=... npm run setup:appwrite
```

## Deploying it

The app is plain static files and needs no build step to run — but most hosts
detect a `package.json`, guess a framework, and run `npm run build` expecting an
output directory. So there is a build script that validates the curriculum and
copies the site into `dist/`:

```bash
npm run build      # -> dist/
```

Configure your host with:

| Setting | Value |
|---|---|
| Framework | **Other** / Static (do **not** let it pick React — there is no React here) |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |

If your host has no build step at all, skip the build entirely and serve the
repo root (`./`) as static files — that works too.

> If a deploy fails with `npm error Missing script: "build"`, the host has
> auto-detected the wrong framework and is running a build this project didn't
> have. Either set the framework to Static, or pull this branch, which now
> provides the `build` script.

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
  config.js              Optional Appwrite settings for shared progress (blank = local only)
  phonics.js             Phoneme table (articulation, age bands) + teaching techniques
  data.js                The 37 monthly plans — words and phrase patterns
  storage.js             localStorage persistence + dashboard aggregates
  sync.js                Cross-device sync against an Appwrite database
  app.js                 Controller: age→month→word-of-the-day logic + rendering
icons/                   Generated PNG app icons
scripts/
  make_icons.py          Dependency-free icon generator
  check-data.js          Curriculum validation (npm run check)
  build.js               Assembles dist/ for static hosts (npm run build)
  setup-appwrite.js      Creates the sync database + collections (npm run setup:appwrite)
CONTENT-DESIGN.md        Why the curriculum is built this way + the evidence
SYNC.md                  Setting up shared cross-device progress in Appwrite
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
- True lock-screen daily notification (the in-app banner ships today; the
  scheduled version needs the native build)
- Red-flag guidance: when to seek professional advice
- Photos: let parents snap the real-world object they pointed at
- Multiple children / profiles
- Tighter sync access if the open collection ever stops feeling comfortable —
  anonymous sessions plus a Team (SYNC.md covers the options)
- Bilingual households mode
- iCloud sync across a couple's devices
