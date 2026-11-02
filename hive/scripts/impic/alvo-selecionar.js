// Seleção para o passo aprovado (< 400 fichas novas, revistas à mão), sem BD. Parte das lacunas a ≤ 10 km, retira as que o
// piloto e as atividades das licenças já fecham, e escolhe da fila IMPIC só o necessário: até K fichas por lacuna, as melhores
// primeiro (ofício principal igual à lacuna, telefone e email de domínio próprio, posição exata). Escreve alvo-impic.json.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const F = require('./ficha');
const { decidir, aluminioOk } = require('./licencas-filtro');
const D = f => dados(f);
const K = +(process.argv[2] || 2);
const km = (a, b, c, d) => { const r = x => x * Math.PI / 180, R = 6371; const h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
const MAT = JSON.parse(fs.readFileSync(D('gap-matriz.json'), 'utf8'));
const H = JSON.parse(fs.readFileSync(D('hierarquia.json'), 'utf8'));
const nomeAtiv = {}; for (const v of Object.values(H)) Object.assign(nomeAtiv, v.subs);
const ler = f => fs.readFileSync(D(f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
const proc = new Map(); for (const x of ler('processadas.jsonl')) proc.set(x.key, x);
const ja = new Set(ler('inseridas.jsonl').map(x => x.key));
const perto = (m, la, lo) => Math.abs(la - m.lat) <= 0.1 && Math.abs(lo - m.lng) <= 0.14 && km(m.lat, m.lng, la, lo) <= 10;

const abertas = new Set(); for (const m of MAT) for (const [s, v] of Object.entries(m.a)) if (v.r10 === 0) abertas.add(m.nome + '|' + s);
const inicio = abertas.size;
const fecha = (la, lo, setores) => { for (const m of MAT) if (perto(m, la, lo)) for (const s of setores) abertas.delete(m.nome + '|' + s); };
for (const x of ler('piloto-inseridas.jsonl')) fecha(x.lat, x.lng, x.sectors);
const aposPiloto = abertas.size;
for (const f of JSON.parse(fs.readFileSync(D('licencas-final.json'), 'utf8'))) fecha(f.lat, f.lng, f.novos);
const aposLic = abertas.size;
const pops = new Map(MAT.map(m => [m.nome, m.pop]));
const g20 = () => [...abertas].filter(k => pops.get(k.split('|')[0]) >= 20000).length;
console.log(`lacunas a ≤ 10 km: início ${inicio} | depois do piloto ${aposPiloto} | depois das licenças ${aposLic} (${g20()} em concelhos ≥ 20 mil hab.)`);

// candidatas IMPIC
const low = s => F.N(s).toLowerCase();
const NOVAS = [['alvenarias', /alvenarias/, ['pedreiros', 'alvenaria']], ['estuques', /estuques|pinturas/, ['estucadores']], ['isolamentos', /impermeabilizacoes e isolamentos/, ['isolamento']], ['betao', /estruturas e elementos de betao/, ['betao_cimento']], ['ajardinamentos', /ajardinamentos/, ['paisagismo_jardins']]];
const FRACAS = /sinalizacao nao el|vias de circulacao|pontes e viadutos|obras de arte correntes|infraestruturas de desporto|oleodutos/;
const FORA_NOME = /MERGULH|DRAGAG|PETROL|NAVAL|FERROVI|TAPECARIA|FESTAS|TAXI|TURIS|LUBRIFIC|COMBUSTIV|HOTELEIR|GALVANIZ|TINTAS|PUBLICIDADE|MATERIAIS DE CONSTRUC|PRODUTOS DE CIMENTO|FLOREST|SERRACAO|INDUSTRIAL SERVICE|SISTEMAS INDUSTRI|CONSULTORIA/;
// vistas à mão: o nome não diz, mas o negócio não é o que a lacuna pede
const FORA_CHAVE = new Set(['17-72063', '17-68455', '17-103739', '17-66608', '17-90302', '17-32586', '17-115053', '17-53568', '17-58245', '18-109167']);
const todas = [...proc.values()].filter(x => x.ok && !ja.has(x.key));
const freqE = new Map(), freqT = new Map(); for (const x of [...proc.values()].filter(y => y.ok)) { if (x.ficha.email) freqE.set(x.ficha.email, (freqE.get(x.ficha.email) || 0) + 1); const t = String(x.ficha.phone || '').replace(/\D/g, ''); if (t) freqT.set(t, (freqT.get(t) || 0) + 1); }
const mot = {}; const conta = k => mot[k] = (mot[k] || 0) + 1;
const cands = [];
for (const x of todas) {
  if (F.filtroEntidade(x.nome, x.ficha.nif)) { conta('filtro'); continue; }
  if (FORA_NOME.test(F.N(x.nome)) || FORA_CHAVE.has(x.key)) { conta('nome fora'); continue; }
  if (/^localidade/.test(x.geo.fonte)) { conta('só localidade'); continue; }
  const fd = D('cache/det/' + x.key + '.json'); if (!fs.existsSync(fd)) { conta('sem detalhe'); continue; }
  const det = JSON.parse(fs.readFileSync(fd, 'utf8')); const cl = F.classificar(det, det.nome); if (!cl.primario) { conta('fora das áreas'); continue; }
  const email = x.ficha.email && freqE.get(x.ficha.email) >= 3 ? '' : x.ficha.email, tel = String(x.ficha.phone || '').replace(/\D/g, ''), fone = tel && freqT.get(tel) >= 3 ? '' : x.ficha.phone;
  if (!email && !fone) { conta('contacto partilhado'); continue; }
  if (!fone && !x.ficha.email_proprio) { conta('só email pessoal'); continue; }
  // atividades: as da classificação, mais as da licença se ≤ 6 linhas (mesma regra das fichas existentes)
  const n = (det.habs || []).length; let setores = cl.setores.filter(s => (s === cl.primario || s !== 'escavacao') && !(x.key === '17-63032' && s === 'picheleiros') && (s !== 'aluminios_pvc' || aluminioOk(cl.primario, x.ficha.name)));
  if (n && n <= 6) {
    const at = new Set(cl.setores), tabela = [], novas = [];
    for (const h of det.habs) { const l = low(h.sub), s = F.setorDaSub(h.sub); if (s && s !== 'instalacoes_mecanicas' && s !== 'construcao_geral' && !FRACAS.test(l) && !at.has(s) && !tabela.some(t => t.s === s)) tabela.push({ s, linha: h.sub, classe: h.classe }); for (const [lig, re, alvo] of NOVAS) if (re.test(l)) for (const a of alvo) if (!at.has(a) && !novas.some(t => t.s === a)) novas.push({ s: a, lig, linha: h.sub, classe: h.classe }); }
    const r = decidir([{ id: 0, name: x.ficha.name, city: x.ficha.city, lat: x.ficha.lat, lng: x.ficha.lng, primario: cl.primario, setores: cl.setores, website: '', tabela, novas }])[0];
    if (r) setores = [...new Set([...setores, ...r.novos])];
  }
  const fonte = x.geo.fonte; const pos = /porta/.test(fonte) ? 3 : /house/.test(fonte) ? 3 : /rua/.test(fonte) ? 2 : /street/.test(fonte) ? 2 : 1;
  const qual = (fone ? 2 : 0) + (x.ficha.email_proprio ? 2 : 0) + pos;
  cands.push({ key: x.key, x, primario: cl.primario, setores, nLinhas: n, qual, la: x.ficha.lat, lo: x.ficha.lng });
}
console.log('fila:', todas.length, '| candidatas fortes:', cands.length, '| fora:', JSON.stringify(mot));
const usos = new Map(); const escolhidas = [];
const pesoDe = c => { let p = 0; const lista = []; for (const m of MAT) { if (!perto(m, c.la, c.lo)) continue; for (const s of c.setores) { const k = m.nome + '|' + s; if (abertas.has(k) && (usos.get(k) || 0) < K) { const b = s === c.primario ? 1 : 0.35; p += m.pop * b; lista.push(k); } } } return { p, lista }; };
for (;;) {
  let melhor = null, mp = 0, ml = null;
  for (const c of cands) { if (c.usada) continue; const { p, lista } = pesoDe(c); const v = p * (0.6 + c.qual * 0.1); if (v > mp) { mp = v; melhor = c; ml = lista; } }
  if (!melhor) break;
  melhor.usada = true; for (const k of ml) usos.set(k, (usos.get(k) || 0) + 1); melhor.fecha = ml; escolhidas.push(melhor);
}
const fechadas = new Set(escolhidas.flatMap(c => c.fecha));
console.log(`K=${K}: escolhidas ${escolhidas.length}, fecham ${fechadas.size} lacunas (${[...fechadas].filter(k => pops.get(k.split('|')[0]) >= 20000).length} em ≥ 20 mil) | por distrito ${JSON.stringify(escolhidas.reduce((o, c) => (o[c.x.distrito] = (o[c.x.distrito] || 0) + 1, o), {}))}`);
fs.writeFileSync(D('alvo-impic.json'), JSON.stringify(escolhidas.map(c => ({ key: c.key, distrito: c.x.distrito, name: c.x.ficha.name, nif: c.x.ficha.nif, alvara: c.x.ficha.alvara, address: c.x.ficha.address, postal_code: c.x.ficha.postal_code, city: c.x.ficha.city, email: c.x.ficha.email, email_proprio: c.x.ficha.email_proprio, phone: c.x.ficha.phone, tags: c.x.ficha.tags, description: c.x.ficha.description, lat: c.la, lng: c.lo, alt: c.x.geo.alt || [], geo: c.x.geo.fonte, sector: c.primario, sectors: c.setores, nLinhas: c.nLinhas, fecha: c.fecha.map(k => { const [m, s] = k.split('|'); return m + ': ' + (nomeAtiv[s] || s); }) })), null, 1));
fs.writeFileSync(D('lacunas-abertas.json'), JSON.stringify([...abertas]));
