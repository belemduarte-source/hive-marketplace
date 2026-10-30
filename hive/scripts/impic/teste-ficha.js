const { FIX_PUB, FIX_PAR } = require('./teste-fixtures');
const f = require('./ficha');
let falhas = 0;
const eq = (rot, a, b) => { const ok = JSON.stringify(a) === JSON.stringify(b); if (!ok) falhas++; console.log((ok ? 'ok  ' : 'FALHA ') + rot, ok ? '' : `→ ${JSON.stringify(a)} (esperado ${JSON.stringify(b)})`); };

// entidades / unipessoais
eq('ACE Construções (nome) passa', f.filtroEntidade('ACE CONSTRUCOES LDA', '510315917'), null);
eq('Metro - ACE excluído', f.filtroEntidade('METRO DO PORTO - ACE', '510315917'), 'entidade-nao-empresa');
eq('Gaiurb, EM excluída', f.filtroEntidade('GAIURB - URBANISMO E HABITACAO, EM', '510315917'), 'entidade-nao-empresa');
eq('Unipessoal excluída', f.filtroEntidade('TRACO & RASCUNHO UNIPESSOAL LDA', '510315917'), 'unipessoal');
eq('Unip excluída', f.filtroEntidade('WORK DA FORMIGA UNIP LDA', '510315917'), 'unipessoal');
// gralhas e abreviaturas reais do IMPIC
for (const n of ['ARRANJOEU - CONSTRUCAO CIVIL UNPESSOAL LDA', 'PONTIESFERA - COGRAGEM, UNIOPESSOAL LDA', 'UILES - UNIIPESSOAL LDA',
  'MAURICIO VAZ LAVRADOR SOC UNIPESSOL LDA', 'PINABRA IMPORTACAO EXPORTACAO E CONSTRUCAO UNIPESS LDA', 'FACHADA ECLETICA UNIPE LDA',
  'RENOCLIMA UNIPL LDA', 'J J PINTURAS UNIPLDA', 'INFRACORREIA CONSTRUCAO E IMOBILIARIO SOCIEDADE UNIPLDA', 'RECANTO MIMOSO UNP LDA',
  'SOFTHARDSERV INFORMATICA SERVICOS E FORMACAO UNILDA'])
  eq(`${n} excluída`, f.filtroEntidade(n, '510315917'), 'unipessoal');
for (const n of ['IRMAOS PESSOA CONSTRUCOES LDA', 'UNIHL VERTICAL LDA', 'UNIKONSTROI LDA', 'UNIPROLAR CONSTRUCOES LDA', 'UNIAO CONSTRUTORA LDA'])
  eq(`${n} passa`, f.filtroEntidade(n, '510315917'), null);
eq('ENI (NIF 1) excluído', f.filtroEntidade('FRANCISCO MANUEL LADEIRAS MAGRINHO', '123456789'), 'nao-pessoa-coletiva');
eq('NIF inválido', f.filtroEntidade('X LDA', '510315918'), 'nif-invalido');
eq('Lda normal passa', f.filtroEntidade('STRANGO & RAMOS - CONSTRUCOES LDA', '510315917'), null);
eq('Município excluído', f.filtroEntidade('MUNICIPIO DE LOURES', '510315917'), 'entidade-nao-empresa');
eq('Huawei fora de âmbito', f.filtroEntidade('HUAWEI TECH.PORTUGAL TECNOLOGIAS DE INFORMAÇÃO LDA', '510315917'), 'fora-de-ambito');
eq('EDP Comercial fora', f.filtroEntidade('EDP COMERCIAL-COMERCIALIZACAO DE ENERGIA, S.A.', '510315917'), 'fora-de-ambito');
eq('Resíduos fora', f.filtroEntidade('BGR GESTAO DE RESIDUOS LDA', '510315917'), 'fora-de-ambito');
eq('Francisco ≠ Cisco', f.filtroEntidade('FRANCISCO SILVA & FILHOS LDA', '510315917'), null);
eq('Romeo ≠ MEO', f.filtroEntidade('ROMEO CONSTRUCOES LDA', '510315917'), null);
eq('Instalações e comunicações passa', f.filtroEntidade('LUZOESTE - INSTALACOES ELECTRICAS E COMUNICACOES LDA', '510315917'), null);
eq('Imobiliária construtora passa', f.filtroEntidade('IMOVIL - IMOBILIARIA CONSTRUTORA LDA', '510315917'), null);
eq('Promoção imobiliária fora', f.filtroEntidade('CULTIVARTS - PROMOCAO IMOBILIARIA LDA', '510315917'), 'imobiliaria-sem-obra');
eq('Construções e investimentos imobiliários passa', f.filtroEntidade('SILVA & SILVA - CONSTRUCOES E INVESTIMENTOS IMOBILIARIOS LDA', '510315917'), null);
eq('Gestão hoteleira fora', f.filtroEntidade('LUCRIVAGEST - GESTAO E EXPLORACAO HOTELEIRA E IMOBILIARIA, S. A.', '510315917'), 'fora-de-ambito');
const g = require('./geo-pt');
eq('Concelhos do IMPIC com região', ['Lagoa (Algarve)', 'Lagoa (São Miguel)', 'Calheta (Madeira)', 'Calheta (São Jorge)', 'Lagoa'].map(g.distritoDe), ['Faro', 'Açores', 'Madeira', 'Açores', 'Faro']);

