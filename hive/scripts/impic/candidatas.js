// Fase B (offline, sem rede): listagem IMPIC em cache → filtros de entidade → deduplicação contra a BD.
// Saída: cands.json (candidatas a pedir detalhe) + funil-listagem.json (contagens por distrito).
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { filtroEntidade, N } = require('./ficha');
const { regiao, norm } = require('./geo-pt');

function lerListagem() {
  const out = [];
  for (const obj of ['17', '18']) {
    const base = dados('cache', 'lista', obj);
    if (!fs.existsSync(base)) continue;
    for (const d of fs.readdirSync(base)) {
      for (const f of fs.readdirSync(path.join(base, d))) {
        for (const r of JSON.parse(fs.readFileSync(path.join(base, d, f), 'utf8')).rows) {
          const ult = r.morada[r.morada.length - 1] || '';
          const m = ult.match(/^(.*) - (.*)$/);
          out.push({ obj: +obj, nl: r.nl, alvara: r.alvara, nif: (r.nif || '').replace(/\D/g, ''), nome: r.nome,
            morada: m ? r.morada.slice(0, -1) : r.morada, concelho: m ? m[1].trim() : null, distrito: m ? regiao(m[2].trim()) : null });
        }
      }
    }
  }
  return out;
}

// Nome "núcleo" para comparar com fichas sem NIF (OSM): sem formas jurídicas nem palavras genéricas.
const GENERICAS = new Set(['LDA', 'LIMITADA', 'SA', 'S', 'A', 'UNIPESSOAL', 'UNIP', 'SOCIEDADE', 'SOC', 'DE', 'DA', 'DO', 'DAS', 'DOS', 'E', '&', 'CONSTRUCOES', 'CONSTRUCAO', 'CONSTRUTORA', 'CIVIL', 'OBRAS', 'PUBLICAS', 'ENGENHARIA', 'EMPREITADAS', 'COMERCIO', 'SERVICOS', 'INDUSTRIA', 'PORTUGAL', 'IMOBILIARIA', 'GESTAO', 'INVESTIMENTOS', 'FILHOS', 'FILHO', 'IRMAOS', 'CIA', 'COMPANHIA', 'GRUPO', 'SGPS']);
const nucleo = s => N(s).split(' ').filter(t => t.length >= 2 && !GENERICAS.has(t));
const jacc = (a, b) => { if (!a.length || !b.length) return 0; const B = new Set(b); const i = a.filter(t => B.has(t)).length; return i / (a.length + b.length - i); };

function indiceBD() {
  const { rows } = JSON.parse(fs.readFileSync(dados('bd-dedupe.json'), 'utf8'));
  const nifs = new Set(), alvs = new Set(), alvNum = new Set(), porConcelho = new Map();
  for (const r of rows) {
    if (r.nif) nifs.add(r.nif.replace(/\D/g, ''));
    if (r.alv_num) {
      const tipo = (r.alvara.match(/\b(PUB|PAR)\b/) || [])[1];
      if (tipo) alvs.add(r.alv_num + '-' + tipo); else alvNum.add(r.alv_num);   // sem tipo: casa com ambos
    }
    if (r.country === 'pt' && !r.nif) {
      const k = norm(r.city || '');
      if (!porConcelho.has(k)) porConcelho.set(k, []);
      porConcelho.get(k).push({ id: r.id, status: r.status, nuc: nucleo(r.name), nome: r.name });
    }
  }
  return { nifs, alvs, alvNum, porConcelho };
}

function construir() {
  const lista = lerListagem();
  const bd = indiceBD();
  const funil = {};
  const F = d => (funil[d] = funil[d] || { listadas: 0, 'eni-nif-oculto': 0, 'nif-invalido': 0, 'nao-pessoa-coletiva': 0, unipessoal: 0, 'entidade-nao-empresa': 0, 'fora-de-ambito': 0, 'imobiliaria-sem-obra': 0, 'ja-na-bd-nif': 0, 'ja-na-bd-alvara': 0, 'nome-igual-a-ficha-sem-nif': 0, 'nif-repetido-na-lista': 0, candidatas: 0 });
  const vistos = new Map();
  // PUB primeiro: se o mesmo NIF tiver PUB e PAR fica o PUB (tem habilitações)
  lista.sort((a, b) => a.obj - b.obj);
  const cands = [];
  for (const r of lista) {
    const d = r.distrito || '?';
    const f = F(d);
    f.listadas++;
    const motivo = filtroEntidade(r.nome, r.nif);
    if (motivo) { f[motivo]++; continue; }
    if (bd.nifs.has(r.nif)) { f['ja-na-bd-nif']++; continue; }
    const num = (r.alvara.match(/\d+/) || [])[0], tipo = (r.alvara.match(/\b(PUB|PAR)\b/) || [])[1];
    if (bd.alvs.has(num + '-' + tipo) || bd.alvNum.has(num)) { f['ja-na-bd-alvara']++; continue; }
    const nuc = nucleo(r.nome);
    const viz = bd.porConcelho.get(norm(r.concelho || '')) || [];
    const igual = nuc.length && viz.find(x => jacc(nuc, x.nuc) >= 0.75);
    if (igual) { f['nome-igual-a-ficha-sem-nif']++; continue; }
    if (vistos.has(r.nif)) { f['nif-repetido-na-lista']++; continue; }
    vistos.set(r.nif, true);
    f.candidatas++;
    cands.push({ key: r.obj + '-' + r.nl, ...r });
  }
  return { cands, funil, total: lista.length };
}

if (require.main === module) {
  const { cands, funil, total } = construir();
  fs.writeFileSync(dados('cands.json'), JSON.stringify(cands));
  fs.writeFileSync(dados('funil-listagem.json'), JSON.stringify(funil, null, 1));
  console.log('listadas', total, '| candidatas', cands.length);
  const cols = ['listadas', 'eni-nif-oculto', 'nao-pessoa-coletiva', 'unipessoal', 'entidade-nao-empresa', 'nif-invalido', 'ja-na-bd-nif', 'ja-na-bd-alvara', 'nome-igual-a-ficha-sem-nif', 'nif-repetido-na-lista', 'candidatas'];
  console.log('distrito'.padEnd(17) + cols.map(c => c.slice(0, 9).padStart(10)).join(''));
  for (const [d, f] of Object.entries(funil).sort((a, b) => b[1].listadas - a[1].listadas)) console.log(d.padEnd(17) + cols.map(c => String(f[c]).padStart(10)).join(''));
}
module.exports = { construir, nucleo, jacc };
