// Fase D — inserção em lotes (por omissão SÓ ENSAIO; grava apenas com --gravar).
//  - só INSERT de fichas novas; nunca UPDATE de fichas existentes
//  - re-verifica contra a BD viva, mesmo ao lote: NIF, alvará (nº+tipo), email, telefone (qualquer estado)
//  - um contacto partilhado por ≥3 candidatas (contabilista, grupo) não conta como canal da empresa
//  - sem pinos empilhados: ponto a < 5 m de outra empresa → porta INE livre mais próxima da mesma rua/CP7
//  - cada linha gravada fica em inseridas.jsonl (id, chave, nif, alvará, ponto) para auditoria/reversão
// Uso: node inserir.js [--distritos "Lisboa|Setúbal"] [--max 500] [--lote 50] [--gravar]
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const { km } = require('./geocode');
const { nucleo, jacc } = require('./candidatas');
const { filtroEntidade, classificar, EMOJI, COR } = require('./ficha');
const { GRAFIA } = require('./geo-pt');
const DET = dados('cache', 'det');

// fichas PT sem NIF (OSM, qualquer estado): a mesma empresa pode lá estar com a localidade em vez do concelho
function vizinhasSemNif() {
  const { rows } = JSON.parse(fs.readFileSync(dados('bd-dedupe.json'), 'utf8'));
  const grelha = new Map();
  for (const r of rows) {
    if (r.country !== 'pt' || r.nif || r.lat == null) continue;
    const k = Math.floor(r.lat * 50) + ':' + Math.floor(r.lng * 50);          // células de ~2 km
    if (!grelha.has(k)) grelha.set(k, []);
    grelha.get(k).push({ id: r.id, nuc: nucleo(r.name), lat: +r.lat, lng: +r.lng });
  }
  return (lat, lng, nome) => {
    const nuc = nucleo(nome); if (!nuc.length) return null;
    const a = Math.floor(lat * 50), b = Math.floor(lng * 50);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++)
      for (const r of grelha.get((a + i) + ':' + (b + j)) || []) if (km(lat, lng, r.lat, r.lng) <= 1.5 && jacc(nuc, r.nuc) >= 0.6) return r.id;
    return null;
  };
}

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const GRAVAR = argv.includes('--gravar');
const SO = opt('distritos', null) ? new Set(opt('distritos').split('|')) : null;
const MAX = +opt('max', 1e9);
const LOTE = +opt('lote', 50);
const PROC = dados('processadas.jsonl');
const LOG = dados('inseridas.jsonl');
const SITES = dados('sites.json');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const telDig = s => String(s || '').replace(/\D/g, '').replace(/^351(?=\d{9}$)/, '');

const COLS = ['name', 'sector', 'sectors', 'nif', 'alvara', 'address', 'postal_code', 'city', 'country', 'email', 'phone', 'website',
  'tags', 'description', 'lat', 'lng', 'emoji', 'color', 'confidence', 'created_by', 'status', 'is_new', 'verified'];

