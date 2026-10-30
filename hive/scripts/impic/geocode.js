// Geocodificação por MORADA no momento da importação (nunca ao centróide do concelho, nunca jitter).
//  1) GeoAPI.pt /cp/<CP7> (pontos de morada INE): porta da rua > rua > (Photon) > centróide do CP7
//  2) Photon (komoot) com bias ao centróide do CP7, aceite só a ≤3 km e com o CP4 certo
//  3) CP7 desconhecido → Photon estrito (CP4 + concelho) ou NADA (a ficha fica de fora)
// Guardas: o concelho do CP7 tem de bater com o do IMPIC; sem posição honesta → null.
const sleep = ms => new Promise(r => setTimeout(r, ms));
const UA = 'hivex.pt importador IMPIC (geral.hivex@gmail.com)';
const strip = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
const norm = s => strip(s).toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set(['RUA', 'R', 'AVENIDA', 'AV', 'TRAVESSA', 'TV', 'TRV', 'PRACETA', 'PCT', 'PRACA', 'PC', 'PCA', 'LARGO', 'LG', 'ESTRADA', 'EST', 'ESTR', 'CAMINHO', 'CAM', 'CMO', 'LUGAR', 'LUG', 'BECO', 'BC', 'CALCADA', 'CC', 'ALAMEDA', 'AL', 'URBANIZACAO', 'URB', 'BAIRRO', 'BR', 'BRR', 'ZONA', 'ZN', 'INDUSTRIAL', 'IND', 'QUINTA', 'QTA', 'EDIFICIO', 'EDF', 'ED', 'LOTE', 'LT', 'LOJA', 'LJ', 'ANDAR', 'DTO', 'ESQ', 'FRT', 'FTE', 'RC', 'RCH', 'CV', 'BLOCO', 'BL', 'PISO', 'FRACAO', 'FR', 'APARTADO', 'APT', 'SALA', 'ARMAZEM', 'ARM', 'PAVILHAO', 'PAV', 'NUM', 'NO', 'N', 'SN', 'S', 'DE', 'DA', 'DO', 'DAS', 'DOS', 'E', 'O', 'A', 'AO', 'NA', 'NAS', 'NOS', 'EN', 'ER', 'SR', 'SRA', 'DR', 'DONA', 'D', 'STA', 'STO', 'SAO', 'S', 'NOSSA', 'SENHORA']);
// tokens significativos da rua: sem tipos de via/andares/lotes e sem nada que comece por algarismo (portas, "3ESQ", "1B")
const toks = s => norm(s).split(' ').filter(t => t.length >= 3 && !STOP.has(t) && !/^\d/.test(t) && !/^(EDIF|ESCR|ESCRIT)$/.test(t));
function km(a, b, c, d) {
  const R = 6371, x = (c - a) * Math.PI / 180, y = (d - b) * Math.PI / 180;
  const h = Math.sin(x / 2) ** 2 + Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.sin(y / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ── GeoAPI.pt ───────────────────────────────────────────────────────────────
// Vez de arranque partilhada: cada pedido reserva o seu instante (≥ gap entre arranques), também com
// vários registos em paralelo no mesmo processo.
function vez(estado, gap) {
  const agora = Date.now(), t = Math.max(agora, estado.prox);
  estado.prox = t + gap;
  return t > agora ? sleep(t - agora) : Promise.resolve();
}
const cpMem = new Map();
const ritmoGeoapi = { prox: 0 };
async function geoapiCP(cp) {
  if (cpMem.has(cp)) return cpMem.get(cp);
  let out;   // undefined = falha de rede (não cachear); null = CP inexistente
  for (let tent = 1; tent <= 4 && out === undefined; tent++) {
    await vez(ritmoGeoapi, 700);
    try {
      const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 30000);
      const r = await fetch('https://json.geoapi.pt/cp/' + cp, { signal: ctl.signal, headers: { accept: 'application/json', 'User-Agent': UA } });
      clearTimeout(to);
      if (r.status === 404) { out = null; break; }
      if (r.status === 429) { await sleep(8000 * tent); continue; }
      if (!r.ok) { await sleep(2000 * tent); continue; }
      const j = await r.json();
      out = {
        concelho: j.Concelho || null, distrito: j.Distrito || null, localidade: j.Localidade || null,
        centro: Array.isArray(j.centroide) && isFinite(j.centroide[0]) ? [+j.centroide[0], +j.centroide[1]] : null,
        pontos: (Array.isArray(j.pontos) ? j.pontos : []).filter(p => p && Array.isArray(p.coordenadas) && isFinite(p.coordenadas[0]))
          .map(p => ({ rua: p.rua || '', casa: p.casa != null ? String(p.casa) : '', lat: +p.coordenadas[0], lng: +p.coordenadas[1] })),
      };
    } catch (_) { await sleep(2000 * tent); }
  }
  if (out !== undefined) { if (cpMem.size > 3000) cpMem.clear(); cpMem.set(cp, out); }
  return out;
}

// Mesma rua? Com 1 só token significativo (ex.: "R SAO JOAO" → JOAO) exige igualdade exata — senão casava
// "R JOAO DE DEUS"; com vários, ≥60% em comum ou todos os do nome mais curto (≥2).
function mesmaRua(ta, tr) {
  if (!ta.length || !tr.length) return false;
  if (ta.length === 1 || tr.length === 1) return ta.length === 1 && tr.length === 1 && ta[0] === tr[0];
  const comuns = ta.filter(t => tr.includes(t)).length;
  return comuns / Math.max(ta.length, tr.length) >= 0.6 || (comuns >= 2 && comuns === Math.min(ta.length, tr.length));
}
// Rua do IMPIC ↔ rua INE: melhor sobreposição de tokens (não basta 1 token comum tipo "SANTO").
function melhorRua(pontos, linhaRua) {
  const alvo = toks(linhaRua);
  if (!alvo.length) return null;
  const porRua = new Map();
  for (const p of pontos) { const k = p.rua; if (!porRua.has(k)) porRua.set(k, []); porRua.get(k).push(p); }
  const tipoAlvo = tipoVia(linhaRua);
  let best = null;
  for (const [rua, pts] of porRua) {
    const tr = toks(rua);
    if (!mesmaRua(alvo, tr)) continue;
    const comuns = alvo.filter(t => tr.includes(t)).length;
    const score = comuns / Math.max(alvo.length, tr.length) + (tipoAlvo && tipoVia(rua) === tipoAlvo ? 0.1 : 0);
    if (!best || score > best.score || (score === best.score && pts.length > best.pts.length)) best = { rua, pts, score };
  }
  return best;
}
const TIPOS = { R: 'R', RUA: 'R', AV: 'AV', AVENIDA: 'AV', TV: 'TV', TRV: 'TV', TRAVESSA: 'TV', LG: 'LG', LARGO: 'LG', PCT: 'PCT', PRACETA: 'PCT', PC: 'PC', PCA: 'PC', PRACA: 'PC', EST: 'EST', ESTR: 'EST', ESTRADA: 'EST', CAM: 'CAM', CMO: 'CAM', CAMINHO: 'CAM', BC: 'BC', BECO: 'BC', AL: 'AL', ALAMEDA: 'AL', CC: 'CC', CALCADA: 'CC', URB: 'URB', URBANIZACAO: 'URB', BR: 'BR', BRR: 'BR', BAIRRO: 'BR', LUG: 'LUG', LUGAR: 'LUG' };
const tipoVia = s => TIPOS[norm(s).split(' ')[0]] || null;
// nº de porta: números da linha da rua que NÃO fazem parte do nome INE (ex.: "LG 25 ABRIL 5A 1" → 5A, 1)
function portaNaRua(best, linhaRua) {
  const nomeNums = new Set((norm(best.rua).match(/\b\d+[A-Z]?\b/g) || []));
  const nums = (norm(linhaRua).match(/\b\d+[A-Z]?\b/g) || []).filter(n => !nomeNums.has(n));
  for (const n of nums) {
    const hit = best.pts.find(p => norm(p.casa) === n) || best.pts.find(p => norm(p.casa) === n.replace(/[A-Z]$/, ''));
    if (hit) return hit;
  }
  return null;
}
const medoide = pts => {
  const la = pts.reduce((s, p) => s + p.lat, 0) / pts.length, lo = pts.reduce((s, p) => s + p.lng, 0) / pts.length;
  return pts.reduce((b, p) => (!b || km(la, lo, p.lat, p.lng) < km(la, lo, b.lat, b.lng)) ? p : b, null);
};

// ── Photon ──────────────────────────────────────────────────────────────────
// Disjuntor: o Photon público às vezes cai (out/2026: ECONNREFUSED e depois sem resposta). 3 chamadas falhadas
// seguidas → aberto: 10 min sem tentar e depois UMA sonda curta (6 s, sem repetições) — se falhar, mais 10 min.
// Quem precisar dele entretanto fica com retry (não se perde, refaz-se depois com o detalhe em cache).
const ritmoPhoton = { prox: 0 };
let photonFalhas = 0, photonParadoAte = 0, photonEmBaixo = false, photonSonda = false;
async function photonPedido(u, ms) {
  await vez(ritmoPhoton, 400);
  const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), ms);
  try { return await fetch(u, { signal: ctl.signal, headers: { 'User-Agent': UA } }); }
  finally { clearTimeout(to); }
}
async function photon(qs, lat, lng) {
  const u = 'https://photon.komoot.io/api/?q=' + encodeURIComponent(qs) + (lat != null ? `&lat=${lat}&lon=${lng}` : '') + '&limit=5&lang=default';
  if (photonEmBaixo) {
    if (Date.now() < photonParadoAte || photonSonda) return null;
    photonSonda = true;
    try {
      const r = await photonPedido(u, 6000);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const fs = (await r.json()).features || [];
      photonEmBaixo = false; photonFalhas = 0; console.log('[geo] Photon de volta');
      return fs;
    } catch (_) { photonParadoAte = Date.now() + 10 * 60e3; return null; }
    finally { photonSonda = false; }
  }
  for (let tent = 1; tent <= 3; tent++) {
    try {
      const r = await photonPedido(u, 15000);
      if (r.status === 429) { await sleep(8000 * tent); continue; }
      if (!r.ok) { await sleep(2000 * tent); continue; }
      photonFalhas = 0;
      return ((await r.json()).features || []);
    } catch (_) { await sleep(2000 * tent); }
    if (photonEmBaixo) return null;          // outro registo em paralelo já abriu o disjuntor
  }
  if (++photonFalhas >= 3 && !photonEmBaixo) { photonEmBaixo = true; photonParadoAte = Date.now() + 10 * 60e3; photonFalhas = 0; console.log('[geo] Photon indisponível — pausa de 10 min (depois uma sonda curta)'); }
  return null;
}

