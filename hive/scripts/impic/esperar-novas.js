// Espera (1 só processo, sem loops bash) até haver trabalho para a próxima vaga de inserção:
//  - N fichas aprovadas no processamento ainda não inseridas (além das que já esperavam ao arrancar:
//    retidas por empilhamento ou filtradas na inserção não contam), ou
//  - fim/erro do orquestrador, ou
//  - processamento parado há mais de PARADO_MIN minutos (máquina suspensa, IMPIC em baixo…)
// Uso: node esperar-novas.js <log do orquestrador> [N=1000] [PARADO_MIN=20]
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const [LOG, N = 1000, PARADO_MIN = 20] = [process.argv[2], +(process.argv[3] || 1000), +(process.argv[4] || 20)];
const PROC = dados('processadas.jsonl'), INS = dados('inseridas.jsonl');
const linhas = f => fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean) : [];
let ultTam = -1, ultMud = Date.now(), base = null;
const t0 = Date.now();
function verificar() {
  const log = fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8') : '';
  if (/ERRO FATAL/.test(log)) return 'erro fatal no orquestrador';
  if (/\[correr\] FIM/.test(log)) return 'orquestrador terminou';
  const tam = fs.existsSync(PROC) ? fs.statSync(PROC).size : 0;
  if (tam !== ultTam) { ultTam = tam; ultMud = Date.now(); }
  else if (Date.now() - ultMud > PARADO_MIN * 60e3) return `processamento parado há ${PARADO_MIN} min`;
  const ins = new Set(linhas(INS).map(x => x.key));
  const porChave = new Map(); for (const x of linhas(PROC)) porChave.set(x.key, x);
  const novas = [...porChave.values()].filter(x => x.ok && !ins.has(x.key)).length;
  if (base === null) base = novas;
  if (novas - base >= N) return `${novas - base} fichas aprovadas novas por inserir`;
  return null;
}
const iv = setInterval(() => {
  let m = null;
  try { m = verificar(); } catch (e) { m = 'erro a ler: ' + e.message; }
  if (m) { console.log(`[esperar-novas] ${m} (${((Date.now() - t0) / 60000).toFixed(0)} min de espera)`); clearInterval(iv); }
}, 30000);
