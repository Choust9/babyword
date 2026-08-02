/*
 * config.js — optional Appwrite settings for shared, cross-device progress.
 *
 * Leave these blank and Babbler works exactly as before: everything stays in
 * localStorage on the one device. Fill them in and progress is also stored in
 * an Appwrite database as readable rows you can inspect in the console.
 *
 * Run `npm run setup:appwrite` to create the database and both collections,
 * then paste the ids it prints in here. See SYNC.md.
 *
 * NOTE: these values are public — anyone who opens the site can read them.
 * That is normal for a browser app. The *family code* that scopes a record is
 * deliberately NOT here: it is typed into the app on each device, so it never
 * appears in the page source.
 */

window.BABBLER_CONFIG = {
  // e.g. 'https://fra.cloud.appwrite.io/v1'  (no trailing slash)
  endpoint: '',
  // Appwrite project ID
  projectId: '',
  // The database (the setup script names it "Babbler")
  databaseId: '',
  // One document per baby
  babiesCollectionId: '',
  // One document per word or phrase taught — this is the audit trail
  progressCollectionId: '',
};
