/*
 * version.js — the single place the app's version is declared.
 *
 * It is shown in Settings → About so you can tell at a glance which build a
 * device is actually running, which is the fastest way to spot a stale cache
 * or a deploy that did not land.
 *
 * `npm run check` fails if this does not match APP_VERSION in service-worker.js
 * — the two must move together or the cache name stops changing between
 * releases and clients never update.
 */
window.BABBLR_VERSION = '2.4.0';
