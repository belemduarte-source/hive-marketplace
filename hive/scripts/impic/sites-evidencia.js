// Teste pequeno (sem BD): os sites das empresas dizem que ofícios fazem? Amostra ao acaso de fichas IMPIC em "construção geral"
// com site validado; lê a página inicial e procura termos de atividades que o IMPIC não distingue. Escreve sites-evidencia.json para ler à mão.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const F = require('./ficha');
const D = f => dados(f);
const N_AMOSTRA = +(process.argv[2] || 60);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const TERMOS = { telhados_coberturas: /\b(TELHADOS?|COBERTURAS?)\b/, pavimentos: /\b(PAVIMENTOS?|SOALHOS?|FLUTUANTES?)\b/, azulejos: /\b(AZULEJOS?|CERAMICOS?|LADRILHOS?)\b/, gesso_cartonado: /\b(PLADUR|GESSO CARTONADO)\b/,
  pedreiros: /\b(PEDREIROS?|ALVENARIAS?|TROLHAS?)\b/, estucadores: /\b(ESTUQUES?|ESTUCAD)/, isolamento: /\b(ISOLAMENTOS?|CAPOTO|ETICS|ISOLAMENTO TERMICO)\b/, impermeabilizacao: /\bIMPERMEABILIZ/, pintores: /\bPINTURAS?\b/, carpinteiros: /\bCARPINTARIAS?\b/,
  picheleiros: /\b(CANALIZACOES|CANALIZADOR|PICHELEIRO)/, eletricistas: /\b(ELECTRICIDADE|ELETRICIDADE|INSTALACOES ELE[C]?TRICAS)\b/, piscinas: /\bPISCINAS?\b/, chave_na_mao: /\bCHAVE NA MAO\b/, remodelacao: /\b(REMODELACOES|REMODELACAO)\b/, gestao_obra: /\b(GESTAO DE OBRAS?|FISCALIZACAO)\b/, engenharia_civil: /\bENGENHARIA CIVIL\b/, arquitetura_projetos: /\b(ARQUITECTURA|ARQUITETURA)\b/ };
const ler = f => fs.readFileSync(D(f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
const ins = ler('inseridas.jsonl').filter(x => x.website && x.sector === 'construcao_geral');
let s = 20261102 >>> 0; const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
for (let i = ins.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ins[i], ins[j]] = [ins[j], ins[i]]; }
const am = ins.slice(0, N_AMOSTRA);
const out = []; let i = 0;
const trab = async () => { while (i < am.length) { const x = am[i++];
  try { const r = await fetch(x.website, { redirect: 'follow', signal: AbortSignal.timeout(12000), headers: { 'User-Agent': UA, accept: 'text/html' } });
    if (!r.ok) { out.push({ id: x.id, name: x.name, erro: r.status }); continue; }
    const T = F.N((await r.text()).slice(0, 400000).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
    const h = Object.entries(TERMOS).filter(([, re]) => re.test(T)).map(([k]) => k);
    out.push({ id: x.id, name: x.name, city: x.city, url: x.website, chars: T.length, termos: h, trechos: h.slice(0, 4).map(k => { const m = T.match(TERMOS[k]); return T.slice(Math.max(0, m.index - 45), m.index + 45); }) });
  } catch (e) { out.push({ id: x.id, name: x.name, erro: 'rede' }); } } };
(async () => {
  await Promise.all([trab(), trab(), trab(), trab()]);
  fs.writeFileSync(D('sites-evidencia.json'), JSON.stringify(out, null, 1));
  const okk = out.filter(x => !x.erro), c = {}; for (const x of okk) for (const t of x.termos) c[t] = (c[t] || 0) + 1;
  console.log(`sites lidos ${okk.length}/${am.length}; com pelo menos um termo ${okk.filter(x => x.termos.length).length}; pouco texto (< 400 letras) ${okk.filter(x => x.chars < 400).length}`);
  console.log('sites por termo:', JSON.stringify(Object.entries(c).sort((a, b) => b[1] - a[1])));
  for (const x of okk.slice(0, 16)) console.log(`- ${x.name.slice(0, 36)} | ${x.url} | ${x.termos.join(',')}\n    ${x.trechos.slice(0, 2).join(' // ').slice(0, 190)}`);
})();
