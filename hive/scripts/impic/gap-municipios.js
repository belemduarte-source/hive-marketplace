// Fase de análise (não toca na BD): população (Censos 2021) e ponto central dos 308 municípios, do GeoAPI.pt.
// Escreve municipios.json. Resumível: os já obtidos não se pedem outra vez. Um só processo, um pedido de cada vez.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const j = JSON.parse(fs.readFileSync(path.join(__dirname, 'concelhos-por-distrito.json'), 'utf8'));
const { regiao } = require('./geo-pt');
const SAIDA = dados('municipios.json');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const feito = fs.existsSync(SAIDA) ? JSON.parse(fs.readFileSync(SAIDA, 'utf8')) : {};

async function pede(nome) {
  for (let t = 0; t < 4; t++) {
    try {
      const r = await fetch('https://json.geoapi.pt/municipio/' + encodeURIComponent(nome), { signal: AbortSignal.timeout(30000) });
      if (r.status === 429) { await sleep(5000 * (t + 1)); continue; }
      if (!r.ok) return { erro: r.status };
      return await r.json();
    } catch (e) { await sleep(2000 * (t + 1)); }
  }
  return { erro: 'falhou' };
}

(async () => {
  const nomes = [];
  for (const [d, ms] of Object.entries(j)) for (const m of ms) nomes.push([m, regiao(d)]);
  let n = 0, erros = [];
  for (const [nome, regi] of nomes) {
    if (feito[nome]) continue;
    const x = await pede(nome);
    const c = x.geojson && x.geojson.properties && x.geojson.properties.centros;
    const p = c && (c.centroMediano || c.centroide || c.centro);
    if (x.erro || !p || !x.censos2021) { erros.push(nome + ' ' + (x.erro || 'sem dados')); await sleep(150); continue; }
    feito[nome] = { nome, regiao: regi, pop: x.censos2021.N_INDIVIDUOS, alojamentos: x.censos2021.N_ALOJAMENTOS_FAMILIARES, lat: p[1], lng: p[0], areaha: +x.areaha || null };
    if (++n % 25 === 0) { fs.writeFileSync(SAIDA, JSON.stringify(feito)); console.log('[municipios]', Object.keys(feito).length, '/', nomes.length); }
    await sleep(150);
  }
  fs.writeFileSync(SAIDA, JSON.stringify(feito));
  console.log('[municipios] FIM', Object.keys(feito).length, '/', nomes.length, 'erros', erros.length, erros.slice(0, 10).join(' | '));
})();
