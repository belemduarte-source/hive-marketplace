// Fase C — detalhe oficial IMPIC + barra de confiança + setor + geocodificação por morada.
// NÃO grava na BD: cada candidata processada vai para processadas.jsonl (pronta para inserir).
// Uso: node processar.js [--amostra 25] [--distritos "Lisboa|Setúbal"]
// 1 só processo; resumível (cache/det/*.json, geo em processadas.jsonl). Ritmo IMPIC: IMPIC_GAP_MS (def. 2500).
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;
const { post } = require('./impic-lib');
const F = require('./ficha');
const { geocodificar, km } = require('./geocode');
const { construir } = require('./candidatas');

const OUT = dados('processadas.jsonl');
const DET = dados('cache', 'det');
fs.mkdirSync(DET, { recursive: true });

const PRIORIDADE = ['Lisboa', 'Setúbal', 'Faro', 'Leiria', 'Santarém', 'Coimbra', 'Évora', 'Beja', 'Portalegre', 'Castelo Branco', 'Guarda', 'Bragança', 'Vila Real', 'Viseu', 'Madeira', 'Açores', 'Aveiro', 'Porto', 'Braga', 'Viana do Castelo'];
const { EMOJI, COR } = F;

// contactos já presentes na BD (qualquer estado) → a candidata é a MESMA empresa listada de outra forma
function contactosBD() {
  const { rows } = JSON.parse(fs.readFileSync(dados('bd-dedupe.json'), 'utf8'));
  const emails = new Set(), tels = new Set(), doms = new Set();
  for (const r of rows) {
    if (r.email) emails.add(r.email);
    const t = (r.tel || '').replace(/^00351|^351(?=\d{9}$)/, '');
    if (/^[239]\d{8}$/.test(t)) tels.add(t);
    const m = String(r.website || '').match(/^(?:https?:\/\/)?(?:www\.)?([^\/:?#]+)/);
    if (m && m[1].includes('.')) doms.add(m[1]);
  }
  return { emails, tels, doms };
}

// true = vivo (MX/A/lookup), false = morto (NXDOMAIN definitivo nas 3), null = incerto (timeout/erro de rede → repetir)
const dnsCache = new Map();
async function dominioVivo(dom) {
  if (dnsCache.has(dom)) return dnsCache.get(dom);
  const comTempo = p => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(Object.assign(new Error('timeout'), { code: 'ETIMEOUT' })), 10000))]);
  let mortos = 0;
  for (const fn of [() => dns.resolveMx(dom), () => dns.resolve4(dom), () => dns.lookup(dom)]) {
    try { const r = await comTempo(fn()); if (Array.isArray(r) ? r.length : r && r.address) { dnsCache.set(dom, true); return true; } mortos++; }
    catch (e) { if (e.code === 'ENOTFOUND' || e.code === 'ENODATA') mortos++; }
  }
  const estado = mortos === 3 ? false : null;
  if (estado === false) dnsCache.set(dom, false);
  return estado;
}

async function detalhe(c) {
  const f = path.join(DET, c.key + '.json');
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  const html = await post({ id_type: 8, id_object: c.obj, informacao: 'true', info: 'NUMERO_LICENCA', value: c.nl, nl: c.nl });
  const d = F.parseDetalhe(html);
  if (d.alvara && d.nome) fs.writeFileSync(f, JSON.stringify(d));
  return d;
}

function descricao(d, concelho) {
  const ano = (String(d.inscricao || '').match(/(\d{4})$/) || [])[1];
  const cats = [...new Set((d.habs || []).map(h => h.cat.replace(/\s+/g, ' ').trim()))]
    .sort((a, b) => (parseInt(a) || 9) - (parseInt(b) || 9)).slice(0, 3);
  return `Empreiteiro com Alvará IMPIC ${d.alvara}${d.classe ? ` (classe ${d.classe})` : ''}${ano ? `, inscrito desde ${ano}` : ''}.`
    + (cats.length ? ' ' + cats.join('; ') + '.' : '') + ` Sede em ${concelho}.`;
}

