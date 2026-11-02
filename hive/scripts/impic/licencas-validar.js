// Validação independente (sem BD): amostra NOVA, ao acaso e depois do filtro, das fichas que ganhariam cada ligação nova,
// excluindo as já vistas na primeira amostra. Lê a página inicial (com repetições) para julgar à mão.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const F = require('./ficha');
const D = f => dados(f);
const N_POR = +(process.argv[2] || 15);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const fin = JSON.parse(fs.readFileSync(D('licencas-final.json'), 'utf8'));
const usados = new Set(); try { for (const a of Object.values(JSON.parse(fs.readFileSync(D('licencas-amostra.json'), 'utf8')))) for (const x of a) usados.add(x.id); } catch (_) {}
for (const m of fs.readFileSync(D('licencas-amostra.log'), 'utf8').matchAll(/^- (\d+) /gm)) usados.add(+m[1]);
const ALVO = { alvenaria: 'alvenarias', betao: 'betao', estuques: 'estuques', isolamentos: 'isolamentos', ajardinamentos: 'ajardinamentos' };
const TERMOS = /\b(ALVENARIAS?|PEDREIROS?|TROLHAS?|REBOCOS?|BETAO|ESTRUTURAS?|ESTUQUES?|ESTUCAD\w*|GESSOS?|ISOLAMENTOS?|CAPOTO|ETICS|PAISAGISMO|JARDINS?|JARDINAGEM|ESPACOS VERDES|PINTURAS?|CONSTRUCAO CIVIL|CONSTRUCOES?|REMODELACOES?|REMODELACAO|REABILITACAO|EMPREITADAS?)\b/g;
let s = 77 >>> 0; const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
const baralha = a => { const o = a.slice(); for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } return o; };
const dec = t => String(t || '').replace(/&amp;/g, '&').replace(/&#\d+;|&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
async function ler(url) {
  for (let t = 0; t < 3; t++) {
    try {
      const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(14000), headers: { 'User-Agent': UA, accept: 'text/html' } });
      if (!r.ok) return { erro: 'http ' + r.status };
      const h = (await r.text()).slice(0, 500000);
      return { titulo: dec((h.match(/<title[^>]*>([^<]*)/i) || [])[1]).slice(0, 100), desc: dec((h.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)/i) || [])[1]).slice(0, 150), T: F.N(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')) };
    } catch (e) { await new Promise(z => setTimeout(z, 4000 * (t + 1))); }
  }
  return { erro: 'rede' };
}
(async () => {
  for (const lig of Object.values(ALVO)) {
    const c = fin.filter(f => f.website && f.porque.some(p => p.lig === lig) && !usados.has(f.id));
    const am = baralha(c).slice(0, N_POR);
    console.log(`\n=== ${lig} (${fin.filter(f => f.porque.some(p => p.lig === lig)).length} fichas; ${c.length} com site por ver; amostra ${am.length})`);
    for (const f of am) {
      usados.add(f.id);
      const p = await ler(f.website); await new Promise(z => setTimeout(z, 400));
      if (p.erro) { console.log(`- ${f.id} ${f.name.slice(0, 44)} | ${p.erro}`); continue; }
      const c2 = {}; for (const m of p.T.matchAll(TERMOS)) c2[m[1]] = (c2[m[1]] || 0) + 1;
      console.log(`- ${f.id} ${f.name.slice(0, 44)} | ${f.primario} | ${f.website}\n    T: ${p.titulo} | D: ${p.desc}\n    termos: ${Object.entries(c2).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([k, n]) => k + '×' + n).join(', ') || '(nenhum)'} | letras ${p.T.length}`);
    }
  }
})();
