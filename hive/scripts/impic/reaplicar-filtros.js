// Reaplica os filtros de entidade (ficha.js) às fichas JÁ INSERIDAS por este pipeline: quando uma regra fica
// mais apertada (ex.: grafias de "unipessoal" que o IMPIC abrevia ou escreve mal), as que já entraram e agora
// falham são retiradas (status removed), como as recusadas na inserção. Só mexe em fichas de inseridas.jsonl
// (created_by=7, aprovadas). Por omissão SÓ ENSAIO; grava com --gravar (cada retirada fica em corrigidas.jsonl).
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const { filtroEntidade } = require('./ficha');
const GRAVAR = process.argv.includes('--gravar');
const L = f => fs.existsSync(dados(f)) ? fs.readFileSync(dados(f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean) : [];
(async () => {
  const ins = new Map(L('inseridas.jsonl').map(x => [+x.id, x]));
  const rows = await q(`SELECT id::int id, name, nif, lat::float8 lat, lng::float8 lng FROM companies WHERE id = ANY($1) AND status='approved' AND created_by=7`, [[...ins.keys()]]);
  const falham = rows.map(r => ({ ...r, motivo: filtroEntidade(r.name, r.nif) })).filter(r => r.motivo);
  const res = {}, log = dados('corrigidas.jsonl');
  for (const r of falham) {
    res[r.motivo] = (res[r.motivo] || 0) + 1;
    console.log(`${GRAVAR ? 'RETIRAR' : 'retiraria'} (${r.motivo}) | ${r.id} ${r.name} | NIF ${r.nif}`);
    if (!GRAVAR) continue;
    const u = await q(`UPDATE companies SET status='removed', removed_at=NOW(), updated_at=NOW() WHERE id=$1 AND created_by=7 AND status='approved' RETURNING id`, [r.id]);
    if (u.length) fs.appendFileSync(log, JSON.stringify({ t: new Date().toISOString(), id: r.id, key: ins.get(r.id).key, acao: 'retirada', regra: r.motivo, em: [r.lat, r.lng], motivo: `filtro de entidade reaplicado: ${r.motivo} (${r.name})` }) + '\n');
  }
  console.log(`[reaplicar-filtros] ${GRAVAR ? 'GRAVADO' : 'ENSAIO'} aprovadas verificadas ${rows.length} | a retirar ${falham.length} | ${JSON.stringify(res)}`);
})().catch(e => { console.error('[reaplicar-filtros] ERRO', e.message); process.exit(1); });
