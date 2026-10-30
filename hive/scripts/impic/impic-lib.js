// Cliente da consulta pública do IMPIC (POST form-urlencoded; UA de browser obrigatório;
// só campos não vazios). Ritmo educado: >= 2,5 s entre pedidos (garantido aqui).
// UM só pedido de cada vez, mesmo com vários registos em processamento no mesmo processo: as chamadas
// entram numa fila (e as esperas de repetição também a seguram — quando o IMPIC falha, todos esperam).
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const URL = 'https://www.impic.pt/impic/ajax/call/impic_api/consultar/ajax/43';
const sleep = ms => new Promise(r => setTimeout(r, ms));
let ultimo = 0;
const GAP = +(process.env.IMPIC_GAP_MS || 2500);
let fila = Promise.resolve();
function post(fields) {
  const p = fila.then(() => postUm(fields));
  fila = p.catch(() => {});
  return p;
}
async function postUm(fields) {
  for (let tent = 1; tent <= 4; tent++) {
    const espera = ultimo + GAP - Date.now();
    if (espera > 0) await sleep(espera);
    ultimo = Date.now();
    try {
      const body = new URLSearchParams();
      for (const [k, v] of Object.entries(fields)) if (v !== '' && v != null) body.append(k, String(v));
      const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 30000);
      const r = await fetch(URL, { method: 'POST', signal: ctl.signal, headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' }, body });
      clearTimeout(to);
      const t = await r.text();
      if (r.status === 200 && !/The page cannot be displayed/.test(t)) { pedidosOk++; return t; }
      erro(`HTTP ${r.status}${/\((\d{4})\)/.test(t) ? ' TMG ' + t.match(/\((\d{4})\)/)[1] : ''}`, fields, tent);
    } catch (e) { erro(e.name === 'AbortError' ? 'timeout 30s' : 'rede ' + (e.cause && e.cause.code || e.message), fields, tent); }
    await sleep([10000, 30000, 60000, 0][tent - 1]);      // a maioria das falhas é pontual; as janelas longas escalam
  }
  throw new Error('IMPIC falhou 4x: ' + JSON.stringify(fields));
}
// Registo de falhas (para perceber o limite real do servidor): hora, nº de pedidos OK desde o arranque, motivo.
let pedidosOk = 0;
function erro(motivo, fields, tent) {
  const o = fields.informacao ? `det ${fields.id_object}-${fields.value}` : `lista ${fields.id_object} ${fields.distrito} p${fields.pageSearch}`;
  require('fs').appendFileSync(require('./dados')('impic-erros.log'), `${new Date().toISOString()} ok=${pedidosOk} tent=${tent} ${motivo} | ${o}\n`);
}
const dec = s => String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').trim();
function parseLista(html) {
  const total = +((html.match(/Encontrados\s+(\d+)/) || [])[1] || 0);
  const paginas = +((html.match(/de\s*<label>(\d+)<\/label>/) || [])[1] || 0);
  const rows = [];
  const re = /<tr class='[^']*page-\d+'>([\s\S]*?)<\/tr>/g;
  let m;
  while ((m = re.exec(html))) {
    const tds = [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(x => x[1]);
    if (tds.length < 4) continue;
    const nl = (tds[0].match(/data-nl='(\d+)'/) || [])[1];
    const txt = s => dec(s.replace(/<[^>]*>/g, ''));
    const morada = tds[3].split(/<br\s*\/?>/i).map(s => dec(s.replace(/<[^>]*>/g, ''))).filter(Boolean);
    rows.push({ nl, alvara: txt(tds[0]), nif: txt(tds[1]), nome: txt(tds[2]), morada });
  }
  return { total, paginas, rows };
}
function parseDetalhe(html) {
  const t = html.replace(/\r/g, '');
  const campo = (rot) => {
    const re = new RegExp('>\s*' + rot + '\s*<[\s\S]*?<(?:td|div|span|p)[^>]*>([\s\S]*?)<\/(?:td|div|span|p)>', 'i');
    const m = t.match(re); return m ? dec(m[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '')) : null;
  };
  return { html: t, campo };
}
module.exports = { post, parseLista, parseDetalhe, dec, sleep };
