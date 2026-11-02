// Lê uma folha de um .xlsx já descompactado (sharedStrings + sheetN.xml), sem dependências. Devolve linhas como arrays.
const fs = require('fs');
const path = require('path');
const dec = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
function lerFolha(dir, n = 1) {
  const ss = fs.existsSync(path.join(dir, 'xl/sharedStrings.xml')) ? fs.readFileSync(path.join(dir, 'xl/sharedStrings.xml'), 'utf8') : '';
  const strs = [...ss.matchAll(/<si>([\s\S]*?)<\/si>/g)].map(m => dec([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => x[1]).join('')));
  const xml = fs.readFileSync(path.join(dir, `xl/worksheets/sheet${n}.xml`), 'utf8');
  const col = ref => { let c = 0; for (const ch of ref.match(/^[A-Z]+/)[0]) c = c * 26 + ch.charCodeAt(0) - 64; return c - 1; };
  const linhas = [];
  for (const m of xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    const l = [];
    for (const c of m[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const ref = (c[1].match(/r="([A-Z]+\d+)"/) || [])[1]; if (!ref) continue;
      const t = (c[1].match(/t="(\w+)"/) || [])[1];
      const v = c[2] ? (c[2].match(/<v>([\s\S]*?)<\/v>/) || [])[1] : null;
      const inl = c[2] ? (c[2].match(/<t[^>]*>([\s\S]*?)<\/t>/) || [])[1] : null;
      l[col(ref)] = t === 's' ? strs[+v] : t === 'inlineStr' ? dec(inl || '') : (v != null ? dec(v) : '');
    }
    if (l.some(x => x != null && String(x).trim() !== '')) linhas.push(Array.from(l, x => x == null ? '' : String(x).trim()));
  }
  return linhas;
}
module.exports = { lerFolha };
if (require.main === module) {
  const [dir, n] = process.argv.slice(2);
  const L = lerFolha(dir, +(n || 1));
  console.log('linhas', L.length);
  for (const x of L.slice(0, 8)) console.log(JSON.stringify(x).slice(0, 260));
}
