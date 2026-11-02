// Passo aprovado (< 400 fichas novas): grava alvo-final.json, revista à mão. Por omissão SÓ ENSAIO; grava com --gravar.
// Só INSERT. Antes de gravar, duas leituras leves (sem logo): duplicados na BD viva e pontos a < 5 m de outra empresa.
// Nome igual pela palavra da marca só bloqueia se estiver em alvo-duplicados.json; no ensaio lista-se para rever à mão.
// Log: alvo-inseridas.jsonl; as IMPIC também vão para inseridas.jsonl. Lotes de 40, com pausa, para gastar pouco da BD.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const F = require('./ficha');
const { km } = require('./geocode');
const { distintivas } = require('./site-valida');
const D = f => dados(f);
const GRAVAR = process.argv.includes('--gravar');
const L = JSON.parse(fs.readFileSync(D('alvo-final.json'), 'utf8'));
const FEITOS = fs.existsSync(D('alvo-inseridas.jsonl')) ? new Set(fs.readFileSync(D('alvo-inseridas.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => { const x = JSON.parse(l); return x.key || x.aut; })) : new Set();
const REVISTOS = fs.existsSync(D('alvo-duplicados.json')) ? new Set(JSON.parse(fs.readFileSync(D('alvo-duplicados.json'), 'utf8'))) : new Set();
const COLS = ['name', 'sector', 'sectors', 'nif', 'alvara', 'address', 'postal_code', 'city', 'country', 'email', 'phone', 'website', 'tags', 'description', 'lat', 'lng', 'emoji', 'color', 'confidence', 'created_by', 'status', 'is_new', 'verified'];
const tel = s => String(s || '').replace(/\D/g, '').replace(/^351(?=\d{9}$)/, '');
const dominio = x => x.website ? new URL(x.website).hostname.replace(/^www\./, '') : (x.email && F.emailProprio(x.email) ? F.dominio(x.email) : '');
const SAPO = /(^|\.)(sapo\.pt|netcabo\.pt|clix\.pt|telepac\.pt|netvisao\.pt|nos\.pt|meo\.pt|iol\.pt)$/;
const marca = nome => { const t = distintivas(nome)[0]; return t && t.length >= 5 ? t.toLowerCase() : null; };
const dorme = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const fila = L.filter(x => !FEITOS.has(x.key || x.aut));
  const nifs = fila.map(x => x.nif).filter(Boolean), emails = fila.map(x => x.email).filter(Boolean), tels = fila.map(x => tel(x.phone)).filter(Boolean);
  const doms = fila.map(dominio).filter(d => d && !SAPO.test(d)).map(d => '%' + d + '%'), marcas = [...new Set(fila.map(x => marca(x.name)).filter(Boolean))].map(m => '%' + m + '%');
  const hits = await q(`SELECT id::int id, name, status, city, nif, lower(btrim(email)) e, right(regexp_replace(coalesce(phone,''),'\\D','','g'),9) t, lower(coalesce(website,'')) w,
      translate(lower(name), 'áàâãéêíóôõúç', 'aaaaeeiooouc') n
    FROM companies
    WHERE nif = ANY($1) OR lower(btrim(email)) = ANY($2) OR right(regexp_replace(coalesce(phone,''),'\\D','','g'),9) = ANY($3)
       OR lower(coalesce(website,'')) LIKE ANY($4) OR translate(lower(name), 'áàâãéêíóôõúç', 'aaaaeeiooouc') LIKE ANY($5)`, [nifs, emails, tels, doms, marcas]);
  const caixas = fila.map(x => `(lat BETWEEN ${x.lat - 0.0015} AND ${x.lat + 0.0015} AND lng BETWEEN ${x.lng - 0.002} AND ${x.lng + 0.002})`).join(' OR ');
  const viz = fila.length ? await q(`SELECT lat::float8 lat, lng::float8 lng FROM companies WHERE status='approved' AND lat IS NOT NULL AND (${caixas})`) : [];
  const ocup = viz.map(r => [r.lat, r.lng]);
  const ocupado = (a, b) => ocup.some(([u, v]) => km(a, b, u, v) * 1000 < 5);
  const ok = [], duros = [], nomes = [], semPonto = [];
  for (const x of fila) {
    const d = dominio(x), m = marca(x.name), pat = m ? new RegExp('(^|[^a-z])' + m + '($|[^a-z])') : null;
    const h = hits.filter(r => (x.nif && r.nif === x.nif) || (x.email && r.e === x.email) || (tel(x.phone) && r.t === tel(x.phone)) || (d && !SAPO.test(d) && r.w.includes(d)));
    if (h.length) { duros.push(`${x.name} ← ${h.map(r => `${r.id} ${r.name} [${r.status}, ${r.city}]`).join(' ; ').slice(0, 170)}`); continue; }
    // apelidos comuns não chegam: o nome inteiro tem de ser parecido (Jaccard ≥ 0,5 nas palavras não genéricas)
    const toks = s => new Set(F.N(s).toLowerCase().split(' ').filter(t => t.length >= 3 && !/^(lda|limitada|sociedade|construcoes|construcao|civil|filhos|filho|engenharia|instalacoes|comercio|servicos|electricas|electro|carpintaria|transportes)$/.test(t)));
    const jac = (a, b) => { const A = toks(a), B = toks(b); const i = [...A].filter(t => B.has(t)).length; return i / Math.max(1, new Set([...A, ...B]).size); };
    const hn = pat ? hits.filter(r => pat.test(r.n) && jac(r.n, x.name) >= 0.5) : [];
    if (hn.length && !REVISTOS.has(x.key || x.aut)) { nomes.push(`${x.key || x.aut} ${x.name} ← ${hn.slice(0, 3).map(r => `${r.id} ${r.name} [${r.status}, ${r.city}]`).join(' ; ').slice(0, 190)}`); continue; }
    let lat = x.lat, lng = x.lng, geo = x.geo;
    if (ocupado(lat, lng)) {
      const livre = (x.alt || []).filter(([a, b]) => km(lat, lng, a, b) <= 0.6 && !ocupado(a, b)).sort((p, n) => km(lat, lng, p[0], p[1]) - km(lat, lng, n[0], n[1]))[0];
      if (!livre) { semPonto.push(x.name); continue; }
      [lat, lng] = livre; geo += '+porta-vizinha';
    }
    ocup.push([lat, lng]); ok.push({ ...x, lat, lng, geo });
  }
  console.log(`fila ${fila.length} | a gravar ${ok.length} (IMPIC ${ok.filter(x => x.fonte === 'IMPIC').length}, DGEG ${ok.filter(x => x.fonte === 'DGEG').length}) | duplicados ${duros.length} | nome a rever ${nomes.length} | sem ponto livre ${semPonto.length}`);
  for (const s of duros) console.log('  DUPLICADO:', s);
  for (const s of nomes) console.log('  NOME?:', s);
  if (semPonto.length) console.log('  SEM PONTO:', semPonto.join(' | '));
  if (!GRAVAR) { console.log('(ensaio: nada gravado)'); return; }
  let n = 0; const ids = [];
  for (let i = 0; i < ok.length; i += 40) {
    const lote = ok.slice(i, i + 40), vals = [], ph = [];
    for (const f of lote) { const v = [f.name, f.sector, f.sectors, f.nif || null, f.alvara || '', f.address, f.postal_code, f.city, 'pt', f.email || '', f.phone || '', f.website || '', f.tags, f.description, f.lat, f.lng, F.EMOJI[f.sector] || '🏗️', F.COR(f.sector), f.confidence, 7, 'approved', true, false]; ph.push('(' + v.map((_, k) => '$' + (vals.length + k + 1)).join(',') + ')'); vals.push(...v); }
    const r = await q(`INSERT INTO companies (${COLS.join(',')}) VALUES ${ph.join(',')} ON CONFLICT (nif) WHERE nif IS NOT NULL AND nif <> '' DO NOTHING RETURNING id, name`, vals);
    const idDe = new Map(r.map(o => [o.name, +o.id]));
    for (const f of lote) {
      const id = idDe.get(f.name); if (!id) { console.log('  não entrou:', f.name); continue; }
      const t = new Date().toISOString(); ids.push(id); n++;
      fs.appendFileSync(D('alvo-inseridas.jsonl'), JSON.stringify({ t, id, fonte: f.fonte, key: f.key || null, aut: f.aut || null, name: f.name, sector: f.sector, sectors: f.sectors, city: f.city, lat: f.lat, lng: f.lng, geo: f.geo, email: f.email, phone: f.phone, website: f.website, fecha: f.fecha, pino: f.pino }) + '\n');
      if (f.fonte === 'IMPIC') fs.appendFileSync(D('inseridas.jsonl'), JSON.stringify({ t, key: f.key, id, nif: f.nif, alvara: f.alvara, name: f.name, city: f.city, distrito: f.distrito, lat: f.lat, lng: f.lng, geo: f.geo, sector: f.sector, email: !!f.email, phone: !!f.phone, website: f.website || '' }) + '\n');
    }
    console.log(`[alvo] ${Math.min(i + 40, ok.length)}/${ok.length}`);
    await dorme(1000);
  }
  console.log(`[alvo] GRAVADAS ${n}: ids ${Math.min(...ids)}–${Math.max(...ids)}`);
})().catch(e => { console.error('[alvo] ERRO', e.message.slice(0, 400)); process.exit(1); });
