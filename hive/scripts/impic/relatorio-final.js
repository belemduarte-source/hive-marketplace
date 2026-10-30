// Relatório final em Markdown (só leitura: ficheiros locais). Correr DEPOIS de verificar.js e amostra.js.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { construir } = require('./candidatas');
const { DISTRITOS } = require('./geo-pt');
const ler = f => JSON.parse(fs.readFileSync(dados(f), 'utf8'));
// o processamento pode estar a escrever: uma linha a meio é ignorada
const linhasJ = f => fs.existsSync(dados(f)) ? fs.readFileSync(dados(f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean) : [];

const antes = ler('antes-por-distrito.json'), depois = fs.existsSync(dados('depois-por-distrito.json')) ? ler('depois-por-distrito.json') : null;
const ins = linhasJ('inseridas.jsonl');
const porChave = new Map(); for (const x of linhasJ('processadas.jsonl')) porChave.set(x.key, x);
const proc = [...porChave.values()];
const { funil } = construir();
const insD = {}; for (const x of ins) insD[x.distrito] = (insD[x.distrito] || 0) + 1;
// retiradas depois de gravar (corrigidas.jsonl), por distrito da ficha inserida
const distDe = new Map(ins.map(x => [+x.id, x.distrito])), retD = {};
for (const x of linhasJ('corrigidas.jsonl')) if (x.acao === 'retirada') { const d = distDe.get(+x.id); retD[d] = (retD[d] || 0) + 1; }
const menos = n => n ? ` (−${n})` : '';
const out = [];
const p = s => out.push(s);
const pct = (a, b) => b ? Math.round(100 * a / b) + '%' : '—';

p('## Contagens por distrito (empresas aprovadas em Portugal)\n');
p('| Distrito | Antes | Inseridas (− retiradas depois) | Depois | Registos IMPIC listados | Candidatas (após filtros e duplicados) | Processadas | Aprovadas na barra | Por processar |');
p('|---|---:|---:|---:|---:|---:|---:|---:|---:|');
const T = { a: 0, i: 0, d: 0, l: 0, c: 0, pr: 0, ok: 0 };
for (const d of [...DISTRITOS, '?']) {
  const f = funil[d] || {};
  const pd = proc.filter(x => x.distrito === d && !x.retry), okd = pd.filter(x => x.ok).length;
  const a = antes.cont[d] || 0, dd = depois ? (depois.cont[d] || 0) : null;
  if (!a && !f.listadas && !dd) continue;
  p(`| ${d} | ${a} | ${insD[d] || 0}${menos(retD[d])} | ${dd ?? '—'} | ${f.listadas || 0} | ${f.candidatas || 0} | ${pd.length} | ${okd} | ${Math.max(0, (f.candidatas || 0) - pd.length)} |`);
  T.a += a; T.i += insD[d] || 0; T.d += dd || 0; T.l += f.listadas || 0; T.c += f.candidatas || 0; T.pr += pd.length; T.ok += okd;
}
p(`| **Total** | **${T.a}** | **${T.i}**${menos(Object.values(retD).reduce((s, n) => s + n, 0))} | **${depois ? depois.total : '—'}** | ${T.l} | ${T.c} | ${T.pr} | ${T.ok} | ${Math.max(0, T.c - T.pr)} |\n`);

// funil global
const F = {}; for (const f of Object.values(funil)) for (const [k, v] of Object.entries(f)) F[k] = (F[k] || 0) + v;
p('## Funil (todos os distritos listados)\n');
p(`- Registos IMPIC listados: ${F.listadas}`);
p(`- Fora por serem de uma pessoa: unipessoais ${F.unipessoal}, empresários em nome individual (NIF oculto/singular) ${(F['eni-nif-oculto'] || 0) + (F['nao-pessoa-coletiva'] || 0)}`);
p(`- Fora por não serem prestadores: entidades públicas/associações/ACE ${F['entidade-nao-empresa']}, fora de âmbito (telecom, energia, resíduos, turismo…) ${F['fora-de-ambito'] || 0}, imobiliárias e sociedades de investimento sem palavra de obra no nome ${F['imobiliaria-sem-obra'] || 0}, trabalho temporário ${F['trabalho-temporario'] || 0}, NIF inválido ${F['nif-invalido']}`);
p(`- Já existiam na Hivex: por NIF ${F['ja-na-bd-nif']}, por alvará ${F['ja-na-bd-alvara']}, por nome no concelho ${F['nome-igual-a-ficha-sem-nif']}; NIF repetido entre registos ${F['nif-repetido-na-lista']}`);
p(`- Candidatas: ${F.candidatas}\n`);
const mot = {}; for (const x of proc) if (!x.ok) mot[x.retry ? 'à espera (retry): ' + x.motivo : x.motivo] = (mot[x.retry ? 'à espera (retry): ' + x.motivo : x.motivo] || 0) + 1;
p('Recusadas no detalhe/geocodificação: ' + Object.entries(mot).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ') + '\n');

// inseridas
if (ins.length) {
  const c = (arr, fn) => { const o = {}; for (const x of arr) { const k = fn(x); o[k] = (o[k] || 0) + 1; } return Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · '); };
  p('## Inseridas\n');
  p(`- Total: ${ins.length} (fonte: consulta pública do IMPIC — ${c(ins, x => /PUB/.test(x.alvara) ? 'alvará de obras públicas' : 'certificado de obras particulares')})`);
  p(`- Contactos oficiais: email ${pct(ins.filter(x => x.email).length, ins.length)}, telefone ${pct(ins.filter(x => x.phone).length, ins.length)}, website validado ${pct(ins.filter(x => x.website).length, ins.length)}`);
  p(`- Precisão da posição: ${c(ins, x => x.geo.replace(/-sem-cp7|\+porta-vizinha/g, '').replace(/^geoapi-porta$/, 'porta (INE)').replace(/^geoapi-rua$/, 'rua (INE)').replace(/^photon-house$/, 'porta (OSM)').replace(/^photon-street$/, 'rua (OSM)').replace(/^geoapi-cp7(-centro)?$/, 'código postal').replace(/^localidade-.*/, 'localidade'))}`);
  p(`- Setor principal: ${c(ins, x => x.sector)}`);
  p(`- Desempilhadas para a porta vizinha: ${ins.filter(x => /porta-vizinha/.test(x.geo)).length}`);
  // retidas na inserção da última vaga (ficam em processadas.jsonl e são tentadas outra vez na vaga seguinte)
  const vagas = fs.readdirSync(dados('.')).filter(f => /^inserir-vaga\d+\.log$/.test(f)).sort((a, b) => a.match(/\d+/)[0] - b.match(/\d+/)[0]);
  const ultima = vagas[vagas.length - 1];
  const fim = ultima && (fs.readFileSync(dados(ultima), 'utf8').match(/\[inserir\] FIM \(gravado\) (\{.*\})/) || [])[1];
  if (fim) { const r = JSON.parse(fim); p(`- Retidas na inserção da última vaga (tentadas outra vez na seguinte): sem porta livre a ≥ 5 m de outra empresa ${r['empilhada-sem-porta-livre'] || 0}, email já na BD ${r['email-ja-na-bd'] || 0}, telefone já na BD ${r['telefone-ja-na-bd'] || 0}`); }
  const corr = linhasJ('corrigidas.jsonl'), emp = corr.filter(x => !x.regra), ret = emp.filter(x => x.acao === 'retirada'), unip = corr.filter(x => x.regra === 'unipessoal');
  if (emp.length) p(`- Corrigidas depois de gravar (a < 5 m de outra empresa nova; o teste antigo comparava a chave arredondada a 5 casas): ${emp.length - ret.length} movidas para uma porta INE livre, ${ret.length} retiradas por não haver porta livre (ids ${ret.map(x => x.id).join(', ')})`);
  if (unip.length) p(`- Retiradas depois de gravar por serem unipessoais com o nome abreviado ou mal escrito no IMPIC (o filtro antigo só apanhava "Unipessoal"/"Unip"): ${unip.length} (ids ${unip.map(x => x.id).join(', ')})`);
  const imob = corr.filter(x => x.regra === 'imobiliaria-sem-obra');
  if (imob.length) p(`- Retiradas depois de gravar por serem imobiliárias ou sociedades de investimento sem palavra de obra no nome (Imóveis, Propriedades, Empreendimentos, Real Estate, Investimentos; o filtro antigo só apanhava "Imobiliária"): ${imob.length} (ids ${imob.map(x => x.id).join(', ')})`);
  const elev = corr.filter(x => x.regra === 'fora-das-areas' || x.regra === 'habilitacoes-desconhecidas');
  if (elev.length) p(`- Retiradas depois de gravar por só terem a habilitação de elevadores na numeração nova do IMPIC ("11.ª - Instalações de elevação"; a tabela de setores só conhecia "Ascensores…" e punha-as em construção geral): ${elev.length} (ids ${elev.map(x => x.id).join(', ')})`);
  const tt = corr.filter(x => x.regra === 'trabalho-temporario');
  if (tt.length) p(`- Retiradas depois de gravar por serem empresas de trabalho temporário (têm o certificado para colocar trabalhadores em obra, não fazem obras para o público): ${tt.length} (ids ${tt.map(x => x.id).join(', ')})`);
  p('');
}
// amostras: Lisboa (20 ao acaso) e entre distritos (estratificada); amostra.json se for a única
const AMOSTRAS = [['amostra-lisboa.json', 'Lisboa, ao acaso'], ['amostra-setubal.json', 'Setúbal, ao acaso, antes de gravar'], ['amostra-setubal2.json', 'Setúbal (5.ª vaga), ao acaso, antes de gravar'], ['amostra-faro.json', 'Faro, ao acaso, antes de gravar'], ['amostra-faro2.json', 'Faro (6.ª vaga), ao acaso, antes de gravar'], ['amostra-leiria.json', 'Leiria, ao acaso, antes de gravar'], ['amostra-leiria2.json', 'Leiria (7.ª vaga), ao acaso, antes de gravar'], ['amostra-santarem.json', 'Santarém, ao acaso, antes de gravar'], ['amostra-santarem2.json', 'Santarém (8.ª vaga), ao acaso, antes de gravar'], ['amostra-coimbra.json', 'Coimbra, ao acaso, antes de gravar'],['amostra-distritos.json', 'todos os distritos, estratificada'], ['amostra.json', 'ao acaso']];
const vistas = new Set();
for (const [fic, rot] of AMOSTRAS) {
  if (!fs.existsSync(dados(fic))) continue;
  const am = ler(fic);
  const sig = am.map(x => x.key).join();
  if (!am.length || vistas.has(sig) || (fic === 'amostra.json' && vistas.size)) continue;
  vistas.add(sig);
  p(`## Amostra de verificação — ${rot} (${am.length})\n`);
  p(`Rua no ponto = rua da morada: ${am.filter(x => x.ruaConfere).length}/${am.length} · concelho no ponto = concelho da ficha: ${am.filter(x => x.concelhoConfere).length}/${am.length}\n`);
  p('| Empresa | Alvará | Concelho | Setor | Contactos | Posição | No ponto (GeoAPI) |');
  p('|---|---|---|---|---|---|---|');
  for (const x of am) p(`| ${x.nome} | ${x.alvara} (classe ${x.classe ?? '—'}, desde ${(x.inscricao || '').slice(-4)}) | ${x.concelho} | ${x.setor} | ${[x.email ? 'email' : '', x.telefone ? 'tel' : ''].filter(Boolean).join('+')} | ${x.geo} | ${x.noPino}${x.ruaConfere ? ' ✓' : ''} |`);
  p('');
}
const md = out.join('\n');
fs.writeFileSync(dados('relatorio-final.md'), md);
console.log(md);
