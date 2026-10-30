// Pares de empresas aprovadas em PT a menos de D metros em que pelo menos uma é das inseridas (só leitura).
// Uso: node pares-perto.js [D=8] [--json saida.json]
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const { km } = require('./geocode');
const D = +(process.argv[2] || 8);
const iJ = process.argv.indexOf('--json'), SAIDA = iJ > 0 ? process.argv[iJ + 1] : null;
(async () => {
  const ins = fs.readFileSync(dados('inseridas.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  const novos = new Map(ins.map(x => [+x.id, x]));
  const rows = (await q(`SELECT id::int id, lat::float8 lat, lng::float8 lng, name, address FROM companies WHERE status='approved' AND lower(country)='pt' AND lat IS NOT NULL`));
  const g = new Map(); const cel = (a, b) => Math.floor(a * 2000) + ':' + Math.floor(b * 2000);
  for (const r of rows) { const k = cel(r.lat, r.lng); if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const pares = [], vistos = new Set();
  for (const r of rows) {
    if (!novos.has(r.id)) continue;
    const a = Math.floor(r.lat * 2000), b = Math.floor(r.lng * 2000);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const s of g.get((a + i) + ':' + (b + j)) || []) {
      if (s.id === r.id) continue;
      const d = km(r.lat, r.lng, s.lat, s.lng) * 1000;
      if (d >= D) continue;
      const k = [r.id, s.id].sort((x, y) => x - y).join('-'); if (vistos.has(k)) continue; vistos.add(k);
      pares.push({ d: +d.toFixed(1), a: r, b: s, bNova: novos.has(s.id) });
    }
  }
  pares.sort((x, y) => x.d - y.d);
  console.log(`pares a < ${D} m com fichas novas: ${pares.length} | < 1 m: ${pares.filter(p => p.d < 1).length} | < 3 m: ${pares.filter(p => p.d < 3).length} | os dois novos: ${pares.filter(p => p.bNova).length}`);
  for (const p of pares) console.log(`${p.d} m | ${p.a.id} ${p.a.name} [${p.a.address}] <-> ${p.b.id} ${p.b.name} [${p.b.address}] ${p.bNova ? '(nova)' : '(existente)'}`);
  if (SAIDA) fs.writeFileSync(dados(SAIDA), JSON.stringify(pares, null, 1));
})().catch(e => { console.error(e.message); process.exit(1); });
