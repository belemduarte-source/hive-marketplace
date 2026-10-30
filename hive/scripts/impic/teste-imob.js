// teste do filtro de imobiliárias/investimento sem palavra de obra contra toda a listagem IMPIC em cache (só leitura)
// Compara o que fica de fora com a regra antiga (só "Imobiliária" sem obra) e com o filtro em uso (ficha.js).
// Uso: node teste-imob.js [--todos]
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs'), path = require('path');
const { filtroEntidade } = require('./ficha');
const strip = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
const N = s => strip(s).toUpperCase().replace(/[^A-Z0-9&]+/g, ' ').trim();
const V_IMOB = /\bIMOBILI/, V_OBRA = /CONSTRU|OBRAS|EMPREIT|ENGENHAR|REMODEL|REABILIT|EDIFIC/;
const PAL = /\bIMOBILI|\bIMOB\b|\bIMOVE(IS|L)\b|\bPROPRIEDADES?\b|\bEMPREEND|\bREAL ESTATE\b|INVEST(?!IGA)/;   // só para dizer que palavra apanhou
const NIF = '510315917';   // NIF coletivo válido de teste: só o nome decide
const novo = s => filtroEntidade(s, NIF) !== null;
const velho = s => { const m = filtroEntidade(s, NIF); return (m !== null && m !== 'imobiliaria-sem-obra') || (V_IMOB.test(s) && !V_OBRA.test(s)); };
const nomes = new Map();
for (const obj of ['17', '18']) {
  const base = dados('cache', 'lista', obj);
  for (const d of fs.readdirSync(base)) for (const f of fs.readdirSync(path.join(base, d)))
    for (const r of JSON.parse(fs.readFileSync(path.join(base, d, f), 'utf8')).rows) {
      const nif = (r.nif || '').replace(/\D/g, '');
      if (nif[0] === '5') nomes.set(nif + '|' + r.nome, N(r.nome));
    }
}
let v = 0, n = 0; const mais = [], menos = [];
for (const s of nomes.values()) { const a = velho(s), b = novo(s); if (a) v++; if (b) n++; if (b && !a) mais.push(s); if (a && !b) menos.push(s); }
console.log('NIF 5… listados:', nomes.size, '| fora com a regra antiga', v, '| fora com o filtro em uso', n, '| só o novo tira', mais.length, '| só o antigo tirava', menos.length);
const pal = {}; for (const s of mais) { const m = s.match(PAL); const k = m ? m[0] : '?'; pal[k] = (pal[k] || 0) + 1; }
console.log('palavra que apanha (só o novo):', JSON.stringify(pal));
if (process.argv[2] === '--todos') for (const s of mais.sort()) console.log('  +', s);
for (const s of menos.sort()) console.log('  - (deixa de sair)', s);
