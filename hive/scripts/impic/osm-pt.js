// Fase de análise (não toca na BD): negócios de ofícios em Portugal no OpenStreetMap, só por tags estruturadas
// (craft=/shop=/office=), nunca por regex de nome (ver memória project-osm-name-regex-junk). Escreve osm-pt.json.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const SAIDA = dados('osm-pt.json');
const CRAFT = 'electrician|plumber|carpenter|painter|roofer|hvac|tiler|plasterer|stonemason|mason|glaziery|metal_construction|window_construction|builder|gardener|floorer|insulation|locksmith|joiner|cabinet_maker|scaffolder|sawmill|solar|tinsmith|blacksmith|parquet_layer|chimney_sweeper';
const SHOP = 'doityourself|hardware|trade|bathroom_furnishing|kitchen|flooring|tiles|paint|glaziery|fireplace|swimming_pool|garden_centre|security|energy';
const OFFICE = 'architect|engineer|surveyor|construction_company|construction|interior_design|contractor|electrician|plumber|builder|energy_supplier';
const Q = `[out:json][timeout:180];
area["ISO3166-1"="PT"][admin_level=2]->.pt;
(
  nwr["craft"~"^(${CRAFT})$"](area.pt);
  nwr["shop"~"^(${SHOP})$"](area.pt);
  nwr["office"~"^(${OFFICE})$"](area.pt);
);
out tags center;`;
const SERVIDORES = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
(async () => {
  for (const u of SERVIDORES) {
    try {
      const r = await fetch(u, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'hivex-gap-analysis/1.0' }, body: 'data=' + encodeURIComponent(Q), signal: AbortSignal.timeout(240000) });
      if (!r.ok) { console.log('[osm]', u, r.status); continue; }
      const j = await r.json();
      fs.writeFileSync(SAIDA, JSON.stringify({ t: new Date().toISOString(), fonte: u, elementos: j.elements }));
      console.log('[osm] OK', u, j.elements.length, 'elementos');
      return;
    } catch (e) { console.log('[osm] falhou', u, e.message); }
  }
  console.log('[osm] nenhum servidor respondeu'); process.exit(1);
})();
