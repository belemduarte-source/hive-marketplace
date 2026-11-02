// Piloto de lacunas: prepara as fichas escolhidas à mão (sem BD). Valida o domínio e o site, geocodifica as da DGEG pela
// morada e confere o pino com o GeoAPI (rua e concelho). Escreve piloto-final.json, que é exatamente o que piloto-gravar.js grava.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;
const F = require('./ficha');
const { geocodificar, km } = require('./geocode');
const D = f => dados(f);
const MAT = JSON.parse(fs.readFileSync(D('gap-matriz.json'), 'utf8'));
const H = JSON.parse(fs.readFileSync(D('hierarquia.json'), 'utf8'));
const nomeAtiv = {}; for (const v of Object.values(H)) Object.assign(nomeAtiv, v.subs);
const ler = f => fs.readFileSync(D(f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
const proc = new Map(); for (const x of ler('processadas.jsonl')) proc.set(x.key, x);

// IMPIC: ofício principal é a lacuna; setores pela licença, revistos à mão quando a licença engana
const IMPIC = { '17-57613': null, '17-61500': null, '17-111950': null, '17-57167': ['seguranca_alarmes'], '17-66895': null, '17-119125': null, '17-33868': null, '17-72441': null, '17-62570': null, '17-117520': null, '17-58734': null, '17-68734': null };
// DGEG: especialistas (gás no nome ou no site), tipos A e A+B
const DGEG = ['12', '526', '83', '626', '244', '305', '517', '487', '260', '761'];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const PARQ = /domain (is )?for sale|buy this domain|parked|sedoparking|dan\.com|afternic|hugedomains|dom[ií]nio (est[aá] )?(à|a) venda|em constru[cç][aã]o|under construction|coming soon/i;
const LEGAIS = /^(COMERCIO|INSTALACOES|SERVICOS|SOCIEDADE|LIMITADA|TECNICA|TECNICOS|ENERGIA|ENERGIAS|ASSISTENCIA|CONSTRUCOES|REDES|ELECTRICAS|ELECTRICIDADE|INDUSTRIA)$/;
async function site(dom, nome) {
  for (const u of ['https://www.' + dom, 'https://' + dom]) {
    try {
      const r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(12000), headers: { 'User-Agent': UA, accept: 'text/html' } });
      if (!r.ok || !/html/i.test(r.headers.get('content-type') || '')) continue;
      const h = (await r.text()).slice(0, 300000);
      if (PARQ.test(h.slice(0, 60000))) return { ok: false, motivo: 'estacionado-ou-em-construcao' };
      const domFinal = new URL(r.url).hostname.replace(/^www\./, '');
      if (domFinal.split('.')[0] !== dom.split('.')[0] && !domFinal.endsWith('.' + dom)) return { ok: false, motivo: 'redireciona:' + domFinal };
      const T = F.N(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
      const titulo = F.N((h.match(/<title[^>]*>([^<]*)/i) || [])[1] || '');
      const pal = F.N(nome).split(' ').filter(t => t.length >= 4 && !LEGAIS.test(t));
      const menciona = pal.some(t => T.includes(t) || titulo.includes(t)) || T.includes(F.N(dom.split('.')[0]));
      return { ok: menciona, url: new URL(r.url).origin + '/', T, motivo: menciona ? '' : 'nao-menciona' };
    } catch (_) {}
  }
  return { ok: false, motivo: 'sem-resposta' };
}
const vivo = async d => { try { await dns.resolveMx(d); return true; } catch (e) { try { await dns.resolve(d); return true; } catch (_) { return false; } } };
const noPino = async (la, lo) => {
  for (let t = 0; t < 3; t++) {
    try {
      const r = await fetch(`https://json.geoapi.pt/gps/${la},${lo}`, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
      if (r.status === 429) { await new Promise(s => setTimeout(s, 3000)); continue; }
      const j = await r.json();
      return { concelho: j.concelho || '', freguesia: j.freguesia || '', rua: j.rua || (j.detalhesPorta && j.detalhesPorta.rua) || (Array.isArray(j.ruas) && j.ruas[0]) || '' };
    } catch (_) {}
  }
  return { concelho: '?', freguesia: '', rua: '' };
};
const fechaLista = (la, lo, setores) => { const o = []; for (const m of MAT) { if (Math.abs(la - m.lat) > 0.1 || Math.abs(lo - m.lng) > 0.14 || km(m.lat, m.lng, la, lo) > 10) continue; for (const s of setores) if (m.a[s] && m.a[s].r10 === 0) o.push(`${m.nome}: ${nomeAtiv[s] || s}`); } return o; };

(async () => {
  const lista = [];
  for (const [k, sobre] of Object.entries(IMPIC)) {
    const x = proc.get(k); if (!x || !x.ok) { console.log('IMPIC em falta ou recusada:', k); continue; }
    const det = JSON.parse(fs.readFileSync(D('cache/det/' + k + '.json'), 'utf8'));
    const cl = F.classificar(det, det.nome); if (!cl.primario) { console.log('fora das áreas:', k); continue; }
    const setores = sobre || cl.setores.filter(s => s === cl.primario || s !== 'escavacao');
    const f = x.ficha; let web = '', mot = '';
    if (f.email_proprio) { const d = f.email.split('@')[1]; if (await vivo(d)) { const s = await site(d, f.name); if (s.ok) web = s.url; else mot = s.motivo; } else mot = 'dominio-sem-dns'; }
    lista.push({ fonte: 'IMPIC', key: k, distrito: x.distrito, name: f.name, sector: setores[0], sectors: setores, nif: f.nif, alvara: f.alvara, address: f.address, postal_code: f.postal_code, city: f.city, email: f.email, phone: f.phone, website: web, siteMotivo: mot,
      tags: f.tags, description: f.description, lat: f.lat, lng: f.lng, alt: x.geo.alt || [], geo: x.geo.fonte, confidence: 3, habs: (det.habs || []).length, fecha: fechaLista(f.lat, f.lng, setores) });
  }
  const novas = JSON.parse(fs.readFileSync(D('dgeg-novas.json'), 'utf8'));
  const TIPO = { A: 'instalações e redes de gás', 'A+B': 'instalações, redes e aparelhos de gás', B: 'aparelhos de gás' };
  for (const num of DGEG) {
    const e = novas.find(n => String(n.aut).split('/')[0].trim() === num); if (!e) { console.log('DGEG em falta:', num); continue; }
    const dom = F.dominio(e.email);
    if (!(await vivo(dom))) { console.log('DGEG domínio sem DNS:', e.nome); continue; }
    const loc = e.loc || '', linhas = [e.morada, `${e.cp} ${loc}`.trim()].filter(Boolean);
    const g = await geocodificar([e.morada, loc, `${e.cp} ${loc}`].filter(Boolean), e.concelho);
    if (!g.ok) { console.log('DGEG sem posição:', e.nome, g.motivo); continue; }
    const s = await site(dom, e.nome);
    const setores = ['gas'];
    if (s.ok && /CLIMA/.test(F.N(e.nome)) && s.T.includes('CLIMATIZ')) setores.push('climatizacao_avac');
    if (F.setorDoNome(e.nome) === 'eletricistas') setores.push('eletricistas');
    const nomeF = F.capitalizar(e.nome);
    lista.push({ fonte: 'DGEG', aut: e.aut, tipo: e.tipo, name: nomeF, sector: 'gas', sectors: setores, nif: null, alvara: '', address: linhas.join(', '), postal_code: e.cp, city: e.concelho, email: e.email, phone: F.fmtTel(e.tel), website: s.ok ? s.url : '', siteMotivo: s.motivo || '', falaDeGas: !!(s.T && /\bGAS\b/.test(s.T)),
      tags: ['registo DGEG'], description: `Entidade instaladora de gás autorizada pela DGEG (n.º ${num}, tipo ${e.tipo}: ${TIPO[e.tipo]}). Sede em ${e.concelho}.`,
      lat: +g.lat.toFixed(7), lng: +g.lng.toFixed(7), geo: g.fonte, alt: (g.alternativas && g.alternativas.length ? g.alternativas : g.cpPontos || []).filter(p => km(g.lat, g.lng, p.lat, p.lng) <= 0.6).slice(0, 25).map(p => [+p.lat.toFixed(6), +p.lng.toFixed(6)]),
      confidence: s.ok ? 3 : 2, fecha: fechaLista(+g.lat, +g.lng, setores) });
    await new Promise(r => setTimeout(r, 300));
  }
  for (const x of lista) { x.pino = await noPino(x.lat, x.lng); await new Promise(r => setTimeout(r, 250)); }
  fs.writeFileSync(D('piloto-final.json'), JSON.stringify(lista, null, 1));
  console.log(`lista: ${lista.length} (IMPIC ${lista.filter(x => x.fonte === 'IMPIC').length}, DGEG ${lista.filter(x => x.fonte === 'DGEG').length}); lacunas fechadas: ${lista.reduce((t, x) => t + x.fecha.length, 0)}\n`);
  for (const x of lista) console.log(`${x.fonte.padEnd(5)} ${x.name.slice(0, 40).padEnd(40)} | ${x.sectors.join('+').slice(0, 40).padEnd(40)} | ${x.geo.slice(0, 22).padEnd(22)} | ${x.address.slice(0, 54).padEnd(54)} | no pino: ${x.pino.rua ? x.pino.rua + ' · ' : ''}${x.pino.freguesia.slice(0, 26)} · ${x.pino.concelho} | ${x.email || '—'} | ${x.phone || '—'} | ${x.website || '(' + (x.siteMotivo || 'sem site') + ')'} | fecha ${x.fecha.length}: ${x.fecha.slice(0, 3).join('; ').slice(0, 90)}`);
})();
