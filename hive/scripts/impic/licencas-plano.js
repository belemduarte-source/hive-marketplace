// Plano (offline, sem BD) para acrescentar atividades pelas linhas da licença, nas fichas PUB da importação com ≤ 6 linhas.
// Ligações atuais (SUB2SETOR) e 5 ligações novas em revisão. Mostra quem as tem, o ofício principal dessas empresas e
// o que cada ligação fecharia. Escreve licencas-plano.json. Não decide nada: é para rever à mão.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const F = require('./ficha');
const D = f => dados(f);
const km = (a, b, c, d) => { const r = x => x * Math.PI / 180, R = 6371; const h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
const ler = f => fs.readFileSync(D(f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
const ret = new Set(ler('corrigidas.jsonl').filter(x => x.acao === 'retirada').map(x => +x.id));
const ins = ler('inseridas.jsonl').filter(x => !ret.has(+x.id) && /PUB/.test(x.alvara));
const MAT = JSON.parse(fs.readFileSync(D('gap-matriz.json'), 'utf8'));
const low = s => F.N(s).toLowerCase();
const NOVAS = [['alvenarias', /alvenarias/, ['pedreiros', 'alvenaria']], ['estuques', /estuques|pinturas/, ['estucadores']], ['isolamentos', /impermeabilizacoes e isolamentos/, ['isolamento']], ['betao', /estruturas e elementos de betao/, ['betao_cimento']], ['ajardinamentos', /ajardinamentos/, ['paisagismo_jardins']]];
// linhas da tabela atual que não devem dar atividade por si só: sinalização e obras de estrada não são escavação
const FRACAS = /sinalizacao nao el|vias de circulacao|pontes e viadutos|obras de arte correntes|infraestruturas de desporto|oleodutos/;
const plano = [];
for (const x of ins) {
  const fd = D('cache/det/' + x.key + '.json'); if (!fs.existsSync(fd)) continue;
  const det = JSON.parse(fs.readFileSync(fd, 'utf8')); const n = (det.habs || []).length; if (!n || n > 6) continue;
  const cl = F.classificar(det, det.nome); if (!cl.primario) continue;
  const at = new Set(cl.setores); const tabela = [], novas = [];
  for (const h of det.habs) {
    const l = low(h.sub), s = F.setorDaSub(h.sub);
    if (s && s !== 'instalacoes_mecanicas' && s !== 'construcao_geral' && !FRACAS.test(l) && !at.has(s) && !tabela.some(t => t.s === s)) tabela.push({ s, linha: h.sub.replace(/^\d+\.ª - /, ''), classe: h.classe });
    for (const [lig, re, alvo] of NOVAS) if (re.test(l)) for (const a of alvo) if (!at.has(a) && !novas.some(t => t.s === a)) novas.push({ s: a, lig, linha: h.sub.replace(/^\d+\.ª - /, ''), classe: h.classe });
  }
  plano.push({ id: +x.id, key: x.key, name: x.name, city: x.city, lat: x.lat, lng: x.lng, primario: cl.primario, setores: cl.setores, nLinhas: n, website: x.website || '', linhas: det.habs.map(h => h.sub.replace(/^\d+\.ª - /, '')), tabela, novas });
}
fs.writeFileSync(D('licencas-plano.json'), JSON.stringify(plano));
const dist = a => { const c = {}; for (const v of a) c[v] = (c[v] || 0) + 1; return Object.entries(c).sort((p, q) => q[1] - p[1]).slice(0, 9).map(([k, n]) => k + ' ' + n).join(', '); };
console.log('fichas ≤ 6 linhas:', plano.length);
console.log('\nLigações atuais que acrescentam:'); const t = {}; for (const f of plano) for (const a of f.tabela) { const k = a.linha + ' → ' + a.s; (t[k] = t[k] || []).push(f); }
for (const [k, fs2] of Object.entries(t).sort((a, b) => b[1].length - a[1].length)) console.log(String(fs2.length).padStart(4), k.slice(0, 70).padEnd(70), '| principal:', dist(fs2.map(f => f.primario)).slice(0, 80));
console.log('\nLigações novas:');
for (const [lig, , alvo] of NOVAS) for (const a of alvo) { const fs2 = plano.filter(f => f.novas.some(n => n.lig === lig && n.s === a)); console.log(String(fs2.length).padStart(4), (lig + ' → ' + a).padEnd(34), '| principal:', dist(fs2.map(f => f.primario))); }
