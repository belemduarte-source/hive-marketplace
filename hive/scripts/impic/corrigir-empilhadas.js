// Corrige fichas INSERIDAS por este pipeline que ficaram a < PERTO_M metros de outra empresa aprovada
// (a comparação antiga por chave arredondada a 5 casas deixava passar pontos quase iguais: o mapa só abre
// em leque os que têm a mesma chave, os outros tapam-se). Fica no sítio a ficha mais antiga; a mais nova
// vai para a porta INE livre mais próxima (≤ 0,6 km, ≥ PERTO_M de qualquer empresa). Sem porta livre → é
// retirada (status removed), como as retidas na inserção. Só mexe em fichas de inseridas.jsonl (created_by=7).
// Por omissão SÓ ENSAIO; grava com --gravar (cada correção fica em corrigidas.jsonl).
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const { km } = require('./geocode');
const GRAVAR = process.argv.includes('--gravar');
const PERTO_M = 5;
const L = f => fs.existsSync(dados(f)) ? fs.readFileSync(dados(f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean) : [];
(async () => {
  const ins = new Map(L('inseridas.jsonl').map(x => [+x.id, x]));
  const proc = new Map(); for (const x of L('processadas.jsonl')) proc.set(x.key, x);
  const rows = await q(`SELECT id::int id, lat::float8 lat, lng::float8 lng FROM companies WHERE status='approved' AND lower(country)='pt' AND lat IS NOT NULL`);
  const pos = new Map(rows.map(r => [r.id, [r.lat, r.lng]]));
  const cel = (a, b) => Math.floor(a * 2000) + ':' + Math.floor(b * 2000);
  const g = new Map();
  const por = (id, a, b) => { const k = cel(a, b); if (!g.has(k)) g.set(k, new Set()); g.get(k).add(id); };
  const tira = (id, a, b) => { const s = g.get(cel(a, b)); if (s) s.delete(id); };
  for (const r of rows) por(r.id, r.lat, r.lng);
  const vizinhos = (a, b, excl) => { const out = []; const A = Math.floor(a * 2000), B = Math.floor(b * 2000);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const id of g.get((A + i) + ':' + (B + j)) || []) {
      if (id === excl) continue; const [x, y] = pos.get(id); const d = km(a, b, x, y) * 1000; if (d < PERTO_M) out.push({ id, d }); }
    return out; };
  // a mover: fichas inseridas com uma empresa MAIS ANTIGA (id menor) a < PERTO_M
  const mover = [...ins.keys()].filter(id => pos.has(id)).sort((a, b) => a - b)
    .filter(id => { const [a, b] = pos.get(id); return vizinhos(a, b, id).some(v => v.id < id); });
  const res = { movidas: 0, 'sem-porta-livre': 0 }, log = dados('corrigidas.jsonl');
  for (const id of mover) {
    const [a, b] = pos.get(id);
    if (!vizinhos(a, b, id).some(v => v.id < id)) continue;          // uma correção anterior já resolveu
    const x = ins.get(id), p = proc.get(x.key);
    const alt = ((p && p.geo && p.geo.alt) || []).map(([u, v]) => ({ u, v, d: km(a, b, u, v) }))
      .filter(o => o.d <= 0.6 && o.d * 1000 >= PERTO_M && !vizinhos(o.u, o.v, id).length).sort((m, n) => m.d - n.d);
    const viz = vizinhos(a, b, id).map(v => `${v.id}@${v.d.toFixed(1)}m`).join(',');
    if (!alt.length) {
      res['sem-porta-livre']++;
      console.log(`${GRAVAR ? 'RETIRAR' : 'retiraria'} (sem porta livre) | ${id} ${x.name} | perto de ${viz}`);
      if (GRAVAR) {
        const r = await q(`UPDATE companies SET status='removed', removed_at=NOW(), updated_at=NOW() WHERE id=$1 AND created_by=7 AND status='approved' RETURNING id`, [id]);
        if (r.length) fs.appendFileSync(log, JSON.stringify({ t: new Date().toISOString(), id, key: x.key, acao: 'retirada', em: [a, b], motivo: `a < ${PERTO_M} m de ${viz}, sem porta INE livre` }) + '\n');
      }
      tira(id, a, b); continue;
    }
    const n = alt[0];
    console.log(`${GRAVAR ? 'MOVER' : 'moveria'} | ${id} ${x.name} | perto de ${viz} | ${a.toFixed(6)},${b.toFixed(6)} → ${n.u.toFixed(6)},${n.v.toFixed(6)} (${Math.round(n.d * 1000)} m)`);
    if (GRAVAR) {
      const r = await q(`UPDATE companies SET lat=$1, lng=$2, updated_at=NOW() WHERE id=$3 AND created_by=7 AND abs(lat-$4)<1e-7 AND abs(lng-$5)<1e-7 RETURNING id`, [n.u, n.v, id, a, b]);
      if (!r.length) { console.log('  (não alterada: a ficha mudou entretanto)'); continue; }
      fs.appendFileSync(log, JSON.stringify({ t: new Date().toISOString(), id, key: x.key, acao: 'movida', de: [a, b], para: [n.u, n.v], m: Math.round(n.d * 1000), motivo: `a < ${PERTO_M} m de ${viz}` }) + '\n');
    }
    tira(id, a, b); pos.set(id, [n.u, n.v]); por(id, n.u, n.v); res.movidas++;
  }
  console.log(`[corrigir-empilhadas] ${GRAVAR ? 'GRAVADO' : 'ENSAIO'} a mover ${mover.length} | ${JSON.stringify(res)}`);
})().catch(e => { console.error('[corrigir-empilhadas] ERRO', e.message); process.exit(1); });
