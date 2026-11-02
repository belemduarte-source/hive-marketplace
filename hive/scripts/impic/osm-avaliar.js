// Análise offline: o que o OSM (só tags craft/shop/office) acrescentaria, depois da barra e da deduplicação local.
// Deduplica contra bd-dedupe.json (qualquer estado, 29/10) + inseridas.jsonl. Não toca na BD. Escreve osm-candidatas.json.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { filtroEntidade, N, limparEmail, emailProprio } = require('./ficha');
const D = f => dados(f);
const OSM = JSON.parse(fs.readFileSync(D('osm-pt.json'), 'utf8')).elementos;
const bd = JSON.parse(fs.readFileSync(D('bd-dedupe.json'), 'utf8')).rows.filter(r => r.country === 'pt' || r.country === '');
const ins = fs.readFileSync(D('inseridas.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const km = (a, b, c, d) => { const r = x => x * Math.PI / 180, R = 6371; const h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };

const MAPA = { 'craft=electrician': 'eletricistas', 'craft=plumber': 'picheleiros', 'craft=carpenter': 'carpinteiros', 'craft=joiner': 'carpinteiros', 'craft=parquet_layer': 'pavimentos',
  'craft=painter': 'pintores', 'craft=roofer': 'telhados_coberturas', 'craft=hvac': 'climatizacao_avac', 'craft=tiler': 'azulejos', 'craft=plasterer': 'estucadores',
  'craft=stonemason': 'marmoraria', 'craft=mason': 'pedreiros', 'craft=glaziery': 'vidraceiros', 'craft=metal_construction': 'serralharia', 'craft=blacksmith': 'serralharia', 'craft=tinsmith': 'serralharia',
  'craft=window_construction': 'aluminios_pvc', 'craft=builder': 'construcao_geral', 'craft=gardener': 'jardineiros', 'craft=floorer': 'pavimentos', 'craft=insulation': 'isolamento',
  'craft=cabinet_maker': 'moveis_medida', 'craft=solar': 'energias_renovaveis', 'craft=scaffolder': 'equipamentos_construcao',
  'shop=doityourself': 'materiais_construcao', 'shop=hardware': 'materiais_construcao', 'shop=trade': 'materiais_construcao', 'shop=bathroom_furnishing': 'materiais_construcao', 'shop=tiles': 'azulejos',
  'shop=flooring': 'pavimentos', 'shop=paint': 'materiais_construcao', 'shop=glaziery': 'vidraceiros', 'shop=swimming_pool': 'piscinas', 'shop=security': 'seguranca_alarmes', 'shop=energy': 'energias_renovaveis', 'shop=kitchen': 'moveis_medida',
  'office=architect': 'arquitetura_projetos', 'office=engineer': 'engenharia_civil', 'office=surveyor': 'topografia', 'office=construction_company': 'construcao_geral', 'office=construction': 'construcao_geral',
  'office=interior_design': 'design_interiores', 'office=contractor': 'construcao_geral', 'office=electrician': 'eletricistas', 'office=plumber': 'picheleiros', 'office=builder': 'construcao_geral' };

const dom = u => { try { return new URL(/^https?:/.test(u) ? u : 'https://' + u).hostname.replace(/^www\./, '').toLowerCase(); } catch (_) { return ''; } };
const AGREG = /(facebook|instagram|linkedin|google|sites\.google|wix|blogspot|wordpress\.com|pai\.pt|sapo\.pt|olx|yelp|tripadvisor|linktr|booking)\b/i;
const tel = s => { const d = String(s || '').split(/[;,/]/)[0].replace(/\D/g, '').replace(/^351(?=\d{9}$)/, '').replace(/^00351/, ''); return d.length === 9 ? d : ''; };
// índices de deduplicação
const tels = new Set(), emails = new Set(), doms = new Set(), nomes = [];
const nucleo = s => N(s).replace(/\b(LDA|LIMITADA|SA|S A|UNIPESSOAL|SOCIEDADE|SOC|DE|DA|DO|DOS|DAS|E|CONSTRUCOES|CONSTRUCAO|OBRAS)\b/g, ' ').replace(/\s+/g, ' ').trim();
for (const r of bd) {
  if (r.tel) { for (const t of String(r.tel).match(/\d{9}/g) || []) tels.add(t); }
  if (r.email) emails.add(r.email);
  if (r.website) { const d = dom(r.website); if (d && !AGREG.test(d)) doms.add(d); }
  nomes.push({ n: nucleo(r.name || ''), la: parseFloat(r.lat), lo: parseFloat(r.lng) });
}
for (const r of ins) nomes.push({ n: nucleo(r.name || ''), la: r.lat, lo: r.lng });
const nomesPorChave = new Map();
for (const x of nomes) { if (!x.n) continue; const k = x.n.split(' ')[0]; if (!nomesPorChave.has(k)) nomesPorChave.set(k, []); nomesPorChave.get(k).push(x); }
const nomePerto = (nome, la, lo) => { const n = nucleo(nome); if (!n) return false; for (const x of nomesPorChave.get(n.split(' ')[0]) || []) if (x.n === n && (!isFinite(x.la) || km(la, lo, x.la, x.lo) < 3)) return true; return false; };
// nome que parece de uma pessoa ("João Silva - Canalizador", "Marcenaria António Costa")
const PROPRIOS = /\b(JOSE|JOAO|ANTONIO|MANUEL|FRANCISCO|CARLOS|PAULO|PEDRO|LUIS|RUI|JORGE|MIGUEL|FERNANDO|MARIO|ARMINDO|ALBERTO|ALVARO|ANTERO|ARTUR|AUGUSTO|BRUNO|DANIEL|DAVID|DOMINGOS|EDUARDO|FILIPE|HUGO|JOAQUIM|NUNO|RICARDO|SERGIO|TIAGO|VITOR|MARIA|ANA)\b/;
const SOCIEDADE = /\b(LDA|LIMITADA|S A|SA|SOCIEDADE|SOC|IRMAOS|FILHOS|FILHO|& |COMPANHIA|CIA)\b/;

const fun = {}; const mais = (k, n = 1) => fun[k] = (fun[k] || 0) + n;
const cands = []; const porTag = {};
for (const el of OSM) {
  const t = el.tags || {};
  const tag = t.craft ? 'craft=' + t.craft : t.office ? 'office=' + t.office : t.shop ? 'shop=' + t.shop : '';
  porTag[tag] = porTag[tag] || { total: 0, comNome: 0, passa: 0 }; porTag[tag].total++;
  const setor = MAPA[tag]; if (!setor) { mais('tag sem atividade no site'); continue; }
  if (!t.name) { mais('sem nome'); continue; }
  porTag[tag].comNome++;
  const la = el.lat ?? (el.center && el.center.lat), lo = el.lon ?? (el.center && el.center.lon);
  if (la == null) { mais('sem ponto'); continue; }
  if (t.disused || t['disused:craft'] || t.abandoned) { mais('fechado no OSM'); continue; }
  const site0 = t.website || t['contact:website'] || t.url || '';
  const d = dom(site0), site = d && !AGREG.test(d) ? site0 : '';
  const email = limparEmail(t.email || t['contact:email'] || '');
  const fone = tel(t.phone || t['contact:phone'] || t['contact:mobile'] || t.mobile || '');
  const canais = (site ? 1 : 0) + (email ? 1 : 0) + (fone ? 1 : 0);
  if (canais < 2) { mais(canais === 1 ? '1 só canal' : 'sem contacto'); continue; }
  if (!site && !emailProprio(email)) { mais('sem site nem email de domínio próprio'); continue; }
  const nn = N(t.name);
  if (filtroEntidade(t.name, '510315917')) { mais('filtro de entidade (' + filtroEntidade(t.name, '510315917') + ')'); continue; }
  if (PROPRIOS.test(nn) && !SOCIEDADE.test(nn)) { mais('nome de pessoa sem Lda/SA'); continue; }
  if (fone && tels.has(fone)) { mais('já na BD: telefone'); continue; }
  if (email && emails.has(email)) { mais('já na BD: email'); continue; }
  if (d && doms.has(d)) { mais('já na BD: site'); continue; }
  if (nomePerto(t.name, la, lo)) { mais('já na BD: nome perto'); continue; }
  mais('PASSA'); porTag[tag].passa++;
  cands.push({ id: el.type + '/' + el.id, tag, setor, nome: t.name, la, lo, site, email, fone, rua: t['addr:street'] || '', porta: t['addr:housenumber'] || '', cp: t['addr:postcode'] || '', cidade: t['addr:city'] || '' });
}
fs.writeFileSync(D('osm-candidatas.json'), JSON.stringify(cands, null, 1));
console.log('elementos OSM em PT:', OSM.length);
console.log('funil:', JSON.stringify(Object.entries(fun).sort((a, b) => b[1] - a[1]), null, 0));
console.log('\ntag | total | com nome | passa');
for (const [k, v] of Object.entries(porTag).sort((a, b) => b[1].total - a[1].total)) console.log(k.padEnd(28), String(v.total).padStart(5), String(v.comNome).padStart(5), String(v.passa).padStart(5));
const porSetor = {}; for (const c of cands) porSetor[c.setor] = (porSetor[c.setor] || 0) + 1;
console.log('\npassa por atividade:', JSON.stringify(porSetor));
