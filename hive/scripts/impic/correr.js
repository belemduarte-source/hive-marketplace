// Orquestrador — UM só processo e UM só cliente IMPIC (com 2 clientes o servidor falha mais vezes):
//  1) listagem dos distritos subcobertos (o que falta; o resto vem da cache)
//  2) amostra estratificada (25/distrito) → "ENSAIO PRONTO" (relatorio.js já pode correr)
//  3) detalhes de TODAS as candidatas, por prioridade de distrito (PUB antes de PAR) → "DISTRITO CONCLUÍDO X"
//  4) nova passagem para os que ficaram à espera do Photon (retry)
// Não grava na BD — a inserção é feita à parte, distrito a distrito (inserir.js --gravar).
const { listar } = require('./listar');
const { main } = require('./processar');

const SUBCOBERTOS = ['Lisboa', 'Setúbal', 'Faro', 'Leiria', 'Santarém', 'Coimbra', 'Viseu', 'Aveiro', 'Évora', 'Beja', 'Portalegre',
  'Castelo Branco', 'Guarda', 'Vila Real', 'Bragança', 'Ilha da Madeira', 'Ilha de Porto Santo', 'Ilha de São Miguel',
  'Ilha Terceira', 'Ilha de Santa Maria', 'Ilha de São Jorge', 'Ilha do Pico', 'Ilha do Faial', 'Ilha das Flores',
  'Ilha Graciosa', 'Ilha do Corvo'];
const REGIOES = new Set(['Lisboa', 'Setúbal', 'Faro', 'Leiria', 'Santarém', 'Coimbra', 'Viseu', 'Aveiro', 'Évora', 'Beja', 'Portalegre',
  'Castelo Branco', 'Guarda', 'Vila Real', 'Bragança', 'Madeira', 'Açores']);

(async () => {
  await listar(SUBCOBERTOS);
  await main({ AMOSTRA: 25, SO: REGIOES });
  console.log('[correr] ENSAIO PRONTO');
  await main({ SO: REGIOES });
  console.log('[correr] PASSAGEM PRINCIPAL CONCLUÍDA');
  await main({ SO: REGIOES });                      // só os retry (Photon/DNS/IMPIC em baixo na 1.ª passagem)
  console.log('[correr] FIM');
})().catch(e => { console.error('[correr] ERRO FATAL', e); process.exit(1); });
