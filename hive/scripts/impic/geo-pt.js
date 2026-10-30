// Concelho → distrito (308 municípios, GeoAPI.pt). Ilhas agrupadas em Madeira / Açores.
const fs = require('fs');
const path = require('path');
const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
// concelhos-por-distrito.json: 308 municípios (fonte: json.geoapi.pt/distritos/municipios)
const j = JSON.parse(fs.readFileSync(path.join(__dirname, 'concelhos-por-distrito.json'), 'utf8'));
const regiao = d => /madeira|porto santo/i.test(d) ? 'Madeira' : /^ilha/i.test(d) ? 'Açores' : d;
const C2D = new Map(), NOME = new Map();
for (const [d, ms] of Object.entries(j)) for (const m of ms) { C2D.set(norm(m), regiao(d)); NOME.set(norm(m), m); }
// variantes que aparecem em moradas/OSM e nos concelhos do IMPIC ("Lagoa (Algarve)", "Calheta (Madeira)"…)
const alias = { 'calheta sao jorge': 'calheta de sao jorge', 'calheta acores': 'calheta de sao jorge', 'calheta madeira': 'calheta',
  'lagoa algarve': 'lagoa', 'lagoa sao miguel': 'lagoa acores', 'praia da vitoria': 'praia da vitoria' };
function distritoDe(city) {
  const k = norm(city);
  if (C2D.has(k)) return C2D.get(k);
  if (alias[k] && C2D.has(alias[k])) return C2D.get(alias[k]);
  return null;
}
const DISTRITOS = ['Aveiro','Beja','Braga','Bragança','Castelo Branco','Coimbra','Évora','Faro','Guarda','Leiria','Lisboa','Portalegre','Porto','Santarém','Setúbal','Viana do Castelo','Vila Real','Viseu','Madeira','Açores'];
module.exports = { norm, distritoDe, C2D, NOME, DISTRITOS, regiao };