// Pontos alternativos compactos (para desempilhar na inserção sem voltar a geocodificar)
const altCompactas = (g) => {
  const lista = (g.alternativas && g.alternativas.length ? g.alternativas : g.cpPontos) || [];
  return lista.filter(p => km(g.lat, g.lng, p.lat, p.lng) <= 0.6)
    .sort((a, b) => km(g.lat, g.lng, a.lat, a.lng) - km(g.lat, g.lng, b.lat, b.lng)).slice(0, 25)
    .map(p => [+p.lat.toFixed(6), +p.lng.toFixed(6)]);
};

async function processar(c, bd) {
  const r = { key: c.key, distrito: c.distrito, concelho: c.concelho, alvara: c.alvara, nif: c.nif, nome: c.nome };
  let d;
  try { d = await detalhe(c); } catch (e) { return { ...r, ok: false, motivo: 'detalhe-falhou', retry: true }; }
  if (!d.alvara || !d.nome) return { ...r, ok: false, motivo: 'detalhe-vazio', retry: true };
  if (d.nif && d.nif !== c.nif) return { ...r, ok: false, motivo: 'nif-difere-no-detalhe' };
  if (d.pais && !/PORTUGAL/i.test(d.pais)) return { ...r, ok: false, motivo: 'sede-fora-de-portugal' };
  r.det = { classe: d.classe, inscricao: d.inscricao, nHabs: (d.habs || []).length };

  // contactos oficiais
  let email = F.limparEmail(d.email);
  const notas = [];
  if (email && F.emailProprio(email)) {
    const vivo = await dominioVivo(F.dominio(email));
    if (vivo === null) return { ...r, ok: false, motivo: 'dns-incerto', retry: true };
    if (vivo === false) { notas.push('email-dominio-morto'); email = ''; }
  }
  const tel = F.limparTelefone(d.telefone);
  if (email && bd.emails.has(email)) return { ...r, ok: false, motivo: 'email-ja-na-bd' };
  if (tel && bd.tels.has(tel)) return { ...r, ok: false, motivo: 'telefone-ja-na-bd' };
  if (email && F.emailProprio(email) && bd.doms.has(F.dominio(email))) return { ...r, ok: false, motivo: 'site-ja-na-bd' };
  const canais = 1 + (email ? 1 : 0) + (tel ? 1 : 0);          // alvará + email + telefone
  if (canais < 2) return { ...r, ok: false, motivo: 'sem-contacto', notas };

  const cl = F.classificar(d, d.nome);
  if (!cl.primario) return { ...r, ok: false, motivo: 'fora-das-areas' };

  const concelho = d.concelho || c.concelho;
  const morada = d.morada && d.morada.length ? d.morada : c.morada;
  const g = await geocodificar(morada, concelho);
  if (!g.ok) return { ...r, ok: false, motivo: 'geo-' + g.motivo, retry: !!g.retry };

  const cp = (morada.join(' ').match(/\b\d{4}-\d{3}\b/) || [''])[0];
  return {
    ...r, ok: true, notas,
    geo: { fonte: g.fonte, alt: altCompactas(g) },
    ficha: {
      name: F.capitalizar(d.nome), sector: cl.primario, sectors: cl.setores, nif: c.nif, alvara: d.alvara,
      address: morada.join(', '), postal_code: cp || null, city: concelho, country: 'pt',
      email, phone: F.fmtTel(tel), website: '', tags: ['registo IMPIC'], description: descricao(d, concelho),
      lat: +g.lat.toFixed(7), lng: +g.lng.toFixed(7), emoji: EMOJI[cl.primario] || '🏗️', color: COR(cl.primario),
      confidence: 3, email_proprio: !!(email && F.emailProprio(email)),
    },
  };
}

