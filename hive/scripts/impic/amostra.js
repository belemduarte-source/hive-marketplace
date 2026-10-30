// Amostra de verificação (só leitura): N fichas aprovadas ao acaso (semente fixa), com verificação
// independente da posição: Photon reverse no ponto escolhido → a rua do OSM bate com a rua da morada?
// Uso: node amostra.js [N=20] [semente] [--estratificada] [--saida amostra.json]
//  --estratificada: round-robin pelos distritos (cada distrito entra antes de qualquer um repetir)
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { toks } = require('./geocode');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ARGV = process.argv.slice(2), POS = ARGV.filter((a, i) => !a.startsWith('--') && !(ARGV[i - 1] || '').startsWith('--saida'));
const N = +(POS[0] || 20), SEED = +(POS[1] || 7);
const ESTRAT = ARGV.includes('--estratificada'), SAIDA = ARGV.includes('--saida') ? ARGV[ARGV.indexOf('--saida') + 1] : 'amostra.json';

function shuffle(a, seed) {
  let s = seed >>> 0; const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
// GeoAPI.pt /gps: morada INE mais próxima do ponto (rua, nº, CP) + concelho/freguesia do ponto
async function reverso(lat, lng) {
  try {
    const r = await fetch(`https://json.geoapi.pt/gps/${lat},${lng}`, { headers: { accept: 'application/json', 'User-Agent': 'hivex.pt verificação (geral.hivex@gmail.com)' } });
    if (!r.ok) return null;
    const j = await r.json();
    return { street: j.rua, housenumber: j.n_porta, postcode: j.CP, city: j.freguesia, concelho: j.concelho };
  } catch (_) { return null; }
}
(async () => {
  const porChave = new Map();
  for (const l of fs.readFileSync(dados('processadas.jsonl'), 'utf8').split('\n').filter(Boolean)) { const x = JSON.parse(l); porChave.set(x.key, x); }
  const ok = [...porChave.values()].filter(x => x.ok);
  let sel = shuffle(ok.slice(), SEED).slice(0, N);
  if (ESTRAT) {
    const grupos = new Map();
    for (const x of shuffle(ok.slice(), SEED)) { if (!grupos.has(x.distrito)) grupos.set(x.distrito, []); grupos.get(x.distrito).push(x); }
    sel = [];
    for (let r = 0; sel.length < N && [...grupos.values()].some(g => g.length > r); r++)
      for (const g of grupos.values()) if (g[r] && sel.length < N) sel.push(g[r]);
  }
  const out = [];
  for (const x of sel) {
    const f = x.ficha;
    const p = await reverso(f.lat, f.lng);
    const ruaPino = p ? (p.street || '') : '';
    const ruaMorada = f.address.split(',')[0];
    const confere = toks(ruaMorada).some(t => toks(ruaPino).includes(t));
    const concConfere = !!(p && p.concelho && toks(p.concelho).join(' ') === toks(f.city.replace(/\s*\(.*\)$/, '')).join(' '));
    out.push({ key: x.key, nome: f.name, alvara: f.alvara, nif: f.nif, setor: f.sectors.join('+'), concelho: f.city, distrito: x.distrito,
      email: f.email, telefone: f.phone, morada: f.address, geo: x.geo.fonte, pino: `${f.lat},${f.lng}`,
      noPino: p ? [p.street, p.housenumber, p.postcode, p.city, p.concelho].filter(Boolean).join(' · ') : '?', ruaConfere: confere, concelhoConfere: concConfere,
      classe: x.det.classe, inscricao: x.det.inscricao, descricao: f.description });
    console.log(`${confere ? '✓' : '·'}${concConfere ? '✓' : '✗'} ${f.name.slice(0, 40).padEnd(40)} ${f.alvara.padEnd(13)} ${x.geo.fonte.slice(0, 18).padEnd(18)} morada: ${ruaMorada.slice(0, 32).padEnd(32)} no pino: ${ruaPino || '?'} (${(p && p.concelho) || '?'})`);
    await sleep(300);
  }
  fs.writeFileSync(dados(SAIDA), JSON.stringify(out, null, 1));
  console.log(`\nrua no pino = rua da morada: ${out.filter(o => o.ruaConfere).length}/${out.length} | concelho no pino = concelho da ficha: ${out.filter(o => o.concelhoConfere).length}/${out.length}`);
})().catch(e => { console.error(e); process.exit(1); });
