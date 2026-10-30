// Reaplica os filtros de entidade e de setor (ficha.js) às fichas JÁ INSERIDAS por este pipeline: quando uma regra fica
// mais apertada (ex.: grafias de "unipessoal" que o IMPIC abrevia ou escreve mal, ou uma subcategoria do IMPIC que a
// tabela de setores não conhecia), as que já entraram e agora falham são retiradas (status removed), como as recusadas
// na inserção. As que só mudariam de setor principal são listadas, não alteradas. Só mexe em fichas de inseridas.jsonl
// (created_by=7, aprovadas). Por omissão SÓ ENSAIO; grava com --gravar (cada retirada fica em corrigidas.jsonl).
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const { filtroEntidade, classificar } = require('./ficha');
const GRAVAR = process.argv.includes('--gravar');
const DET = dados('cache', 'det');
const L = f => fs.existsSync(dados(f)) ? fs.readFileSync(dados(f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean) : [];
// setor com as regras atuais, a partir do detalhe oficial em cache (igual a inserir.js)
const setorAtual = key => { const fd = path.join(DET, key + '.json'); if (!fs.existsSync(fd)) return null; const det = JSON.parse(fs.readFileSync(fd, 'utf8')); return classificar(det, det.nome); };
(async () => {
  const ins = new Map(L('inseridas.jsonl').map(x => [+x.id, x]));
  const rows = await q(`SELECT id::int id, name, nif, sector, lat::float8 lat, lng::float8 lng FROM companies WHERE id = ANY($1) AND status='approved' AND created_by=7`, [[...ins.keys()]]);
  const falham = [], mudaSetor = {};
  for (const r of rows) {
    const fe = filtroEntidade(r.name, r.nif);
    if (fe) { falham.push({ ...r, motivo: fe }); continue; }
    const cl = setorAtual(ins.get(r.id).key);
    if (cl && !cl.primario) { falham.push({ ...r, motivo: cl.motivo }); continue; }
    if (cl && cl.primario !== r.sector) { const k = `${r.sector} → ${cl.primario}`; (mudaSetor[k] = mudaSetor[k] || []).push(r.id); }
  }
  const res = {}, log = dados('corrigidas.jsonl');
  for (const r of falham) {
    res[r.motivo] = (res[r.motivo] || 0) + 1;
    console.log(`${GRAVAR ? 'RETIRAR' : 'retiraria'} (${r.motivo}) | ${r.id} ${r.name} | NIF ${r.nif}`);
    if (!GRAVAR) continue;
    const u = await q(`UPDATE companies SET status='removed', removed_at=NOW(), updated_at=NOW() WHERE id=$1 AND created_by=7 AND status='approved' RETURNING id`, [r.id]);
    if (u.length) fs.appendFileSync(log, JSON.stringify({ t: new Date().toISOString(), id: r.id, key: ins.get(r.id).key, acao: 'retirada', regra: r.motivo, em: [r.lat, r.lng], motivo: `filtro reaplicado: ${r.motivo} (${r.name})` }) + '\n');
  }
  for (const [k, ids] of Object.entries(mudaSetor)) console.log(`setor principal mudaria (não alterado): ${k} | ${ids.length} | ids ${ids.slice(0, 15).join(', ')}${ids.length > 15 ? '…' : ''}`);
  console.log(`[reaplicar-filtros] ${GRAVAR ? 'GRAVADO' : 'ENSAIO'} aprovadas verificadas ${rows.length} | a retirar ${falham.length} | ${JSON.stringify(res)}`);
})().catch(e => { console.error('[reaplicar-filtros] ERRO', e.message); process.exit(1); });
