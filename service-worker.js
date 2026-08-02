/*
 * service-worker.js — makes Babblr installable and fully offline.
 *
 * Strategy: NETWORK-FIRST for the app shell, with the cache as an offline
 * fallback.
 *
 * It used to be cache-first, which is why a deploy could go out and every
 * device would keep showing the previous build indefinitely: index.html,
 * app.js and styles.css were answered from the cache and the network was
 * never consulted. Bumping the cache version does not help, because the page
 * doing the checking was itself served from the stale cache.
 *
 * Network-first costs a round trip on each asset when online, and in exchange
 * a new deploy is live immediately. For an app under active development that
 * is the right way round. Offline still works: everything is precached on
 * install and refreshed on every successful fetch.
 *
 * APP_VERSION must match window.BABBLR_VERSION in js/version.js —
 * `npm run check` enforces it.
 */

const APP_VERSION = '2.1.0';
const CACHE_VERSION = `babblr-${APP_VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/version.js',
  './js/config.js',
  './js/phonics.js',
  './js/data.js',
  './js/storage.js',
  './js/sync.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      // One bad asset must not abort the whole install.
      .then((cache) => Promise.allSettled(ASSETS.map((a) => cache.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Never intercept cross-origin requests — notably the Appwrite sync API,
  // which must always be live.
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      // Only cache real responses; an opaque or error response would poison it.
      if (fresh && fresh.ok) {
        const cache = await caches.open(CACHE_VERSION);
        cache.put(req, fresh.clone()).catch(() => {});
      }
      return fresh;
    } catch (_) {
      // Offline: fall back to this version's cache only, never an older one.
      const cache = await caches.open(CACHE_VERSION);
      const cached = await cache.match(req);
      if (cached) return cached;
      if (req.mode === 'navigate') {
        const shell = await cache.match('./index.html');
        if (shell) return shell;
      }
      return Response.error();
    }
  })());
});

// Lets the page ask a waiting worker to take over immediately.
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
