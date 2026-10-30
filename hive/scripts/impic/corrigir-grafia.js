// Corrige a grafia do concelho (city) nas fichas JÁ INSERIDAS por este pipeline quando o IMPIC o escreve de outra
// maneira (ex.: "Freixo Espada à Cinta"), com a tabela GRAFIA de geo-pt.js que o inserir.js já aplica às novas.
// Só mexe em fichas de inseridas.jsonl (created_by=7, aprovadas) e só no campo city.
// Por omissão SÓ ENSAIO; grava com --gravar (cada correção fica em corrigidas.jsonl, regra 'grafia-concelho').
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const { GRAFIA } = require('./geo-pt');
const GRAVAR = process.argv.includes('--gravar');
const L = f => fs.existsSync(dados(f)) ? fs.readFileSync(dados(f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean) : [];
(async () => {
  const ins = new Map(L('inseridas.jsonl').map(x => [+x.id, x]));
  const rows = await q(`SELECT id::int id, name, city FROM companies WHERE id = ANY($1) AND status='approved' AND created_by=7 AND city = ANY($2)`, [[...ins.keys()], Object.keys(GRAFIA)]);
  const log = dados('corrigidas.jsonl');
  for (const r of rows) {
    const nova = GRAFIA[r.city];
    console.log(`${GRAVAR ? 'CORRIGIR' : 'corrigiria'} | ${r.id} ${r.name} | ${r.city} → ${nova}`);
    if (!GRAVAR) continue;
    const u = await q(`UPDATE companies SET city=$2, updated_at=NOW() WHERE id=$1 AND created_by=7 AND status='approved' AND city=$3 RETURNING id`, [r.id, nova, r.city]);
    if (u.length) fs.appendFileSync(log, JSON.stringify({ t: new Date().toISOString(), id: r.id, key: ins.get(r.id).key, acao: 'cidade-corrigida', regra: 'grafia-concelho', de: r.city, para: nova, motivo: `grafia do IMPIC: ${r.city} → ${nova} (${r.name})` }) + '\n');
  }
  console.log(`[corrigir-grafia] ${GRAVAR ? 'GRAVADO' : 'ENSAIO'} | ${rows.length} fichas com grafia por corrigir`);
})().catch(e => { console.error('[corrigir-grafia] ERRO', e.message); process.exit(1); });
