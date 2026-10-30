// Espera até um padrão aparecer num log (sai com o resto da linha). Uso: node esperar.js ficheiro "regex"
const fs = require('fs');
const [f, padrao] = process.argv.slice(2);
const re = new RegExp(padrao);
const t = setInterval(() => {
  let s = ''; try { s = fs.readFileSync(f, 'utf8'); } catch (_) { return; }
  const linhas = s.split('\n').filter(l => re.test(l));
  if (linhas.length) { console.log(linhas.join('\n')); clearInterval(t); }
}, 15000);
