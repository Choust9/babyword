# From GitHub to the App Store — migration guide

This prototype is a **Progressive Web App (PWA)**: plain HTML/CSS/JS with no
build step. That was a deliberate choice — it runs on an iPhone home screen
*today*, and it gives you two clean routes to a real, App-Store-distributed iOS
app. This document lays out both, why you'd pick each, and the practical
checklist to ship.

---

## The two routes at a glance

| | **Route A — Capacitor wrapper** | **Route B — Native SwiftUI rewrite** |
|---|---|---|
| Effort | Low (days) | High (weeks) |
| Reuses this code | ✅ Almost all of it | ❌ Logic ports; UI is rebuilt |
| Feel | Very good; web view | Best-in-class native |
| Native APIs (notifications, StoreKit, widgets) | Via plugins | First-class |
| Best when | You want to ship and learn fast | This becomes a serious product |
| Recommended for | **Right now** | **After validating demand** |

**Recommendation:** ship with **Route A** to validate the idea with real
parents, then invest in **Route B** if it gains traction. The curriculum data
and the age→stage→word logic carry over to either, so nothing is wasted.

---

## Route A — Wrap it with Capacitor (fastest to the App Store)

[Capacitor](https://capacitorjs.com) packages this exact web app into a native
iOS shell you can submit to the App Store. Your `js/`, `css/`, and `index.html`
become the app's UI unchanged.

### Steps

```bash
# 1. From the repo root (a package.json already exists), add Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init "Babblr" com.yourname.babblr --web-dir .

# 2. Add the iOS platform (creates an Xcode project under ./ios)
npx cap add ios

# 3. Copy web assets into the native shell and open Xcode
npx cap copy ios
npx cap open ios
```

In Xcode you then set the app icon (reuse `icons/icon-512.png`), signing team,
and bundle identifier, and hit Run.

### What changes vs. the web version

- **Service worker / manifest** aren't needed inside the native shell (the app
  is already "installed"), but they do no harm — leave them for the web version.