(async () => {
  // o processamento pode estar a acrescentar linhas neste momento: uma última linha a meio é ignorada
  const todos = fs.readFileSync(PROC, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
  // último registo por chave (re-processamentos substituem os anteriores)
  const porChave = new Map(); for (const x of todos) porChave.set(x.key, x);
  const ok = [...porChave.values()].filter(x => x.ok);
  const jaInseridas = new Set(fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l).key) : []);
  const sites = fs.existsSync(SITES) ? JSON.parse(fs.readFileSync(SITES, 'utf8')) : {};

  // contactos partilhados por ≥3 candidatas → não são canal próprio de nenhuma
  const freqE = new Map(), freqT = new Map();
  for (const x of ok) {
    if (x.ficha.email) freqE.set(x.ficha.email, (freqE.get(x.ficha.email) || 0) + 1);
    const t = telDig(x.ficha.phone); if (t) freqT.set(t, (freqT.get(t) || 0) + 1);
  }
  const motivos = {};
  const conta = m => (motivos[m] = (motivos[m] || 0) + 1);
  const mesmaPerto = vizinhasSemNif();
  let fila = [];
  for (const x of ok) {
    if (jaInseridas.has(x.key)) { conta('ja-inserida'); continue; }
    if (SO && !SO.has(x.distrito)) continue;
    const fe = filtroEntidade(x.nome, x.nif);                 // regras de entidade re-aplicadas (podem ter mudado)
    if (fe) { conta(fe); continue; }
    if (mesmaPerto(x.ficha.lat, x.ficha.lng, x.nome)) { conta('nome-igual-a-ficha-perto'); continue; }
    const f = { ...x.ficha };
    f.city = GRAFIA[f.city] || f.city;
    // setor com as regras ATUAIS, a partir do detalhe oficial em cache
    const fd = path.join(DET, x.key + '.json');
    if (fs.existsSync(fd)) {
      const det = JSON.parse(fs.readFileSync(fd, 'utf8'));
      const cl = classificar(det, det.nome);
      if (!cl.primario) { conta(cl.motivo || 'fora-das-areas'); continue; }
      f.sector = cl.primario; f.sectors = cl.setores; f.emoji = EMOJI[cl.primario] || '🏗️'; f.color = COR(cl.primario);
    }
    if (f.email && freqE.get(f.email) >= 3) f.email = '';
    if (f.phone && freqT.get(telDig(f.phone)) >= 3) f.phone = '';
    if (!f.email && !f.phone) { conta('contacto-partilhado'); continue; }
    const dom = f.email_proprio ? f.email.split('@')[1] : null;
    if (dom && sites[dom] && sites[dom].ok) f.website = sites[dom].url;
    fila.push({ x, f });
  }
  fila = fila.slice(0, MAX);
  console.log(`[inserir] ${GRAVAR ? 'GRAVAR' : 'ENSAIO'} | aprovadas no processamento ${ok.length} | na fila ${fila.length} | ${JSON.stringify(motivos)}`);

  // pontos já ocupados (empresas aprovadas em PT). Ocupado = outra empresa a < PERTO_M metros, não a mesma chave
  // arredondada: pontos quase iguais com chaves diferentes não abrem em leque no mapa e tapam-se
  const PERTO_M = 5;
  const grelha = new Map(), celula = (a, b) => Math.floor(a * 2000) + ':' + Math.floor(b * 2000);   // células de ~50 m
  const ocupar = (a, b) => { const k = celula(a, b); if (!grelha.has(k)) grelha.set(k, []); grelha.get(k).push([+a, +b]); };
  const ocupado = (a, b) => {
    const A = Math.floor(a * 2000), B = Math.floor(b * 2000);
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++)
      for (const [u, v] of grelha.get((A + i) + ':' + (B + j)) || []) if (km(a, b, u, v) * 1000 < PERTO_M) return true;
    return false;
  };
  for (const r of await q(`SELECT lat, lng FROM companies WHERE status='approved' AND lower(country)='pt' AND lat IS NOT NULL`)) ocupar(r.lat, r.lng);
  const res = { inseridas: 0, 'nif-ja-na-bd': 0, 'alvara-ja-na-bd': 0, 'email-ja-na-bd': 0, 'telefone-ja-na-bd': 0, 'repetida-no-lote': 0, 'empilhada-sem-porta-livre': 0, desempilhadas: 0 };
  const porDistrito = {};
  for (let i = 0; i < fila.length; i += LOTE) {
    const lote = fila.slice(i, i + LOTE);
    // re-verificação contra a BD viva (qualquer estado)
    const nifs = lote.map(o => o.f.nif);
    const nums = lote.map(o => (o.f.alvara.match(/\d+/) || [''])[0]);
    const emails = lote.map(o => o.f.email).filter(Boolean);
    const tels = lote.map(o => telDig(o.f.phone)).filter(Boolean);
    const [rN, rA, rE, rT] = await Promise.all([
      q(`SELECT nif FROM companies WHERE nif = ANY($1)`, [nifs]),
      q(`SELECT upper(alvara) a FROM companies WHERE substring(alvara from '\\d+') = ANY($1)`, [nums]),
      emails.length ? q(`SELECT lower(btrim(email)) e FROM companies WHERE lower(btrim(email)) = ANY($1)`, [emails]) : [],
      tels.length ? q(`SELECT right(regexp_replace(phone,'\\D','','g'),9) t FROM companies WHERE right(regexp_replace(phone,'\\D','','g'),9) = ANY($1)`, [tels]) : [],
    ]);
    const sN = new Set(rN.map(r => r.nif)), sA = rA.map(r => r.a), sE = new Set(rE.map(r => r.e)), sT = new Set(rT.map(r => r.t));
    const vistosE = new Set(), vistosT = new Set(), vistosN = new Set();
    const linhas = [];
    for (const { x, f } of lote) {
      const num = (f.alvara.match(/\d+/) || [''])[0], tipo = (f.alvara.match(/\b(PUB|PAR)\b/) || [''])[0];
      if (sN.has(f.nif) || vistosN.has(f.nif)) { res['nif-ja-na-bd']++; continue; }
      if (sA.some(a => (a.match(/\d+/) || [''])[0] === num && (!/\b(PUB|PAR)\b/.test(a) || a.includes(tipo)))) { res['alvara-ja-na-bd']++; continue; }
      if (f.email && (sE.has(f.email) || vistosE.has(f.email))) { res['email-ja-na-bd']++; continue; }
      const t = telDig(f.phone);
      if (t && (sT.has(t) || vistosT.has(t))) { res['telefone-ja-na-bd']++; continue; }
      // desempilhar: ponto ocupado → porta INE livre mais próxima; sem nenhuma livre a ficha NÃO entra
      // (nunca jitter) — fica em processadas.jsonl para uma passagem futura (ex.: Photon com outra posição)
      let lat = f.lat, lng = f.lng, fonte = x.geo.fonte;
      if (ocupado(lat, lng)) {
        const livre = (x.geo.alt || []).filter(([a, b]) => km(lat, lng, a, b) <= 0.6 && !ocupado(a, b))
          .sort((m, n) => km(lat, lng, m[0], m[1]) - km(lat, lng, n[0], n[1]))[0];
        if (!livre) { res['empilhada-sem-porta-livre']++; continue; }
        [lat, lng] = livre; fonte += '+porta-vizinha'; res.desempilhadas++;
      }
      vistosN.add(f.nif); if (f.email) vistosE.add(f.email); if (t) vistosT.add(t);
      ocupar(lat, lng);
      linhas.push({ x, f: { ...f, lat, lng }, fonte });
    }
    if (!linhas.length) continue;
    if (GRAVAR) {
      const vals = [], ph = [];
      for (const { f } of linhas) {
        const v = [f.name, f.sector, f.sectors, f.nif, f.alvara, f.address, f.postal_code, f.city, 'pt', f.email || '', f.phone || '', f.website || '',
          f.tags, f.description, f.lat, f.lng, f.emoji, f.color, 3, 7, 'approved', true, false];
        ph.push('(' + v.map((_, k) => '$' + (vals.length + k + 1)).join(',') + ')');
        vals.push(...v);
      }
      // rede de segurança: o índice único parcial de NIF impede duplicados mesmo em corrida
      const r = await q(`INSERT INTO companies (${COLS.join(',')}) VALUES ${ph.join(',')}
        ON CONFLICT (nif) WHERE nif IS NOT NULL AND nif <> '' DO NOTHING RETURNING id, nif`, vals);
      const idPorNif = new Map(r.map(o => [o.nif, o.id]));
      for (const { x, f, fonte } of linhas) {
        const id = idPorNif.get(f.nif);
        if (!id) { res['nif-ja-na-bd']++; continue; }
        res.inseridas++; porDistrito[x.distrito] = (porDistrito[x.distrito] || 0) + 1;
        fs.appendFileSync(LOG, JSON.stringify({ t: new Date().toISOString(), key: x.key, id: +id, nif: f.nif, alvara: f.alvara, name: f.name, city: f.city, distrito: x.distrito, lat: f.lat, lng: f.lng, geo: fonte, sector: f.sector, email: !!f.email, phone: !!f.phone, website: f.website || '' }) + '\n');
      }
      await sleep(800);
    } else {
      for (const { x } of linhas) { res.inseridas++; porDistrito[x.distrito] = (porDistrito[x.distrito] || 0) + 1; }
    }
    if ((i / LOTE) % 10 === 0) console.log(`[inserir] ${Math.min(i + LOTE, fila.length)}/${fila.length} | ${JSON.stringify(res)}`);
  }
  console.log(`[inserir] FIM ${GRAVAR ? '(gravado)' : '(ensaio — nada gravado)'} ${JSON.stringify(res)}`);
  console.log('[inserir] por distrito', JSON.stringify(porDistrito));
})().catch(e => { console.error('[inserir] ERRO FATAL', e); process.exit(1); });
