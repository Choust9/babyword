# Shared progress across devices

By default Babblr stores everything in `localStorage`, which is **per device
and per browser**. Your phone and your partner's phone keep entirely separate
progress, and clearing Safari's website data wipes it.

This guide turns on an Appwrite database as the **source of truth**, so that
everyone in the family sees the same record on any device — with no accounts
and no logins — and so that every word you teach shows up as a readable row you
can inspect in the Appwrite console.

---

## Setup

### 1. Create an API key

Appwrite console → **Project settings → API keys → Create API key**. Give it
the `databases.read` and `databases.write` scopes. It is used only by the setup
script below and never ships in the app.

### 2. Run the setup script

```bash
APPWRITE_ENDPOINT="https://fra.cloud.appwrite.io/v1" \
APPWRITE_PROJECT="your-project-id" \
APPWRITE_API_KEY="your-api-key" \
npm run setup:appwrite
```

It creates the database, both collections, every attribute, three indexes and
the permissions — then prints the exact config block to paste in. Re-running it
is safe: anything that already exists is skipped.

### 3. Paste the printed config into `js/config.js`

```js
window.BABBLR_CONFIG = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',
  projectId: '…',
  databaseId: 'babblr',
  babiesCollectionId: 'babies',
  progressCollectionId: 'progress',
};
```

### 4. Register the site as a Web platform

**Project settings → Platforms → Add platform → Web app**, and enter the
hostname you serve from (e.g. `babblr.appwrite.network`, plus `localhost` for
testing). Without this the browser blocks every request with a CORS error.

### 5. Verify the link

```bash
npm run verify:appwrite                      # round trip as the app sees it
APPWRITE_API_KEY=... npm run verify:appwrite # also checks every attribute
```

It runs exactly the requests the app makes — read, create, read back, update,
and query by `babyId` — against both collections, and names the fix for
anything that fails (missing collection, missing permission, wrong endpoint).
It exits non-zero on failure, so it works in CI.

One thing it cannot test from Node is **CORS**. After deploying, open the app
and use **Settings → Shared progress → Test connection**: the same checks run
in the browser and will tell you if the hostname is not registered as a Web
platform.

Both leave a clearly-labelled `__selftest__` row behind if they cannot delete
it; remove it in the console whenever you like.

Redeploy. Open **Settings → Shared progress**: you should see a green
**Shared** badge, the record id, and a live row count.

---

## The schema

Two collections, designed so the console is readable at a glance rather than
holding one opaque JSON blob.

### `babies` — one row per child

| Attribute | Type | Meaning |
|---|---|---|
| `name` | string(128) | the baby's name as entered |
| `birth` | string(32) | ISO date, `2026-01-23` |
| `createdAt` | string(32) | when the record was first made |
| `updatedAt` | string(32) | last write from any device |
| `wordsTeaching` | integer | live count, so progress is visible without opening rows |
| `wordsMastered` | integer | " |
| `phrasesTeaching` | integer | " |
| `phrasesMastered` | integer | " |

### `progress` — one row per word or phrase taught

This is the audit trail. Every tap in the app becomes a row here.

| Attribute | Type | Meaning |
|---|---|---|
| `babyId` | string(64) | which baby record this belongs to |
| `kind` | string(16) | `word` or `phrase` |
| `month` | integer | which monthly plan (0–36) |
| `item` | string(128) | the word or phrase itself, e.g. `Banana` |
| `status` | string(16) | `todo` / `teaching` / `mastered` |
| `startedAt` | string(32) | when teaching began |
| `masteredAt` | string(32) | when it was marked mastered |
| `updatedAt` | string(32) | last change — this drives merging |

Indexes: `babyId` (the app's only query), `updatedAt` descending (newest
activity first when you browse the console), and `status`.

Nothing is ever deleted — a reset writes `status: "todo"` rather than removing
the row, so the history stays intact and `Delete` permission is not needed.

### Watching data flow in