function seededShuffle(a, seed) {
  let s = seed >>> 0;
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

async function main({ AMOSTRA = 0, SO = null, REFAZER_GEO = false } = {}) {
  const { cands } = construir();
  const feitos = new Map();
  if (fs.existsSync(OUT)) for (const l of fs.readFileSync(OUT, 'utf8').split('\n')) { if (!l) continue; const x = JSON.parse(l); feitos.set(x.key, x); }
  // REFAZER_GEO: falhas de posição de versões anteriores do geocodificador voltam à fila (detalhe já em cache)
  const pend = k => { const x = feitos.get(k); return !x || x.retry || (REFAZER_GEO && !x.ok && /^geo-/.test(x.motivo)); };
  let fila = cands.filter(c => (!SO || SO.has(c.distrito)) && pend(c.key));
  if (AMOSTRA) {
    const porD = new Map();
    for (const c of seededShuffle(fila.slice(), 20261029)) {
      const feitosD = [...feitos.values()].filter(x => x.distrito === c.distrito && !x.retry).length;
      const n = porD.get(c.distrito) || 0;
      if (n + feitosD < AMOSTRA) { porD.set(c.distrito, n + 1); }
      else continue;
      c._amostra = true;
    }
    fila = fila.filter(c => c._amostra);
  }
  // distrito por prioridade; dentro do distrito, alvarás de obras públicas (exigência maior) antes dos de particulares
  fila.sort((a, b) => (PRIORIDADE.indexOf(a.distrito) - PRIORIDADE.indexOf(b.distrito)) || (a.obj - b.obj));
  console.log(`[processar] candidatas ${cands.length} | já feitas ${feitos.size} | nesta corrida ${fila.length}${AMOSTRA ? ' (amostra ' + AMOSTRA + '/distrito)' : ''}`);
  const bd = contactosBD();
  const t0 = Date.now(); const cont = {};
  // PARALELO registos ao mesmo tempo: o IMPIC continua com um só pedido de cada vez (fila em impic-lib);
  // o paralelo só sobrepõe DNS/GeoAPI/Photon de uns com o pedido IMPIC de outro.
  const PARALELO = +(process.env.PROC_PARALELO || 1);
  const restam = new Map(); for (const c of fila) restam.set(c.distrito, (restam.get(c.distrito) || 0) + 1);
  let prox = 0, feitas = 0;
  const trabalhador = async () => {
    while (prox < fila.length) {
      const c = fila[prox++];
      const x = await processar(c, bd);
      fs.appendFileSync(OUT, JSON.stringify(x) + '\n');
      const k = x.ok ? 'ok' : x.motivo; cont[k] = (cont[k] || 0) + 1;
      feitas++;
      restam.set(c.distrito, restam.get(c.distrito) - 1);
      if (!restam.get(c.distrito)) console.log(`[processar] DISTRITO CONCLUÍDO ${c.distrito}`);
      if (feitas % 25 === 0 || feitas === fila.length) {
        const min = (Date.now() - t0) / 60000;
        console.log(`[processar] ${feitas}/${fila.length} ${c.distrito} | ${JSON.stringify(cont)} | ${min.toFixed(1)} min, ~${((fila.length - feitas) * min / feitas / 60).toFixed(1)} h restantes`);
      }
    }
  };
  await Promise.all(Array.from({ length: PARALELO }, trabalhador));
  console.log('[processar] FIM', JSON.stringify(cont));
}
module.exports = { main, PRIORIDADE };
if (require.main === module) {
  const argv = process.argv.slice(2);
  const opt = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
  main({ AMOSTRA: +opt('amostra', 0), SO: opt('distritos', null) ? new Set(opt('distritos').split('|')) : null, REFAZER_GEO: argv.includes('--refazer-geo') })
    .catch(e => { console.error('[processar] ERRO FATAL', e); process.exit(1); });
}
