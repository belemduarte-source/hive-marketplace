# Importação IMPIC (empresas de construção licenciadas em Portugal)

Pipeline para acrescentar à Hivex empresas **fiáveis** do registo público do IMPIC
(alvarás de obras públicas `PUB` e certificados de obras particulares `PAR`), com a
barra de confiança do catálogo. Tudo corre como **um só processo node** por fase
(nada de loops bash: no Windows ficam processos fantasma) e é resumível pelas caches.

Dados (caches, registos, contactos) ficam FORA do repositório, em `IMPIC_DADOS`
(por omissão `%TEMP%/hivex-impic`). Nunca fazer commit desses ficheiros.

## Regras aplicadas (decisões do dono)

- Só pessoas coletivas (NIF começado por 5). Fora: unipessoais (também as gralhas e abreviaturas do
  IMPIC: Unpessoal, Uniopessoal, Unipe, Unipl, Uniplda, Unp Lda, Unilda…), empresários em nome
  individual (o IMPIC esconde-lhes o NIF), municípios, associações, ACE, EM, insolventes,
  telecom/energia/resíduos/limpeza/hotelaria e promotoras/gestoras imobiliárias sem
  nenhuma palavra de obra no nome ("Imobiliária Construtora" entra; "Promoção Imobiliária" não).
- Barra de confiança: alvará + pelo menos um contacto oficial (email ou telefone) =
  ≥ 2 canais. Email de domínio próprio só conta se o domínio existir (DNS).
- Contacto partilhado por ≥ 3 candidatas (contabilista, grupo) não conta como canal.
- Deduplicação contra a BD em **qualquer estado** (uma ficha removida não volta):
  NIF, alvará (nº + tipo), email, telefone, domínio do site, nome igual no mesmo
  concelho e nome igual a ≤ 1,5 km de uma ficha sem NIF.
- Só `INSERT` de fichas novas. Nunca se altera uma ficha existente.
- Posição pela MORADA no momento da importação (GeoAPI.pt CP7 → porta/rua INE;
  Photon com âncora; centróide do CP7 só se compacto). Nunca centróide do concelho,
  nunca jitter. Ponto ocupado (outra empresa a < 5 m — não basta comparar coordenadas arredondadas:
  o INE tem vários pontos quase iguais no mesmo prédio) → porta INE livre mais próxima da mesma rua; sem nenhuma
  livre a ficha não entra nessa vaga (fica em `processadas.jsonl` para uma passagem futura).
- Setor pelas habilitações (PUB) e por palavras inequívocas do nome; só elevadores /
  ar comprimido / ETAR (sem setor no site) ficam de fora.

## Ordem

```bash
node antes.js            # fotografia ANTES por distrito (não se sobrepõe)
node dump-bd.js          # índice de deduplicação (só leitura)
IMPIC_GAP_MS=1500 PROC_PARALELO=3 node correr.js   # listagem → amostra 25/distrito ("ENSAIO PRONTO") → todos os detalhes
node relatorio.js        # ensaio: funil por distrito e estimativa
node amostra.js 34 11 --estratificada --saida amostra-distritos.json   # verificação (rua/concelho no pino vs morada, GeoAPI /gps)
node sites.js            # site a partir do email de domínio próprio
node inserir.js --distritos "Lisboa"            # ensaio (nada gravado)
node inserir.js --distritos "Lisboa" --gravar   # grava + inseridas.jsonl
node esperar-novas.js correr.log 1000 20      # com o processamento a correr: espera por ~1000 aprovadas novas
                                              # (ou fim/paragem) → nova vaga: sites.js + inserir.js --gravar + verificar.js
node verificar.js        # contagens depois, barra, empilhamento, API
node pares-perto.js 5    # pares de fichas novas a < 5 m de outra empresa (deve dar 0)
node corrigir-empilhadas.js [--gravar]   # se der > 0: a mais nova vai para a porta livre ou é retirada (corrigidas.jsonl)
node reaplicar-filtros.js [--gravar]     # depois de apertar um filtro de ficha.js: retira as já inseridas que agora falham
node relatorio-final.js  # relatório em Markdown (contagens antes/depois, funil, inseridas, amostras)
```

IMPIC: **um só cliente** (com dois em paralelo o servidor devolve mais erros 500 "TMG 1359");
~1,5 s entre pedidos; as falhas vêm em janelas (repetir após 10 s, depois 30/60 s).
`PROC_PARALELO` processa vários registos ao mesmo tempo, mas os pedidos ao IMPIC continuam
numa fila única (um de cada vez); quando o IMPIC responde é ele o limite (~1 detalhe/1,5 s),
o resto do tempo perde-se nas janelas de erro — na prática ~15 registos/min.
O Photon público pode cair (aconteceu a 29/10/2026): o geocodificador tem disjuntor (10 min
parado, depois uma sonda de 6 s) e os registos que dependiam dele ficam com `retry` para a
passagem seguinte (`--refazer-geo`).

Ligação à BD pelo driver HTTP do Neon (`.env.diag` na raiz do workspace; a porta
5432 está bloqueada nesta rede). Reverter uma vaga: os ids estão em `inseridas.jsonl`
(`UPDATE companies SET status='removed', removed_at=NOW() WHERE id = ANY(...)`).
