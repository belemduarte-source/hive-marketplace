// Piloto de lacunas: grava piloto-final.json (revisto à mão). Por omissão SÓ ENSAIO; grava com --gravar.
// Só INSERT, nunca altera fichas existentes. Duas leituras leves (sem logo, só as fichas que coincidem) antes de gravar:
// duplicados por NIF, email, telefone, domínio e nome; pontos a < 5 m de outra empresa. Log: piloto-inseridas.jsonl;
// as IMPIC vão também para inseridas.jsonl, para o inserir.js não as tentar outra vez.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { q } = require('./db');
const F = require('./ficha');
const { km } = require('./geocode');
const D = f => dados(f);
const GRAVAR = process.argv.includes('--gravar');
const L = JSON.parse(fs.readFileSync(D('piloto-final.json'), 'utf8'));
const COLS = ['name', 'sector', 'sectors', 'nif', 'alvara', 'address', 'postal_code', 'city', 'country', 'email', 'phone', 'website', 'tags', 'description', 'lat', 'lng', 'emoji', 'color', 'confidence', 'created_by', 'status', 'is_new', 'verified'];
const tel = s => String(s || '').replace(/\D/g, '').replace(/^351(?=\d{9}$)/, '');
const dominio = x => x.website ? new URL(x.website).hostname.replace(/^www\./, '') : (x.email && F.emailProprio(x.email) ? F.dominio(x.email) : '');
// marca: a primeira palavra distintiva do nome (a mais comprida costuma ser o ofício, que apanha empresas sem relação)
const LEGAIS = /^(COMERCIO|INSTALACOES|SERVICOS|SOCIEDADE|LIMITADA|TECNICA|ENERGIA|ENERGIAS|CONSTRUCOES|REDES|ELECTRICAS|ELECTRICOS|ELETRICOS|ELECTRICA|INDUSTRIA|ISOLAMENTOS|TERMICOS|ACABAMENTOS|SISTEMAS|APLICACAO|REVESTIMENTOS|MONTAGEM|DISTRIBUICAO|MARCENARIA|ENGENHARIA|SEGURANCA|AMBIENTE|ANTONIO|MARTINS|SOARES|CANALIZACOES|SANITARIAS|RECENTES)$/;
const PRECISOS = [[/^FORCA ELECTRICA/, '%forca electrica%'], [/^RECENTES ETAPAS/, '%recentes etapas%'], [/MARCENARIA DE ARTE/, '%marcenaria de arte%']];   // palavras comuns: revistos à mão
const padrao = nome => { const n = F.N(nome); for (const [re, p] of PRECISOS) if (re.test(n)) return p; const t = n.split(' ').filter(p => p.length >= 5 && !LEGAIS.test(p))[0]; return t ? '%' + t.toLowerCase() + '%' : null; };
(async () => {
  const nifs = L.map(x => x.nif).filter(Boolean), emails = L.map(x => x.email).filter(Boolean), tels = L.map(x => tel(x.phone)).filter(Boolean);
  const doms = L.map(dominio).filter(Boolean).map(d => '%' + d + '%'), nomes = L.map(x => padrao(x.name)).filter(Boolean);
  const hits = await q(`SELECT id::int id, name, status, city, nif, lower(btrim(email)) e, right(regexp_replace(coalesce(phone,''),'\\D','','g'),9) t, lower(coalesce(website,'')) w,
      translate(lower(name), 'áàâãéêíóôõúç', 'aaaaeeiooouc') n
    FROM companies
    WHERE nif = ANY($1) OR lower(btrim(email)) = ANY($2) OR right(regexp_replace(coalesce(phone,''),'\\D','','g'),9) = ANY($3)
       OR lower(coalesce(website,'')) LIKE ANY($4) OR translate(lower(name), 'áàâãéêíóôõúç', 'aaaaeeiooouc') LIKE ANY($5)`, [nifs, emails, tels, doms, nomes]);
  console.log('coincidências na BD viva (qualquer estado):', hits.length);
  const caixas = L.map(x => `(lat BETWEEN ${x.lat - 0.0015} AND ${x.lat + 0.0015} AND lng BETWEEN ${x.lng - 0.002} AND ${x.lng + 0.002})`).join(' OR ');
  const viz = await q(`SELECT lat::float8 lat, lng::float8 lng FROM companies WHERE status='approved' AND lat IS NOT NULL AND (${caixas})`);
  const ocup = viz.map(r => [r.lat, r.lng]);
  const ocupado = (a, b) => ocup.some(([u, v]) => km(a, b, u, v) * 1000 < 5);
  const ok = [], fora = [];
  for (const x of L) {
    const d = dominio(x), pn = padrao(x.name), pat = pn ? new RegExp('(^|[^a-z])' + pn.replace(/%/g, '').replace(/ /g, '[^a-z]+') + '($|[^a-z])') : null;
    const h = hits.filter(r => (x.nif && r.nif === x.nif) || (x.email && r.e === x.email) || (tel(x.phone) && r.t === tel(x.phone)) || (d && r.w.includes(d)) || (pat && pat.test(r.n)));
    if (h.length) { fora.push(`${x.name} ← já existe: ${h.map(r => `${r.id} ${r.name} [${r.status}, ${r.city}]`).join(' ; ').slice(0, 200)}`); continue; }
    let lat = x.lat, lng = x.lng, geo = x.geo;
    if (ocupado(lat, lng)) {
      const livre = (x.alt || []).filter(([a, b]) => km(lat, lng, a, b) <= 0.6 && !ocupado(a, b)).sort((m, n) => km(lat, lng, m[0], m[1]) - km(lat, lng, n[0], n[1]))[0];
      if (!livre) { fora.push(`${x.name} ← sem ponto livre a ≥ 5 m`); continue; }
      [lat, lng] = livre; geo += '+porta-vizinha';
    }
    ocup.push([lat, lng]);
    ok.push({ ...x, lat, lng, geo });
  }
  console.log(`a gravar: ${ok.length} | fora: ${fora.length}`); for (const s of fora) console.log('  FORA:', s);
  if (!GRAVAR) { console.log('(ensaio: nada gravado)'); return; }
  const vals = [], ph = [];
  for (const f of ok) {
    const v = [f.name, f.sector, f.sectors, f.nif || null, f.alvara || '', f.address, f.postal_code, f.city, 'pt', f.email || '', f.phone || '', f.website || '', f.tags, f.description, f.lat, f.lng, F.EMOJI[f.sector] || '🏗️', F.COR(f.sector), f.confidence, 7, 'approved', true, false];
    ph.push('(' + v.map((_, k) => '$' + (vals.length + k + 1)).join(',') + ')');
    vals.push(...v);
  }
  const r = await q(`INSERT INTO companies (${COLS.join(',')}) VALUES ${ph.join(',')} ON CONFLICT (nif) WHERE nif IS NOT NULL AND nif <> '' DO NOTHING RETURNING id, name`, vals);
  const idDe = new Map(r.map(o => [o.name, +o.id]));
  for (const f of ok) {
    const id = idDe.get(f.name); if (!id) { console.log('  não entrou:', f.name); continue; }
    const t = new Date().toISOString();
    fs.appendFileSync(D('piloto-inseridas.jsonl'), JSON.stringify({ t, id, fonte: f.fonte, key: f.key || null, aut: f.aut || null, name: f.name, sector: f.sector, sectors: f.sectors, city: f.city, lat: f.lat, lng: f.lng, geo: f.geo, email: f.email, phone: f.phone, website: f.website, fecha: f.fecha, pino: f.pino }) + '\n');
    if (f.fonte === 'IMPIC') fs.appendFileSync(D('inseridas.jsonl'), JSON.stringify({ t, key: f.key, id, nif: f.nif, alvara: f.alvara, name: f.name, city: f.city, distrito: f.distrito, lat: f.lat, lng: f.lng, geo: f.geo, sector: f.sector, email: !!f.email, phone: !!f.phone, website: f.website || '' }) + '\n');
  }
  console.log(`GRAVADAS ${r.length}: ids ${r.map(o => o.id).join(', ')}`);
})().catch(e => { console.error('ERRO', e.message.slice(0, 500)); process.exit(1); });
