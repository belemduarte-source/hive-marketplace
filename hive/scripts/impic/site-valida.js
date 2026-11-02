// Validação estrita de um site derivado do email de domínio próprio: a página tem de mencionar o NIF ou uma palavra
// distintiva do nome, ou o domínio tem de conter essa palavra. Mencionar o próprio domínio não chega (era o erro de sites.js,
// que aceitava sites de contabilistas, grupos e portais). Sem certeza, a ficha fica sem site.
const F = require('./ficha');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const PARQ = /domain (is )?for sale|buy this domain|parked|sedoparking|dan\.com|afternic|hugedomains|dom[ií]nio (est[aá] )?(à|a) venda|em constru[cç][aã]o|under construction|coming soon|brevemente/i;
const GENERICAS = /^(LDA|LIMITADA|SA|UNIP|SOCIEDADE|SOC|CONSTRUCOES|CONSTRUCAO|CIVIL|OBRAS|PUBLICAS|COMERCIO|SERVICOS|INSTALACOES|INST|ENGENHARIA|FILHOS|IRMAOS|MANUTENCAO|TECNICA|TECNICAS|SISTEMAS|GLOBAL|PROJECTOS|PROJETOS|GESTAO|PORTUGAL|ENERGIA|ENERGIAS|ELECTRICIDADE|REDES|GAS|REMODELACOES|PINTURAS|EMPRESA|INDUSTRIA|PRODUTOS|SOLUCOES|ANTONIO|MANUEL|JOSE|JOAO|CARLOS|LUIS|PAULO|SILVA|SANTOS|FERREIRA|PEREIRA|COSTA|MARTINS|GOMES|LOPES|RODRIGUES|FERNANDES|OLIVEIRA|SOUSA|NUNES|MARQUES|ALVES|DIAS|PINTO|MENDES)$/;
const distintivas = nome => F.N(nome).split(' ').filter(p => p.length >= 4 && !GENERICAS.test(p));
async function siteDaEmpresa(dom, nome, nif) {
  for (const u of ['https://www.' + dom, 'https://' + dom]) {
    try {
      const r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(13000), headers: { 'User-Agent': UA, accept: 'text/html' } });
      if (!r.ok || !/html/i.test(r.headers.get('content-type') || '')) continue;
      const h = (await r.text()).slice(0, 400000);
      if (PARQ.test(h.slice(0, 60000))) return { ok: false, motivo: 'estacionado-ou-em-construcao' };
      const final = new URL(r.url).hostname.replace(/^www\./, '');
      if (final.split('.')[0] !== dom.split('.')[0] && !final.endsWith('.' + dom)) return { ok: false, motivo: 'redireciona:' + final };
      const titulo = String((h.match(/<title[^>]*>([^<]*)/i) || [])[1] || '');
      const T = F.N(h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')) + ' ' + F.N(titulo);
      const pal = distintivas(nome), rotulo = F.N(dom.split('.')[0]).replace(/\s/g, '');
      const noTexto = pal.some(p => new RegExp('\\b' + p + '\\b').test(T)), noNif = !!(nif && T.replace(/\s/g, '').includes(nif)), noDominio = pal.some(p => rotulo.includes(p) || (p.length >= 5 && p.includes(rotulo)));
      return { ok: noTexto || noNif || noDominio, url: new URL(r.url).origin + '/', T, titulo: titulo.slice(0, 90), motivo: noTexto || noNif || noDominio ? '' : 'nao-menciona-a-empresa' };
    } catch (_) {}
  }
  return { ok: false, motivo: 'sem-resposta' };
}
module.exports = { siteDaEmpresa, distintivas };
