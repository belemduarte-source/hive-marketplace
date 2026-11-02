// Acrescenta atividades da licença às fichas de licencas-final.json. Por omissão SÓ ENSAIO; grava com --gravar.
// Só acrescenta a `sectors` (nunca altera `sector`), só em fichas desta importação (created_by=7, aprovadas), em lotes pequenos,
// sobre o valor atual da BD. Log: licencas-alteradas.jsonl. Desfazer: --reverter retira só o que este script acrescentou.
// licencas-excluir.json (opcional): ids a deixar de fora, por exemplo os da amostra da auditoria.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const D = f => dados(f);
const GRAVAR = process.argv.includes('--gravar'), REVERTER = process.argv.includes('--reverter');
const LOG = D('licencas-alteradas.jsonl'), LOTE = 100;
const dorme = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  if (REVERTER) {
    const L = fs.readFileSync(LOG, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
    console.log('a reverter:', L.length, GRAVAR ? '' : '(ensaio: usar também --gravar)');
    if (!GRAVAR) return;
    for (let i = 0; i < L.length; i += LOTE) {
      const lote = L.slice(i, i + LOTE).map(x => ({ id: x.id, novos: x.acrescentadas }));
      await q(`UPDATE companies c SET sectors = ARRAY(SELECT e FROM unnest(c.sectors) e WHERE NOT EXISTS (SELECT 1 FROM jsonb_array_elements_text(v.novos) n WHERE n = e)), updated_at = NOW()
                 FROM jsonb_to_recordset($1::jsonb) AS v(id bigint, novos jsonb) WHERE c.id = v.id AND c.created_by = 7`, [JSON.stringify(lote)]);
      await dorme(800);
    }
    console.log('revertido'); return;
  }
  const fim = JSON.parse(fs.readFileSync(D('licencas-final.json'), 'utf8'));
  const excl = fs.existsSync(D('licencas-excluir.json')) ? new Set(JSON.parse(fs.readFileSync(D('licencas-excluir.json'), 'utf8')).map(Number)) : new Set();
  const feitos = fs.existsSync(LOG) ? new Set(fs.readFileSync(LOG, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l).id)) : new Set();
  const alvo = fim.filter(f => !excl.has(f.id) && !feitos.has(f.id)).slice(0, +process.env.LIMITE || undefined);   // LIMITE: teste com poucas fichas
  const vivos = await q(`SELECT id::int id, sector, sectors, status, created_by::int created_by FROM companies WHERE id = ANY($1)`, [alvo.map(f => f.id)]);
  const porId = new Map(vivos.map(r => [r.id, r]));
  const fora = { naoAprovada: 0, geridaPelaEmpresa: 0, primarioMudou: 0, semNada: 0, excluidaAuditoria: excl.size };
  const lista = [];
  for (const f of alvo) {
    const r = porId.get(f.id);
    if (!r || r.status !== 'approved') { fora.naoAprovada++; continue; }
    if (r.created_by !== 7) { fora.geridaPelaEmpresa++; continue; }
    if (r.sector !== f.primario) { fora.primarioMudou++; continue; }   // alguém corrigiu o setor principal: não acrescentar sobre uma decisão nova
    const novos = f.novos.filter(s => !(r.sectors || []).includes(s) && s !== r.sector);
    if (!novos.length) { fora.semNada++; continue; }
    lista.push({ f, r, novos });
  }
  console.log(`alvo ${alvo.length} | a alterar ${lista.length} | atividades ${lista.reduce((t, x) => t + x.novos.length, 0)} | fora ${JSON.stringify(fora)}`);
  for (const x of lista.slice(0, 6)) console.log(' ', x.f.id, x.f.name.slice(0, 38), '|', (x.r.sectors || []).join(','), '+', x.novos.join(','));
  if (!GRAVAR) { console.log('(ensaio: nada gravado)'); return; }
  let feitosN = 0;
  for (let i = 0; i < lista.length; i += LOTE) {
    const lote = lista.slice(i, i + LOTE);
    const r = await q(`UPDATE companies c SET sectors = c.sectors || ARRAY(SELECT n FROM jsonb_array_elements_text(v.novos) n WHERE NOT n = ANY(c.sectors)), updated_at = NOW()
        FROM jsonb_to_recordset($1::jsonb) AS v(id bigint, novos jsonb) WHERE c.id = v.id AND c.created_by = 7 AND c.status = 'approved' RETURNING c.id::int id, c.sectors`,
      [JSON.stringify(lote.map(x => ({ id: x.f.id, novos: x.novos })))]);
    const depois = new Map(r.map(o => [o.id, o.sectors]));
    for (const x of lote) { if (!depois.has(x.f.id)) continue; fs.appendFileSync(LOG, JSON.stringify({ t: new Date().toISOString(), id: x.f.id, name: x.f.name, sector: x.r.sector, antes: x.r.sectors, acrescentadas: x.novos, depois: depois.get(x.f.id), porque: x.f.porque }) + '\n'); feitosN++; }
    console.log(`[licencas] ${Math.min(i + LOTE, lista.length)}/${lista.length}`);
    await dorme(1000);
  }
  console.log(`[licencas] GRAVADAS ${feitosN} fichas`);
})().catch(e => { console.error('[licencas] ERRO', e.message.slice(0, 400)); process.exit(1); });
