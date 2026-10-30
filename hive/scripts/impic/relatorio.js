// Ensaio: funil por distrito (listagem → filtros → deduplicação) + taxa de aprovação na amostra de detalhes
// + estimativa de novas fichas. Só leitura (ficheiros locais). Uso: node relatorio.js [--md]
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { construir } = require('./candidatas');
const { DISTRITOS } = require('./geo-pt');

const { funil } = construir();
const antes = JSON.parse(fs.readFileSync(dados('antes-por-distrito.json'), 'utf8')).cont;
const porChave = new Map();
for (const l of fs.readFileSync(dados('processadas.jsonl'), 'utf8').split('\n').filter(Boolean)) { const x = JSON.parse(l); porChave.set(x.key, x); }
const proc = [...porChave.values()].filter(x => !x.retry);
const motivosGlobais = {};
const linhas = [];
let tot = { antes: 0, listadas: 0, cand: 0, amostra: 0, ok: 0, est: 0 };
for (const d of DISTRITOS) {
  const f = funil[d] || {};
  const am = proc.filter(x => x.distrito === d);
  const ok = am.filter(x => x.ok).length;
  for (const x of am) if (!x.ok) motivosGlobais[x.motivo] = (motivosGlobais[x.motivo] || 0) + 1;
  const taxa = am.length ? ok / am.length : null;
  const est = taxa != null ? Math.round((f.candidatas || 0) * taxa) : null;
  linhas.push({ d, antes: antes[d] || 0, listadas: f.listadas || 0, unip: f.unipessoal || 0, eni: (f['eni-nif-oculto'] || 0) + (f['nao-pessoa-coletiva'] || 0),
    outras: (f['entidade-nao-empresa'] || 0) + (f['fora-de-ambito'] || 0) + (f['imobiliaria-sem-obra'] || 0) + (f['nif-invalido'] || 0), naBD: (f['ja-na-bd-nif'] || 0) + (f['ja-na-bd-alvara'] || 0) + (f['nome-igual-a-ficha-sem-nif'] || 0) + (f['nif-repetido-na-lista'] || 0),
    cand: f.candidatas || 0, amostra: am.length, ok, taxa, est });
  tot.antes += antes[d] || 0; tot.listadas += f.listadas || 0; tot.cand += f.candidatas || 0; tot.amostra += am.length; tot.ok += ok; tot.est += est || 0;
}
const pct = v => v == null ? '—' : Math.round(v * 100) + '%';
const md = process.argv.includes('--md');
if (md) {
  console.log('| Distrito | Hoje na Hivex | IMPIC listadas | − unipessoais | − ENI | − outras | − já na BD | Candidatas | Amostra (ok/n) | Passa | Novas estimadas |');
  console.log('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
  for (const r of linhas) console.log(`| ${r.d} | ${r.antes} | ${r.listadas} | ${r.unip} | ${r.eni} | ${r.outras} | ${r.naBD} | ${r.cand} | ${r.ok}/${r.amostra} | ${pct(r.taxa)} | ${r.est ?? '—'} |`);
  console.log(`| **Total** | ${tot.antes} | ${tot.listadas} | | | | | ${tot.cand} | ${tot.ok}/${tot.amostra} | ${pct(tot.amostra ? tot.ok / tot.amostra : null)} | ${tot.est} |`);
} else {
  console.log('distrito          hoje  listadas  unip   eni  outras naBD  cand  amostra  passa  estimadas');
  for (const r of linhas) console.log(`${r.d.padEnd(16)} ${String(r.antes).padStart(5)} ${String(r.listadas).padStart(9)} ${String(r.unip).padStart(5)} ${String(r.eni).padStart(5)} ${String(r.outras).padStart(6)} ${String(r.naBD).padStart(4)} ${String(r.cand).padStart(5)} ${(r.ok + '/' + r.amostra).padStart(8)} ${pct(r.taxa).padStart(6)} ${String(r.est ?? '—').padStart(10)}`);
  console.log(`TOTAL            ${String(tot.antes).padStart(5)} ${String(tot.listadas).padStart(9)}                         ${String(tot.cand).padStart(5)} ${(tot.ok + '/' + tot.amostra).padStart(8)} ${pct(tot.amostra ? tot.ok / tot.amostra : null).padStart(6)} ${String(tot.est).padStart(10)}`);
}
console.log('\nmotivos de recusa na amostra:', JSON.stringify(motivosGlobais));
const okR = proc.filter(x => x.ok);
const geo = {}; for (const x of okR) { const k = x.geo.fonte.replace(/-sem-cp7$/, ''); geo[k] = (geo[k] || 0) + 1; }
const set = {}; for (const x of okR) set[x.ficha.sector] = (set[x.ficha.sector] || 0) + 1;
const canais = { 'email+tel': 0, 'só email': 0, 'só tel': 0, 'email próprio': 0 };
for (const x of okR) { const e = !!x.ficha.email, t = !!x.ficha.phone; if (e && t) canais['email+tel']++; else if (e) canais['só email']++; else canais['só tel']++; if (x.ficha.email_proprio) canais['email próprio']++; }
const tipo = { PUB: okR.filter(x => /PUB/.test(x.alvara)).length, PAR: okR.filter(x => /PAR/.test(x.alvara)).length };
console.log('precisão da posição (aprovadas):', JSON.stringify(geo));
console.log('setor primário:', JSON.stringify(set));
console.log('canais além do alvará:', JSON.stringify(canais), '| registo:', JSON.stringify(tipo));
