// Confere as fichas de alvo-inseridas.jsonl (leitura por ids, sem logo): estado, canais, atividades e pontos a < 5 m.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const { km } = require('./geocode');
const D = f => dados(f);
(async () => {
  const L = fs.readFileSync(D('alvo-inseridas.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  const ids = L.map(x => x.id);
  const r = await q(`SELECT id::int id, name, status, sector, sectors, city, confidence, created_by::int created_by, (coalesce(alvara,'')<>'') alv, (coalesce(email,'')<>'') em, (coalesce(phone,'')<>'') tel, (coalesce(website,'')<>'') web, lat::float8 lat, lng::float8 lng FROM companies WHERE id = ANY($1) ORDER BY id`, [ids]);
  const canais = x => (+x.alv) + (+x.em) + (+x.tel) + (+x.web);
  console.log(`na BD ${r.length}/${ids.length} | aprovadas ${r.filter(x => x.status === 'approved').length} | < 2 canais ${r.filter(x => canais(x) < 2).length} | com alvará ${r.filter(x => x.alv).length} | com site ${r.filter(x => x.web).length} | created_by≠7 ${r.filter(x => x.created_by !== 7).length}`);
  let perto = 0; for (let i = 0; i < r.length; i++) for (let j = i + 1; j < r.length; j++) if (km(r[i].lat, r[i].lng, r[j].lat, r[j].lng) * 1000 < 5) perto++;
  console.log('pares a < 5 m entre as novas:', perto);
  const c = {}; for (const x of r) c[x.city] = (c[x.city] || 0) + 1;
  console.log('por concelho:', Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(', '));
})().catch(e => { console.error(e.message.slice(0, 300)); process.exit(1); });
