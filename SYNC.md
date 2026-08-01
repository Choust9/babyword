# Shared progress across devices

By default Babbler stores everything in `localStorage`, which is **per device
and per browser**. Your phone and your partner's phone keep entirely separate
progress, and clearing Safari's website data wipes it.

This guide turns on a shared copy in an Appwrite database, so that **anyone who
enters the same baby name and date of birth sees the same record, on any
device** — with no accounts and no logins.

```
Name "Sophia" + DOB 23/01/2026   ->   document id  sophia-2026-01-23
```

Everyone who types those details reads and writes that one document.

---

## Why a database, not a storage bucket

A Storage bucket (a "blob") holds opaque files. To change one word's status
you would download the whole file, edit it, and upload it again — with no
querying, no partial updates, and a much worse story when two phones write at
once. A Databases collection gives you one document per baby, a readable record
you can inspect in the Appwrite console, and room to add fields later.

Use the database.

---

## Setup (about five minutes)

### 1. Create the database and collection

In the Appwrite console:

1. **Databases → Create database.** Name it `Babbler`. Note its **Database ID**.
2. Inside it, **Create collection**. Name it `records`. Note its **Collection ID**.

### 2. Add the attributes

In the collection's **Attributes** tab, create four **String** attributes:

| Key | Size | Required | Notes |
|---|---|---|---|
| `name` | 128 | no | the baby's name, for readability in the console |
| `birth` | 32 | no | ISO date, e.g. `2026-01-23` |
| `data` | 1000000 | no | the progress payload as JSON |
| `updatedAt` | 32 | no | ISO timestamp of the last write |

`data` is the important one — it holds the JSON blob of all word and phrase
progress. A megabyte is far more than this app will ever need (the full
library is 365 words).

### 3. Set permissions

In the collection's **Settings → Permissions**, add the role **Any** with
**Create**, **Read** and **Update** ticked. Leave Delete off.

This is what allows the app to work without accounts. See the security note
below before you do this.

### 4. Register the site as a Web platform

**Project settings → Platforms → Add platform → Web app.** Enter the hostname
your site is served from (e.g. `babbler.appwrite.network`, or `localhost` while
testing). Without this, the browser blocks the requests with a CORS error.

### 5. Fill in `js/config.js`

```js
window.BABBLER_CONFIG = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',   // your region; no trailing slash
  projectId: 'xxxxxxxxxxxxxxxxxxxx',
  databaseId: 'xxxxxxxxxxxxxxxxxxxx',             // the "Babbler" database
  collectionId: 'xxxxxxxxxxxxxxxxxxxx',           // the "records" collection
};
```

Commit and redeploy. Open **Settings → Shared progress** in the app: it should
show the record id and a green **Shared** badge.

---

## How it behaves

- **localStorage stays the source of truth for what you see.** The app renders
  instantly and works with no signal; Appwrite is the shared copy that devices
  reconcile against.
- **Pulls** happen at startup, whenever the tab regains focus, and once a
  minute while open. **Pushes** are debounced ~1.2s so a burst of taps becomes
  one write.
- **Merging is per-entry last-write-wins**, using an `updatedISO` stamp written
  on every change. If you mark *ball* mastered on one phone while your partner
  marks *dog* mastered on another, both survive. If you both change the *same*
  word, the later change wins — including a reset back to "to start", which is
  why the timestamp is written even when clearing a status.
- **A new device never clobbers the shared record.** The first write for a
  record always reads the existing document first and merges into it. Without
  that guard, a freshly onboarded second phone would overwrite everything with
  its own empty progress — which is exactly what happened the first time this
  was tested.
- **Reminder settings stay local.** A banner you dismiss should not go away for
  everyone else, so `settings` are deliberately excluded from the sync payload.
- **Offline changes are kept** and pushed on reconnect.

## Where the data actually lives

One document per baby, in the collection you created:

```json
{
  "$id": "sophia-2026-01-23",
  "name": "Sophia",
  "birth": "2026-01-23",
  "updatedAt": "2026-08-01T22:40:11.402Z",
  "data": "{\"progress\":{\"6::Ba-ba\":{\"status\":\"mastered\",...}},\"phrases\":{},...}"
}
```

You can read and edit it directly in the Appwrite console, and the export /
import buttons in the app's settings still work as a manual backup.

---

## Security: read this before you rely on it

There are **no accounts**, which is what makes "just type the name and DOB"
work. The consequences are worth being explicit about:

- The endpoint and project ID are visible in the page source. That is normal
  for any browser app.
- Because the collection is open to the role **Any**, anyone who finds your
  project could read or write documents in it — and the document ids are
  guessable, since they are derived from a first name and a date.
- There is nothing sensitive here: a baby's first name, a date of birth, and
  which words you have taught. But it is not private, and it is not protected
  against someone deliberately writing junk into it.

For a handful of family and friends, that is a reasonable trade. If you ever
want it locked down, the options in increasing order of effort:

1. **Add a shared secret to the id.** Mix a family passphrase into `recordId()`
   so ids stop being guessable. Everyone types the same passphrase once.
2. **Turn off Create for `Any`** once your records exist, leaving Read and
   Update. New babies then need adding from the console.
3. **Use Appwrite anonymous sessions plus a Team**, so only invited devices can
   read or write. This adds a real login step and is beyond what this app was
   asked to do.

## Turning it off

Blank out any field in `js/config.js` and the app returns to local-only
storage, with no requests made. Nothing breaks; existing local progress is
untouched.

## Troubleshooting

| Symptom | Cause |
|---|---|
| Badge stuck on **Sync problem**, CORS error in the console | The site's hostname is not registered under Project settings → Platforms |
| `401` / "missing scope" | Collection permissions do not include **Any** for read/create/update |
| `404` on first load | Normal — no record exists yet; the app creates one immediately |
| Badge says **Local only** | `js/config.js` still has a blank field |
| Two phones show different data | Check both show the *same* record id in Settings — a different spelling of the name makes a different record |
