// Passo aprovado (< 400 fichas novas): junta as IMPIC e DGEG escolhidas, valida os sites com a regra estrita e confere cada
// pino com o GeoAPI (sem BD). Escreve alvo-final.json, que é exatamente o que alvo-gravar.js grava.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;
const F = require('./ficha');
const { siteDaEmpresa } = require('./site-valida');
const D = f => dados(f);
const vivo = async d => { try { await dns.resolveMx(d); return true; } catch (e) { try { await dns.resolve(d); return true; } catch (_) { return false; } } };
const noPino = async (la, lo) => {
  for (let t = 0; t < 3; t++) {
    try {
      const r = await fetch(`https://json.geoapi.pt/gps/${la},${lo}`, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(15000) });
      if (r.status === 429) { await new Promise(s => setTimeout(s, 3000)); continue; }
      const j = await r.json();
      return { concelho: j.concelho || '', freguesia: j.freguesia || '', rua: j.rua || (j.detalhesPorta && j.detalhesPorta.rua) || (Array.isArray(j.ruas) && j.ruas[0]) || '' };
    } catch (_) { await new Promise(s => setTimeout(s, 2000)); }
  }
  return { concelho: '?', freguesia: '', rua: '' };
};
const TIPO = { A: 'instalações e redes de gás', 'A+B': 'instalações, redes e aparelhos de gás', B: 'aparelhos de gás' };
(async () => {
  const out = [];
  for (const x of JSON.parse(fs.readFileSync(D('alvo-impic.json'), 'utf8'))) {
    let website = '', siteMotivo = '';
    if (x.email_proprio) { const d = x.email.split('@')[1]; if (await vivo(d)) { const s = await siteDaEmpresa(d, x.name, x.nif); if (s.ok) website = s.url; else siteMotivo = s.motivo; } else siteMotivo = 'dominio-sem-dns'; }
    out.push({ fonte: 'IMPIC', key: x.key, distrito: x.distrito, name: x.name, sector: x.sector, sectors: x.sectors, nif: x.nif, alvara: x.alvara, address: x.address, postal_code: x.postal_code, city: x.city, email: x.email, phone: x.phone, website, siteMotivo, tags: x.tags, description: x.description, lat: x.lat, lng: x.lng, alt: x.alt, geo: x.geo, confidence: 3, nLinhas: x.nLinhas, fecha: x.fecha });
  }
  for (const o of fs.existsSync(D('alvo-dgeg.json')) ? JSON.parse(fs.readFileSync(D('alvo-dgeg.json'), 'utf8')) : []) {
    const e = o.e, num = String(e.aut).split('/')[0].trim(), setores = ['gas'];
    if (F.setorDoNome(e.nome) === 'eletricistas') setores.push('eletricistas');
    if (/CLIMA/.test(F.N(e.nome))) setores.push('climatizacao_avac');
    const proprio = !!o.dom;
    out.push({ fonte: 'DGEG', aut: e.aut, tipo: e.tipo, distrito: '', name: F.capitalizar(e.nome), sector: 'gas', sectors: setores, nif: null, alvara: '', address: [e.morada, `${e.cp} ${e.loc || ''}`.trim()].filter(Boolean).join(', '), postal_code: e.cp, city: e.concelho, email: e.email, phone: F.fmtTel(e.tel), website: o.site || '', siteMotivo: o.siteMotivo || '', tags: ['registo DGEG'], description: `Entidade instaladora de gás autorizada pela DGEG (n.º ${num}, tipo ${e.tipo}: ${TIPO[e.tipo]}). Sede em ${e.concelho}.`, lat: o.lat, lng: o.lng, alt: o.alt || [], geo: o.geo, confidence: o.site && proprio ? 3 : (o.site || proprio ? 2 : 1), fecha: o.fecha.map(m => m + ': Instalações de Gás') });
  }
  // a mesma empresa nas duas listas: fica a ficha IMPIC (tem NIF e alvará), com a atividade de gás e a autorização na descrição
  const canon = n => F.N(n).replace(/\b(LDA|SA|S A)\b/g, ' ').replace(/\s+/g, ' ').trim();
  const tel = s => String(s || '').replace(/\D/g, '').replace(/^351(?=\d{9}$)/, '');
  for (const d of out.filter(x => x.fonte === 'DGEG')) {
    const i = out.find(x => x.fonte === 'IMPIC' && (canon(x.name) === canon(d.name) || (x.email && x.email === d.email) || (tel(x.phone) && tel(x.phone) === tel(d.phone))));
    if (!i) continue;
    if (!i.sectors.includes('gas')) i.sectors.push('gas');
    i.description += ' ' + d.description.replace(/ Sede em .*$/, '');
    i.fecha = [...new Set([...i.fecha, ...d.fecha])];
    out.splice(out.indexOf(d), 1);
    console.log('juntadas:', i.name, '←', d.aut);
  }
  // nunca empresas de uma pessoa, e fora o que a revisão à mão excluiu
  const FORA_AUT = new Set(['1172/ EI Tipo A']);
  for (const d of out.filter(x => x.fonte === 'DGEG')) if (F.filtroEntidade(d.name, '510315917') || FORA_AUT.has(d.aut)) { console.log('fora:', d.name); out.splice(out.indexOf(d), 1); }
  for (const x of out) { x.pino = await noPino(x.lat, x.lng); await new Promise(r => setTimeout(r, 200)); }
  fs.writeFileSync(D('alvo-final.json'), JSON.stringify(out, null, 1));
  const n = (s, a, b) => F.N(a).toLowerCase().includes(F.N(b).toLowerCase().split(' (')[0]);
  const conc = out.filter(x => x.pino.concelho && x.pino.concelho !== '?' && !n(0, x.pino.concelho, x.city) && !n(0, x.city, x.pino.concelho));
  console.log(`lista: ${out.length} (IMPIC ${out.filter(x => x.fonte === 'IMPIC').length}, DGEG ${out.filter(x => x.fonte === 'DGEG').length}) | com site validado ${out.filter(x => x.website).length} | sem resposta do GeoAPI ${out.filter(x => x.pino.concelho === '?').length} | concelho diferente no pino ${conc.length}`);
  for (const x of conc) console.log('  concelho?', x.name.slice(0, 40), '|', x.city, '| pino:', x.pino.concelho, '|', x.geo, '|', x.address.slice(0, 60));
})();
