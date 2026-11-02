// Re-verificação (sem BD) dos sites suspeitos: a página tem de mencionar o NIF ou uma palavra distintiva do nome.
// Mencionar o próprio domínio já não chega (era o erro de sites.js). Escreve sites-reverificados.json para rever à mão.
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const F = require('./ficha');
const D = f => dados(f);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const GENERICAS = /^(LDA|LIMITADA|SA|UNIP|SOCIEDADE|SOC|CONSTRUCOES|CONSTRUCAO|CIVIL|OBRAS|PUBLICAS|COMERCIO|SERVICOS|INSTALACOES|ENGENHARIA|FILHOS|IRMAOS|MANUTENCAO|TECNICA|TECNICAS|SISTEMAS|GLOBAL|PROJECTOS|PROJETOS|GESTAO|PORTUGAL|ENERGIA|ELECTRICIDADE|REMODELACOES|PINTURAS|EMPRESA|INDUSTRIA|PRODUTOS|SOLUCOES|ANTONIO|MANUEL|JOSE|JOAO|CARLOS|LUIS|PAULO|SILVA|SANTOS|FERREIRA|PEREIRA|COSTA|MARTINS|GOMES|LOPES|RODRIGUES|FERNANDES|OLIVEIRA|SOUSA|NUNES|MARQUES|ALVES|DIAS|PINTO|MENDES)$/;
const ler = f => fs.readFileSync(D(f), 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch (_) { return null; } }).filter(Boolean);
const nifDe = new Map(ler('inseridas.jsonl').map(x => [+x.id, x.nif]));
const sus = JSON.parse(fs.readFileSync(D('sites-suspeitos.json'), 'utf8'));
const OUT = D('sites-reverificados.json');
const feito = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
async function ver(x) {
  for (let t = 0; t < 2; t++) {
    try {
      const r = await fetch(x.site, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': UA, accept: 'text/html' } });
      const h = (await r.text()).slice(0, 600000);
      const titulo = String((h.match(/<title[^>]*>([^<]*)/i) || [])[1] || '').replace(/\s+/g, ' ').trim().slice(0, 90);
      const T = F.N(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')) + ' ' + F.N(titulo);
      const nif = nifDe.get(+x.id), pal = F.N(x.name).split(' ').filter(p => p.length >= 4 && !GENERICAS.test(p));
      const achou = pal.filter(p => new RegExp('\\b' + p + '\\b').test(T));
      return { estado: r.status, titulo, nif: !!(nif && T.replace(/\s/g, '').includes(nif)), palavras: achou, letras: T.length };
    } catch (e) { if (t) return { erro: e.cause && e.cause.code || e.name }; await new Promise(z => setTimeout(z, 3000)); }
  }
}
(async () => {
  let i = 0; const fila = sus.filter(x => !feito[x.id]);
  const trab = async () => { while (i < fila.length) { const x = fila[i++]; feito[x.id] = { ...x, ...(await ver(x)) }; if (i % 40 === 0) { fs.writeFileSync(OUT, JSON.stringify(feito)); console.log('[reverificar]', i, '/', fila.length); } await new Promise(z => setTimeout(z, 300)); } };
  await Promise.all([trab(), trab(), trab()]);
  fs.writeFileSync(OUT, JSON.stringify(feito));
  const v = Object.values(feito);
  console.log('[reverificar] FIM', v.length, '| NIF na página', v.filter(x => x.nif).length, '| palavra distintiva', v.filter(x => !x.nif && x.palavras && x.palavras.length).length, '| nem uma nem outra', v.filter(x => !x.erro && !x.nif && !(x.palavras && x.palavras.length)).length, '| erro de rede', v.filter(x => x.erro).length);
})();
