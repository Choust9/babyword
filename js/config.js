/*
 * config.js — optional Appwrite settings for shared, cross-device progress.
 *
 * Leave these blank and Babbler works exactly as before: everything stays in
 * localStorage on the one device. Fill them in and progress is also stored in
 * an Appwrite database, keyed by the baby's name + date of birth, so every
 * device that enters the same details sees the same record.
 *
 * See SYNC.md for the five-minute Appwrite setup.
 *
 * NOTE: these values are public — anyone who opens the site can read them.
 * That is normal for a browser app, but it does mean the collection is
 * readable and writable by anyone who finds it. SYNC.md explains the trade-off
 * and how to lock it down if you ever need to.
 */

window.BABBLER_CONFIG = {
  // e.g. 'https://fra.cloud.appwrite.io/v1'  (no trailing slash)
  endpoint: '',
  // Appwrite project ID
  projectId: '',
  // The database you created (e.g. the one named "Babbler")
  databaseId: '',
  // The collection inside it that holds one document per baby
  collectionId: '',
};
