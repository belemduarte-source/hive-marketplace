// Análise de lacunas cidade × atividade: UMA query agregada, só leitura, sem tocar em logo nem ler linhas inteiras.
// Devolve contagens por (cidade, atividade), por (quadrícula ~1 km, atividade), por CAE e por atividade com/sem alvará/site.
// Tudo o resto (raios, tabelas) faz-se offline a partir de gap-bruto.json. Correr uma só vez por análise.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const SAIDA = dados('gap-bruto.json');
if (fs.existsSync(SAIDA) && !process.argv.includes('--outra-vez')) { console.log('gap-bruto.json já existe; usar --outra-vez para repetir a query'); process.exit(0); }
const SQL = `
  WITH base AS (
    SELECT c.id, lower(trim(c.city)) AS city, round(c.lat::numeric, 2)::float8 AS gy, round(c.lng::numeric, 2)::float8 AS gx,
           left(coalesce(c.cae, ''), 5) AS cae, (coalesce(c.alvara, '') <> '') AS tem_alvara, (coalesce(c.website, '') <> '') AS tem_site, u.s
      FROM companies c
     CROSS JOIN LATERAL (SELECT DISTINCT v AS s FROM unnest(array_append(coalesce(c.sectors, '{}'::text[]), c.sector)) AS v WHERE v IS NOT NULL AND v <> '') u
     WHERE c.status = 'approved' AND lower(c.country) = 'pt'
  )
  SELECT GROUPING(city)::int AS g_city, GROUPING(gy)::int AS g_grid, GROUPING(cae)::int AS g_cae, GROUPING(tem_alvara)::int AS g_alv,
         city, gy, gx, s, cae, tem_alvara, tem_site, count(DISTINCT id)::int AS n
    FROM base
   GROUP BY GROUPING SETS ((city, s), (gy, gx, s), (cae), (s, tem_alvara, tem_site))`;
(async () => {
  const t0 = Date.now();
  const rows = await q(SQL);
  const json = JSON.stringify(rows);
  fs.writeFileSync(SAIDA, json);
  console.log(`[gap-query] ${rows.length} linhas agregadas, ${(json.length / 1024).toFixed(0)} KB, ${Date.now() - t0} ms`);
})().catch(e => { console.error('[gap-query] ERRO', e.message.slice(0, 500)); process.exit(1); });
