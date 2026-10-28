#!/usr/bin/env node
/*
 * regeo-cp7.js — desempilha empresas geocodificadas ao centróide do concelho.
 *
 * O ingest IMPIC geocodifica por nome/concelho; quando a morada não resolve,
 * dezenas de empresas caem TODAS no mesmo ponto (centróide) — no mapa ficam
 * empilhadas num leque. Este script corrige: para cada empresa aprovada cujo
 * (lat,lng) é partilhado por ≥2 registos e que tem morada,
 *   1) GeoAPI.pt por CP7 (dados INE, determinístico):
 *      ponto de morada com RUA (+ nº porta) a bater → precisão casa/rua;
 *      senão centróide do CP7 → segmento de rua/lugar;
 *   2) fallback Photon (komoot) com bias ao ponto atual, aceite só se o CP4
 *      do resultado coincidir e ficar ≤20 km;
 *   3) sem hit aceitável → NÃO MEXE (nunca inventar posições).
 * Sanidade: novo ponto a ≤35 km e >50 m do antigo. Cada update fica em
 * regeo-log.jsonl (id, antes, depois, fonte) para reversão.
 *
 * Uso (porta 5432 bloqueada → driver HTTP do Neon):
 *   npm i @neondatabase/serverless   (onde correr o script)
 *   DATABASE_URL=postgres://... node hive/scripts/regeo-cp7.js
 *   (sem DATABASE_URL no ambiente, lê .env.diag na raiz do workspace)
 *
 * Correr DEPOIS de cada ingest IMPIC em lote. 1 só processo; ~1 req/s.
 */
const fs = require('fs');
const path = require('path');

function dbUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const f = path.resolve(__dirname, '..', '..', '.env.diag');
  const m = fs.readFileSync(f, 'utf8').match(/DATABASE_URL=(.+)/);
  return m[1].trim().replace(/^"|"$/g, '');
}
const { neon } = require('@neondatabase/serverless');
const sql = neon(dbUrl());

const LOG = path.join(process.cwd(), 'regeo-log.jsonl');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function dist(lat1, lon1, lat2, lon2) {
  const R = 6371, dLa = (lat2 - lat1) * Math.PI / 180, dLo = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLa / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));      // km
}
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set(['RUA', 'AVENIDA', 'AV', 'TRAVESSA', 'PRACETA', 'PRACA', 'LARGO', 'ESTRADA', 'CAMINHO', 'LUGAR', 'DE', 'DA', 'DO', 'DAS', 'DOS', 'E', 'O', 'A', 'SN', 'LOTE', 'N', 'NO']);
const toks = (s) => norm(s).split(' ').filter(t => t.length >= 3 && !STOP.has(t) && !/^\d+$/.test(t));

const cpCache = new Map();
async function geoapiCP(cp) {
  if (cpCache.has(cp)) return cpCache.get(cp);
  let out = null;
  for (let tent = 1; tent <= 3; tent++) {
    try {
      const r = await fetch('https://json.geoapi.pt/cp/' + cp, { headers: { accept: 'application/json', 'User-Agent': 'hivex.pt regeo (geral.hivex@gmail.com)' } });
      if (r.status === 404) break;
      if (r.status === 429) { await sleep(6000 * tent); continue; }
      if (!r.ok) { await sleep(1500 * tent); continue; }
      out = await r.json();
      break;
    } catch (_) { await sleep(1500 * tent); }
  }
  cpCache.set(cp, out);
  await sleep(650);
  return out;
}

function melhorPontoCP(cpData, ruaEmpresa) {
  if (!cpData) return null;
  const alvo = toks(ruaEmpresa);
  const casaM = norm(ruaEmpresa).match(/\b(\d{1,4})\b/);
  const casa = casaM ? casaM[1] : null;
  let ruaHit = null, casaHit = null;
  for (const p of (Array.isArray(cpData.pontos) ? cpData.pontos : [])) {
    const co = p && p.coordenadas;
    if (!co || !isFinite(co[0])) continue;
    const pr = toks(p.rua);
    if (!(alvo.length && pr.length && alvo.some(t => pr.includes(t)))) continue;
    if (!ruaHit) ruaHit = p;
    if (casa && String(p.casa) === casa) { casaHit = p; break; }
  }
  const esc = casaHit || ruaHit;
  if (esc) return { lat: +esc.coordenadas[0], lng: +esc.coordenadas[1], fonte: casaHit ? 'geoapi-casa' : 'geoapi-rua' };
  const c = cpData.centroide || cpData.centro;
  if (Array.isArray(c) && isFinite(c[0])) return { lat: +c[0], lng: +c[1], fonte: 'geoapi-cp7' };
  return null;
}

