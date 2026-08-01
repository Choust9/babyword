#!/usr/bin/env node
/*
 * build.js — assemble the deployable site into dist/.
 *
 * This app has no build step: it is plain HTML/CSS/JS that runs straight from
 * the repo root. But most hosts (Appwrite Sites, Netlify, Vercel, Cloudflare
 * Pages) auto-detect a package.json, assume a framework, and run
 * `npm run build` expecting an output directory. Without this script that fails
 * with "Missing script: build".
 *
 * So: validate the curriculum, then copy the static assets into dist/.
 * Point your host's output directory at `dist`.
 *
 * Run with: npm run build
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const out = path.join(root, 'dist');

// Everything the running site needs. Docs, scripts and tooling stay out.
const ASSETS = [
  'index.html',
  'manifest.webmanifest',
  'service-worker.js',
  'css',
  'js',
  'icons',
];

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) copy(path.join(src, entry), path.join(dest, entry));
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Fail the deploy if the curriculum is invalid — better than shipping it.
execFileSync(process.execPath, [path.join(__dirname, 'check-data.js')], { stdio: 'inherit' });

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

let files = 0;
for (const asset of ASSETS) {
  const src = path.join(root, asset);
  if (!fs.existsSync(src)) {
    console.error(`✗ missing asset: ${asset}`);
    process.exit(1);
  }
  copy(src, path.join(out, asset));
}

(function count(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) count(path.join(dir, entry.name));
    else files++;
  }
})(out);

console.log(`✓ built dist/ — ${files} files ready to deploy`);
