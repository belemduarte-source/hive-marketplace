// Regras de qualidade + transformação de uma entrada IMPIC numa ficha Hivex.
// Tudo puro (sem rede/BD) para poder ser testado e reutilizado no ensaio e na inserção.
const { dec } = require('./impic-lib');

const strip = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
const N = s => strip(s).toUpperCase().replace(/[^A-Z0-9&]+/g, ' ').trim();

// ── Detalhe ─────────────────────────────────────────────────────────────────
function parseDetalhe(html) {
  const campos = {};
  for (const m of html.matchAll(/<label>([^<]+)<\/label>\s*<span>([\s\S]*?)<\/span>/g)) {
    campos[dec(m[1])] = dec(m[2].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '')).replace(/[ \t]+\n/g, '\n').trim();
  }
  const habs = [];
  let cat = null;
  const tb = (html.match(/Habilita[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/) || [])[1] || '';
  for (const tr of tb.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
    const tds = [...tr[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(x => dec(x[1].replace(/<[^>]*>/g, '')));
    if (tds.length === 1) cat = tds[0];
    else if (tds.length >= 2) habs.push({ cat: cat || '', sub: tds[0], classe: +tds[1] || 0 });
  }
  return {
    alvara: campos['Alvará'] || null,
    inscricao: campos['Data de inscrição'] || null,
    classe: +(campos['Classe Máxima'] || campos['Classe'] || 0) || null,
    nif: (campos['NIF/NIPC'] || '').replace(/\D/g, ''),
    nome: campos['Denominação'] || null,
    morada: (campos['Morada'] || '').split('\n').map(s => s.trim()).filter(Boolean),
    concelho: campos['Concelho'] || null,
    distrito: campos['Distrito'] || null,
    pais: campos['País'] || null,
    telefone: campos['Telefone'] || null,
    email: campos['E-mail'] || null,
    habs,
  };
}

// ── NIF ─────────────────────────────────────────────────────────────────────
function nifValido(n) {
  if (!/^\d{9}$/.test(n)) return false;
  let s = 0;
  for (let i = 0; i < 8; i++) s += +n[i] * (9 - i);
  const r = s % 11, cd = r < 2 ? 0 : 11 - r;
  return cd === +n[8];
}

// ── Filtros de entidade (antes do detalhe — só com nome+NIF) ─────────────────
// Regra do dono: empresas de uma pessoa (unipessoal / ENI) NUNCA por importação automática.
// O IMPIC tem gralhas e abreviaturas: UNPESSOAL, UNIOPESSOAL, UNIIPESSOAL, UNIPESSOL, UNIPESS, UNIPE, UNIPL,
// UNIPLDA, UNP LDA, UNILDA (testado contra toda a listagem: nenhuma marca apanhada; PESSOA sozinho é apelido).
const RE_UNIP = /\bUN[A-Z]{0,3}PES{1,2}[OA]{0,2}L?(L?DA)?\b|\bUNIP(E|L|LDA)?\b|\bUNP\b|\bUNI ?LDA\b|\bSOC(IEDADE)? UNIP/;
// Entidades que não são prestadores de serviços para o público (municípios, associações, ACE…).
const RE_ENTIDADE = /\b(MUNICIPIO|CAMARA MUNICIPAL|JUNTA DE FREGUESIA|SERVICOS MUNICIPALIZADOS|ASSOCIACAO|FUNDACAO|MISERICORDIA|CENTRO SOCIAL|PAROQUIA|FABRICA DA IGREJA|INSTITUTO|UNIVERSIDADE|ESCOLA|REGIAO AUTONOMA|GOVERNO|COMUNIDADE INTERMUNICIPAL|AREA METROPOLITANA|EMPRESA MUNICIPAL|AGRUPAMENTO COMPLEMENTAR|COOPERATIVA DE HABITACAO|CONDOMINIO|HERANCA|INSOLVENCIA|INSOLVENTE|EM LIQUIDACAO)\b|(\bACE|\bE ?E ?M|\bEM)$/;
// Licenciadas mas não são prestadores de obra para o público: fabricantes/operadoras de telecomunicações,
// tecnológicas, energia/utilities, gestores de infraestruturas, resíduos, limpeza, vigilância.
const RE_FORA_AMBITO = /\b(HUAWEI|ERICSSON|NOKIA|ALCATEL|CISCO|IBM|HEALTHCARE|EDP|E REDES|GALP|REDES ENERGETICAS NACIONAIS|MEO|ALTICE|VODAFONE|NOS COMUNICACOES|NOS TECHNOLOGY|RESIDUOS|INFRAESTRUTURAS DE PORTUGAL|METROPOLITANO|CAMINHOS DE FERRO|CARRIS|AGUAS DE PORTUGAL|EPAL|AEROPORTOS|NAV PORTUGAL|PROSEGUR|SECURITAS|LIMPEZAS?|HIGIENE|TURISTICOS?|TURISMO|HOTEIS|HOTELARIA|HOTELEIRAS?|HOTEL)\b/;
// Promotores/gestores/mediadores imobiliários e sociedades de investimento têm alvará para as obras próprias,
// mas não são empreiteiros para o público: ficam de fora quando o nome não tem nenhuma palavra de obra
// ("Imobiliária Construtora" passa). O IMPIC escreve o mesmo de várias maneiras: Imóveis, Propriedades,
// Empreendimentos, Real Estate, Imob, Investimentos/Investments/Invest (não Investigação). As palavras de obra
// incluem abreviaturas (Constr, Const) e ofícios (Pintura, Manutenção, Renovações…). Testado contra a listagem inteira.
const RE_IMOBILIARIA = /\bIMOBILI|\bIMOB\b|\bIMOVE(IS|L)\b|\bPROPRIEDADES?\b|\bEMPREEND|\bREAL ESTATE\b|INVEST(?!IGA)/;
const RE_OBRA = /CONSTR|\bCONST\b|OBRAS?\b|EMPREIT|ENGENH|ENGINEER|REMODEL|REABILIT|RENOVAC|RECUPERAC|REPARAC|EDIFIC|BUILD|PINTUR|MANUTENC|INSTALAC|ELE(C)?TRIC|CANALIZ|CARPINT|SERRALH|CLIMATIZ|TELHAD|COBERTUR|IMPERMEAB|ISOLAM|PAVIMENT|DEMOLI|TERRAPLEN|COFRAG|ESTRUTUR|RESTAURO|RESTAURACAO DE IMOVEIS|CONSERVAC/;
function filtroEntidade(nome, nif) {
  const n = N(nome);
  if (!nif) return 'eni-nif-oculto';                      // o IMPIC esconde o NIF dos empresários em nome individual
  if (!nifValido(nif)) return 'nif-invalido';
  if (nif[0] !== '5') return 'nao-pessoa-coletiva';      // 1/2/3 = singular (ENI), 6 = público, 9 = irregular
  if (RE_UNIP.test(n)) return 'unipessoal';
  if (RE_ENTIDADE.test(n)) return 'entidade-nao-empresa';
  if (RE_FORA_AMBITO.test(n)) return 'fora-de-ambito';
  if (RE_IMOBILIARIA.test(n) && !RE_OBRA.test(n)) return 'imobiliaria-sem-obra';
  return null;
}

// ── Canais de contacto ──────────────────────────────────────────────────────
const FREEMAIL = new Set(['gmail.com', 'hotmail.com', 'hotmail.pt', 'outlook.com', 'outlook.pt', 'live.com', 'live.com.pt', 'sapo.pt', 'mail.pt', 'iol.pt', 'netcabo.pt', 'clix.pt', 'yahoo.com', 'yahoo.com.br', 'yahoo.es', 'yahoo.fr', 'yahoo.co.uk', 'msn.com', 'icloud.com', 'me.com', 'gmx.com', 'gmx.net', 'gmx.pt', 'aol.com', 'protonmail.com', 'proton.me', 'zoho.com', 'telepac.pt', 'vodafone.pt', 'meo.pt', 'oninet.pt', 'portugalmail.pt', 'net.novis.pt', 'mail.telepac.pt', 'ip.pt', 'esoterica.pt', 'kanguru.pt', 'yandex.com', 'mail.ru', 'hotmail.fr', 'hotmail.es', 'hotmail.co.uk', 'live.fr', 'outlook.es', 'outlook.fr', 'googlemail.com', 'ymail.com', 'rocketmail.com', 'cabovisao.pt', 'nos.pt', 'zonmail.pt', 'sapo.ao', 'uol.com.br', 'bol.com.br', 'terra.com.br', 'ig.com.br']);
function limparEmail(e) {
  const v = String(e || '').trim().toLowerCase().replace(/^mailto:/, '').split(/[;,\s/]+/)[0] || '';
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(v) ? v : '';
}
const dominio = e => (e.split('@')[1] || '').replace(/^www\./, '');
const emailProprio = e => !!e && !FREEMAIL.has(dominio(e));
function limparTelefone(t) {
  // pode vir "912345678 / 213456789"; aceita o 1º nº PT válido (9 dígitos, 2/3/9)
  for (const parte of String(t || '').split(/[\/;,|e]+/)) {
    let d = parte.replace(/\D/g, '');
    if (d.startsWith('00351')) d = d.slice(5); else if (d.startsWith('351') && d.length === 12) d = d.slice(3);
    if (/^[239]\d{8}$/.test(d) && !/^(\d)\1{8}$/.test(d) && !/^9{2}0{7}$/.test(d)) return d;
  }
  return '';
}
const fmtTel = d => d ? '+351 ' + d : '';

// ── Nome: mesma capitalização das fichas IMPIC já existentes ────────────────
const MINUSC = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'a', 'o', 'para', 'por', 'com', 'na', 'no', 'nas', 'nos', 'à', 'ao']);
const MAIUSC = new Set(['LDA', 'SA', 'S.A.', 'S.A', 'SGPS', 'ACE', 'CRL', 'II', 'III', 'IV', 'PT', 'UK', 'EU', 'AVAC', 'ITED', 'ITUR', 'PVC', 'BTL', 'SL', 'SRL', 'GMBH', 'AG', 'BV', 'NV', 'SAS', 'SARL', 'SPA']);
function capitalizar(nomeIMPIC) {
  const palavras = String(nomeIMPIC || '').replace(/\s+/g, ' ').trim().replace(/\bS A$/i, 'SA').split(' ');
  return palavras.map((w, i) => {
    const up = w.toUpperCase();
    const nu = up.replace(/[^A-Z.]/g, '');
    if (MAIUSC.has(nu) || MAIUSC.has(up)) return up;
    if (i > 0 && MINUSC.has(w.toLowerCase())) return w.toLowerCase();
    if (/^[A-Z]\.([A-Z]\.)+,?$/.test(up)) return up;                // siglas com pontos (A.S.)
    if (/^[A-Z]{2,4}$/.test(up) && !/[AEIOU]/.test(up)) return up;   // siglas sem vogais (JMS, BCL)
    return w.toLowerCase().replace(/(^|[-/(&'.])([a-zà-ÿ])/g, (m, p, c) => p + c.toUpperCase());
  }).join(' ').replace(/\s+,/g, ',');
}

// ── Classificação por habilitações (PUB) + palavras do nome (PUB e PAR) ─────
// O IMPIC usa duas numerações de subcategorias: "Ascensores, escadas mecânicas…" (antiga) e
// "11.ª - Instalações de elevação" (nova) são o mesmo. scan-subs.js lista as que esta tabela não conhece.
const SUB2SETOR = [
  [/estruturas e elementos de betao|alvenarias|instalacoes sem qualificacao/, 'construcao_geral'],
  [/estruturas metalicas/, 'estruturas_metalicas'],
  [/estruturas de madeira|carpintarias/, 'carpinteiros'],
  [/estuques|pinturas/, 'pintores'],
  [/perfis nao estruturais/, 'aluminios_pvc'],
  [/canalizacoes e condutas em edificios/, 'picheleiros'],
  [/restauro de bens imoveis/, 'fachadas'],
  [/calcetamentos/, 'calcetamento'],
  [/ajardinamentos/, 'jardineiros'],
  [/saneamento basico|emissarios|redes de agua|abastecimento/, 'canalizacao_saneamento'],
  [/vias de circulacao rodoviaria|vias de circulacao ferroviaria|pontes e viadutos|obras de arte correntes|infraestruturas de desporto|sinalizacao nao electrica|sinalizacao nao eletrica|oleodutos/, 'escavacao'],
  [/captacao/, 'pocos_agua'],
  [/obras fluviais|obras maritimas|obras portuarias|protecao costeira|barragens|dragagens|hidraulic|regadio|drenagem/, 'canalizacao_saneamento'],
  [/instalacoes electricas de utilizacao|instalacoes eletricas de utilizacao|redes electricas|redes eletricas|instalacoes electricas|instalacoes eletricas|tracao electrica|traccao electrica|tracao eletrica|postos de transformacao|telecomunicacoes/, 'eletricistas'],
  [/producao de energia/, 'energias_renovaveis'],
  [/gestao tecnica centralizada/, 'domotica_automacao'],
  [/extincao de incendios|seguranca e deteccao|seguranca e detecao/, 'seguranca_alarmes'],
  [/aquecimento|ventilacao|ar condicionado|refrigeracao/, 'climatizacao_avac'],
  [/distribuicao e instalacoes de gas|gas/, 'gas'],
  [/ascensores|escadas mecanicas|instalacoes de elevacao|ar comprimido|outras instalacoes mecanicas|tratamento ambiental|apoio e sinalizacao/, 'instalacoes_mecanicas'],
  [/demolicoes/, 'demolicao'],
  [/movimentacao de terras|caminhos agricolas|tuneis|geotecnia|fundacoes especiais|paredes de contencao|taludes/, 'escavacao'],
  [/impermeabilizacoes e isolamentos/, 'impermeabilizacao'],
  [/cofragens|armaduras para betao/, 'cofragem'],
  [/reabilitacao de elementos estruturais|reparacoes e tratamentos superficiais/, 'fachadas'],
  [/andaimes/, 'construcao_geral'],
];
const lowerSemAcento = s => strip(s).toLowerCase();
function setorDaSub(sub) {
  const s = lowerSemAcento(sub);
  for (const [re, setor] of SUB2SETOR) if (re.test(s)) return setor;
  return null;
}
// Nome → especialidade (só quando o nome é inequívoco).
const NOME2SETOR = [
  [/\bSERRALHARI/, 'serralharia'],
  [/\bELE(C)?TRIC|\bELE(C)?TROTECN|\bINSTALACOES ELE/, 'eletricistas'],
  [/\bCLIMATIZ|\bAVAC\b|\bAR CONDICIONADO|\bREFRIGERA/, 'climatizacao_avac'],
  [/\bESTUQU/, 'estucadores'],
  [/\bPINTURA/, 'pintores'],
  [/\bCARPINTARI|\bMARCENARI/, 'carpinteiros'],
  [/\bALUMINIO|\bCAIXILHARI|\bPVC\b/, 'aluminios_pvc'],
  [/\bCANALIZA|\bPICHELAR/, 'picheleiros'],
  [/\bJARDINAGEM|\bJARDINS\b|\bPAISAGIS|\bESPACOS VERDES/, 'jardineiros'],
  [/\bPISCINA/, 'piscinas'],
  [/\bFOTOVOLT|\bENERGIAS? RENOVA|\bENERGIA SOLAR|\bSOLAR (ENERGY|ENERGIA|SYSTEMS|SISTEMAS|POWER)\b/, 'energias_renovaveis'],
  [/\bTERRAPLANAG|\bESCAVA|\bMOVIMENTO DE TERRAS|\bMOVIMENTACAO DE TERRAS/, 'escavacao'],
  [/\bDEMOLI/, 'demolicao'],
  [/\bIMPERMEABILIZ/, 'impermeabilizacao'],
  [/\bISOLAMENTO|\bCAPOTO\b|\bETICS\b/, 'isolamento'],
  [/\bPLADUR\b|\bGESSO CARTONADO|\bTETOS FALSOS|\bTECTOS FALSOS/, 'gesso_cartonado'],
  [/\bTELHADO|\bCOBERTURAS\b/, 'telhados_coberturas'],
  [/\bVIDRACA|\bVIDROS?\b/, 'vidraceiros'],
  [/\bMARMORE|\bMARMORI|\bGRANITO|\bCANTARIA/, 'marmoraria'],
  [/\bCALCETAMENT|\bCALCADA/, 'calcetamento'],
  [/\bSEGURANCA ELETRONICA|\bALARME|\bVIDEOVIGILANC|\bINCENDIO/, 'seguranca_alarmes'],
  [/\bDOMOTICA|\bAUTOMACAO/, 'domotica_automacao'],
  [/\bESTRUTURAS METALICAS|\bMETALOMECANIC/, 'estruturas_metalicas'],
  [/\bPAVIMENTOS\b/, 'pavimentos'],
];
function setorDoNome(nome) {
  const n = N(nome);
  for (const [re, setor] of NOME2SETOR) if (re.test(n)) return setor;
  return null;
}
// Empresas só com habilitações "mecânicas" (elevadores, ar comprimido, ETAR) não têm setor no site:
// ficam de fora (motivo 'fora-das-areas') em vez de serem rotuladas com um ofício errado.
function classificar(det, nome) {
  const porSetor = new Map();
  for (const h of det.habs || []) {
    const s = setorDaSub(h.sub);
    if (!s) continue;
    const cur = porSetor.get(s) || { n: 0, classe: 0 };
    cur.n++; cur.classe = Math.max(cur.classe, h.classe || 0);
    porSetor.set(s, cur);
  }
  const doNome = setorDoNome(nome);
  const nSubs = (det.habs || []).length;
  let primario;
  if (porSetor.has('construcao_geral')) primario = doNome && doNome !== 'construcao_geral' && nSubs <= 4 ? doNome : 'construcao_geral';
  else if (doNome) primario = doNome;
  else if (porSetor.size) {
    const ord = [...porSetor.entries()].filter(([s]) => s !== 'instalacoes_mecanicas')
      .sort((a, b) => (b[1].classe - a[1].classe) || (b[1].n - a[1].n));
    primario = ord.length ? ord[0][0] : null;            // só mecânicas (elevadores, ar comprimido, ETAR)
  } else if (!nSubs) primario = 'construcao_geral';      // PAR sem habilitações discriminadas
  else return { primario: null, setores: [], motivo: 'habilitacoes-desconhecidas' };   // subcategoria que SUB2SETOR não conhece
  if (!primario) return { primario: null, setores: [], motivo: 'fora-das-areas' };
  // secundários: só em empresas focadas (generalistas com tudo ficam só no primário)
  const setores = [primario];
  if (nSubs > 0 && nSubs <= 6) {
    const sec = [...porSetor.entries()].filter(([s]) => s !== primario && s !== 'instalacoes_mecanicas')
      .sort((a, b) => (b[1].classe - a[1].classe) || (b[1].n - a[1].n)).map(([s]) => s);
    for (const s of sec) { if (setores.length >= 3) break; setores.push(s); }
  }
  return { primario, setores };
}

// Categoria principal (texto) para a descrição — igual ao modelo das fichas existentes.
function categoriaPrincipal(det) {
  const cont = new Map();
  for (const h of det.habs || []) cont.set(h.cat, Math.max(cont.get(h.cat) || 0, h.classe || 0));
  if (!cont.size) return null;
  return [...cont.entries()].sort((a, b) => b[1] - a[1])[0][0].replace(/\s+/g, ' ').trim();
}

// Emoji/cor por setor: os mais frequentes nas fichas aprovadas da BD (construção geral a azul, o resto laranja)
const EMOJI = { construcao_geral: '🏗️', engenharia_civil: '🏗️', eletricistas: '⚡', climatizacao_avac: '❄️', jardineiros: '🌿', picheleiros: '🔧', canalizacao_saneamento: '🔧', serralharia: '🔩', estruturas_metalicas: '🔩', aluminios_pvc: '🔩', pintores: '🎨', estucadores: '✨', carpinteiros: '🪚', escavacao: '🚜', calcetamento: '🧱', demolicao: '🧱', pavimentos: '🧱', impermeabilizacao: '🏠', telhados_coberturas: '🏠', cofragem: '🏗️', fachadas: '🏗️', energias_renovaveis: '⚡', domotica_automacao: '⚡', seguranca_alarmes: '🔒', gas: '🔥', pocos_agua: '💧', isolamento: '🌡️', gesso_cartonado: '🛠️', vidraceiros: '🪟', marmoraria: '🏛️', piscinas: '🏊' };
const COR = s => (s === 'construcao_geral' || s === 'engenharia_civil') ? '#2563eb' : '#f97316';

module.exports = { EMOJI, COR, parseDetalhe, nifValido, filtroEntidade, limparEmail, emailProprio, dominio, limparTelefone, fmtTel, capitalizar, classificar, categoriaPrincipal, setorDoNome, setorDaSub, N, strip, FREEMAIL };
