#!/usr/bin/env node
/*
 * bump-assets.js — automate cache-busting for the static frontend.
 *
 * The CSS and app JS are served `immutable` (1-year cache) by vercel.json, so
 * a content change only reaches returning visitors when the FILENAME changes.
 * This script does the bump that used to be manual and error-prone:
 *   1. renames  frontend/app.vN.css -> app.v(N+1).css
 *   2. renames  frontend/app.vN.js  -> app.v(N+1).js   (same N — kept aligned)
 *   3. updates  both references in index.html
 *   4. bumps    the service-worker CACHE_NAME (hive-vM -> hive-v(M+1))
 *
 * Crash-safety (2026-07-13): uma escrita do index.html falhou a meio com um
 * lock transitório do Windows DEPOIS dos renames — o commit desse estado
 * inconsistente derrubou produção (index a apontar para ficheiros removidos).
 * Agora: retry na escrita, ROLLBACK dos renames se falhar na mesma, e uma
 * verificação final que garante que tudo o que o index referencia existe.
 *
 * Usage:  node hive/scripts/bump-assets.js
 * (Run after editing the CSS or app JS; then commit + push as usual.)
 */
const fs = require('fs');
const path = require('path');

const FRONTEND = path.resolve(__dirname, '..', 'frontend');
const INDEX = path.join(FRONTEND, 'index.html');
const SW = path.join(FRONTEND, 'sw.js');

function fail(msg) { console.error('✖ ' + msg); process.exit(1); }

// Escrita com novas tentativas — locks transitórios (antivírus, preview com o
// ficheiro aberto) no Windows fazem o writeFileSync falhar esporadicamente.
function writeComRetry(file, data, tentativas = 6) {
  for (let i = 1; ; i++) {
    try { fs.writeFileSync(file, data); return; }
    catch (e) {
      if (i >= tentativas) throw e;
      console.warn(`  escrita de ${path.basename(file)} falhou (${e.code || e.message}); tentativa ${i}/${tentativas}…`);
      const fim = Date.now() + 500;
      while (Date.now() < fim) { /* espera síncrona curta */ }
    }
  }
}

// 1-3. CSS + JS filenames + index.html references
let html = fs.readFileSync(INDEX, 'utf8');
const cssMatch = html.match(/app\.v(\d+)\.css/);
if (!cssMatch) fail('Could not find app.vN.css reference in index.html');
const curCss = cssMatch[1];
const nextCss = Number(curCss) + 1;
const oldFile = path.join(FRONTEND, `app.v${curCss}.css`);
const newFile = path.join(FRONTEND, `app.v${nextCss}.css`);
if (!fs.existsSync(oldFile)) fail(`Missing ${path.basename(oldFile)} on disk`);

// App JS is versioned in lockstep with the CSS (same number). Tolerate its
// absence so the script still works on branches that predate the extraction.
const jsMatch = html.match(/app\.v(\d+)\.js/);
const oldJs = jsMatch ? path.join(FRONTEND, `app.v${jsMatch[1]}.js`) : null;
const newJs = jsMatch ? path.join(FRONTEND, `app.v${nextCss}.js`) : null;
if (jsMatch && !fs.existsSync(oldJs)) fail(`Missing ${path.basename(oldJs)} on disk`);

// Renomeia, mas com rollback garantido se a escrita do index falhar de vez.
const renamesFeitos = [];
try {
  fs.renameSync(oldFile, newFile);
  renamesFeitos.push([newFile, oldFile]);
  html = html.replace(new RegExp(`app\\.v${curCss}\\.css`, 'g'), `app.v${nextCss}.css`);
  if (jsMatch) {
    fs.renameSync(oldJs, newJs);
    renamesFeitos.push([newJs, oldJs]);
    html = html.replace(new RegExp(`app\\.v${jsMatch[1]}\\.js`, 'g'), `app.v${nextCss}.js`);
  }
  writeComRetry(INDEX, html);
} catch (e) {
  console.error('✖ Falha a atualizar o index.html — a reverter os renames…');
  for (const [de, para] of renamesFeitos.reverse()) {
    try { fs.renameSync(de, para); console.error(`  revertido: ${path.basename(de)} -> ${path.basename(para)}`); }
    catch (e2) { console.error(`  ROLLBACK FALHOU para ${path.basename(de)}: ${e2.message} — repõe à mão!`); }
  }
  fail('Bump abortado sem alterações efetivas (' + (e.code || e.message) + ')');
}

// 3. service-worker cache name (não-fatal se falhar: index já está consistente)
let sw = fs.readFileSync(SW, 'utf8');
const swMatch = sw.match(/hive-v(\d+)/);
if (!swMatch) fail('Could not find hive-vM cache name in sw.js');
const nextSw = Number(swMatch[1]) + 1;
sw = sw.replace(/hive-v\d+/, `hive-v${nextSw}`);
writeComRetry(SW, sw);

// Verificação final: TUDO o que o index referencia tem de existir em disco.
// É esta a rede de segurança contra o estado que derrubou produção.
const finalHtml = fs.readFileSync(INDEX, 'utf8');
const refs = [...new Set(finalHtml.match(/app\.v\d+\.(?:js|css)/g) || [])];
const emFalta = refs.filter(r => !fs.existsSync(path.join(FRONTEND, r)));
if (emFalta.length) fail('INCONSISTENTE: index.html referencia ficheiros inexistentes: ' + emFalta.join(', '));

console.log(`✔ CSS  app.v${curCss}.css -> app.v${nextCss}.css (index.html updated)`);
if (jsMatch) console.log(`✔ JS   app.v${jsMatch[1]}.js -> app.v${nextCss}.js (index.html updated)`);
console.log(`✔ SW   cache hive-v${swMatch[1]} -> hive-v${nextSw}`);
console.log(`✔ Verificação: ${refs.join(', ')} existem em disco`);
console.log('  Next: git add -A && commit && push');
