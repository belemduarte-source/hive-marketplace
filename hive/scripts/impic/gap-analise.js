// Análise offline das lacunas concelho × atividade, a partir de gap-bruto.json (uma query) e municipios.json (GeoAPI).
// Não toca na BD. "Atividade" = as 53 do site (sector ou sectors), como no filtro do site; raio medido a partir do
// centro mediano do concelho, com a grelha de ~1 km da query. Escreve gap-matriz.json e gap-relatorio.md.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { norm } = require('./geo-pt');
const D = f => dados(f);
const R = JSON.parse(fs.readFileSync(D('gap-bruto.json'), 'utf8'));
const MUN = Object.values(JSON.parse(fs.readFileSync(D('municipios.json'), 'utf8')));
const H = JSON.parse(fs.readFileSync(D('hierarquia.json'), 'utf8'));
const km = (a, b, c, d) => { const r = x => x * Math.PI / 180, RT = 6371; const h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2; return 2 * RT * Math.asin(Math.sqrt(h)); };

const ATIV = [], AREA_DE = {};
for (const [g, v] of Object.entries(H)) for (const k of Object.keys(v.subs)) { ATIV.push(k); AREA_DE[k] = g; }
// trades que uma pessoa pede para a casa, com oferta real em Portugal (o resto é nicho, ver tabela por atividade)
const NUCLEO = ['construcao_geral', 'pedreiros', 'eletricistas', 'picheleiros', 'climatizacao_avac', 'gas', 'energias_renovaveis', 'seguranca_alarmes',
  'pintores', 'estucadores', 'pavimentos', 'azulejos', 'isolamento', 'impermeabilizacao', 'carpinteiros', 'serralharia', 'aluminios_pvc', 'vidraceiros',
  'telhados_coberturas', 'jardineiros', 'piscinas', 'arquitetura_projetos', 'engenharia_civil', 'materiais_construcao'];

const grid = R.filter(r => r.g_grid === 0);
const porCidade = R.filter(r => r.g_city === 0);
// grelha por atividade, para somar depressa
const G = new Map();
for (const r of grid) { if (r.gy == null || r.gx == null) continue; if (!G.has(r.s)) G.set(r.s, []); G.get(r.s).push(r); }
const nomeC = new Map();   // concelho (norm) × atividade → n, pelo texto da cidade
for (const r of porCidade) { const k = norm(r.city) + '|' + r.s; nomeC.set(k, (nomeC.get(k) || 0) + r.n); }

const conta = (m, s, raio) => { let n = 0; for (const c of G.get(s) || []) { if (Math.abs(c.gy - m.lat) > raio / 100 || Math.abs(c.gx - m.lng) > raio / 70) continue; if (km(m.lat, m.lng, c.gy, c.gx) <= raio) n += c.n; } return n; };

const matriz = MUN.map(m => {
  const a = {};
  for (const s of ATIV) a[s] = { nome: nomeC.get(norm(m.nome) + '|' + s) || 0, r10: conta(m, s, 10), r25: conta(m, s, 25) };
  return { ...m, a };
}).sort((x, y) => y.pop - x.pop);
fs.writeFileSync(D('gap-matriz.json'), JSON.stringify(matriz));

const TIERS = [['≥ 100 mil hab.', m => m.pop >= 100000], ['50–100 mil', m => m.pop >= 50000 && m.pop < 100000], ['20–50 mil', m => m.pop >= 20000 && m.pop < 50000], ['< 20 mil', m => m.pop < 20000]];
const out = []; const p = s => out.push(s);
const pct = (a, b) => b ? Math.round(100 * a / b) + '%' : '—';
const lacunas = (ms, ativs, campo) => ms.reduce((t, m) => t + ativs.filter(s => m.a[s][campo] === 0).length, 0);

p('## Tamanho da lacuna: pares concelho × atividade sem nenhuma empresa\n');
p('| Concelhos | N.º | Pop. | Sem empresa no próprio concelho (nome) | A ≤ 10 km do centro | A ≤ 25 km |');
p('|---|---:|---:|---:|---:|---:|');
for (const ativs of [['24 ofícios principais', NUCLEO], ['todas as 53 atividades', ATIV]]) {
  p(`| **${ativs[0]}** | | | | | |`);
  for (const [rot, f] of TIERS) {
    const ms = matriz.filter(f), tot = ms.length * ativs[1].length;
    p(`| ${rot} | ${ms.length} | ${(ms.reduce((s, m) => s + m.pop, 0) / 1e6).toFixed(1)} M | ${lacunas(ms, ativs[1], 'nome')} (${pct(lacunas(ms, ativs[1], 'nome'), tot)}) | ${lacunas(ms, ativs[1], 'r10')} (${pct(lacunas(ms, ativs[1], 'r10'), tot)}) | ${lacunas(ms, ativs[1], 'r25')} (${pct(lacunas(ms, ativs[1], 'r25'), tot)}) |`);
  }
}
p('');
// áreas (8): uma área está vazia se nenhuma das suas atividades tem empresa
p('## As 8 áreas: concelhos sem nenhuma empresa da área\n');
p('| Área | Sem empresa no concelho | A ≤ 10 km | A ≤ 25 km | Empresas em PT (linhas únicas por atividade) |');
p('|---|---:|---:|---:|---:|');
const flags = R.filter(r => r.g_alv === 0); const tot = {}; for (const r of flags) tot[r.s] = (tot[r.s] || 0) + r.n;
for (const [g, v] of Object.entries(H)) {
  const subs = Object.keys(v.subs);
  const vazio = campo => matriz.filter(m => subs.every(s => m.a[s][campo] === 0)).length;
  p(`| ${v.label} | ${vazio('nome')} | ${vazio('r10')} | ${vazio('r25')} | ${subs.reduce((s, k) => s + (tot[k] || 0), 0)} |`);
}
p('');
p('## Por atividade: concelhos com 20 mil habitantes ou mais, sem empresa\n');
const grandes = matriz.filter(m => m.pop >= 20000);
p(`| Atividade | Área | Total PT | Sem empresa a ≤ 10 km (de ${grandes.length}) | A ≤ 25 km |`);
p('|---|---|---:|---:|---:|');
for (const s of [...ATIV].sort((a, b) => grandes.filter(m => m.a[b].r10 === 0).length - grandes.filter(m => m.a[a].r10 === 0).length))
  p(`| ${H[AREA_DE[s]].subs[s]} | ${H[AREA_DE[s]].label} | ${tot[s] || 0} | ${grandes.filter(m => m.a[s].r10 === 0).length} | ${grandes.filter(m => m.a[s].r25 === 0).length} |`);
p('');
p('## As 30 maiores cidades: ofícios principais sem empresa a ≤ 10 km\n');
p('| Concelho | Pop. | N.º de ofícios em falta (de 24) | Quais |');
p('|---|---:|---:|---|');
for (const m of matriz.slice(0, 30)) { const f = NUCLEO.filter(s => m.a[s].r10 === 0); p(`| ${m.nome} | ${m.pop.toLocaleString('pt-PT')} | ${f.length} | ${f.map(s => H[AREA_DE[s]].subs[s]).join(', ')} |`); }
p('');
const md = out.join('\n');
fs.writeFileSync(D('gap-relatorio.md'), md);
console.log(md);