// setor pelo nome
eq('Jardim apelido ≠ jardineiro', f.setorDoNome('CONSTRUCOES JARDIM LDA'), null);
eq('Rio Frio ≠ AVAC', f.setorDoNome('RIO FRIO OBRAS LDA'), null);
eq('Serralharia', f.setorDoNome('METALRIO - SERRALHARIA CIVIL, LDA'), 'serralharia');
eq('Elétrica', f.setorDoNome('JMS INSTALACOES ELECTRICAS LDA'), 'eletricistas');
eq('Fotovoltaico', f.setorDoNome('SOL NASCENTE FOTOVOLTAICO LDA'), 'energias_renovaveis');

// capitalização (igual às fichas IMPIC existentes)
eq('cap 1', f.capitalizar('JOSE JOAQUIM CORNACHO & FILHOS, LDA'), 'Jose Joaquim Cornacho & Filhos, LDA');
eq('cap 2', f.capitalizar('CVF-CONSTRUTORA DE VILA FRANCA, LIMITADA'), 'Cvf-Construtora de Vila Franca, Limitada');
eq('cap S A', f.capitalizar('RODIO PORTUGAL S A'), 'Rodio Portugal SA');
eq('cap 3', f.capitalizar('TEIXEIRA DUARTE - ENGENHARIA E CONSTRUCOES, S.A'), 'Teixeira Duarte - Engenharia e Construcoes, S.A');
eq('cap 4', f.capitalizar('A.S.CORREIA LDA'), 'A.S.Correia LDA');
console.log('   ', f.capitalizar('S.E.T.H. - SOCIEDADE DE EMPREITADAS E TRABALHOS HIDRAULICOS, S.A.'), '|', f.capitalizar('RODIO PORTUGAL S A'), '|', f.capitalizar('JMS INSTALACOES ELECTRICAS LDA'));

// NIF / contactos
eq('nif ok', [f.nifValido('500257760'), f.nifValido('510315917'), f.nifValido('500307997')], [true, true, true]);
eq('nif mau', [f.nifValido('510315918'), f.nifValido('12345')], [false, false]);
eq('tel', [f.limparTelefone('917287442'), f.limparTelefone('+351 21 444 55 66 / 912345678'), f.limparTelefone('-'), f.limparTelefone('000000000'), f.limparTelefone('999999999')], ['917287442', '214445566', '', '', '']);
eq('email', [f.limparEmail(' Geral@Empresa.PT '), f.limparEmail('-'), f.limparEmail('a@b.pt; c@d.pt')], ['geral@empresa.pt', '', 'a@b.pt']);
eq('email próprio', [f.emailProprio('geral@empresa.pt'), f.emailProprio('x@gmail.com'), f.emailProprio('x@sapo.pt')], [true, false, false]);

// detalhe real (PUB 623, PAR 80025) + classificação
const dPub = f.parseDetalhe(FIX_PUB);
const dPar = f.parseDetalhe(FIX_PAR);
console.log('PUB 623:', JSON.stringify({ ...dPub, habs: dPub.habs.length }), '\n  habs[0..2]:', JSON.stringify(dPub.habs.slice(0, 3)));
console.log('  classif:', JSON.stringify(f.classificar(dPub, dPub.nome)), '| cat:', f.categoriaPrincipal(dPub));
console.log('PAR 80025:', JSON.stringify(dPar));
console.log('  classif:', JSON.stringify(f.classificar(dPar, dPar.nome)));
eq('PAR campos', [dPar.alvara, dPar.classe, dPar.nif, dPar.concelho, dPar.distrito, dPar.telefone, dPar.email, dPar.morada.length], ['80999 - PAR', 2, '510315917', 'Loures', 'Lisboa', '210000000', 'geral@exemplo.pt', 3]);
// especialista só 4ª categoria
const so4 = { habs: [{ cat: '4ª Categoria - Instalações elétricas e mecânicas', sub: '1.ª - Instalações eléctricas de utilização de baixa tensão', classe: 2 }, { cat: '4ª', sub: '10.ª - Aquecimento, ventilação, ar condicionado e refrigeração', classe: 1 }] };
eq('só 4ª → eletricistas + AVAC', f.classificar(so4, 'XPTO LDA'), { primario: 'eletricistas', setores: ['eletricistas', 'climatizacao_avac'] });
const elev = { habs: [{ cat: '4ª', sub: '9.ª - Ascensores, escadas mecânicas e tapetes rolantes', classe: 3 }] };
eq('só elevadores → fora', f.classificar(elev, 'ELEVADORES XPTO LDA').primario, null);
console.log(falhas ? `\n${falhas} FALHA(S)` : '\nTUDO OK');
