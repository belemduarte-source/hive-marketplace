// Análise (sem escrever na BD): 1) dimensão do OSM em PT por tag (taginfo da Geofabrik);
// 2) fichas já no catálogo que estão na lista DGEG mas sem a atividade de gás (uma leitura pequena, por ids);
// 3) lacunas que as habilitações oficiais fechariam com subcategorias ligadas às atividades próprias do site (sem fichas novas).
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const F = require('./ficha');
const { lerFolha } = require('./xlsx-ler');
const D = f => dados(f);
const km = (a, b, c, d) => { const r = x => x * Math.PI / 180, R = 6371; const h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
const MAT = JSON.parse(fs.readFileSync(D('gap-matriz.json'), 'utf8'));
const H = JSON.parse(fs.readFileSync(D('hierarquia.json'), 'utf8'));
const nomeAtiv = {}; for (const v of Object.values(H)) Object.assign(nomeAtiv, v.subs);
const NUCLEO = new Set(['construcao_geral', 'pedreiros', 'eletricistas', 'picheleiros', 'climatizacao_avac', 'gas', 'energias_renovaveis', 'seguranca_alarmes', 'pintores', 'estucadores', 'pavimentos', 'azulejos', 'isolamento', 'impermeabilizacao', 'carpinteiros', 'serralharia', 'aluminios_pvc', 'vidraceiros', 'telhados_coberturas', 'jardineiros', 'piscinas', 'arquitetura_projetos', 'engenharia_civil', 'materiais_construcao']);
const ler = f => fs.readFileSync(D(f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
const proc = new Map(); for (const x of ler('processadas.jsonl')) proc.set(x.key, x);
const ins = ler('inseridas.jsonl');
const retirados = new Set(ler('corrigidas.jsonl').filter(x => x.acao === 'retirada').map(x => +x.id));
const fecha = pontos => { const f = new Set(); for (const m of MAT) for (const [s, v] of Object.entries(m.a)) { if (v.r10 !== 0) continue; for (const p of pontos[s] || []) { if (Math.abs(p[0] - m.lat) > 0.1 || Math.abs(p[1] - m.lng) > 0.14) continue; if (km(m.lat, m.lng, p[0], p[1]) <= 10) { f.add(m.nome + '|' + s); break; } } } return f; };
const pops = new Map(MAT.map(m => [m.nome, m.pop]));
const contas = f => { const a = [...f]; return { total: a.length, g20: a.filter(k => pops.get(k.split('|')[0]) >= 20000).length, nucleo20: a.filter(k => pops.get(k.split('|')[0]) >= 20000 && NUCLEO.has(k.split('|')[1])).length }; };

(async () => {
  // 1) OSM
  const TAGS = { craft: ['electrician', 'plumber', 'carpenter', 'joiner', 'painter', 'roofer', 'hvac', 'tiler', 'plasterer', 'stonemason', 'mason', 'glaziery', 'metal_construction', 'window_construction', 'builder', 'gardener', 'floorer', 'insulation', 'cabinet_maker', 'solar'],
    office: ['architect', 'engineer', 'surveyor', 'construction_company', 'interior_design', 'contractor'], shop: ['doityourself', 'hardware', 'trade', 'bathroom_furnishing', 'tiles', 'flooring', 'paint', 'swimming_pool', 'security', 'kitchen'] };
  const osm = {}; let total = 0;
  for (const [k, vs] of Object.entries(TAGS)) for (const v of vs) {
    try { const r = await fetch(`https://taginfo.geofabrik.de/europe:portugal/api/4/tag/stats?key=${k}&value=${v}`, { headers: { 'User-Agent': 'hivex-gap-analysis/1.0' }, signal: AbortSignal.timeout(20000) }); const j = await r.json(); const n = (j.data.find(d => d.type === 'all') || {}).count || 0; osm[k + '=' + v] = n; total += n; } catch (e) { osm[k + '=' + v] = '?'; }
    await new Promise(s => setTimeout(s, 150));
  }
  console.log('1) OSM em Portugal, objetos por tag (com ou sem contactos):', total, JSON.stringify(osm));

  // 2) DGEG: já no catálogo e sem gás
  const canon = s => F.N(s || '').replace(/\b(LDA|LIMITADA|SA|S A|UNIPESSOAL|UNIP|SOCIEDADE|SOC|DE|DA|DO|DOS|DAS|E|COMERCIO|GAS|GASES|INSTALACOES|SERVICOS)\b/g, ' ').replace(/\s+/g, ' ').trim();
  const bd = JSON.parse(fs.readFileSync(D('bd-dedupe.json'), 'utf8')).rows.filter(r => r.country === 'pt' || r.country === '');
  const tels = new Map(), emails = new Map(), nomes = new Map();
  const idx = (id, tel, email, nome, st) => { for (const t of String(tel || '').match(/\d{9}/g) || []) if (!tels.has(t)) tels.set(t, [id, st]); if (email) emails.set(String(email).toLowerCase(), [id, st]); const c = canon(nome); if (c.length >= 5 && !nomes.has(c)) nomes.set(c, [id, st]); };
  for (const r of bd) idx(r.id, r.tel, r.email, r.name, r.status);
  for (const x of ins) { const p = proc.get(x.key); if (p && p.ficha) idx(x.id, String(p.ficha.phone || '').replace(/\D/g, '').replace(/^351/, ''), p.ficha.email, p.ficha.name, retirados.has(+x.id) ? 'removed' : 'approved'); }
  const LL = lerFolha(dados('../fontes/dgeg'), 1); const rows = LL.slice(LL.findIndex(r => r[0] === 'Tipo') + 1).filter(r => r[2]);
  const ids = new Map();
  for (const r of rows) { const tel = String(r[6] || '').replace(/\D/g, '').slice(0, 9), em = F.limparEmail(r[7]); const h = (tel && tels.get(tel)) || (em && emails.get(em)) || nomes.get(canon(r[2])); if (h && h[1] === 'approved') ids.set(+h[0], r[2]); }
  const reg = await q(`SELECT id::int id, sector, sectors, lat::float8 lat, lng::float8 lng FROM companies WHERE id = ANY($1) AND status='approved'`, [[...ids.keys()]]);
  const semGas = reg.filter(x => x.sector !== 'gas' && !(x.sectors || []).includes('gas'));
  const pGas = { gas: semGas.map(x => [x.lat, x.lng]) };
  console.log(`\n2) DGEG já no catálogo: ${reg.length} fichas; sem a atividade de gás: ${semGas.length}; lacunas de gás a ≤ 10 km que fechariam:`, JSON.stringify(contas(fecha(pGas))));
  fs.writeFileSync(D('dgeg-sem-gas.json'), JSON.stringify(semGas.map(x => ({ id: x.id, nome: ids.get(x.id), sector: x.sector }))));

  // 3) habilitações → atividades próprias, com limites
  const EXTRA = [[/alvenarias/, ['pedreiros', 'alvenaria']], [/estuques|pinturas/, ['estucadores']], [/impermeabilizacoes e isolamentos/, ['isolamento']], [/estruturas e elementos de betao/, ['betao_cimento']], [/ajardinamentos/, ['paisagismo_jardins']]];
  const noMapa = ins.filter(x => !retirados.has(+x.id) && /PUB/.test(x.alvara));
  const low = s => F.N(s).toLowerCase();
  for (const [rot, lim, classeMax] of [['≤ 12 habilitações', 12, 99], ['≤ 12 habilitações, classe ≤ 3 nessa habilitação', 12, 3], ['≤ 6 habilitações', 6, 99], ['qualquer n.º, classe ≤ 2 nessa habilitação', 999, 2]]) {
    const p1 = {}, p2 = {}; let n1 = 0, n2 = 0, fichas = new Set();
    for (const x of noMapa) {
      const fd = D('cache/det/' + x.key + '.json'); if (!fs.existsSync(fd)) continue;
      const det = JSON.parse(fs.readFileSync(fd, 'utf8')); const nh = (det.habs || []).length; if (!nh || nh > lim) continue;
      const at = new Set(F.classificar(det, det.nome).setores);
      for (const h of det.habs) {
        if ((h.classe || 0) > classeMax) continue;
        const s = F.setorDaSub(h.sub);
        if (s && s !== 'instalacoes_mecanicas' && s !== 'construcao_geral' && s !== 'escavacao' && !at.has(s)) { (p1[s] = p1[s] || []).push([x.lat, x.lng]); (p2[s] = p2[s] || []).push([x.lat, x.lng]); n1++; n2++; at.add(s); fichas.add(x.key); }
        for (const [re, ex] of EXTRA) if (re.test(low(h.sub))) for (const e of ex) if (!at.has(e)) { (p2[e] = p2[e] || []).push([x.lat, x.lng]); n2++; at.add(e); fichas.add(x.key); }
      }
    }
    console.log(`\n3) ${rot}: ${fichas.size} fichas | tabela atual: +${n1} atividades, fecha ${JSON.stringify(contas(fecha(p1)))} | com subcategorias ligadas a pedreiros, estucadores, isolamento, betão e paisagismo: +${n2}, fecha ${JSON.stringify(contas(fecha(p2)))}`);
  }
})().catch(e => { console.error('ERRO', e.message.slice(0, 400)); process.exit(1); });
