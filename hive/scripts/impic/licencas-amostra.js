// Revisão das 5 ligações novas (sem BD): amostra ao acaso de empresas com a linha da licença e site validado.
// Lê a página inicial e mostra o título, a descrição e os trechos com ofícios, para julgar à mão se o site
// confirma a atividade, é compatível (construção/remodelação em geral) ou a contradiz (só outro ofício).
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const F = require('./ficha');
const D = f => dados(f);
const N_POR = +(process.argv[2] || 14);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const plano = JSON.parse(fs.readFileSync(D('licencas-plano.json'), 'utf8')).filter(f => f.website);
const LIG = { alvenarias: { alvo: 'pedreiros', re: /\b(ALVENARIAS?|PEDREIROS?|TROLHAS?|REBOCOS?)\b/ }, estuques: { alvo: 'estucadores', re: /\b(ESTUQUES?|ESTUCAD\w*|REBOCOS?|GESSOS?)\b/ }, isolamentos: { alvo: 'isolamento', re: /\b(ISOLAMENTOS?|CAPOTO|ETICS|TERMICO)\b/ }, betao: { alvo: 'betao_cimento', re: /\b(BETAO|BETOES|ESTRUTURAS?|CIMENTO)\b/ }, ajardinamentos: { alvo: 'paisagismo_jardins', re: /\b(PAISAGISMO|PAISAGISTICA|JARDINS?|JARDINAGEM|AJARDINAMENTOS?|ESPACOS VERDES)\b/ } };
const GERAL = /\b(CONSTRUCAO CIVIL|CONSTRUCOES?|REMODELACOES?|REMODELACAO|REABILITACAO|OBRAS?|EMPREITADAS?)\b/;
let s = 20261102 >>> 0; const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
const baralha = a => { const o = a.slice(); for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } return o; };
const dec = t => String(t || '').replace(/&amp;/g, '&').replace(/&#\d+;|&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
async function ler(url) {
  for (let t = 0; t < 3; t++) { const r = await ler1(url); if (!r.erro || !/^rede/.test(r.erro)) return r; await new Promise(z => setTimeout(z, 4000 * (t + 1))); }
  return { erro: 'rede (3 tentativas)' };
}
async function ler1(url) {
  try {
    const r = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(14000), headers: { 'User-Agent': UA, accept: 'text/html' } });
    if (!r.ok) return { erro: 'http ' + r.status };
    const h = (await r.text()).slice(0, 500000);
    const titulo = dec((h.match(/<title[^>]*>([^<]*)/i) || [])[1]).slice(0, 110);
    const desc = dec((h.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)/i) || [])[1]).slice(0, 170);
    const T = F.N(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
    return { titulo, desc, T };
  } catch (e) { return { erro: 'rede ' + (e.cause && e.cause.code || e.name) }; }
}
(async () => {
  const saida = {};
  for (const [lig, cfg] of Object.entries(LIG)) {
    const am = baralha(plano.filter(f => f.novas.some(n => n.lig === lig))).slice(0, N_POR);
    console.log(`\n=== ${lig} → ${cfg.alvo} (${plano.filter(f => f.novas.some(n => n.lig === lig)).length} com site; amostra ${am.length})`);
    saida[lig] = [];
    for (const f of am) {
      const p = await ler(f.website); await new Promise(z => setTimeout(z, 500));
      if (p.erro) { console.log(`- ${f.id} ${f.name.slice(0, 40)} | ${p.erro}`); continue; }
      const m = p.T.match(cfg.re), g = p.T.match(GERAL);
      const trecho = m ? p.T.slice(Math.max(0, m.index - 50), m.index + 55) : '';
      console.log(`- ${f.id} ${f.name.slice(0, 40)} | ${f.primario} | ${f.website}\n    T: ${p.titulo}\n    D: ${p.desc}\n    termo: ${trecho || '(nenhum)'} | geral: ${g ? g[0] : '(nenhum)'} | letras: ${p.T.length}`);
      saida[lig].push({ id: f.id, name: f.name, primario: f.primario, url: f.website, titulo: p.titulo, desc: p.desc, trecho, geral: g ? g[0] : '', letras: p.T.length });
    }
  }
  fs.writeFileSync(D('licencas-amostra.json'), JSON.stringify(saida, null, 1));
})();
