// Fase C2 — website a partir do email de domínio próprio (validaSite): https://www.dom → https://dom.
// Só é aceite se responder HTML, não for página estacionada/à venda/"em construção" e mencionar a empresa
// (palavra do nome, NIF ou o próprio domínio no conteúdo). 4 pedidos em paralelo; resumível (sites.json).
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { nucleo } = require('./candidatas');
const { N } = require('./ficha');
const PROC = dados('processadas.jsonl');
const OUT = dados('sites.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const PARQUEADO = /domain (is )?for sale|buy this domain|this domain (is|may be) for sale|parked (free|domain)|sedoparking|dan\.com|afternic|hugedomains|dom[ií]nio (est[aá] )?(à|a) venda|comprar este dom[ií]nio|website coming soon|site em constru[cç][aã]o|p[aá]gina em constru[cç][aã]o|under construction|em breve dispon[ií]vel|index of \/|default web site page|it works!|plesk|cpanel|welcome to nginx|account suspended|conta suspensa|this site can.t be reached|hostinger|domain has expired|dom[ií]nio expirou/i;

async function buscar(url) {
  const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(url, { signal: ctl.signal, redirect: 'follow', headers: { 'User-Agent': UA, accept: 'text/html' } });
    const ct = r.headers.get('content-type') || '';
    if (!r.ok || !/html/i.test(ct)) return { ok: false, motivo: 'http-' + r.status };
    const html = (await r.text()).slice(0, 400000);
    return { ok: true, html, url: r.url };
  } catch (e) { return { ok: false, motivo: e.name === 'AbortError' ? 'timeout' : 'rede' }; }
  finally { clearTimeout(to); }
}
async function validar(dom, nome, nif) {
  for (const u of ['https://www.' + dom, 'https://' + dom, 'http://www.' + dom]) {
    const r = await buscar(u);
    if (!r.ok) continue;
    const texto = r.html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
    if (PARQUEADO.test(r.html.slice(0, 60000))) return { ok: false, motivo: 'estacionado-ou-em-construcao' };
    const final = new URL(r.url);
    const domFinal = final.hostname.replace(/^www\./, '');
    // mesma marca noutro TLD (teixeiraduarte.com → teixeiraduarte.pt) é aceite; outro nome não
    const rotulo = h => h.split('.')[0];
    if (domFinal !== dom && !domFinal.endsWith('.' + dom) && rotulo(domFinal) !== rotulo(dom)) return { ok: false, motivo: 'redireciona-para-outro-dominio:' + domFinal };
    const pal = nucleo(nome).filter(t => t.length >= 4);
    const menciona = T => pal.some(t => T.includes(t)) || T.includes(nif) || T.includes(N(dom.split('.')[0]));
    // sites feitos em JavaScript têm pouco texto no HTML: aí basta o <title>/meta mencionar a empresa
    const cabecalho = N([(r.html.match(/<title[^>]*>([^<]*)/i) || [])[1], ...[...r.html.matchAll(/<meta[^>]+(?:og:site_name|og:title|name="description")[^>]*content="([^"]*)"/gi)].map(m => m[1])].filter(Boolean).join(' '));
    if (texto.replace(/\s+/g, ' ').trim().length < 200) return menciona(cabecalho) ? { ok: true, url: final.origin + '/' } : { ok: false, motivo: 'pagina-vazia' };
    if (!menciona(N(texto) + ' ' + cabecalho)) return { ok: false, motivo: 'nao-menciona-a-empresa' };
    return { ok: true, url: final.origin + '/' };
  }
  return { ok: false, motivo: 'sem-resposta' };
}

(async () => {
  const sites = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  const porDom = new Map();
  for (const l of fs.readFileSync(PROC, 'utf8').split('\n').filter(Boolean)) {
    const x = JSON.parse(l);
    if (!x.ok || !x.ficha.email_proprio) continue;
    const dom = x.ficha.email.split('@')[1];
    if (!sites[dom] && !porDom.has(dom)) porDom.set(dom, x);
  }
  const fila = [...porDom.entries()];
  console.log('[sites] domínios a validar', fila.length);
  let i = 0, feitos = 0;
  const worker = async () => {
    while (i < fila.length) {
      const [dom, x] = fila[i++];
      sites[dom] = await validar(dom, x.nome, x.nif);
      if (++feitos % 25 === 0) { fs.writeFileSync(OUT, JSON.stringify(sites)); console.log(`[sites] ${feitos}/${fila.length}`); }
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  fs.writeFileSync(OUT, JSON.stringify(sites));
  const c = {}; for (const v of Object.values(sites)) { const k = v.ok ? 'ok' : v.motivo.split(':')[0]; c[k] = (c[k] || 0) + 1; }
  console.log('[sites] FIM', JSON.stringify(c));
})().catch(e => { console.error('[sites] ERRO FATAL', e); process.exit(1); });
