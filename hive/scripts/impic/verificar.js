// Verificação pós-inserção (só leitura): contagens por distrito antes/depois, barra de confiança,
// empresas de uma pessoa, empilhamento, e o que a API pública devolve.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const { distritoDe, DISTRITOS } = require('./geo-pt');
const { filtroEntidade } = require('./ficha');

(async () => {
  const LOG = dados('inseridas.jsonl');
  const ins = fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
  const ids = ins.map(x => x.id);
  console.log('inseridas (registo):', ins.length);

  // 1) contagens por distrito, mesmo método do antes.js
  const rows = await q(`SELECT id, city, address FROM companies WHERE status='approved' AND lower(country)='pt'`);
  const cont = {};
  for (const r of rows) {
    let d = distritoDe(r.city);
    if (!d && r.address) { const m = String(r.address).match(/\d{4}-\d{3}\s+([^,]+)$/); if (m) d = distritoDe(m[1]); }
    cont[d || '?'] = (cont[d || '?'] || 0) + 1;
  }
  const antes = JSON.parse(fs.readFileSync(dados('antes-por-distrito.json'), 'utf8'));
  console.log(`\nPT aprovadas: ${antes.total} → ${rows.length}`);
  console.log('distrito          antes  depois   +');
  for (const d of [...DISTRITOS, '?']) console.log(`${d.padEnd(16)} ${String(antes.cont[d] || 0).padStart(6)} ${String(cont[d] || 0).padStart(7)} ${String((cont[d] || 0) - (antes.cont[d] || 0)).padStart(5)}`);
  fs.writeFileSync(dados('depois-por-distrito.json'), JSON.stringify({ t: new Date().toISOString(), total: rows.length, cont }, null, 1));
  if (!ids.length) return;

  // 2) as fichas novas na BD
  const novas = await q(`SELECT id, name, nif, alvara, email, phone, website, status, lat, lng, sector, confidence, created_by, tags, city FROM companies WHERE id = ANY($1)`, [ids]);
  const canais = r => (r.alvara ? 1 : 0) + (r.email ? 1 : 0) + (String(r.phone).replace(/\D/g, '').length >= 9 ? 1 : 0) + (r.website ? 1 : 0);
  console.log(`\nnovas na BD: ${novas.length}/${ids.length} | aprovadas ${novas.filter(r => r.status === 'approved').length}`);
  console.log('com < 2 canais:', novas.filter(r => canais(r) < 2).length, '| sem alvará:', novas.filter(r => !r.alvara).length, '| confidence≠3:', novas.filter(r => r.confidence !== 3).length, '| created_by≠7:', novas.filter(r => +r.created_by !== 7).length);
  console.log('nome de uma pessoa/unipessoal/entidade:', novas.filter(r => r.status === 'approved' && filtroEntidade(r.name.toUpperCase(), r.nif)).map(r => r.id + ' ' + r.name));
  const nifDup = await q(`SELECT nif, count(*)::int n FROM companies WHERE nif = ANY($1) GROUP BY nif HAVING count(*) > 1`, [novas.map(r => r.nif)]);
  console.log('NIF duplicado:', nifDup.length);
  console.log('cidade que não é um concelho oficial (grafia do IMPIC por corrigir):', novas.filter(r => r.status === 'approved' && !distritoDe(r.city)).map(r => r.id + ' ' + r.city));

  // 3) empilhamento: pontos exatos partilhados e células densas (≥4 por ~110 m) que incluam fichas novas
  const pilhas = await q(`SELECT round(lat::numeric,5) la, round(lng::numeric,5) lo, count(*)::int n FROM companies
    WHERE status='approved' AND (round(lat::numeric,5), round(lng::numeric,5)) IN (SELECT round(lat::numeric,5), round(lng::numeric,5) FROM companies WHERE id = ANY($1))
    GROUP BY 1,2 HAVING count(*) > 1 ORDER BY 3 DESC LIMIT 10`, [ids]);
  console.log('pontos exatos partilhados com fichas novas:', pilhas.length, pilhas.slice(0, 5).map(p => `${p.la},${p.lo}×${p.n}`).join(' '));
  const densas = await q(`SELECT round(lat::numeric,3) la, round(lng::numeric,3) lo, count(*)::int n, count(*) FILTER (WHERE id = ANY($1))::int novas FROM companies
    WHERE status='approved' AND lower(country)='pt' GROUP BY 1,2 HAVING count(*) >= 4 AND count(*) FILTER (WHERE id = ANY($1)) > 0 ORDER BY 3 DESC LIMIT 10`, [ids]);
  console.log('células ~110 m com ≥4 empresas (com novas):', densas.length, densas.slice(0, 6).map(p => `${p.la},${p.lo}:${p.n}(${p.novas} novas)`).join(' '));

  // 4) API pública (cache CDN até 5 min)
  try {
    const r = await fetch('https://www.hivex.pt/api/companies?country=pt&compact=1', { headers: { 'Accept-Encoding': 'gzip' } });
    const j = await r.json();
    const set = new Set(j.map(x => +x.id));
    console.log(`\nAPI ?country=pt: HTTP ${r.status}, ${j.length} empresas, ${ids.filter(i => set.has(i)).length}/${ids.length} novas já visíveis (cache ${r.headers.get('x-vercel-cache')}, age ${r.headers.get('age')})`);
    const t = await (await fetch('https://www.hivex.pt/api/companies/totals')).json();
    console.log('API /totals:', JSON.stringify(t));
  } catch (e) { console.log('API: erro', e.message); }
})().catch(e => { console.error(e); process.exit(1); });