In the Appwrite console open **Databases → babblr → progress**, sort by
`updatedAt` descending, and you will see each word appear as you tap it in the
app. Filter by `babyId` to see one child, or by `status` to list everything
mastered.

---

## Record identity, and the family code

There are no accounts, so the baby's details *are* the key:

```
name "Sophia" + DOB 2026-01-23                 ->  sophia-2026-01-23
name "Sophia" + DOB 2026-01-23 + code "hazelnut" ->  bdb085914b160889dd780b93e7c61b73a
```

Without a family code the id is readable but **guessable** — someone with your
project id could try `sophia-2026-01-23`. With one, the id is a SHA-256 hash of
the code plus the name and date of birth, so it cannot be guessed.

The code is typed into the app (during onboarding, or later under **Settings →
Shared progress**) and stored only on the device. It is deliberately *not* in
`config.js`, because that file is readable in the page source, which would
defeat the point. Everyone in the family types the same code once per device.

Changing the code moves you to a different record; it does not migrate data.

> A family code needs a secure context (HTTPS, or localhost) because it uses
> the browser's `crypto.subtle`. Over plain HTTP the app refuses to hash rather
> than quietly falling back to a guessable id.

---

## How syncing behaves

- **localStorage stays the source of truth for what you see.** The app renders
  instantly and works with no signal; Appwrite is the shared copy that devices
  reconcile against.
- **Pulls** happen at startup, when the tab regains focus, and once a minute
  while open. **Pushes** are debounced ~1.2s, and only rows whose timestamp
  actually changed are written.
- **Merging is per-entry last-write-wins** on `updatedAt`. If you mark *ball*
  mastered while your partner marks *dog* mastered, both survive. If you both
  change the same word, the later change wins — including a reset, which is why
  the timestamp is written even when clearing a status.
- **A new device never clobbers the shared record.** The first write for a
  record always reads the existing rows first and merges into them.
- **Reminder settings stay local.** A banner you dismiss should not go quiet
  for everyone else, so `settings` are excluded from the sync payload.
- **Offline changes are kept** and pushed on reconnect.

---

## Security: read this before you rely on it

There are no accounts, which is what makes "just type the name and DOB" work.
Be clear-eyed about what that means:

- The endpoint and project id are visible in the page source. That is normal
  for any browser app.
- The collections grant the role **Any** create/read/update. **A family code
  stops someone guessing your record id, but it does not stop someone who has
  your project id from listing the collection and reading every row.** Hashing
  the id raises the bar; it is not access control.
- What is actually there: a first name, a date of birth, and which words you
  have taught. Low stakes — but not private, and not protected against someone
  deliberately writing junk into it.

For family and a few friends that is a reasonable trade. If you outgrow it:

1. **Remove `create("any")`** once your records exist, leaving read and update.
   New babies then have to be added from the console.
2. **Appwrite anonymous sessions + a Team**, with document-level permissions so
   only invited devices can read. This adds a real login step.
3. **Encrypt the payload** with the family code before upload. This genuinely
   hides the data — but it also makes the console unreadable, which defeats
   using the database as a source of truth you can browse.

## Turning it off

Blank out any field in `js/config.js` and the app returns to local-only
storage, making no requests. Nothing breaks; local progress is untouched.

## Troubleshooting

| Symptom | Cause |
|---|---|
| **Sync problem** badge, CORS error in the console | The hostname is not registered under Project settings → Platforms |
| `401` / "missing scope" | Collection permissions do not include **Any** for read/create/update |
| Badge says **Local only** | A field in `js/config.js` is still blank |
| "A family code needs HTTPS" | You are on plain HTTP; use HTTPS or localhost, or clear the code |
| Two phones show different data | Compare the record id in Settings on both — a different name spelling *or a different family code* makes a different record |
| Rows synced stays 0 | Nothing taught yet; rows appear as you mark words |
| Not sure what is wrong | Run `npm run verify:appwrite`, then **Test connection** in the app — between them they cover every failure mode above |