// Linha da rua só até ao nº de porta (sem piso/escritório/loja) e com as abreviaturas CTT por extenso,
// que é como o OSM/Photon as tem ("AV AQUILINO RIBEIRO MACHADO 8 PISO 2 ESCRITORIO 212" → "Avenida … 8").
const EXT = { R: 'Rua', AV: 'Avenida', TV: 'Travessa', TRV: 'Travessa', LG: 'Largo', PCT: 'Praceta', PC: 'Praça', PCA: 'Praça', EST: 'Estrada', ESTR: 'Estrada', CAM: 'Caminho', CMO: 'Caminho', BC: 'Beco', AL: 'Alameda', CC: 'Calçada', URB: 'Urbanização', QTA: 'Quinta', BR: 'Bairro', BRR: 'Bairro', LUG: 'Lugar', ZI: 'Zona Industrial', S: 'São', STA: 'Santa', STO: 'Santo', NSA: 'Nossa', SRA: 'Senhora', ENG: 'Engenheiro', DR: 'Doutor', PROF: 'Professor', GEN: 'General', CMDT: 'Comandante', CAP: 'Capitão', CEL: 'Coronel', MAJ: 'Major', PE: 'Padre', CON: 'Cónego', INF: 'Infante', ALM: 'Almirante', MAL: 'Marechal', CONS: 'Conselheiro', VISC: 'Visconde', CDE: 'Conde', BQ: 'Bairro' };
function ruaParaPhoton(linha) {
  const seg = String(linha || '').split(',')[0].replace(/\./g, ' ').replace(/º|ª/g, ' ');
  const ws = seg.split(/\s+/).filter(Boolean);
  const out = [];
  let temNome = false;
  for (let i = 0; i < ws.length; i++) {
    const w = ws[i], up = strip(w).toUpperCase();
    if (/^\d+[A-Z]?$/.test(up)) { out.push(w); if (temNome) break; continue; }   // nº de porta → corta aqui
    if (/^(PISO|ESCRITORIO|ESCRIT|ESC|ANDAR|SALA|LOJA|LJ|FRACAO|BLOCO|BL|DTO|ESQ|FRT|FTE|RC|R\/C|CV|CAVE|APARTAMENTO|APT|ATELIER|ARMAZEM|ARM|PAVILHAO|PAV|LOTE|LT|PORTA|EDF|EDIFICIO)$/.test(up) && temNome) break;
    out.push(i === 0 || EXT[up] && up.length <= 4 ? (EXT[up] || w) : w);
    if (!EXT[up] && !/^(DE|DA|DO|DAS|DOS|E)$/.test(up)) temNome = true;
  }
  return out.join(' ');
}
// Âncora do concelho (1 consulta Photon por concelho, em memória) — para CP7 sem centro na GeoAPI.
const ancoras = new Map();
async function ancoraConcelho(concelho) {
  const k = norm(concelho);
  if (ancoras.has(k)) return ancoras.get(k);
  const fs = await photon(concelho + ', Portugal');
  let a = null;
  for (const f of fs || []) {
    const p = f.properties || {}, g = (f.geometry || {}).coordinates;
    if (!g || p.countrycode !== 'PT') continue;
    if (!['city', 'town', 'village', 'municipality', 'county', 'district', 'locality'].includes(p.type) && p.osm_key !== 'place' && p.osm_key !== 'boundary') continue;
    if (norm(p.name) !== k && norm(p.county || '') !== k) continue;
    a = [g[1], g[0]]; break;
  }
  if (fs !== null) ancoras.set(k, a);
  return a;
}
// Resultado Photon aceite só se for a MESMA rua (tokens) e no sítio certo: CP4 igual OU concelho igual
// (os "CP de cliente" de Lisboa, ex. 1649-029, nunca batem no CP4 geográfico da rua).
function aceitaPhoton(fs, { cp, rua, concelho, ancora, raioKm }) {
  for (const f of fs || []) {
    const p = f.properties || {}, g = (f.geometry || {}).coordinates;
    if (!g || p.countrycode !== 'PT' || !['house', 'street'].includes(p.type)) continue;
    if (ancora && km(ancora[0], ancora[1], g[1], g[0]) > raioKm) continue;
    const cp4ok = p.postcode && String(p.postcode).startsWith(cp.slice(0, 4));
    const concOk = [p.county, p.city, p.district].some(v => v && norm(v) === norm(concelho));
    if (!cp4ok && !concOk) continue;
    if (!mesmaRua(toks(rua), toks(p.type === 'house' ? (p.street || p.name || '') : (p.name || p.street || '')))) continue;
    return { lat: g[1], lng: g[0], fonte: 'photon-' + p.type };
  }
  return null;
}
// Último recurso honesto: o ponto da LOCALIDADE da morada oficial (lugar ou localidade postal), nunca o
// centróide do concelho. Exige povoação/bairro com o mesmo nome, no mesmo concelho (ou ≤20 km da âncora).
async function pontoLocalidade(nomes, concelho, ancora) {
  for (const nome of nomes.filter(Boolean)) {
    const k = norm(nome);
    if (!k || k === norm(concelho)) continue;      // localidade = sede do concelho → seria a pilha do centróide; nunca
    const fs = await photon(`${nome}, ${concelho}, Portugal`, ancora && ancora[0], ancora && ancora[1]);
    if (fs === null) return { retry: true };
    for (const f of fs) {
      const p = f.properties || {}, g = (f.geometry || {}).coordinates;
      if (!g || p.countrycode !== 'PT') continue;
      if (!['city', 'town', 'village', 'hamlet', 'suburb', 'neighbourhood', 'quarter', 'locality', 'district', 'isolated_dwelling'].includes(p.type) && p.osm_key !== 'place') continue;
      if (norm(p.name) !== k) continue;
      const concOk = [p.county, p.city, p.district].some(v => v && norm(v) === norm(concelho));
      if (!concOk && !(ancora && km(ancora[0], ancora[1], g[1], g[0]) <= 20)) continue;
      return { lat: g[1], lng: g[0], fonte: 'localidade-' + p.type, localidade: p.name };
    }
  }
  return null;
}

