// Texto oficial legível nas páginas servidas pelo servidor (/c/, /s/, /e/) —
// a MESMA lógica do frontend (app.vNNN.js: _nomeLegivel / _moradaLegivel).
// Os dados do IMPIC chegam sem acentos ("Construcoes") e as moradas em
// MAIÚSCULAS; só na apresentação: acentos repostos num dicionário fechado de
// palavras que em português SÓ existem acentuadas (empresas de Portugal), e
// moradas em maiúsculas passam a escrita normal. Ao mudar o dicionário,
// mudar também no frontend.
const _PT_ACENTOS = (() => {
  const pares = 'construcoes:construções construcao:construção servicos:serviços instalacoes:instalações ' +
    'remodelacoes:remodelações remodelacao:remodelação reparacoes:reparações reparacao:reparação manutencao:manutenção ' +
    'climatizacao:climatização canalizacao:canalização canalizacoes:canalizações impermeabilizacao:impermeabilização ' +
    'impermeabilizacoes:impermeabilizações pavimentacao:pavimentação pavimentacoes:pavimentações decoracao:decoração ' +
    'decoracoes:decorações reabilitacao:reabilitação renovacao:renovação renovacoes:renovações edificacao:edificação ' +
    'edificacoes:edificações urbanizacao:urbanização urbanizacoes:urbanizações demolicoes:demolições solucoes:soluções ' +
    'solucao:solução gestao:gestão comercio:comércio industria:indústria industrias:indústrias tecnica:técnica ' +
    'tecnicas:técnicas tecnico:técnico tecnicos:técnicos eletrica:elétrica eletricas:elétricas electrica:eléctrica ' +
    'electricas:eléctricas hidraulica:hidráulica hidraulicas:hidráulicas ceramica:cerâmica ceramicas:cerâmicas ' +
    'metalurgica:metalúrgica metalurgicas:metalúrgicas metalurgico:metalúrgico metalurgicos:metalúrgicos metalomecanica:metalomecânica mecanica:mecânica imobiliaria:imobiliária ' +
    'imobiliarias:imobiliárias vidracaria:vidraçaria vidracarias:vidraçarias aluminio:alumínio aluminios:alumínios ' +
    'marmore:mármore marmores:mármores termica:térmica acustica:acústica energetica:energética automacao:automação ' +
    'iluminacao:iluminação seguranca:segurança administracao:administração promocao:promoção promocoes:promoções ' +
    'imoveis:imóveis predios:prédios armazens:armazéns producao:produção producoes:produções fabricacao:fabricação ' +
    'distribuicao:distribuição inovacao:inovação logistica:logística escavacoes:escavações perfuracoes:perfurações ' +
    'fundacoes:fundações metalica:metálica metalicas:metálicas metalico:metálico metalicos:metálicos betao:betão ' +
    'associacao:associação cooperacao:cooperação uniao:união regiao:região portugues:português iberica:ibérica ' +
    'lusitania:lusitânia irmaos:irmãos joao:joão sebastiao:sebastião simao:simão estevao:estevão conceicao:conceição ' +
    'assuncao:assunção goncalves:gonçalves simoes:simões magalhaes:magalhães guimaraes:guimarães leitao:leitão ' +
    'romao:romão galvao:galvão brandao:brandão falcao:falcão paixao:paixão antonio:antónio sao:são ' +
    'publicas:públicas publica:pública imobiliarios:imobiliários instalacao:instalação irmao:irmão mobiliario:mobiliário telecomunicacoes:telecomunicações comunicacoes:comunicações edificios:edifícios edificio:edifício assistencia:assistência renovaveis:renováveis sergio:sérgio conservacao:conservação refrigeracao:refrigeração eletricos:elétricos eletrico:elétrico electricos:eléctricos electrico:eléctrico ventilacao:ventilação climatizacoes:climatizações mario:mário mecanicas:mecânicas mecanico:mecânico moveis:móveis marcio:márcio energeticas:energéticas energeticos:energéticos abilio:abílio divisorias:divisórias fabrica:fábrica fabio:fábio termicas:térmicas termicos:térmicos transformacao:transformação domotica:domótica americo:américo aplicacao:aplicação recuperacao:recuperação eletronica:eletrónica electronica:electrónica julio:júlio prestacao:prestação manutencoes:manutenções mediacao:mediação informatica:informática colocacao:colocação dimensao:dimensão sinalizacao:sinalização adao:adão comercializacao:comercialização formacao:formação vitoria:vitória nivel:nível tecnologica:tecnológica tecnologicas:tecnológicas tecnologico:tecnológico tecnologicos:tecnológicos prestigio:prestígio iluminacoes:iluminações electrotecnica:electrotécnica eletrotecnica:eletrotécnica africa:áfrica metalomecanicas:metalomecânicas questao:questão importacao:importação exportacao:exportação exploracao:exploração representacao:representação representacoes:representações ilidio:ilídio patrimonio:património concepcao:concepção hilario:hilário eugenio:eugénio eugenia:eugénia silverio:silvério imperio:império dario:dário incendio:incêndio incendios:incêndios opcao:opção reconstrucao:reconstrução flavio:flávio visionario:visionário fiscalizacao:fiscalização gregorio:gregório ambrosio:ambrósio definicao:definição razao:razão favoravel:favorável jose:josé luis:luís goncalo:gonçalo lourenco:lourenço araujo:araújo agua:água aguas:águas certificacao:certificação avaliacao:avaliação coordenacao:coordenação execucao:execução protecao:proteção proteccao:protecção condominio:condomínio condominios:condomínios maquinas:máquinas veiculos:veículos grafica:gráfica graficas:gráficas quimica:química quimicos:químicos plasticos:plásticos eficiencia:eficiência restauracao:restauração familia:família acores:açores setubal:setúbal santarem:santarém evora:évora braganca:bragança portimao:portimão olhao:olhão loule:loulé famalicao:famalicão covilha:covilhã agueda:águeda alcobaca:alcobaça valenca:valença fundao:fundão';
  const m = new Map(pares.split(' ').map(p => p.split(':')));
  return { m, re: new RegExp('(?<![\\p{L}\\p{N}])(' + [...m.keys()].join('|') + ')(?![\\p{L}\\p{N}])', 'giu') };
})();
function _nomeLegivel(nome, pais) {
  const s = String(nome || '');
  if (!s || String(pais || 'pt').toLowerCase() !== 'pt') return s;
  return s.replace(_PT_ACENTOS.re, w => {
    const novo = _PT_ACENTOS.m.get(w.toLowerCase());
    if (!novo) return w;
    if (w === w.toUpperCase()) return novo.toUpperCase();
    if (w[0] === w[0].toUpperCase()) return novo[0].toUpperCase() + novo.slice(1);
    return novo;
  });
}
const _MORADA_MIN = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o', 'as', 'os', 'em', 'na', 'no', 'nas', 'nos', 'à', 'ao', 'aos', 'às', 'com']);
const _MORADA_SIGLA = new Set(['en', 'er', 'ic', 'ip', 'cp', 'ue', 'lda']);
function _moradaLegivel(morada) {
  const s = String(morada || '').trim();
  const letras = s.match(/\p{L}/gu) || [];
  if (letras.length < 4) return s;
  const maius = letras.filter(ch => ch !== ch.toLowerCase()).length;
  if (maius / letras.length < 0.7) return s;   // já vem em escrita normal
  let n = 0;
  const baixo = s.toLowerCase();
  return baixo.replace(/\p{L}[\p{L}\p{M}'’.\/]*/gu, (w, off) => {
    const primeira = n++ === 0;
    if (w.includes('/') || _MORADA_SIGLA.has(w) || /^[ivx]{2,4}$/.test(w) ||
        (w.length <= 3 && /\d/.test(baixo[off + w.length] || ''))) return w.toUpperCase();
    if (!primeira && _MORADA_MIN.has(w)) return w;
    return w[0].toUpperCase() + w.slice(1);
  });
}

module.exports = { nomeLegivel: _nomeLegivel, moradaLegivel: _moradaLegivel };