async function photonFallback(c, cp4) {
  const rua = String(c.address).split(',')[0].trim();
  const freg = (String(c.address).match(/\d{4}-\d{3}\s+([^,]+)/) || [])[1] || c.city || '';
  const q = [rua, freg, 'Portugal'].filter(Boolean).join(', ');
  try {
    const url = 'https://photon.komoot.io/api/?q=' + encodeURIComponent(q) + '&lat=' + c.lat + '&lon=' + c.lng + '&limit=3';
    const r = await fetch(url, { headers: { 'User-Agent': 'hivex.pt regeo (geral.hivex@gmail.com)' } });
    if (!r.ok) return null;
    const j = await r.json();
    for (const f of (j.features || [])) {
      const p = f.properties || {}, g = (f.geometry || {}).coordinates;
      if (!g || p.countrycode !== 'PT') continue;
      if (cp4 && !(String(p.postcode || '').startsWith(cp4))) continue;
      if (dist(c.lat, c.lng, g[1], g[0]) > 20) continue;
      return { lat: g[1], lng: g[0], fonte: 'photon-' + (p.type || '?') };
    }
  } catch (_) {}
  finally { await sleep(1000); }
  return null;
}

(async () => {
  const pend = await sql`
    SELECT c.id, c.name, c.address, c.postal_code, c.city, c.lat, c.lng
    FROM companies c
    WHERE c.status='approved' AND COALESCE(TRIM(c.address),'') <> ''
      AND (c.lat, c.lng) IN (
        SELECT lat, lng FROM companies
        WHERE status='approved' AND lat IS NOT NULL
        GROUP BY lat, lng HAVING COUNT(*) > 1)
    ORDER BY c.id`;
  console.log('[regeo] empilhadas com morada:', pend.length);
  let ok = 0, sem = 0, falha = 0;
  const porFonte = {};
  const t0 = Date.now();
  for (let i = 0; i < pend.length; i++) {
    const c = pend[i];
    c.lat = +c.lat; c.lng = +c.lng;
    const cp = (String(c.address).match(/\d{4}-\d{3}/) || [c.postal_code && /^\d{4}-\d{3}$/.test(c.postal_code) ? c.postal_code : ''])[0];
    const rua = String(c.address).split(',').slice(0, 2).join(' ');
    let hit = cp ? melhorPontoCP(await geoapiCP(cp), rua) : null;
    if (!hit) hit = await photonFallback(c, cp ? cp.slice(0, 4) : null);
    if (hit) {
      const d = dist(c.lat, c.lng, hit.lat, hit.lng);
      if (d > 35 || d < 0.05) hit = null;
    }
    if (hit) {
      try {
        await sql`UPDATE companies SET lat=${hit.lat}, lng=${hit.lng}, updated_at=NOW() WHERE id=${c.id}`;
        fs.appendFileSync(LOG, JSON.stringify({ id: c.id, nome: c.name, de: [c.lat, c.lng], para: [hit.lat, hit.lng], fonte: hit.fonte }) + '\n');
        porFonte[hit.fonte] = (porFonte[hit.fonte] || 0) + 1;
        ok++;
      } catch (e) { falha++; console.log('[regeo] UPDATE falhou id', c.id, e.message); }
    } else sem++;
    if ((i + 1) % 50 === 0 || i === pend.length - 1) {
      console.log(`[regeo] ${i + 1}/${pend.length} | movidas ${ok} | sem hit ${sem} | falhas ${falha} | ${((Date.now() - t0) / 60000).toFixed(1)} min`);
    }
  }
  console.log('[regeo] FIM:', JSON.stringify({ movidas: ok, semHit: sem, falhasDB: falha, porFonte }));
})().catch(e => { console.error('[regeo] ERRO FATAL:', e.message); process.exit(1); });
