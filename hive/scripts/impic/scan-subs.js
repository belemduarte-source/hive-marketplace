// Só leitura: subcategorias do IMPIC que a tabela SUB2SETOR não reconhece,
// e fichas com habilitações mas sem nenhuma reconhecida — têm de dar 0 (desde a 6.ª vaga uma subcategoria desconhecida deixa a ficha de fora).
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { setorDaSub, classificar } = require('./ficha');
const dir = dados('cache', 'det');
const subs = new Map();
const semSetor = [];
for (const f of fs.readdirSync(dir)) {
  if (!f.startsWith('17-')) continue;
  let d; try { d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (_) { continue; }
  const habs = d.habs || [];
  let reconhecidas = 0;
  for (const h of habs) {
    const k = (h.sub || '').replace(/\s+/g, ' ').trim();
    const s = setorDaSub(k);
    if (s) reconhecidas++;
    const cur = subs.get(k) || { n: 0, setor: s };
    cur.n++; subs.set(k, cur);
  }
  if (habs.length && !reconhecidas) semSetor.push({ key: f.replace('.json', ''), nome: d.nome, subs: habs.map(h => h.sub).join(' | '), cl: classificar(d, d.nome || '') });
}
console.log('subcategorias distintas:', subs.size);
for (const [k, v] of [...subs.entries()].filter(([, v]) => !v.setor).sort((a, b) => b[1].n - a[1].n)) console.log('  SEM SETOR', String(v.n).padStart(5), k);
console.log('\nfichas PUB com habilitações e nenhuma reconhecida:', semSetor.length);
for (const x of semSetor) console.log(' ', x.key.padEnd(9), JSON.stringify(x.cl.primario), '|', x.nome, '|', x.subs);
