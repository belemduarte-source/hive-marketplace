// Veredito (offline, sem BD) para os 464 sites suspeitos, a partir de sites-reverificados.json. Não altera nada na BD.
// confirmado: a página menciona o NIF ou uma palavra distintiva do nome (ou o domínio é a sigla/nome da empresa)
// errado: a página é claramente de outro negócio (contabilidade, advogados, imobiliária, seguros, universidade, etc.)
// marca-provavel: página de construção ou ofício sem menção à empresa; pode ser marca comercial: rever à mão
// rever: não dá para decidir (página vazia, bloqueada ou sem relação clara); erro: não respondeu
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const F = require('./ficha');
const D = f => dados(f);
const v = Object.values(JSON.parse(fs.readFileSync(D('sites-reverificados.json'), 'utf8')));
const OUTRO = /CONTABIL|CONTABILISTA|FISCAL|ACCOUNT|\bIMPOSTOS\b|\bTAX\b|ADVOGAD|ADVOCACIA|LAW FIRM|\bLAWYER\b|SOLICITADOR|\bSEGUROS\b|UNIVERSIDADE|\bREAL ESTATE\b|\bIMOBILI|INVESTMENTS?\b|\bPROPERTIES\b|GESTAO DE CONDOMINIOS|MUDANCAS|DOCUMENTACAO E SERVICOS AUTOMOVEIS|PANIFICADORA|TREINO|\bBAKING\b|ELECTRODOMESTICOS|APARTAMENTOS DE FERIAS|CORRETORES|RECURSOS HUMANOS|GESTORIA|CONSULTORIA EMPRESARIAL|PERSONALIZACAO DE VIDRO|TENCENT|腾讯/;
const OUTRO_DOM = /CONTA|CONTAB|TAXGEST|FISCAL|COUNT|ADVOG|LAWYER|CUATRECASAS|ULUSOFONA|^JLL$|^GE$|^QQ$|ODEBRECHT|AICCOPN|INFOREGISTO|PORTALCONSTRUA/;
const TRADE = /CONSTRU|REMODEL|REABILIT|ENGENHAR|ENGINEER|OBRAS\b|ARQUITET|ARCHITECT|SERRALH|METALOMEC|PAVIMENT|REVESTIMENT|PISCINA|POOL|JANELA|WINDOW|DOORS|ELECTRIC|ELETRIC|ENERGIA|SOLAR|AVAC|CLIMATIZ|SEGURANCA|ELEVADOR|ANDAIME|BUILD|HOME|CASA|LIVING|VIDRO|ALUMIN|PEDRA|STONE|FACHADA|COBERTURA|INTERIOR|INSTALAC|AUTOMAT|CARPINT|MADEIRA|WOOD|BETAO|CONCRETE/;
const siglaOk = (nome, site) => {
  let d = ''; try { d = F.N(new URL(site).hostname.replace(/^www\./, '').split('.')[0]).replace(/\s/g, ''); } catch (_) { return false; }
  const ini = F.N(nome).split(' ').filter(Boolean).map(t => t[0]).join('');
  const sem = F.N(nome).split(' ').filter(t => !/^(LDA|SA|DE|DA|DO|DOS|DAS|E|&)$/.test(t)).map(t => t[0]).join('');
  return d.length >= 3 && (ini.includes(d.slice(0, 3)) || sem.includes(d.slice(0, 3)) || d.includes(sem) || sem.includes(d));
};
const out = [];
for (const x of v) {
  const titulo = F.N(String(x.titulo || '')), dom = (() => { try { return F.N(new URL(x.site).hostname.replace(/^www\./, '').split('.')[0]).replace(/\s/g, ''); } catch (_) { return ''; } })();
  let veredito, razao;
  if (x.erro) { veredito = 'erro'; razao = 'não respondeu: ' + x.erro; }
  else if (x.nif) { veredito = 'confirmado'; razao = 'a página mostra o NIF'; }
  else if (x.palavras && x.palavras.length) { veredito = 'confirmado'; razao = 'a página menciona: ' + x.palavras.join(', '); }
  else if (OUTRO.test(titulo) || OUTRO_DOM.test(dom)) { veredito = 'errado'; razao = 'a página é de outro negócio'; }
  else if (siglaOk(x.name, x.site) && (TRADE.test(titulo) || TRADE.test(dom))) { veredito = 'confirmado'; razao = 'o domínio é a sigla da empresa e a página é do ramo'; }
  else if (TRADE.test(titulo) || TRADE.test(dom)) { veredito = 'marca-provavel'; razao = 'página do ramo sem menção à empresa; pode ser marca comercial'; }
  else { veredito = 'rever'; razao = (x.letras || 0) < 300 ? 'página quase vazia ou bloqueada' : 'sem relação clara com o nome'; }
  out.push({ id: x.id, nome: x.name, site: x.site, veredito, razao, titulo: String(x.titulo || '').slice(0, 90), nif_na_pagina: !!x.nif, palavras: x.palavras || [], letras: x.letras || 0 });
}
const NOTAS = 'C:/Users/35191/AppData/Roaming/Claude/side-session-notes/local_e2b80c62-561f-49cc-8eeb-bd85cc948263/sites-reverificados.json';
fs.writeFileSync(NOTAS, JSON.stringify(out, null, 1));
fs.writeFileSync(D('sites-veredito.json'), JSON.stringify(out, null, 1));
const c = {}; for (const x of out) c[x.veredito] = (c[x.veredito] || 0) + 1;
console.log('vereditos:', JSON.stringify(c));
const mostra = (k, n) => { console.log(`\n${k} (amostra):`); for (const x of out.filter(y => y.veredito === k).slice(0, n)) console.log(' ', String(x.id).padEnd(6), x.nome.slice(0, 32).padEnd(32), '|', x.site.replace(/^https?:\/\/(www\.)?/, '').slice(0, 26).padEnd(26), '|', x.titulo.slice(0, 62)); };
mostra('errado', 14); mostra('marca-provavel', 14); mostra('rever', 14);
