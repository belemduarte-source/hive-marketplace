// Fotografia de deduplicação (só leitura): TODAS as fichas, qualquer estado — uma empresa removida
// antes (uma-pessoa-auto, um-so-canal, lixo) nunca pode voltar por esta importação.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const { q } = require('./db');
(async () => {
  const out = [];
  let ultimo = 0;
  for (;;) {
    const r = await q(`SELECT id, status, lower(coalesce(country,'')) country, nullif(btrim(nif),'') nif,
        nullif(substring(coalesce(alvara,'') from '\\d+'),'') alv_num, upper(coalesce(alvara,'')) alvara,
        lower(btrim(coalesce(email,''))) email, regexp_replace(coalesce(phone,''),'\\D','','g') tel,
        lower(coalesce(website,'')) website, name, city, postal_code, lat, lng, tags
      FROM companies WHERE id > $1 ORDER BY id LIMIT 8000`, [ultimo]);
    if (!r.length) break;
    for (const x of r) out.push(x);
    ultimo = +r[r.length - 1].id;
    process.stdout.write(`\r${out.length}`);
  }
  fs.writeFileSync(dados('bd-dedupe.json'), JSON.stringify({ t: new Date().toISOString(), rows: out }));
  const pt = out.filter(x => x.country === 'pt');
  console.log(`\nfichas ${out.length} | PT ${pt.length} | com NIF ${out.filter(x => x.nif).length} | com alvará ${out.filter(x => x.alv_num).length}`);
})().catch(e => { console.error(e); process.exit(1); });
