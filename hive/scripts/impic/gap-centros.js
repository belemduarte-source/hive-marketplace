// Offline: ponto central de cada concelho = mediana das fichas PT com esse nome (bd-dedupe.json + inseridas.jsonl);
// com menos de 5 fichas fica o centro mediano do GeoAPI. Corrige casos como o Funchal, cujo concelho inclui as Selvagens.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { norm } = require('./geo-pt');
const D = f => dados(f);
const M = JSON.parse(fs.readFileSync(D('municipios.json'), 'utf8'));
const bd = JSON.parse(fs.readFileSync(D('bd-dedupe.json'), 'utf8')).rows.filter(r => r.country === 'pt' && r.status === 'approved');
const ins = fs.readFileSync(D('inseridas.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const pts = new Map();
const add = (city, la, lo) => { const k = norm(city); if (!isFinite(la) || !isFinite(lo)) return; if (!pts.has(k)) pts.set(k, []); pts.get(k).push([+la, +lo]); };
for (const r of bd) add(r.city, parseFloat(r.lat), parseFloat(r.lng));
for (const r of ins) add(r.city, r.lat, r.lng);
const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const km = (a, b, c, d) => { const r = x => x * Math.PI / 180, R = 6371; const h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
let troca = 0; const longe = [];
for (const m of Object.values(M)) {
  const k = norm(m.nome.replace(/\s*\(.*\)$/, ''));
  const p = pts.get(norm(m.nome)) || pts.get(k) || [];
  m.lat0 = m.lat; m.lng0 = m.lng; m.nFichas = p.length;
  if (p.length >= 5) { const la = med(p.map(x => x[0])), lo = med(p.map(x => x[1])); const d = km(m.lat, m.lng, la, lo); if (d > 8) longe.push(`${m.nome} ${d.toFixed(0)} km`); m.lat = la; m.lng = lo; troca++; }
}
fs.writeFileSync(D('municipios.json'), JSON.stringify(M));
console.log('centro pela mediana das fichas:', troca, '/', Object.keys(M).length, '| sem fichas suficientes:', Object.values(M).filter(m => m.nFichas < 5).map(m => m.nome + ' ' + m.pop).slice(0, 20).join(', '));
console.log('mudaram mais de 8 km:', longe.join(', '));
