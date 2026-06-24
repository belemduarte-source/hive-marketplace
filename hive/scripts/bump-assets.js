#!/usr/bin/env node
/*
 * bump-assets.js — automate cache-busting for the static frontend.
 *
 * The CSS is served `immutable` (1-year cache) by vercel.json, so a content
 * change only reaches returning visitors when the FILENAME changes. This script
 * does the bump that used to be manual and error-prone:
 *   1. renames  frontend/app.vN.css -> app.v(N+1).css
 *   2. updates  the <link rel="stylesheet"> reference in index.html
 *   3. bumps    the service-worker CACHE_NAME (hive-vM -> hive-v(M+1))
 *
 * Usage:  node hive/scripts/bump-assets.js
 * (Run after editing the CSS; then commit + push as usual.)
 */
const fs = require('fs');
const path = require('path');

const FRONTEND = path.resolve(__dirname, '..', 'frontend');
const INDEX = path.join(FRONTEND, 'index.html');
const SW = path.join(FRONTEND, 'sw.js');

function fail(msg) { console.error('✖ ' + msg); process.exit(1); }

// 1+2. CSS filename + index.html reference
let html = fs.readFileSync(INDEX, 'utf8');
const cssMatch = html.match(/app\.v(\d+)\.css/);
if (!cssMatch) fail('Could not find app.vN.css reference in index.html');
const curCss = cssMatch[1];
const nextCss = Number(curCss) + 1;
const oldFile = path.join(FRONTEND, `app.v${curCss}.css`);
const newFile = path.join(FRONTEND, `app.v${nextCss}.css`);
if (!fs.existsSync(oldFile)) fail(`Missing ${path.basename(oldFile)} on disk`);
fs.renameSync(oldFile, newFile);
html = html.replace(new RegExp(`app\\.v${curCss}\\.css`, 'g'), `app.v${nextCss}.css`);
fs.writeFileSync(INDEX, html);

// 3. service-worker cache name
let sw = fs.readFileSync(SW, 'utf8');
const swMatch = sw.match(/hive-v(\d+)/);
if (!swMatch) fail('Could not find hive-vM cache name in sw.js');
const nextSw = Number(swMatch[1]) + 1;
sw = sw.replace(/hive-v\d+/, `hive-v${nextSw}`);
fs.writeFileSync(SW, sw);

console.log(`✔ CSS  app.v${curCss}.css -> app.v${nextCss}.css (index.html updated)`);
console.log(`✔ SW   cache hive-v${swMatch[1]} -> hive-v${nextSw}`);
console.log('  Next: git add -A && commit && push');
