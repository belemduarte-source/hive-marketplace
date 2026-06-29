// Hivex production build — minifies the static frontend into hive/dist.
//
// Conservative on purpose: the app is one big index.html with ~250 inline
// onclick="fnName()" handlers that reference GLOBAL function names as strings.
// A minifier that renamed top-level identifiers would break those references, so
// every step collapses whitespace / dead code but NEVER renames top-level names
// (esbuild: minifyIdentifiers:false; terser: mangle:{toplevel:false}).
import esbuild from 'esbuild';
import { minify as minifyHtml } from 'html-minifier-terser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'frontend');
const DIST = path.join(ROOT, 'dist');
const kb = (n) => (n / 1024).toFixed(1) + 'KB';

// 1. Clean + copy everything (icons, manifest, robots, sitemap, ads.txt, etc.)
fs.rmSync(DIST, { recursive: true, force: true });
fs.cpSync(SRC, DIST, { recursive: true });
for (const junk of ['serve.log', 'serve.log.err']) {
  fs.rmSync(path.join(DIST, junk), { force: true });
}

let totalBefore = 0, totalAfter = 0;
const track = (b, a) => { totalBefore += b; totalAfter += a; };

// 2. CSS files
for (const f of fs.readdirSync(DIST)) {
  if (!f.endsWith('.css')) continue;
  const p = path.join(DIST, f);
  const src = fs.readFileSync(p, 'utf8');
  const out = await esbuild.transform(src, { loader: 'css', minify: true });
  fs.writeFileSync(p, out.code);
  track(src.length, out.code.length);
  console.log('css ', f.padEnd(16), kb(src.length), '->', kb(out.code.length));
}

// 3. Standalone JS (whitespace + syntax only; identifiers preserved)
for (const f of ['api.js', 'sw.js', 'demo-companies.js']) {
  const p = path.join(DIST, f);
  if (!fs.existsSync(p)) continue;
  const src = fs.readFileSync(p, 'utf8');
  const out = await esbuild.transform(src, {
    loader: 'js', minifyWhitespace: true, minifySyntax: true, minifyIdentifiers: false,
  });
  fs.writeFileSync(p, out.code);
  track(src.length, out.code.length);
  console.log('js  ', f.padEnd(16), kb(src.length), '->', kb(out.code.length));
}

// 4. index.html — collapse whitespace + minify inline CSS/JS (terser, no toplevel mangle)
const htmlPath = path.join(DIST, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const min = await minifyHtml(html, {
  collapseWhitespace: true,
  conservativeCollapse: true,   // keep one space so adjacent inline words don't merge
  removeComments: true,
  minifyCSS: true,
  minifyJS: { compress: true, mangle: { toplevel: false } }, // never rename top-level (onclick refs)
  keepClosingSlash: true,
});
fs.writeFileSync(htmlPath, min);
track(html.length, min.length);
console.log('html', 'index.html'.padEnd(16), kb(html.length), '->', kb(min.length));

console.log('\nTOTAL', kb(totalBefore), '->', kb(totalAfter),
  '(' + Math.round((1 - totalAfter / totalBefore) * 100) + '% smaller)');