// ── API ─────────────────────────────────────────────────────────────────────
// morada IMPIC: ['R CANEJA 6', 'LOURES', '2670-502 LOURES'] ; concelho 'Loures'
async function geocodificar(morada, concelho) {
  const linhas = morada.filter(Boolean);
  const iCP = linhas.findIndex(l => /\b\d{4}-\d{3}\b/.test(l));
  const cp = iCP >= 0 ? linhas[iCP].match(/\b\d{4}-\d{3}\b/)[0] : null;
  const locPostal = iCP >= 0 ? linhas[iCP].replace(/\b\d{4}-\d{3}\b/, '').trim() : '';
  // só o 1.º segmento é a rua ("AV. DAS ROBINIAS, LT. 1, QTA. GRANDE" → "AV. DAS ROBINIAS")
  const rua = (linhas[0] || '').split(',')[0].trim();
  const lugar = iCP > 1 ? linhas[1] : '';
  if (!cp) return { ok: false, motivo: 'sem-cp7' };
  const d = await geoapiCP(cp);
  if (d === undefined) return { ok: false, motivo: 'geoapi-falhou', retry: true };
  if (d && d.concelho && norm(d.concelho) !== norm(concelho)) {
    // CP7 de outro concelho: morada incoerente — só aceita se a rua bater no CP7 (o IMPIC às vezes tem o concelho da sede antiga)
    const b = d.pontos.length ? melhorRua(d.pontos, rua) : null;
    if (!b) return { ok: false, motivo: 'cp7-de-outro-concelho', cpConcelho: d.concelho };
  }
  const qPhoton = [ruaParaPhoton(rua), lugar || locPostal, concelho].filter(Boolean).join(', ');
  if (d && d.pontos.length) {
    const b = melhorRua(d.pontos, rua);
    if (b) {
      const porta = portaNaRua(b, rua);
      const p = porta || medoide(b.pts);
      return { ok: true, lat: p.lat, lng: p.lng, fonte: porta ? 'geoapi-porta' : 'geoapi-rua', cp, ruaINE: b.rua, alternativas: b.pts, cpPontos: d.pontos, centro: d.centro };
    }
  }
  if (d && d.centro) {
    // rua não está nos pontos INE do CP7 → Photon com bias ao centro do CP7 (mesma rua, CP4 ou concelho certo, ≤8 km:
    // o IMPIC às vezes tem o CP7 de outro troço do mesmo concelho)
    const fs = await photon(qPhoton, d.centro[0], d.centro[1]);
    if (fs === null) return { ok: false, motivo: 'photon-falhou', retry: true };
    const h = aceitaPhoton(fs, { cp, rua, concelho, ancora: d.centro, raioKm: 8 });
    if (h) return { ok: true, ...h, cp, cpPontos: d.pontos, centro: d.centro };
    // fica no ponto INE central do CP7 (código postal ≈ troço de rua / lugar) — só se o CP7 for compacto
    const raio = d.pontos.length ? Math.max(...d.pontos.map(p => km(d.centro[0], d.centro[1], p.lat, p.lng))) : 0;
    if (d.pontos.length && raio <= 2.5) {
      const p = medoide(d.pontos);
      return { ok: true, lat: p.lat, lng: p.lng, fonte: 'geoapi-cp7', cp, raioCP7: +raio.toFixed(2), cpPontos: d.pontos, centro: d.centro };
    }
    if (!d.pontos.length) return { ok: true, lat: d.centro[0], lng: d.centro[1], fonte: 'geoapi-cp7-centro', cp, centro: d.centro };
    const loc = await pontoLocalidade([lugar, locPostal], concelho, d.centro);
    if (loc && loc.retry) return { ok: false, motivo: 'photon-falhou', retry: true };
    if (loc) return { ok: true, ...loc, cp };
    return { ok: false, motivo: 'cp7-extenso-sem-rua', raioCP7: +raio.toFixed(2) };
  }
  // CP7 sem pontos/centro na GeoAPI (códigos novos, "CP de cliente") → Photon: mesma rua, CP4 ou concelho certo, ≤15 km
  const ancora = await ancoraConcelho(concelho);
  const fs = await photon(qPhoton, ancora && ancora[0], ancora && ancora[1]);
  if (fs === null) return { ok: false, motivo: 'photon-falhou', retry: true };
  const h = aceitaPhoton(fs, { cp, rua, concelho, ancora, raioKm: 15 });
  if (h) return { ok: true, ...h, fonte: h.fonte + '-sem-cp7', cp };
  const loc = await pontoLocalidade([lugar, locPostal], concelho, ancora);
  if (loc && loc.retry) return { ok: false, motivo: 'photon-falhou', retry: true };
  if (loc) return { ok: true, ...loc, cp };
  return { ok: false, motivo: d ? 'cp7-sem-pontos-e-rua-nao-achada' : 'cp7-desconhecido' };
}

// Nada de pinos empilhados: se o ponto já está ocupado, usa a porta INE livre mais próxima da MESMA rua
// (ou do mesmo CP7). Sem alternativa livre → mantém (o leque do mapa separa colocalizadas).
const chave = (lat, lng) => lat.toFixed(5) + ',' + lng.toFixed(5);   // ~1 m
function desempilhar(g, ocupados) {
  if (!ocupados.has(chave(g.lat, g.lng))) return g;
  for (const lista of [g.alternativas, g.cpPontos]) {
    if (!lista || !lista.length) continue;
    const livres = lista.filter(p => !ocupados.has(chave(p.lat, p.lng)) && km(g.lat, g.lng, p.lat, p.lng) <= 0.6);
    if (livres.length) {
      const p = livres.reduce((b, x) => km(g.lat, g.lng, x.lat, x.lng) < km(g.lat, g.lng, b.lat, b.lng) ? x : b);
      return { ...g, lat: p.lat, lng: p.lng, fonte: g.fonte + '+porta-vizinha' };
    }
  }
  return { ...g, colocalizada: true };
}

module.exports = { geocodificar, desempilhar, chave, km, geoapiCP, melhorRua, portaNaRua, toks, norm, ruaParaPhoton };
