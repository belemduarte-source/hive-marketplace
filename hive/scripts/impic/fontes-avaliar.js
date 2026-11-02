// Análise offline (não toca na BD): que lacunas concelho × atividade cada fonte fecharia.
//  A) fila IMPIC parada (1871): só as que fecham uma lacuna a ≤ 10 km;
//  B) habilitações oficiais das fichas IMPIC já inseridas: lacunas fechadas SEM fichas novas (só mais atividades em sectors);
//  C) lista DGEG de instaladoras de gás; D) lista ACT de segurança no trabalho.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { filtroEntidade, N, limparEmail, setorDaSub, classificar } = require('./ficha');
const { norm, distritoDe } = require('./geo-pt');
const { lerFolha } = require('./xlsx-ler');
const D = f => dados(f);
const km = (a, b, c, d) => { const r = x => x * Math.PI / 180, R = 6371; const h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
const MAT = JSON.parse(fs.readFileSync(D('gap-matriz.json'), 'utf8'));
const H = JSON.parse(fs.readFileSync(D('hierarquia.json'), 'utf8'));
const nomeAtiv = {}; for (const v of Object.values(H)) Object.assign(nomeAtiv, v.subs);
const GRANDES = MAT.filter(m => m.pop >= 20000);
const ler = f => fs.readFileSync(D(f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
const proc = new Map(); for (const x of ler('processadas.jsonl')) proc.set(x.key, x);
const ins = ler('inseridas.jsonl');
const retirados = new Set(ler('corrigidas.jsonl').filter(x => x.acao === 'retirada').map(x => +x.id));
const ja = new Set(ins.map(x => x.key));

// lacunas fechadas por pontos com atividade: mapa "concelho|atividade" → n.º de empresas que a fecham
function fecha(pontos, ms = MAT) {
  const f = new Map();
  for (const m of ms) for (const [s, v] of Object.entries(m.a)) {
    if (v.r10 !== 0) continue;
    for (const p of pontos[s] || []) { if (Math.abs(p[0] - m.lat) > 0.1 || Math.abs(p[1] - m.lng) > 0.14) continue; if (km(m.lat, m.lng, p[0], p[1]) <= 10) { f.set(m.nome + '|' + s, (f.get(m.nome + '|' + s) || 0) + 1); } }
  }
  return f;
}
const resumo = (rot, f) => {
  const pops = new Map(MAT.map(m => [m.nome, m.pop]));
  const g = [...f.keys()].filter(k => pops.get(k.split('|')[0]) >= 20000);
  const porS = {}; for (const k of g) { const s = k.split('|')[1]; porS[s] = (porS[s] || 0) + 1; }
  console.log(`${rot}: fecha ${f.size} lacunas a ≤ 10 km (${g.length} em concelhos ≥ 20 mil hab.)`);
  console.log('   nos ≥ 20 mil, por atividade:', Object.entries(porS).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([s, n]) => `${nomeAtiv[s] || s} ${n}`).join(', '));
};
const tot = { nucleo: 0 };
const lacG = GRANDES.reduce((t, m) => t + Object.values(m.a).filter(v => v.r10 === 0).length, 0);
console.log(`Lacunas a ≤ 10 km em concelhos ≥ 20 mil hab. (53 atividades): ${lacG}; em todos os concelhos: ${MAT.reduce((t, m) => t + Object.values(m.a).filter(v => v.r10 === 0).length, 0)}\n`);

// A) fila IMPIC parada, com setores pelas regras atuais
const DET = D('cache/det');
const detDe = k => { const fd = path.join(DET, k + '.json'); return fs.existsSync(fd) ? JSON.parse(fs.readFileSync(fd, 'utf8')) : null; };
const fila = [...proc.values()].filter(x => x.ok && !ja.has(x.key) && !filtroEntidade(x.nome || x.ficha.name, x.ficha.nif));
const ptsA = {}; const filaUteis = [];
for (const x of fila) {
  const det = detDe(x.key); const cl = det ? classificar(det, det.nome) : null; if (!cl || !cl.primario) continue;
  for (const s of cl.setores) (ptsA[s] = ptsA[s] || []).push([x.ficha.lat, x.ficha.lng, x.key]);
}
const fA = fecha(ptsA); resumo(`A) fila IMPIC parada (${fila.length} aprovadas, setores atuais)`, fA);
// quantas fichas da fila fecham pelo menos uma lacuna
const fechaAlguma = new Set();
for (const m of MAT) for (const [s, v] of Object.entries(m.a)) { if (v.r10 !== 0) continue; for (const p of ptsA[s] || []) if (Math.abs(p[0] - m.lat) <= 0.1 && Math.abs(p[1] - m.lng) <= 0.14 && km(m.lat, m.lng, p[0], p[1]) <= 10) fechaAlguma.add(p[2]); }
const porD = {}; for (const k of fechaAlguma) { const d = proc.get(k).distrito; porD[d] = (porD[d] || 0) + 1; }
console.log(`   fichas da fila que fecham pelo menos uma lacuna: ${fechaAlguma.size} de ${fila.length} | ${JSON.stringify(porD)}\n`);
fs.writeFileSync(D('fila-uteis.json'), JSON.stringify([...fechaAlguma]));

// B) habilitações oficiais das fichas já inseridas: todas as atividades que a licença permite (sem fichas novas)
const noMapa = ins.filter(x => !retirados.has(+x.id) && /PUB/.test(x.alvara));
const CLASSES = [['todas as PUB, qualquer n.º de habilitações', () => true], ['só PUB com ≤ 12 habilitações', n => n <= 12], ['só PUB com ≤ 6 habilitações (regra atual sem o limite de 3)', n => n <= 6]];
for (const [rot, cond] of CLASSES) {
  const pts = {}; let fichas = 0, novos = 0;
  for (const x of noMapa) {
    const det = detDe(x.key); if (!det) continue;
    const n = (det.habs || []).length; if (!n || !cond(n)) continue;
    const atuais = new Set(classificar(det, det.nome).setores);
    let mudou = false;
    for (const h of det.habs) { const s = setorDaSub(h.sub); if (!s || s === 'instalacoes_mecanicas' || s === 'construcao_geral' || atuais.has(s)) continue; atuais.add(s); (pts[s] = pts[s] || []).push([x.lat, x.lng]); novos++; mudou = true; }
    if (mudou) fichas++;
  }
  resumo(`B) ${rot}: ${fichas} fichas ganhavam ${novos} atividades`, fecha(pts));
}
console.log(`   (PUB no mapa com detalhe: ${noMapa.length}. Sem novos mapeamentos de subcategorias.)`);

// B2) subcategorias que hoje vão para construção geral ou para um setor só, e que têm atividade própria no site
const SUBS = {};
for (const x of noMapa) { const det = detDe(x.key); if (!det) continue; const vistos = new Set(); for (const h of det.habs || []) { if (!vistos.has(h.sub)) { SUBS[h.sub] = (SUBS[h.sub] || 0) + 1; vistos.add(h.sub); } } }
console.log('\nSubcategorias PUB mais comuns no mapa:', Object.entries(SUBS).sort((a, b) => b[1] - a[1]).slice(0, 18).map(([k, n]) => `${k.replace(/^\d+\.ª - /, '')} ${n}`).join(' · '));

// C) DGEG, instaladoras de gás
const SOC = /\b(LDA|LIMITADA|SA|S A|SOCIEDADE|SOC)\b/;
const canon = s => N(s || '').replace(/\b(LDA|LIMITADA|SA|S A|UNIPESSOAL|UNIP|SOCIEDADE|SOC|DE|DA|DO|DOS|DAS|E|COMERCIO|GAS|GASES|INSTALACOES|SERVICOS)\b/g, ' ').replace(/\s+/g, ' ').trim();
const bd = JSON.parse(fs.readFileSync(D('bd-dedupe.json'), 'utf8')).rows.filter(r => r.country === 'pt' || r.country === '');
const tels = new Map(), emails = new Map(), nomes = new Map();
const idx = (id, tel, email, nome, status) => { for (const t of String(tel || '').match(/\d{9}/g) || []) if (!tels.has(t)) tels.set(t, [id, status]); if (email) emails.set(String(email).toLowerCase(), [id, status]); const c = canon(nome); if (c.length >= 5 && !nomes.has(c)) nomes.set(c, [id, status]); };
for (const r of bd) idx(r.id, r.tel, r.email, r.name, r.status);
for (const x of ins) { const p = proc.get(x.key); if (p && p.ficha) idx(x.id, String(p.ficha.phone || '').replace(/\D/g, '').replace(/^351/, ''), p.ficha.email, p.ficha.name, retirados.has(+x.id) ? 'removed' : 'approved'); }
const L = lerFolha(dados('../fontes/dgeg'), 1);
const cab = L.findIndex(r => r[0] === 'Tipo');
const rows = L.slice(cab + 1).filter(r => r[2]);
const unicos = new Map();
for (const r of rows) { const k = (r[1] || '').replace(/\s+/g, '') || r[2]; if (!unicos.has(k)) unicos.set(k, { tipo: r[0], aut: r[1], nome: r[2], morada: r[3], loc: r[4], cp: r[5], tel: String(r[6] || '').replace(/\D/g, '').slice(0, 9), email: limparEmail(r[7]), obs: r[8] }); }
const fun = {}; const mais = k => fun[k] = (fun[k] || 0) + 1;
const novosC = [];
// CP4 → concelho, a partir das fichas locais
const cp4 = new Map(); for (const r of bd) { const m = String(r.postal_code || '').match(/^(\d{4})/); if (m && distritoDe(r.city)) { const k = m[1]; const o = cp4.get(k) || {}; o[norm(r.city)] = (o[norm(r.city)] || 0) + 1; cp4.set(k, o); } }
for (const x of proc.values()) { if (!x.ficha) continue; const m = String(x.ficha.postal_code || '').match(/^(\d{4})/); if (m && x.ficha.city) { const o = cp4.get(m[1]) || {}; o[norm(x.ficha.city)] = (o[norm(x.ficha.city)] || 0) + 1; cp4.set(m[1], o); } }
const concelhoDe = cp => { const m = String(cp || '').match(/^(\d{4})/); if (!m) return null; const o = cp4.get(m[1]); if (!o) return null; return Object.entries(o).sort((a, b) => b[1] - a[1])[0][0]; };
const matPor = new Map(MAT.map(m => [norm(m.nome), m]));
for (const e of unicos.values()) {
  const n = N(e.nome);
  if (filtroEntidade(e.nome, '510315917')) { mais('fora: ' + filtroEntidade(e.nome, '510315917')); continue; }
  if (!SOC.test(n)) { mais('fora: sem Lda/SA (pode ser uma pessoa)'); continue; }
  if (!e.tel || !e.email) { mais('fora: falta telefone ou email'); continue; }
  const hit = (e.tel && tels.get(e.tel)) || (e.email && emails.get(e.email)) || nomes.get(canon(e.nome));
  if (hit) { mais(hit[1] === 'approved' ? 'já no catálogo (aprovada)' : 'já na BD (removida ou escondida)'); continue; }
  mais('NOVA'); novosC.push(e);
}
console.log(`\nC) DGEG, instaladoras de gás: ${unicos.size} entidades (A/B/A+B: ${['A', 'B', 'A+B'].map(t => [...unicos.values()].filter(e => e.tipo === t).length).join('/')})`);
console.log('   funil:', JSON.stringify(Object.entries(fun).sort((a, b) => b[1] - a[1])));
let fechaC = 0, fechaC20 = 0; const vistos = new Set(); const uteisC = [];
for (const e of novosC) { const c = concelhoDe(e.cp); const m = c && matPor.get(c); e.concelho = m ? m.nome : null; if (!m) continue; if (m.a.gas.r10 === 0) { uteisC.push(e); if (!vistos.has(m.nome)) { vistos.add(m.nome); fechaC++; if (m.pop >= 20000) fechaC20++; } } }
console.log(`   novas com concelho identificado: ${novosC.filter(e => e.concelho).length}; concelhos sem gás a ≤ 10 km que fechava: ${fechaC} (${fechaC20} com ≥ 20 mil hab.); novas nesses concelhos: ${uteisC.length}`);
fs.writeFileSync(D('dgeg-novas.json'), JSON.stringify(novosC, null, 1));

// D) ACT, segurança no trabalho
const A = lerFolha(dados('../fontes/act'), 1).slice(1).filter(r => /^\d{9}$/.test(r[0]));
const nifs = new Set(bd.filter(r => r.nif).map(r => r.nif));
const validas = A.filter(r => !/revogad|caduc|cessa/i.test(r.join(' ')));
const col = validas.filter(r => r[0][0] === '5' && !filtroEntidade(r[1], r[0]));
console.log(`\nD) ACT, segurança no trabalho: ${A.length} entidades, ${validas.length} sem revogação no texto, ${col.length} coletivas e não filtradas, ${col.filter(r => nifs.has(r[0])).length} já na BD por NIF. A lista não traz telefone, email nem site: precisa de enriquecimento antes da barra.`);
