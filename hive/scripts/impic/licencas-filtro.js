// Decide, para cada ficha de licencas-plano.json, que atividades acrescentar (sem BD). Critérios revistos à mão a 2/11/2026:
// uma linha da licença sozinha não prova o ofício (há tendas de festas, tapeçarias e serralharias com "Alvenarias"), por isso
// as 5 ligações novas exigem um ofício principal compatível e um nome que não indique outro ramo. As ligações da tabela
// atual aplicam-se como já se aplicam às secundárias, menos a fichas com o nome na lista de exclusão.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const F = require('./ficha');
const D = f => dados(f);

// fichas fora de tudo: o nome ou o site mostram um negócio que não é uma obra (vistas à mão)
const FORA_TUDO = new Set([74905, 64622, 65809, 72707, 68895, 71225, 65189, 65524, 71241, 74978, 73110, 69832, 73113, 73132, 64494, 68580, 68910, 72496, 74846, 69738, 68889, 73443]);
// nome com outro ramo: serve para as ligações de alvenaria, betão e estuque, a não ser que diga também construção civil ou empreiteiro
const OUTRO_RAMO = /METAL|SERRALH|ALUMIN|CAIXILH|CARPINT|MARCEN|MADEIR|\bMOBILI|\bMOVEIS\b|TRANSFORMACAO|ELECTR|ELETR|CANALIZ|CLIMATIZ|\bAVAC\b|\bFRIO\b|REFRIGER|\bGAS\b|SOLAR|RENOVAV|FOTOVOLT|ENERG|DOMOTIC|QUIMIC|TINTAS|\bCOMERCIO\b|TRANSPORT|AGRO|FLOREST|PLANTAS|VIVEIRO|FESTAS|PISCINA|NATACAO|HIDRO|POOL|SWIM|DIVIS|TECTOS?\b|LADRILH|PAVIMENT|\bPISOS?\b|FLOOR|ISOLA|IMPERMEAB|REVESTIMENT|EPOXY|SISTEMAS|TELWINDOW|GALVANIZ|TRABALHOS EM ALTURA|PREFABRIC|INDUSTRIAS? DE CONSTRUC|PRODUTOS|REGA\b/;
const E_OBRA = /CONSTRUCAO CIVIL|CONST CIVIL|CONSTRUCOES CIVIS|EMPREITEIRO|OBRAS PUBLICAS|SOCIEDADE DE CONSTRUC|SOC DE CONSTRUC/;
const NOME = f => F.N(f.name);
const outroRamo = f => OUTRO_RAMO.test(NOME(f)) && !E_OBRA.test(NOME(f));
// ofício principal aceite por ligação nova
const ACEITA = {
  alvenarias: f => (f.primario === 'construcao_geral' || f.primario === 'marmoraria') && !outroRamo(f),
  betao: f => f.primario === 'construcao_geral' && !outroRamo(f),
  // a linha junta estuques, pinturas e outros revestimentos e falhou a validação (2/11/2026): só conta se o nome o disser
  estuques: f => /ESTUC|GESSO|PLACO|REBOC/.test(NOME(f)) && !/COMERCIO/.test(NOME(f)),
  isolamentos: f => ['construcao_geral', 'pintores', 'impermeabilizacao', 'isolamento', 'telhados_coberturas', 'gesso_cartonado'].includes(f.primario) && (!outroRamo(f) || /ISOLA|IMPERMEAB|REVESTIMENT|PINT|TERMIC/.test(NOME(f))) && !/COMERCIO|TINTAS|PAVIMENT|FLOOR|PISOS?\b/.test(NOME(f)),
  ajardinamentos: f => ['jardineiros', 'construcao_geral', 'calcetamento', 'escavacao'].includes(f.primario) && !/AGRO PECUARIA|FLORES\b|METAL/.test(NOME(f)) && (!/FLOREST/.test(NOME(f)) || /JARDIN/.test(NOME(f))),
};
// da tabela atual: perfis não estruturais só valem para empresas de metal, alumínio ou caixilharia. Num construtor geral ou numa
// serração não é prova de alumínio nem PVC (pilotos e auditoria de 2/11/2026)
const aluminioOk = (primario, nome) => ['serralharia', 'estruturas_metalicas', 'aluminios_pvc'].includes(primario) || /ALUMIN|CAIXILH|SERRALH|METAL|PVC/.test(F.N(nome));
const TABELA_OK = (f, a) => {
  if (a.s === 'aluminios_pvc') return aluminioOk(f.primario, f.name);
  if (['demolicao', 'cofragem', 'calcetamento', 'carpinteiros', 'pintores', 'impermeabilizacao'].includes(a.s)) return !outroRamo(f) || f.primario !== 'construcao_geral' || E_OBRA.test(NOME(f));
  return true;
};

function decidir(plano) {
  const res = [];
  for (const f of plano) {
    if (FORA_TUDO.has(f.id)) continue;
    const novos = [], porque = [];
    for (const a of f.tabela) if (TABELA_OK(f, a) && !novos.includes(a.s)) { novos.push(a.s); porque.push({ s: a.s, linha: a.linha, lig: 'tabela' }); }
    for (const a of f.novas) if (ACEITA[a.lig](f) && !novos.includes(a.s)) { novos.push(a.s); porque.push({ s: a.s, linha: a.linha, lig: a.lig }); }
    if (novos.length) res.push({ id: f.id, name: f.name, city: f.city, lat: f.lat, lng: f.lng, primario: f.primario, setores: f.setores, website: f.website, novos, porque });
  }
  return res;
}
module.exports = { decidir, FORA_TUDO, ACEITA, outroRamo, aluminioOk };

if (require.main === module) {
  const plano = JSON.parse(fs.readFileSync(D('licencas-plano.json'), 'utf8'));
  const res = decidir(plano);
  fs.writeFileSync(D('licencas-final.json'), JSON.stringify(res));
  const c = {}; for (const r of res) for (const p of r.porque) { const k = p.lig + ' → ' + p.s; c[k] = (c[k] || 0) + 1; }
  console.log(`fichas no plano ${plano.length} | a alterar ${res.length} | atividades acrescentadas ${res.reduce((t, r) => t + r.novos.length, 0)}`);
  console.log(Object.entries(c).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${n} ${k}`).join('\n'));
  const antes = new Set(plano.filter(f => f.novas.length || f.tabela.length).map(f => f.id)), depois = new Set(res.map(r => r.id));
  const fora = plano.filter(f => antes.has(f.id) && !depois.has(f.id));
  console.log(`\nficaram sem nada (${fora.length}):`, fora.map(f => f.name.slice(0, 34)).join(' | ').slice(0, 2600));
  const so = plano.filter(f => f.novas.some(a => a.lig === 'alvenarias' && !ACEITA.alvenarias(f)));
  console.log(`\nfora só da alvenaria (${so.length}):`, so.filter(f => !FORA_TUDO.has(f.id)).map(f => f.name.slice(0, 30)).join(' | ').slice(0, 1900));
}
