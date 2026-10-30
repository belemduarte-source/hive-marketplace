const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const { q } = require('./db');
const { distritoDe, DISTRITOS, norm } = require('./geo-pt');
(async () => {
  const rows = await q(`SELECT id, city, address, postal_code, lat, lng FROM companies WHERE status='approved' AND lower(country)='pt'`);
  const cont = {}, semDist = {};
  for (const r of rows) {
    let d = distritoDe(r.city);
    if (!d && r.address) { const m = String(r.address).match(/\d{4}-\d{3}\s+([^,]+)$/); if (m) d = distritoDe(m[1]); }
    if (!d) { const k = r.city || '(vazio)'; semDist[k] = (semDist[k] || 0) + 1; d = '?'; }
    cont[d] = (cont[d] || 0) + 1;
  }
  console.log('total PT aprovadas', rows.length);
  for (const d of [...DISTRITOS, '?']) console.log(d.padEnd(18), cont[d] || 0);
  const top = Object.entries(semDist).sort((a, b) => b[1] - a[1]).slice(0, 40);
  console.log('sem distrito:', top.map(([k, v]) => k + ':' + v).join(', '));
  if (require('fs').existsSync(dados('antes-por-distrito.json'))) console.log('(antes-por-distrito.json já existe — fotografia ANTES preservada)'); else require('fs').writeFileSync(dados('antes-por-distrito.json'), JSON.stringify({ t: new Date().toISOString(), total: rows.length, cont }, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
