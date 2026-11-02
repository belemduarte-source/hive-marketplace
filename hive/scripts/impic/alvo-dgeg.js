// Seleção DGEG para o passo aprovado (sem BD): especialistas de gás novos que fecham uma lacuna de gás ainda aberta depois
// das licenças e das fichas IMPIC escolhidas. Geocodifica pela morada; só posição de rua, porta ou código postal compacto.
// Especialista = gás no nome, ou tipo A / A+B com um site da própria empresa que fala de gás. Escreve alvo-dgeg.json.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;
const F = require('./ficha');
const { geocodificar, km } = require('./geocode');
const { siteDaEmpresa } = require('./site-valida');
const D = f => dados(f);
const K = +(process.argv[2] || 2);
const MAT = JSON.parse(fs.readFileSync(D('gap-matriz.json'), 'utf8'));
const matPor = new Map(MAT.map(m => [m.nome, m]));
const abertas = new Set(JSON.parse(fs.readFileSync(D('lacunas-abertas.json'), 'utf8')));
for (const c of JSON.parse(fs.readFileSync(D('alvo-impic.json'), 'utf8'))) for (const m of MAT) if (Math.abs(c.lat - m.lat) <= 0.1 && Math.abs(c.lng - m.lng) <= 0.14 && km(m.lat, m.lng, c.lat, c.lng) <= 10) for (const s of c.sectors) abertas.delete(m.nome + '|' + s);
const gasAbertas = MAT.filter(m => abertas.has(m.nome + '|gas'));
console.log('[dgeg] lacunas de gás abertas:', gasAbertas.length, '| em ≥ 20 mil hab.:', gasAbertas.filter(m => m.pop >= 20000).length);
const pil = new Set(fs.readFileSync(D('piloto-inseridas.jsonl'), 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l).aut).filter(Boolean));
const ISP = /(^|\.)(sapo\.pt|netcabo\.pt|clix\.pt|telepac\.pt|net\.novis\.pt|oninet\.pt|iol\.pt|gmail\.pt|netvisao\.pt|nos\.pt|meo\.pt)$/;
const FORA = /PETROL|PRIO\b|RUBIS|REPSOL|CEPSA|DOUROGAS|OZ ENERGIA|ENERGIN|FLOENE|SETGAS|LUSITANIAGAS|PORTGAS|BEIRAGAS|TAGUSGAS|COMBUSTIVE|BONGAS|ELECTRODOMESTICOS|ELETRODOMESTICOS|MOVEIS|HOTELEIR/;
const novas = JSON.parse(fs.readFileSync(D('dgeg-novas.json'), 'utf8')).filter(e => !pil.has(e.aut) && e.concelho && !FORA.test(F.N(e.nome)));
const temGasNome = e => /\bGAS(ES)?\b|GAS\b/.test(F.N(e.nome));
const perto = e => { const m = matPor.get(e.concelho); return m && gasAbertas.some(g => km(g.lat, g.lng, m.lat, m.lng) <= 18); };
const vivo = async d => { try { await dns.resolveMx(d); return true; } catch (e) { try { await dns.resolve(d); return true; } catch (_) { return false; } } };
const fila = novas.filter(e => perto(e) && (temGasNome(e) || e.tipo !== 'B'));
console.log('[dgeg] candidatas perto de uma lacuna:', fila.length, '| com gás no nome:', fila.filter(temGasNome).length);
const SAIDA = D('alvo-dgeg-cand.json'); const cache = fs.existsSync(SAIDA) ? JSON.parse(fs.readFileSync(SAIDA, 'utf8')) : {};
(async () => {
  for (const e of fila) {
    const k = String(e.aut); if (cache[k]) continue;
    const dom = F.emailProprio(e.email) && !ISP.test(F.dominio(e.email)) ? F.dominio(e.email) : null;
    const o = { e, dom, motivo: '' };
    if (dom && !(await vivo(dom))) { o.domMorto = true; o.dom = null; }
    const g = await geocodificar([e.morada, e.loc, `${e.cp} ${e.loc}`].filter(Boolean), e.concelho);
    if (!g.ok) { o.motivo = 'posição: ' + g.motivo; cache[k] = o; continue; }
    if (/^localidade/.test(g.fonte)) { o.motivo = 'só localidade'; cache[k] = o; continue; }
    o.lat = +g.lat.toFixed(7); o.lng = +g.lng.toFixed(7); o.geo = g.fonte;
    o.alt = (g.alternativas && g.alternativas.length ? g.alternativas : g.cpPontos || []).filter(p => km(g.lat, g.lng, p.lat, p.lng) <= 0.6).slice(0, 25).map(p => [+p.lat.toFixed(6), +p.lng.toFixed(6)]);
    if (o.dom) { const s = await siteDaEmpresa(o.dom, e.nome, null); o.site = s.ok ? s.url : ''; o.siteMotivo = s.motivo || ''; o.falaGas = !!(s.T && /\bGAS\b/.test(s.T)); o.titulo = s.titulo || ''; }
    cache[k] = o; try { fs.writeFileSync(SAIDA, JSON.stringify(cache)); } catch (_) {}   // bloqueio momentâneo do ficheiro: a última escrita apanha tudo
    await new Promise(r => setTimeout(r, 250));
  }
  fs.writeFileSync(SAIDA, JSON.stringify(cache));
  // escolha gulosa: até K por lacuna, especialistas com contacto forte primeiro
  const usos = new Map(), esc = [];
  const cands = Object.values(cache).filter(o => o.lat && (temGasNome(o.e) || o.falaGas));
  const fechos = o => gasAbertas.filter(m => km(m.lat, m.lng, o.lat, o.lng) <= 10 && (usos.get(m.nome) || 0) < K);
  const qual = o => (temGasNome(o.e) ? 2 : 0) + (o.site ? 2 : 0) + (o.dom ? 1 : 0) + (/porta|house|rua|street/.test(o.geo) ? 1 : 0);
  for (;;) {
    let melhor = null, mv = 0;
    for (const o of cands) { if (o.usada) continue; const f = fechos(o); if (!f.length) continue; const v = f.reduce((t, m) => t + m.pop, 0) * (0.5 + qual(o) * 0.1); if (v > mv) { mv = v; melhor = o; } }
    if (!melhor) break;
    melhor.usada = true; melhor.fecha = fechos(melhor).map(m => m.nome); for (const n of melhor.fecha) usos.set(n, (usos.get(n) || 0) + 1); esc.push(melhor);
  }
  fs.writeFileSync(D('alvo-dgeg.json'), JSON.stringify(esc, null, 1));
  const fechadas = new Set(esc.flatMap(o => o.fecha));
  console.log(`[dgeg] FIM candidatas com posição ${Object.values(cache).filter(o => o.lat).length} | especialistas ${cands.length} | escolhidas ${esc.length} | fecham ${fechadas.size} lacunas de gás`);
  esc.forEach((o, i) => console.log(String(i + 1).padStart(3), String(o.e.aut).padEnd(20), o.e.nome.slice(0, 46).padEnd(46), '|', o.e.concelho.slice(0, 18).padEnd(18), '|', o.geo.slice(0, 12).padEnd(12), '|', (o.e.email || '').slice(0, 28).padEnd(28), '|', o.site || '(' + (o.siteMotivo || (o.dom ? '' : 'sem domínio')) + ')', '| gás no site:', o.falaGas ? 'sim' : '—', '| fecha', o.fecha.join(', ').slice(0, 60)));
})();