- **`localStorage` keeps working** inside the web view, so `js/storage.js` runs
  unchanged. For durability, later swap it to the Capacitor
  [Preferences](https://capacitorjs.com/docs/apis/preferences) plugin — the API
  shape in `storage.js` was kept deliberately small to make this a one-file
  change.
- **Daily notifications**: the app already has the reminder *settings* and an
  in-app banner; what a web app cannot do is fire a notification while it is
  closed. Add
  [`@capacitor/local-notifications`](https://capacitorjs.com/docs/apis/local-notifications)
  and schedule a repeating daily notification from the stored settings:

  ```js
  import { LocalNotifications } from '@capacitor/local-notifications';

  const { dailyBanner, bannerTime } = Store.loadState().settings;
  await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
  if (dailyBanner) {
    const [hour, minute] = bannerTime.split(':').map(Number);
    await LocalNotifications.schedule({
      notifications: [{
        id: 1,
        title: "Today's word is ready",
        body: `${word.w} — ${word.say}`,
        schedule: { on: { hour, minute }, repeats: true },
      }],
    });
  }
  ```

  Re-run this whenever the toggle or time changes, and hide the in-app banner
  once the native notification is doing the job.

### Keeping the repo tidy

Add an `ios/` entry and Node artifacts to `.gitignore` (already scaffolded
below), and commit the Capacitor config so any machine can rebuild.

---

## Route B — Native SwiftUI app (best long-term product)

When the idea is validated, rebuild the UI natively while **porting the logic
and data directly**. The prototype was structured to make this a transcription,
not a redesign.

### What ports cleanly

| Prototype file | Native equivalent |
|---|---|
| `js/data.js` (37 `MONTHS` plans) | A Swift `Curriculum.swift` with `struct MonthPlan` / `struct Word`, or ship the JSON and decode it with `Codable` |
| `js/phonics.js` (`PHONEMES`, `TECHNIQUES`) | Two `Codable` dictionaries — pure reference data, no logic to port |
| `js/app.js` age/month/word-of-the-day rules | Pure Swift functions — the maths is identical (see below) |
| `js/storage.js` | `UserDefaults` or Core Data; `@AppStorage` for the profile; CloudKit for iCloud sync. `summarise()` becomes a computed dashboard view-model |
| `css/styles.css` | SwiftUI views + a colour asset catalog (light/dark already defined) |

### The core logic to port

Three small, framework-free rules power the whole app — they translate almost
line-for-line:

1. **`ageInMonths(birth, today)`** — whole months between two dates.
2. **`planForMonth(months)`** — index into `MONTHS`, clamped to `0...36` so
   older children keep working.
3. **`wordOfTheDay(plan, date)`** — a deterministic day index
   (`floor(midnight / 86400000)`) rotated over the month's not-yet-mastered
   words, so "today's word" is stable per day and advances daily.

Example Swift skeleton:

```swift
struct Word: Codable, Identifiable {
    var id: String { w }
    let w, c, ipa, say, focus, why: String   // focus keys into PHONEMES
    let acts: [String]
}

struct Phrase: Codable { let p, pattern, tip: String }

struct MonthPlan: Codable, Identifiable {
    var id: Int { m }
    let m: Int
    let title, focus, summary: String
    let milestones, techniques: [String]
    let words: [Word]
    let phrases: [Phrase]?
}

func ageInMonths(birth: Date, on: Date = .now) -> Int {
    max(0, Calendar.current.dateComponents([.month], from: birth, to: on).month ?? 0)
}

func plan(forMonth m: Int, in months: [MonthPlan]) -> MonthPlan {
    months[min(max(m, 0), months.count - 1)]
}

func wordOfTheDay(_ plan: MonthPlan, on date: Date = .now,
                  isMastered: (Word) -> Bool) -> Word {
    let pool = plan.words.filter { !isMastered($0) }
    let candidates = pool.isEmpty ? plan.words : pool
    let day = Int(date.timeIntervalSince1970 / 86_400)
    return candidates[day % candidates.count]
}
```

Ship the contents of `data.js` and `phonics.js` as `curriculum.json` and
`phonics.json` (trivial to derive — both are already plain data with no
functions) and decode them. The models are intentionally the same shape, so the
field names above match the JavaScript exactly.

**Keep the localisation in mind when you port.** Transcriptions and respellings
are British English (RP/SSBE) — see CONTENT-DESIGN.md §3. If you later add
American or other regional pronunciations, add them as extra fields on `Word`
(e.g. `ipaUS`, `sayUS`) selected by a user setting, rather than forking the
curriculum. The `npm run check` validator enforces the British set today and
would need extending alongside.

### Native features worth adding in Route B

- **Local notifications** (`UserNotifications`) for the daily word.
- **Home-screen & Lock-screen widgets** (WidgetKit) showing today's word.
- **StoreKit 2** if you add a paid tier or content packs.
- **iCloud/CloudKit** so both parents share one child's progress.
- **Accessibility**: Dynamic Type and VoiceOver come nearly free in SwiftUI.

---

## App Store submission checklist (both routes)

- [ ] Apple Developer Program membership ($99/year).
- [ ] Bundle identifier + signing set in Xcode.
- [ ] App icons at all required sizes (start from `icons/icon-512.png`).
- [ ] Launch screen / storyboard.
- [ ] App Store screenshots (6.7", 6.1", iPad if supported).
- [ ] **Privacy**: this app collects no data and sends nothing off-device —
      declare "Data Not Collected" in App Privacy. If you later add analytics or
      cloud sync, update the nutrition label and add a privacy policy URL.
- [ ] **Kids Category / age rating**: because the audience is parents of young
      children, review Apple's Kids Category guidelines. If you market it *to*
      children or place it in the Kids Category, you must not include
      third-party analytics/ads and must gate any external links behind a
      parental check. Marketing to *parents* (recommended) is simpler.
- [ ] **Medical-claims caution**: keep copy framed as general educational
      guidance, not diagnosis or treatment, to stay clear of the medical-app
      review bar. The in-app disclaimer already does this.
- [ ] Support URL and marketing copy.
- [ ] TestFlight beta with a few real parents before public release.

---

## Suggested phased roadmap

1. **Phase 0 — now:** PWA on the home screen; share with a handful of parents.
2. **Phase 1 — Capacitor build:** submit to TestFlight, add the daily
   notification, swap `localStorage` → Preferences plugin.
3. **Phase 2 — validate:** gather feedback, expand the word bank, get the
   curriculum reviewed by a speech-language therapist.
4. **Phase 3 — native (optional):** SwiftUI rewrite with widgets, iCloud sync,
   and monetisation if the numbers justify it.

The value of this project is the **curriculum and the pedagogy**, not the
framework — every route above keeps that intact.
