// Hivex app bundle — extracted from index.html (served immutable; bump-assets.js versions it)
// ── TRANSLATIONS ───────────────────────────────────────────────────────────────
const translations = {
  pt: {
    // ── UI coverage additions (view toggle, modals, detail, register, account) ──
    viewMap:"Mapa", viewList:"Lista", resultCompany:"empresa", resultCompanies:"empresas",
    profileTitle:"O Meu Perfil",
    contactTitle:"Enviar Mensagem", contactSub:"A sua mensagem será entregue directamente à empresa",
    contactMsgLabel:"Mensagem", contactMsgPh:"Olá! Gostaria de solicitar informações sobre os vossos serviços...",
    contactPrivacy:"O email da empresa nunca é partilhado consigo — a Hivex entrega a mensagem de forma segura.",
    adminTitle:"Painel de Administração", adminTabStats:"Estatísticas", adminTabPending:"Pendentes", adminTabAll:"Todas", adminTabReports:"Reportes",
    loadingGeneric:"A carregar...",
    statusTitle:"Estado do Registo", statusPrompt:"Introduza o email com que registou a sua empresa para verificar o estado.", statusVerify:"Verificar",
    dpDragClose:"puxe para fechar", dpCloseTitle:"Fechar", dpCallTitle:"Ligar", dpShareTitle:"Partilhar",
    dpDirectionsTitle:"Como chegar", routeLocating:"A obter a sua localização…", routeNoLocation:"Não foi possível obter a sua localização.", routeError:"Não foi possível calcular a rota.", dpMoreInfo:"Mais informação",
    loginGateTitle:"Inicie sessão para ver os contactos", loginGateDesc:"Crie uma conta gratuita para aceder aos contactos, morada, avaliações e pedir orçamentos.", loginGateBtn:"Entrar / Criar Conta Grátis",
    reviewsHeading:"Avaliações", reviewFormTitle:"✍️ A sua avaliação", reviewPh:"Partilhe a sua experiência com esta empresa...", reviewSubmit:"Publicar Avaliação", reviewWrite:"+ Escrever Avaliação",
    closeBtn:"Fechar",
    regNifHint:"9 dígitos. Validamos o formato e o dígito de controlo.", regSectorPlaceholder:"Selecionar áreas de atividade...", regSectorMultiHint:"Pode selecionar várias áreas de atividade.",
    optionalTag:"(opcional)", regAlvaraHint:"Número de alvará de construção, se aplicável.", regCountryPh:"Selecione um país",
    countryPT:"Portugal", countryES:"Espanha", countryFR:"França", countryIT:"Itália", countryDE:"Alemanha", countryUK:"Reino Unido", countryNL:"Países Baixos", countryBE:"Bélgica", countryCH:"Suíça", countryAT:"Áustria", countryOther:"Outro país",
    regAddressHint:"Incluir rua, número, apartamento e complementos para localização precisa no mapa.", regFoundedPh:"Ex: 2010", regHoursPh:"Ex: Seg-Sex 09h-18h, Sáb 09h-13h", regPortfolioPh:"URLs separados por vírgula (até 12)",
    geoTitle:"Localização Bloqueada", geoIntro:"O browser bloqueou o acesso à localização. Siga os passos abaixo para ativar.", geoRetry:"Tentar novamente", geoSkip:"Continuar sem localização",
    forgotBackLogin:"Voltar a iniciar sessão", resetNewPwdLabel:"Nova palavra-passe", min8Chars:"Mínimo 8 caracteres.",
    changePwdTitle:"Alterar palavra-passe", changePwdBody:"Introduza a sua palavra-passe atual e depois a nova (mínimo 8 caracteres).", changePwdCurrent:"Palavra-passe atual", changePwdNew:"Nova palavra-passe", changePwdSubmit:"Alterar palavra-passe",
    delAccTitle:"Eliminar conta", delAccWarn:"Esta ação é <strong>permanente</strong>. As suas avaliações e favoritos serão removidos. As empresas que registou permanecem na plataforma, mas sem dono associado.", delAccConfirmPwd:"Confirme a palavra-passe", delAccSubmit:"Eliminar definitivamente",
    compareOfThree:"de 3 selecionadas",
    // ── JS-string coverage (toasts, dynamic labels) ──
    contactSendTo:"Enviar mensagem para", sendingBtn:"A enviar...",
    toastSelectMin2:"Selecione pelo menos 2 empresas para comparar.", toastMapUnavailable:"⚠️ Mapa indisponível — verifique a sua ligação", toastPlaceNotFound:"Local não encontrado. Tente outro nome.", toastLocationDetected:"Localização detetada!",
    toastEnterEmail:"Indique o seu email", toastEnterEmail2:"Introduza um email", toastPwdReset:"Palavra-passe redefinida! Pode iniciar sessão.", toastLoginToRegister:"Inicie sessão para registar a sua empresa.", toastPwdChanged:"Palavra-passe alterada.", toastAccountDeleted:"Conta eliminada.",
    toastSelectRating:"Selecione uma classificação (1-5 estrelas)", toastReviewPublished:"Avaliação publicada!", toastWriteReply:"Escreva uma resposta", toastReplyPublished:"Resposta publicada", toastMsgTooShort:"Mensagem demasiado curta", toastMsgSent:"Mensagem enviada com sucesso!",
    toastReportUpdated:"Reporte atualizado", toastCompanyApproved:"Empresa aprovada", toastCompanyRejected:"Empresa rejeitada", toastCompanyRemoved:"🗑️ Empresa removida", toastLoadingStats:"A carregar estatísticas...", toastStatsError:"Erro ao carregar estatísticas",
    compareMaxPrefix:"Pode comparar até", compareMaxSuffix:"empresas. Remova uma para adicionar outra.", showingPrefix:"A mostrar", showingMid:"empresas em",
    // ── profile / geo-help / admin coverage ──
    profileMyCompanies:"As Minhas Empresas", profileAdd:"Adicionar", profileEditTitle:"Editar empresa", profileNoCompanyMsg:"Registe a sua empresa para aparecer no mapa e receber orçamentos.", profileAccount:"Conta",
    geoIOSLabel:"iPhone / iPad (Safari)", geoIOS1:"Abra as <strong>Definições</strong> do iPhone", geoIOS2:"Toque em <strong>Privacidade e Segurança</strong>", geoIOS3:"Toque em <strong>Serviços de Localização</strong> e certifique-se que está <strong>ativado</strong>", geoIOS4:"Encontre <strong>Safari</strong> na lista e selecione <strong>Ao Usar a App</strong>", geoIOS5:"Volte ao browser e toque no botão 📍", geoIOSAlt:"Em alternativa: toque no botão <strong>aA</strong> na barra de endereço do Safari → <strong>Definições do Site</strong> → <strong>Localização → Permitir</strong>",
    geoAndroidLabel:"Android (Chrome)", geoAndroid1:"Toque no <strong>cadeado 🔒</strong> na barra de endereço", geoAndroid2:"Toque em <strong>Permissões</strong>", geoAndroid3:"Em <strong>Localização</strong>, selecione <strong>Permitir</strong>", geoAndroid4:"Recarregue a página e toque em 📍", geoAndroidAlt:"Se não aparecer o cadeado: Definições do Chrome → Definições do Site → Localização → permitir este site.",
    geoBrowserLabel:"Browser", geoGeneric1:"Clique no <strong>cadeado 🔒</strong> na barra de endereço", geoGeneric2:"Encontre <strong>Localização</strong> e defina como <strong>Permitir</strong>", geoGeneric3:"Recarregue a página",
    admPendingPlain:"Pendentes", admReviewed:"Revistos", admDismissed:"Descartados", admAll:"Todos", admNoReports:"Nenhum reporte.", admReasonFake:"Empresa falsa", admReasonInappropriate:"Conteúdo impróprio", admReasonDuplicate:"Duplicada", admReasonWrongInfo:"Informação incorreta", admReasonSpam:"Spam", admReasonOther:"Outro", admReportedBy:"Reportado por", admViewCompany:"Ver empresa", admMarkReviewed:"Marcar como revisto", admDismiss:"Descartar", admError:"Erro", admErrorLoading:"Erro ao carregar", admAnonymous:"anónimo",
    admStatApproved:"Aprovadas", admStatRejected:"Rejeitadas", admStatUsers:"Utilizadores", admStatReviews:"Avaliações", admStatEvents7d:"Eventos (7d)", admStatNew7d:"Novas (7d)", admStatTotal:"Total Empresas", admViewPendingA:"Ver", admViewPendingB:"empresa(s) pendente(s) →", admSearchPh:"Pesquisar por nome ou email...", admStatusRemoved:"Removidas", admNoCompanies:"Nenhuma empresa encontrada.", admNoAccount:"sem conta", admRestore:"Restaurar", admApprove:"Aprovar", admRemove:"Remover", admUnfeatureTitle:"Remover destaque", admFeatureTitle:"Destacar", admUnfeatureBtn:"Remover", admFeatureBtn:"☆ Destacar", admFeatured:"Empresa destacada", admUnfeatured:"Destaque removido", adminPanelTitle:"Painel Admin",
    navHome:'Início', navSearch:'Mapa', navAbout:'Sobre', navRegister:'Registar Empresa',
    recentlyViewed:'Vistas recentemente', recentRemove:'Remover', recentClear:'Limpar',
    searchUpdated:'Pesquisa atualizada!',
    importOSM:'Importar Empresas OSM',
    filterTitle:'Filtros', clearAll:'Limpar Tudo', companiesFound:'empresas encontradas',
    sortBy:'Ordenar Por', sortRating:'Melhor Avaliação', sortReviews:'Mais Avaliados', sortName:'Nome A–Z',
    sectorArea:'Área de Atividade', minRating:'Avaliação Mínima',
    ratingAny:'Qualquer avaliação', ratingOrMore:'ou mais',
    searchRadius:'Raio de Pesquisa', featured:'Destaque', ignoreRadius:'Não Usar Raio de Pesquisa', nearbyTitle:'Empresas Próximas', contactYourName:'O seu nome', contactYourEmail:'O seu email (para a empresa responder)', contactNameReq:'Indique o seu nome', contactEmailReq:'Indique um email válido', retryBtn:'Tentar novamente', dpStreetTitle:'Vista de Rua (Street View)', svOpenExternal:'Abrir no Google Maps ↗', svFallback:'Se a vista não carregar, ', svFallbackLink:'abra no Google Maps', claimLink:'🏷 É a sua empresa? Reclame esta ficha', claimTitle:'Reclamar ficha da empresa', claimIntro:'Para provar que gere esta empresa, enviamos um código de 6 dígitos para o email público da ficha. Com a ficha reclamada pode editar os dados, responder a avaliações e ver estatísticas.', claimSendBtn:'Enviar código para o email da ficha', claimSentTo:'Código enviado para', claimVerifyBtn:'Confirmar código', claimSuccess:'Ficha reclamada! Já pode editar os dados e ver as mensagens.', claimNeedLogin:'Inicie sessão para reclamar a ficha', claimCodeInvalid:'Introduza o código de 6 dígitos', rfqCta:'Pedir Orçamentos Grátis', rfqTitle:'Pedir orçamentos', rfqIntro:'Descreva o trabalho — enviamos o pedido às empresas certas da sua zona e as propostas chegam diretamente ao seu email.', rfqSector:'Área de atividade', rfqDesc:'Descrição do trabalho', rfqDescPh:'Ex.: Remodelação completa de casa de banho (~4 m²): substituição de loiças, azulejos e canalização.', rfqCity:'Localidade', rfqTimeline:'Prazo desejado', rfqBudget:'Orçamento indicativo', rfqPhone:'Telefone (opcional)', rfqEmail:'O seu email', rfqSend:'Enviar pedido às empresas', rfqSentA:'Pedido enviado a', rfqSentB:'empresas! As propostas chegarão ao seu email.', rfqDescShort:'Descreva o trabalho com mais detalhe (mínimo 20 caracteres)', rfqCityReq:'Indique a localidade', tlFlex:'Flexível', tlUrgent:'Urgente', tl1m:'No próximo mês', tl3m:'Nos próximos 3 meses', budNS:'Ainda não sei', inboxBtn:'Mensagens de clientes', inboxTitle:'Mensagens de clientes', inboxEmpty:'Ainda não há mensagens.', inboxReplyPh:'Escreva a sua resposta…', inboxReplySend:'Responder', inboxReplySent:'Resposta enviada ao cliente', inboxYou:'Você', featureBtn:'Pedir destaque', featureSent:'Pedido de destaque enviado ao administrador',
    topRated:'Top Rated', verified:'Verificado', newEntry:'Novo Registo',
    specialties:'Especialidades',
    mapLive:'Mapa em tempo real', mapCity:'Lisboa, Portugal',
    emptyTitle:'Nenhuma empresa registada',
    emptyMsg:'O mapa está vazio. Registe a primeira empresa para que apareça aqui como marcador.',
    emptyBtn:'Registar Empresa',
    detailLocation:'Localização',
    detailContact:'Canais de Contacto',
    waName:'WhatsApp Direct', waDesc:'Mensagem pré-preenchida com contexto',
    chatChannelName:'WhatsApp / Mensagem', chatChannelDesc:'Contacto directo via WhatsApp ou SMS',
    emailChannelName:'E-mail Gateway', emailChannelDesc:'Pedido formal direto ao fornecedor',
    detailSpecialties:'Especialidades', detailReviews:'Avaliações Verificadas',
    detailCredentials:'Credenciais & Áreas de Atividade',
    detailActivities:'Áreas de Atividade', detailAlvara:'Alvará', detailCertidao:'Certidão Permanente',
    detailNoActivities:'Sem áreas de atividade indicadas',
    credRequired:'Obrigatória', credOptional:'Opcional',
    credLoginToView:'Inicie sessão para ver',
    alvaraNotApplicable:'Não aplicável', certidaoPending:'Em verificação',
    popupCertOk:'Certidão registada', popupAlvaraOk:'Alvará',
    noRatings:'Sem avaliações', reviews:'reviews',
    review1:'"Excelente parceiro, entregou dentro do prazo e com qualidade acima do esperado."',
    review2:'"Boa comunicação e preços competitivos. Recomendado para projetos de médio prazo."',
    sectors:{
      pedreiros:'Pedreiros / Trolhas', escavacao:'Escavação & Terraplanagem', betao_cimento:'Betão & Cimento',
      estruturas_metalicas:'Estruturas Metálicas', demolicao:'Demolição', alvenaria:'Alvenaria',
      cofragem:'Cofragem & Armação', impermeabilizacao:'Impermeabilização',
      eletricistas:'Eletricistas', picheleiros:'Picheleiros / Canalizadores',
      canalizacao_saneamento:'Canalização & Saneamento', climatizacao_avac:'Climatização / AVAC',
      gas:'Instalações de Gás', domotica_automacao:'Domótica & Automação',
      energias_renovaveis:'Energias Renováveis / Solar', seguranca_alarmes:'Segurança & Alarmes',
      pocos_agua:'Poços de Água / Furos',
      pintores:'Pintores', estucadores:'Estucadores', pavimentos:'Pavimentos & Revestimentos',
      azulejos:'Azulejos & Cerâmica', marmoraria:'Marmoraria & Pedra',
      isolamento:'Isolamento Térmico & Acústico', gesso_cartonado:'Gesso Cartonado / Pladur',
      carpinteiros:'Carpinteiros', serralharia:'Serralharia', aluminios_pvc:'Alumínios & PVC',
      caixilharia:'Caixilharia', vidraceiros:'Vidraceiros', portoes_vedacoes:'Portões & Vedações',
      moveis_medida:'Móveis por Medida',
      telhados_coberturas:'Telhados & Coberturas', piscinas:'Piscinas',
      paisagismo_jardins:'Paisagismo & Jardins', jardineiros:'Jardineiros', vedacoes_muros:'Vedações & Muros',
      calcetamento:'Calçada & Pavimento Exterior', fachadas:'Fachadas & Reabilitação',
      arquitetura_projetos:'Arquitetura & Projetos', engenharia_civil:'Engenharia Civil',
      topografia:'Topografia', gestao_obra:'Gestão de Obra',
      certificacao_energetica:'Certificação Energética', seguranca_trabalho:'Segurança no Trabalho',
      design_interiores:'Design de Interiores', materiais_construcao:'Materiais de Construção',
      equipamentos_construcao:'Equipamentos de Construção'
    },
    sectorOptions:{
      pedreiros:'Pedreiros / Trolhas', escavacao:'Escavação & Terraplanagem', betao_cimento:'Betão & Cimento',
      estruturas_metalicas:'Estruturas Metálicas', demolicao:'Demolição', alvenaria:'Alvenaria',
      cofragem:'Cofragem & Armação', impermeabilizacao:'Impermeabilização',
      eletricistas:'Eletricistas', picheleiros:'Picheleiros / Canalizadores',
      canalizacao_saneamento:'Canalização & Saneamento', climatizacao_avac:'Climatização / AVAC',
      gas:'Instalações de Gás', domotica_automacao:'Domótica & Automação',
      energias_renovaveis:'Energias Renováveis / Solar', seguranca_alarmes:'Segurança & Alarmes',
      pocos_agua:'Poços de Água / Furos',
      pintores:'Pintores', estucadores:'Estucadores', pavimentos:'Pavimentos & Revestimentos',
      azulejos:'Azulejos & Cerâmica', marmoraria:'Marmoraria & Pedra',
      isolamento:'Isolamento Térmico & Acústico', gesso_cartonado:'Gesso Cartonado / Pladur',
      carpinteiros:'Carpinteiros', serralharia:'Serralharia', aluminios_pvc:'Alumínios & PVC',
      caixilharia:'Caixilharia', vidraceiros:'Vidraceiros', portoes_vedacoes:'Portões & Vedações',
      moveis_medida:'Móveis por Medida',
      telhados_coberturas:'Telhados & Coberturas', piscinas:'Piscinas',
      paisagismo_jardins:'Paisagismo & Jardins', jardineiros:'Jardineiros', vedacoes_muros:'Vedações & Muros',
      calcetamento:'Calçada & Pavimento Exterior', fachadas:'Fachadas & Reabilitação',
      arquitetura_projetos:'Arquitetura & Projetos', engenharia_civil:'Engenharia Civil',
      topografia:'Topografia', gestao_obra:'Gestão de Obra',
      certificacao_energetica:'Certificação Energética', seguranca_trabalho:'Segurança no Trabalho',
      design_interiores:'Design de Interiores', materiais_construcao:'Materiais de Construção',
      equipamentos_construcao:'Equipamentos de Construção',
      chave_na_mao_construcao:'Construção Chave na Mão', chave_na_mao_remodelacao:'Remodelação Chave na Mão',
      chave_na_mao_moradia:'Moradias Chave na Mão', chave_na_mao_apartamento:'Apartamentos Chave na Mão',
      chave_na_mao_comercial:'Espaços Comerciais Chave na Mão'
    },
    sectorGroups:{
      estrutura_fundacao:'Estrutura', instalacoes:'Instalações', acabamentos:'Acabamentos',
      carpintaria:'Carpintaria', serralharia_metal:'Serralharia', exterior_jardim:'Exterior', projeto_gestao:'Projeto', chave_na_mao:'Chave na Mão',
      obra_grossa:'Obra Grossa', redes_tecnicas:'Redes Técnicas', revestimentos:'Revestimentos & Pintura',
      madeira:'Madeira & Mobiliário', metal_vidro:'Metal, Vidro & Caixilharia', exteriores:'Exteriores & Jardim', projetos:'Projetos & Consultoria'
    },
    regTitle:'Registar Nova Empresa',
    regSub:'Preencha os dados para adicionar a sua empresa à plataforma Hivex. Campos com',
    regSubSuffix:'são obrigatórios.',
    regCompanyName:'Nome da Empresa', regNamePh:'Ex: Mota-Engil, SA',
    regSectorLabel:'Setor de Atividade', regSectorPh:'Selecionar setor...',
    regCae:'Código CAE', regCaePh:'Ex: CAE 41 – Construção',
    regAlvara:'Alvará', regAlvaraPh:'Nº do Alvará de Licenciamento',
    valAlvara:'Introduza o número do Alvará',
    regCertidao:'Código da Certidão Permanente', regCertidaoPh:'Ex: 1234-5678-9012',
    regCertidaoHint:'Código de acesso à certidão permanente do registo comercial (12 dígitos, formato XXXX-XXXX-XXXX).',
    valCertidao:'Introduza o código da certidão permanente.',
    valCertidaoFormat:'Código da certidão permanente inválido (mínimo 8 caracteres alfanuméricos).',
    regAddress:'Morada', regAddressPh:'Ex: Av. da Liberdade 200, Lisboa',
    regZone:'Localidade / Zona',
    regEmail:'Email de Contacto', regEmailPh:'empresa@email.pt',
    regPhone:'Telefone / WhatsApp',
    regWebsite:'Website', regWebsitePh:'https://www.empresa.pt',
    regLogo:'Logótipo da empresa', regLogoPick:'Escolher imagem…', regLogoRemove:'Remover', regLogoEmpty:'Sem imagem', regLogoHint:'JPG ou PNG — é redimensionada e comprimida. Passa a aparecer como logótipo da empresa.', regLogoInvalid:'Ficheiro de imagem inválido.',
    regSpecialties:'Especialidades', regTagsPh:'Ex: Construção Civil, Obras Públicas, Internacional',
    regTagsHint:'Separe as especialidades por vírgulas.',
    regDescription:'Descrição Breve', regDescPh:'Breve descrição da empresa, serviços prestados e diferenciais...',
    regCancel:'Cancelar', regSubmit:'Registar Empresa',
    zones:{
      lisbon_center:'Lisboa Centro', lisbon_north:'Lisboa Norte',
      lisbon_east:'Lisboa Leste / Parque das Nações', lisbon_west:'Lisboa Oeste / Belém',
      oeiras:'Oeiras', sintra:'Sintra', cascais:'Cascais',
      setubal:'Setúbal', porto:'Porto', braga:'Braga'
    },
    emailTitle:'Pedido de Orçamento',
    emailSub:'Enviado diretamente para o fornecedor via e-mail verificado.',
    emailSubject:'Assunto', emailSubjectVal:'Pedido de Orçamento – Hivex Marketplace',
    emailType:'Tipo de Pedido',
    emailTypes:['Pedido de Orçamento','Pedido de Informação','Proposta de Parceria'],
    emailMessage:'Mensagem',
    emailMessageVal:'Bom dia,\n\nEncontrei a vossa empresa na plataforma Hivex e gostaria de solicitar um orçamento para...',
    emailAttach:'Anexar ficheiro (opcional)', emailCancel:'Cancelar', emailSend:'Enviar Pedido',
    chatOnline:'● Online agora', chatPlaceholder:'Escrever mensagem...',
    chatMsg1:'Olá! Vi o vosso perfil na Hivex. Podem enviar-me uma proposta?',
    chatMsg2:'Bom dia! Com todo o gosto. Pode partilhar as especificações técnicas?',
    chatMsg3:'Perfeito, aqui ficam os detalhes do projeto.',
    toastFiltersCleared:'Todos os filtros foram limpos!',
    toastWhatsapp:'A abrir WhatsApp...', toastEmailSent:'Pedido de orçamento enviado com sucesso!',
    toastAutoReply:'Obrigado pela mensagem! Iremos responder em breve.',
    valName:'Por favor insira o nome da empresa.',
    valSector:'Por favor selecione o setor de atividade.',
    valAddress:'Por favor insira a morada.',
    valEmail:'Por favor insira o email de contacto.',
    valTags:'Por favor insira pelo menos uma especialidade.',
    toastRegistered: name => `"${name}" registada com sucesso! Visível no mapa.`,
    popupNoRatings:'Sem avaliações ainda', popupNewBadge:'Novo Registo',
    openNow:'Aberto', closedNow:'Fechado', newOnHivex:'Novo na Hivex',
    btnSearch:'Pesquisar',
    heroLabel:'Marketplace B2B & B2C',
    heroTitleMain:'Ligue-se. Colabore. ', heroTitleAccent:'Cresça.',
    heroSub:'A Hivex une empresas e particulares aos melhores fornecedores de serviços — de forma rápida, transparente e com total controlo.',
    heroBtnSearch:'Explorar Empresas', heroBtnRegister:'Registar a minha Empresa',
    whatLabel:'O que é a Hivex', whatTitle:'Uma plataforma para todos',
    whatSub:'A Hivex foi criada para simplificar a forma como clientes e fornecedores se encontram. Seja uma empresa à procura de parceiros estratégicos, seja um particular que precisa de um serviço rápido — a Hivex liga-os a especialistas de confiança, com avaliações verificadas e contacto direto.',
    uc1Title:'Empresa para Empresa (B2B)', uc1Desc:'Empresas que procuram fornecedores, subcontratados ou parceiros estratégicos. Ideal para projetos de maior dimensão, contratos de longo prazo e relações comerciais continuadas.',
    uc2Title:'Particular para Empresa (B2C)', uc2Desc:'Particulares que precisam de um serviço profissional para uso pessoal ou doméstico — renovação, obra, instalação ou manutenção. Simples, rápido e sem intermediários.',
    houseLabel:'Exemplo prático', houseTitle:'Construir uma casa? Encontre todos os especialistas',
    houseIntro:'A construção de uma casa envolve dezenas de especialidades diferentes. Com a Hivex, consegue identificar e contactar empresas para cada fase da obra — tudo numa só plataforma.',
    houseCta:'Com a Hivex, faça uma <strong>pesquisa rápida por filtros</strong> para cada especialidade, compare avaliações e <strong>peça orçamento a várias empresas</strong> — tudo num só lugar, sem telefonemas nem intermediários.',
    houseSpecialties:[
      {icon:'ruler',name:'Arquitetura & Projetos',sub:'Projeto de construção e licenciamento'},
      {icon:'hammer',name:'Empreiteiro Geral',sub:'Gestão e coordenação de obra'},
      {icon:'layers',name:'Alvenaria & Estruturas',sub:'Fundações, betão armado e estrutura'},
      {icon:'zap',name:'Instalações Elétricas',sub:'Quadros, cablagem e iluminação'},
      {icon:'droplets',name:'Canalização & Saneamento',sub:'Água, esgoto, gás e aquecimento'},
      {icon:'square',name:'Caixilharia & Vidros',sub:'Janelas, portas e envidraçados'},
      {icon:'paintbrush',name:'Pinturas & Acabamentos',sub:'Paredes, tetos e revestimentos'},
      {icon:'scissors',name:'Carpintaria & Marcenaria',sub:'Portas, armários e mobiliário fixo'},
      {icon:'home',name:'Cobertura & Impermeabilização',sub:'Telhados, varandas e terraços'},
      {icon:'wind',name:'Climatização / AVAC',sub:'Aquecimento, ar condicionado e ventilação'}
    ],
    stepsLabel:'Como funciona', stepsTitle:'Em 3 passos simples',
    step1Title:'Pesquise com filtros', step1Desc:'Filtre por setor, localização, avaliação e especialidade. O mapa atualiza em tempo real com as empresas que correspondem.',
    step2Title:'Compare empresas', step2Desc:'Veja perfis detalhados, avaliações multidimensionais em qualidade, prazos, comunicação e preço, e especialidades de cada empresa.',
    step3Title:'Peça orçamentos', step3Desc:'Contacte diretamente via email formal, chat interno em tempo real ou WhatsApp. Sem intermediários, sem demoras.',
    ctaTitle:'Pronto para começar?', ctaSub:'Explore as empresas disponíveis ou registe a sua empresa na Hivex hoje mesmo.',
    helpTitle:'Centro de Ajuda', helpSubtitle:'Suporte Hivex — estamos aqui para ajudar',
    helpTabSupport:'Suporte ao Cliente', helpTabAbout:'Sobre a Hivex',
    helpSupportIntro:'Estamos aqui para ajudar! Contacte-nos através dos seguintes canais:',
    helpChatTitle:'Chat em Tempo Real', helpChatDesc:'Contacte-nos instantaneamente através do chat integrado na plataforma.', helpChatBtn:'Abrir Chat',
    helpEmailTitle:'Email', helpEmailDesc:'geral.hivex@gmail.com — Resposta em até 24 horas úteis.', helpEmailBtn:'Enviar Email',
    helpPhoneTitle:'Telefone', helpPhoneDesc:'+351 XXX XXX XXX · Seg-Sex: 09h–18h', helpPhoneBtn:'Ligar',
    helpFaqTitle:'FAQ', helpFaqDesc:'Encontre respostas às perguntas mais frequentes.', helpFaqBtn:'Ver FAQ',
    helpWhoTitle:'Quem Somos', helpWhoDesc:'A HIVE é uma plataforma digital inovadora que liga empresas, profissionais independentes e particulares, facilitando a criação de relações comerciais transparentes e confiáveis. Operamos em Portugal com o objetivo de democratizar o acesso a serviços de qualidade, eliminando intermediários e reduzindo custos.',
    helpStatPros:'Empresas Verificadas', helpStatCompanies:'Empresas Registadas',
    helpMissionTitle:'Missão', helpMissionDesc:'Simplificar e democratizar o acesso a serviços profissionais de qualidade, criando um ecossistema transparente onde empresas e profissionais podem crescer juntos, sem intermediários desnecessários.',
    helpVisionTitle:'Visão', helpVisionDesc:'Ser a plataforma de referência em Portugal para ligar empresas e profissionais, promovendo crescimento económico e criando oportunidades para todos.',
    navLogin:'Entrar / Registar', navHelp:'Ajuda',
    themeToDark:'Escuro', themeToLight:'Claro', themeModeDark:'Modo escuro', themeModeLight:'Modo claro',
    navFavourites:'Favoritos', navFaq:'FAQ', navPrivacy:'Privacidade', avatarLogout:'Terminar Sessão', avatarFaqHelp:'FAQ & Ajuda',
    lpHeroRegisterCta:'Registe a sua Empresa', lpHeroRegisterHint:'É uma empresa? Apareça no mapa em minutos.',
    lpHeroLoginHint:'Já tem conta?', lpHeroLoginLink:'Entrar',
    lpHeroTitle:'Encontre os melhores<br><span class="hero-accent">profissionais</span> de construção',
    lpHeroSub:'Compare avaliações e peça orçamentos em minutos.',
    lpEarlyAccessText:'Plataforma nova — registe a sua empresa em minutos.',
    lpTabLocation:'Por Localização', lpTabActivity:'Por Atividade',
    lpLocationLabel:'Localização', lpLocationPh:'Lisboa, Porto, Braga...',
    lpActivityLabel:'Área de Atividade / Serviço', lpSelectActivity:'Selecione uma atividade...',
    lpHeroCatsLabel:'O que procura?',
    statCompanies:'Empresas registadas', statAreas:'Áreas de atividade', statSpecialties:'Especialidades', statCoverage:'Todo Portugal',
    featuredOverline:'Empresas em destaque', featuredTitle:'Os mais bem avaliados', featuredSeeAll:'Ver todas as empresas →', featuredEmpty:'Nenhuma empresa em destaque ainda.',
    featuredVerified:'✓ Verificado', featuredReviews:'avaliações',
    ubFeaturedBtn:'Empresas Destacadas', featEmpty:'Ainda não há empresas destacadas.', featCta:'Quer aparecer aqui primeiro? Destaque a sua empresa', featuredBadge:'Destacado',
    lpStep1Title:'Pesquise', lpStep1Desc:'Filtre por setor, localização e avaliação. O mapa mostra os resultados em tempo real.',
    lpStep2Title:'Compare', lpStep2Desc:'Veja perfis detalhados com avaliações multidimensionais e especialidades de cada empresa.',
    lpStep3Title:'Contacte', lpStep3Desc:'Peça orçamentos diretamente por email ou chat. Sem intermediários, sem demoras.',
    lpForWhom:'Para quem?', lpPlatformTitle:'Uma plataforma para todos',
    lpB2bBadge:'B2B · Para Empresas', lpB2bTitle:'Empresa para Empresa',
    lpB2bDesc:'Encontre fornecedores, parceiros estratégicos e subcontratados especializados. Ideal para projetos exigentes e contratos a longo prazo.',
    lpB2bBtn:'Explorar como empresa →',
    lpB2cBadge:'B2C · Para Particulares', lpB2cTitle:'Particular para Empresa',
    lpB2cDesc:'Precisa de reparações, renovações ou instalações? Compare profissionais verificados e peça orçamentos sem complicações.',
    lpB2cBtn:'Encontrar profissional →',
    // ── Missing i18n keys ──
    toastEmailUnavailable:'📧 Email não disponível — utilize o WhatsApp ou Chat interno',
    toastPhoneUnavailable:'📞 Telefone não disponível',
    toastLinkCopied:'Link copiado!',
    toastCopyFailed:'Não foi possível copiar',
    toastGeoNotSupported:'Geolocalização não suportada neste browser.',
    toastGeoPermissionDenied:'Permissão de localização negada.',
    toastGeoPositionUnavailable:'Posição não disponível.',
    toastGeoTimeout:'Tempo de espera excedido.',
    toastGeoError:'Erro ao obter localização.',
    toastLocationFound:'Localização atual encontrada!',
    toastLocationFailed:'Não foi possível obter a localização.',
    toastLocationError:'Erro ao procurar localização.',
    toastRegisterError:'Erro ao guardar. Verifique a ligação e tente novamente.',
    emailQuoteSubject:'Pedido de Orçamento',
    emailQuoteBody:'Olá,\n\nGostaria de solicitar um orçamento para os vossos serviços.\n\nDetalhes do projeto:\n- Descrição: \n- Localização: \n- Prazo desejado: \n\nAguardo a vossa resposta.\n\nCumprimentos',
    searchListEmpty:'Nenhuma empresa encontrada',
    searchListEmptySub:'Tente ajustar os filtros ou aumentar o raio de pesquisa',
    mapHintNoResults:'Nenhuma empresa encontrada nesta área',
    mapHintNoResultsSub:'Tente aumentar o raio de pesquisa no mapa ou selecione outra atividade',
    mapHintSelectSector:'Selecione uma área de atividade',
    mapHintSelectSectorSub:'para ver empresas no mapa',
    noRatingText:'Sem avaliação',
    regTypeCompany:'Registo Empresa',
    regTypeClient:'🔍 Registo Cliente',
    typeCompanyLabel:'Empresa',
    typeClientLabel:'Cliente',
    typeAdvertiserLabel:'Anunciante',
    avatarRegisterCompany:'Registar Empresa',
    // Status badges (used in admin row, profile companies, owner banner)
    statusApproved:'Aprovada', statusPending:'Pendente', statusRejected:'Rejeitada', statusRemoved:'🗑️ Removida',
    // Post-register choice modal
    postRegAria:'Próximos passos',
    postRegWelcome:'Bem-vindo à Hivex!', postRegWelcomeNamed:'Bem-vindo à Hivex, {name}!',
    postRegPrompt:'O que pretende fazer?',
    postRegAdvertiseTitle:'Anunciar a minha empresa',
    postRegAdvertiseDesc:'Registar a minha empresa e aparecer no marketplace',
    postRegBrowseTitle:'Apenas pesquisar empresas',
    postRegBrowseDesc:'Explorar o marketplace para encontrar profissionais',
    postRegFooterHint:'Pode anunciar a sua empresa mais tarde a partir do menu da conta.',
    // Report listing modal
    reportAria:'Reportar listagem', reportTitle:'Reportar listagem',
    reportSubtitle:'Os reportes são revistos pela nossa equipa de moderação.',
    reportReasonLabel:'Motivo', reportReasonPh:'Selecionar motivo…',
    reportReasonFake:'Empresa falsa ou inexistente', reportReasonInappropriate:'Conteúdo impróprio',
    reportReasonDuplicate:'Listagem duplicada', reportReasonWrongInfo:'Informação incorreta',
    reportReasonSpam:'Spam', reportReasonOther:'Outro',
    reportDetailsLabel:'Detalhes (opcional)', reportDetailsPh:'Descreva o problema (até 500 caracteres)',
    reportSubmit:'Enviar reporte', btnCancel:'Cancelar',
    // Auto-publish success overlay
    regSuccessTitle:'Registo Recebido!',
    regSuccessSub:'O seu registo foi recebido e está em análise pela nossa equipa. Assim que for aprovada, a empresa fica visível no mapa e recebe um email de confirmação.',
    regSuccessStep1:'Em análise — normalmente aprovada em <strong>24 horas úteis</strong>.',
    regSuccessStep2:'✉️ Recebe um <strong>email</strong> assim que for aprovada.',
    regSuccessStep3:'✏️ Pode editar os detalhes em <strong>O Meu Perfil</strong>.',
    // Logged-in hero CTA
    heroUserGreeting:'Olá!', heroUserGreetingNamed:'Olá, {name}!',
    heroUserTagline:'Quer anunciar a sua empresa no marketplace?',
    heroUserCta:'Anunciar Empresa',
    // Master sector toggle
    sectorAllLabel:'Todas as áreas',
    sectorAllSelectAll:'Selecionar todas as áreas',
    sectorAllDeselectAll:'Desmarcar todas as áreas', sectorSelectAllHere:'Selecionar todas',
    // Empty-state hint when no sector selected
    emptySectorTitle:'Selecione uma área de atividade',
    emptySectorSub:'Escolha um ou mais setores acima para ver as empresas disponíveis.',
    // Detail panel button tooltips
    dpFavTitle:'Guardar nos favoritos', dpEditTitle:'Editar', dpEditAria:'Editar empresa',
    dpCloseAria:'Fechar detalhes', dpReportTitle:'Reportar listagem',
    // Auth modal extras (login + register tabs)
    authWelcome:'Bem-vindo à Hivex', authTagline:'A maior rede B2B de Portugal',
    authTabLogin:'Entrar', authTabRegister:'Criar Conta',
    authDividerEmail:'ou continue com email', authDividerData:'ou preencha os dados',
    authEmailLabel:'Email', authPasswordLabel:'Palavra-passe',
    authPasswordPh:'Mínimo 8 caracteres', authPasswordHint:'Mínimo 8 caracteres.',
    authLoginSubmit:'Entrar', authRegisterSubmit:'Criar Conta',
    authNoAccount:'Ainda não tem conta?', authHasAccount:'Já tem conta?',
    capsLockOn:'⚠️ Caps Lock está ativado', pwdToggleAria:'Mostrar/ocultar palavra-passe',
    authAria:'Iniciar sessão ou criar conta',
    // Top user-visible toasts
    toastFavRemoved:'Removida dos favoritos', toastFavAdded:'★ Guardada nos favoritos',
    toastNoEditPermission:'Sem permissão para editar esta empresa.',
    toastCompanyUpdated:'Empresa atualizada com sucesso!',
    toastReportLoginRequired:'Inicie sessão para reportar uma listagem.',
    toastReportSelectReason:'Selecione um motivo.',
    toastReportSent:'Reporte enviado. Obrigado por nos ajudar a manter a plataforma segura.',
    toastReportFailed:'Não foi possível enviar o reporte.',
    toastFillFields:'Preencha todos os campos',
    toastFillRequired:'Preencha os campos obrigatórios',
    toastBadCredentials:'Email ou palavra-passe incorretos',
    toastTooManyAttempts:'Demasiadas tentativas. Tente mais tarde.',
    toastWelcomeUser:'Bem-vindo, {name}!',
    toastLoggedOut:'Sessão terminada',
    toastGoogleFailed:'Falha ao iniciar sessão com Google',
    toastRegisterFailed:'Erro ao criar conta',
    toastPasswordTooShort:'A palavra-passe deve ter pelo menos 8 caracteres',
    regAuthNameLabel:'Nome completo',
    regAuthNamePh:'O seu nome',
    lpTabCompany:'Por Empresa',
    lpCompanyLabel:'Nome da Empresa',
    lpCompanyPh:'Ex: Construções Ribeiro, ElectroLux...',
    legendTitle:'🎨 Legenda',
    legendEstrutura:'Estrutura',
    legendInstalacoes:'Instalações',
    legendAcabamentos:'Acabamentos',
    legendCarpintaria:'Carpintaria',
    legendSerralharia:'Serralharia',
    legendExterior:'Exterior',
    legendProjeto:'Projeto',
    legendChaveNaMao:'Chave na Mão',
    btnRequestQuote:'Pedir Orçamento',
    testimonial1Name:'A sua empresa aqui',
    testimonial1Sector:'Registe-se na HIVE',
    testimonial1Quote:'Junte-se à plataforma e conecte-se com novos clientes em toda Portugal.',
    testimonial2Name:'Profissionais verificados',
    testimonial2Sector:'Qualidade garantida',
    testimonial2Quote:'Todas as empresas são avaliadas pelos clientes para garantir o melhor serviço.',
    testimonial3Name:'Orçamentos gratuitos',
    testimonial3Sector:'Sem compromisso',
    testimonial3Quote:'Peça orçamentos a vários profissionais e compare preços facilmente.',
    testimonial4Name:'Chave na mão',
    testimonial4Sector:'Projetos completos',
    testimonial4Quote:'Encontre todos os profissionais para o seu projeto numa só plataforma.',
    footerDesc:'Marketplace de construção em Portugal. Conectamos empresas e particulares com profissionais verificados.',
    footerNav:'Navegação',
    footerLegal:'Legal',
    footerContact:'Contacto',
    footerTerms:'Termos de Serviço',
    footerPrivacy:'Política de Privacidade',
    footerCookies:'Cookies',
    footerRights:'Hivex — Todos os direitos reservados',
    factSince:'Desde', factHours:'Horário', factVerified:'Verificada', factYear:'ano', factYears:'anos',
    review1Author:'TechCorp Lda.',
    review2Author:'Ibérica Solutions SA',
    logoTagline:'Profissionais de Construção em Portugal',
    adBadge:'🏠 Exemplo Prático',
    adTitle:'Construir uma casa?',
    adNavSub:'10 especialistas, 1 plataforma',
    adMainSub:'8 áreas, 1 plataforma',
    adCta:'Encontre<br>tudo aqui',
    adHivexBadge:'A Hivex',
    adHivexTitle:'Do terreno à casa',
    adHivexSub:'O seu projeto, passo a passo',
    adHivexB2C:'Clientes encontram empresas',
    adHivexB2B:'Empresas encontram parceiros',
    adHivexCta:'Faça<br>parte',
    adStory1:'Tem um terreno',
    adStory2:'Abre a Hivex',
    adStory3:'Procura especialistas',
    adStory4:'Pede orçamento',
    adStory5:'Fecha contrato',
    adStory6:'Casa feita',
    adNodeClient:'Cliente',
    adNodeCompany:'Empresa',
    footerRgpd:'RGPD',
    successTitle:'Pedido Enviado!',
    successSub:'O seu pedido foi recebido e está a aguardar validação. Receberá um email de confirmação assim que a empresa for aprovada.',
    successClose:'Fechar',
    sortAll:'Todas',
    regStep1Label:'Identidade',
    regStep2Label:'Localização',
    regStep3Label:'Detalhes',
    regStepNext:'Seguinte',
    regStepBack:'Voltar',
    regCountry:'País',
    regPostalCode:'Código Postal',
    regCity:'Localidade / Cidade'
  },
  en: {
    // ── UI coverage additions ──
    viewMap:"Map", viewList:"List", resultCompany:"company", resultCompanies:"companies",
    profileTitle:"My Profile",
    contactTitle:"Send Message", contactSub:"Your message will be delivered directly to the company",
    contactMsgLabel:"Message", contactMsgPh:"Hello! I'd like to request information about your services...",
    contactPrivacy:"The company's email is never shared with you — Hivex delivers your message securely.",
    adminTitle:"Admin Panel", adminTabStats:"Statistics", adminTabPending:"Pending", adminTabAll:"All", adminTabReports:"Reports",
    loadingGeneric:"Loading...",
    statusTitle:"Registration Status", statusPrompt:"Enter the email you registered your company with to check its status.", statusVerify:"Check",
    dpDragClose:"pull to close", dpCloseTitle:"Close", dpCallTitle:"Call", dpShareTitle:"Share",
    dpDirectionsTitle:"Directions", routeLocating:"Getting your location…", routeNoLocation:"Could not get your location.", routeError:"Could not calculate the route.", dpMoreInfo:"Additional information",
    loginGateTitle:"Sign in to view contacts", loginGateDesc:"Create a free account to access contacts, address, reviews and request quotes.", loginGateBtn:"Sign in / Create free account",
    reviewsHeading:"Reviews", reviewFormTitle:"✍️ Your review", reviewPh:"Share your experience with this company...", reviewSubmit:"Publish Review", reviewWrite:"+ Write Review",
    closeBtn:"Close",
    regNifHint:"9 digits. We validate the format and the check digit.", regSectorPlaceholder:"Select activity areas...", regSectorMultiHint:"You can select several activity areas.",
    optionalTag:"(optional)", regAlvaraHint:"Construction permit number, if applicable.", regCountryPh:"Select a country",
    countryPT:"Portugal", countryES:"Spain", countryFR:"France", countryIT:"Italy", countryDE:"Germany", countryUK:"United Kingdom", countryNL:"Netherlands", countryBE:"Belgium", countryCH:"Switzerland", countryAT:"Austria", countryOther:"Other country",
    regAddressHint:"Include street, number, apartment and details for precise location on the map.", regFoundedPh:"e.g. 2010", regHoursPh:"e.g. Mon-Fri 9am-6pm, Sat 9am-1pm", regPortfolioPh:"Comma-separated URLs (up to 12)",
    geoTitle:"Location Blocked", geoIntro:"Your browser blocked location access. Follow the steps below to enable it.", geoRetry:"Try again", geoSkip:"Continue without location",
    forgotBackLogin:"Back to sign in", resetNewPwdLabel:"New password", min8Chars:"Minimum 8 characters.",
    changePwdTitle:"Change password", changePwdBody:"Enter your current password and then the new one (minimum 8 characters).", changePwdCurrent:"Current password", changePwdNew:"New password", changePwdSubmit:"Change password",
    delAccTitle:"Delete account", delAccWarn:"This action is <strong>permanent</strong>. Your reviews and favourites will be removed. Companies you registered remain on the platform, but with no associated owner.", delAccConfirmPwd:"Confirm your password", delAccSubmit:"Delete permanently",
    compareOfThree:"of 3 selected",
    // ── JS-string coverage (toasts, dynamic labels) ──
    contactSendTo:"Send message to", sendingBtn:"Sending...",
    toastSelectMin2:"Select at least 2 companies to compare.", toastMapUnavailable:"⚠️ Map unavailable — check your connection", toastPlaceNotFound:"Place not found. Try another name.", toastLocationDetected:"Location detected!",
    toastEnterEmail:"Enter your email", toastEnterEmail2:"Enter an email", toastPwdReset:"Password reset! You can sign in.", toastLoginToRegister:"Sign in to register your company.", toastPwdChanged:"Password changed.", toastAccountDeleted:"Account deleted.",
    toastSelectRating:"Select a rating (1-5 stars)", toastReviewPublished:"Review published!", toastWriteReply:"Write a reply", toastReplyPublished:"Reply published", toastMsgTooShort:"Message too short", toastMsgSent:"Message sent successfully!",
    toastReportUpdated:"Report updated", toastCompanyApproved:"Company approved", toastCompanyRejected:"Company rejected", toastCompanyRemoved:"🗑️ Company removed", toastLoadingStats:"Loading statistics...", toastStatsError:"Error loading statistics",
    compareMaxPrefix:"You can compare up to", compareMaxSuffix:"companies. Remove one to add another.", showingPrefix:"Showing", showingMid:"companies in",
    // ── profile / geo-help / admin coverage ──
    profileMyCompanies:"My Companies", profileAdd:"Add", profileEditTitle:"Edit company", profileNoCompanyMsg:"Register your company to appear on the map and receive quotes.", profileAccount:"Account",
    geoIOSLabel:"iPhone / iPad (Safari)", geoIOS1:"Open the iPhone <strong>Settings</strong>", geoIOS2:"Tap <strong>Privacy & Security</strong>", geoIOS3:"Tap <strong>Location Services</strong> and make sure it is <strong>on</strong>", geoIOS4:"Find <strong>Safari</strong> in the list and select <strong>While Using the App</strong>", geoIOS5:"Return to the browser and tap the 📍 button", geoIOSAlt:"Alternatively: tap the <strong>aA</strong> button in Safari's address bar → <strong>Website Settings</strong> → <strong>Location → Allow</strong>",
    geoAndroidLabel:"Android (Chrome)", geoAndroid1:"Tap the <strong>padlock 🔒</strong> in the address bar", geoAndroid2:"Tap <strong>Permissions</strong>", geoAndroid3:"Under <strong>Location</strong>, select <strong>Allow</strong>", geoAndroid4:"Reload the page and tap 📍", geoAndroidAlt:"If the padlock doesn't appear: Chrome Settings → Site Settings → Location → allow this site.",
    geoBrowserLabel:"Browser", geoGeneric1:"Click the <strong>padlock 🔒</strong> in the address bar", geoGeneric2:"Find <strong>Location</strong> and set it to <strong>Allow</strong>", geoGeneric3:"Reload the page",
    admPendingPlain:"Pending", admReviewed:"Reviewed", admDismissed:"Dismissed", admAll:"All", admNoReports:"No reports.", admReasonFake:"Fake company", admReasonInappropriate:"Inappropriate content", admReasonDuplicate:"Duplicate", admReasonWrongInfo:"Incorrect information", admReasonSpam:"Spam", admReasonOther:"Other", admReportedBy:"Reported by", admViewCompany:"View company", admMarkReviewed:"Mark as reviewed", admDismiss:"Dismiss", admError:"Error", admErrorLoading:"Error loading", admAnonymous:"anonymous",
    admStatApproved:"Approved", admStatRejected:"Rejected", admStatUsers:"Users", admStatReviews:"Reviews", admStatEvents7d:"Events (7d)", admStatNew7d:"New (7d)", admStatTotal:"Total Companies", admViewPendingA:"View", admViewPendingB:"pending company(ies) →", admSearchPh:"Search by name or email...", admStatusRemoved:"Removed", admNoCompanies:"No companies found.", admNoAccount:"no account", admRestore:"Restore", admApprove:"Approve", admRemove:"Remove", admUnfeatureTitle:"Remove featured", admFeatureTitle:"Feature", admUnfeatureBtn:"Remove", admFeatureBtn:"☆ Feature", admFeatured:"Company featured", admUnfeatured:"Featured removed", adminPanelTitle:"Admin Panel",
    navHome:'Home', navSearch:'Map', navBuyer:'Buyer Panel',
    recentlyViewed:'Recently viewed', recentRemove:'Remove', recentClear:'Clear',
    navSupplier:'Supplier Panel', navAbout:'About', navRegister:'Register Company',
    searchUpdated:'Search updated!',
    importOSM:'Import OSM Companies',
    filterTitle:'Filters', clearAll:'Clear All', companiesFound:'companies found',
    sortBy:'Sort By', sortRating:'Best Rating', sortReviews:'Most Reviewed', sortName:'Name A–Z',
    sectorArea:'Activity Area', minRating:'Minimum Rating',
    ratingAny:'Any rating', ratingOrMore:'or more',
    searchRadius:'Search Radius', featured:'Featured', ignoreRadius:'Don\'t Use Search Radius', nearbyTitle:'Nearby Companies', contactYourName:'Your name', contactYourEmail:'Your email (so the company can reply)', contactNameReq:'Enter your name', contactEmailReq:'Enter a valid email', retryBtn:'Try again', dpStreetTitle:'Street View', svOpenExternal:'Open in Google Maps ↗', svFallback:'If the view does not load, ', svFallbackLink:'open it in Google Maps', claimLink:'🏷 Is this your business? Claim this listing', claimTitle:'Claim this listing', claimIntro:'To prove you manage this business we send a 6-digit code to the listing\u2019s public email. Once claimed, you can edit the details, reply to reviews and see analytics.', claimSendBtn:'Send code to the listing email', claimSentTo:'Code sent to', claimVerifyBtn:'Confirm code', claimSuccess:'Listing claimed! You can now edit it and see messages.', claimNeedLogin:'Sign in to claim this listing', claimCodeInvalid:'Enter the 6-digit code', rfqCta:'Get Free Quotes', rfqTitle:'Request quotes', rfqIntro:'Describe the job — we send it to the right companies in your area and proposals arrive in your email.', rfqSector:'Activity area', rfqDesc:'Job description', rfqDescPh:'E.g.: Full bathroom renovation (~4 m²): new fixtures, tiles and plumbing.', rfqCity:'Town/City', rfqTimeline:'Desired timeline', rfqBudget:'Indicative budget', rfqPhone:'Phone (optional)', rfqEmail:'Your email', rfqSend:'Send request to companies', rfqSentA:'Request sent to', rfqSentB:'companies! Proposals will arrive by email.', rfqDescShort:'Describe the job in more detail (min. 20 characters)', rfqCityReq:'Enter the town/city', tlFlex:'Flexible', tlUrgent:'Urgent', tl1m:'Next month', tl3m:'Within 3 months', budNS:'Not sure yet', inboxBtn:'Client messages', inboxTitle:'Client messages', inboxEmpty:'No messages yet.', inboxReplyPh:'Write your reply…', inboxReplySend:'Reply', inboxReplySent:'Reply sent to the client', inboxYou:'You', featureBtn:'Request featuring', featureSent:'Feature request sent to the admin',
    topRated:'Top Rated', verified:'Verified', newEntry:'New Entry',
    specialties:'Specialties',
    mapLive:'Live map', mapCity:'Lisbon, Portugal',
    emptyTitle:'No companies registered',
    emptyMsg:'The map is empty. Register the first company so it appears here as a marker.',
    emptyBtn:'Register Company',
    detailLocation:'Location',
    detailContact:'Contact Channels',
    waName:'WhatsApp Direct', waDesc:'Pre-filled message with context',
    chatChannelName:'WhatsApp / Message', chatChannelDesc:'Direct contact via WhatsApp or SMS',
    emailChannelName:'E-mail Gateway', emailChannelDesc:'Formal request directly to the supplier',
    detailSpecialties:'Specialties', detailReviews:'Verified Reviews',
    detailCredentials:'Credentials & Areas of Activity',
    detailActivities:'Areas of Activity', detailAlvara:'Alvará (Licence)', detailCertidao:'Permanent Certificate',
    detailNoActivities:'No areas of activity listed',
    credRequired:'Required', credOptional:'Optional',
    credLoginToView:'Sign in to view',
    alvaraNotApplicable:'Not applicable', certidaoPending:'Pending verification',
    popupCertOk:'Certificate on file', popupAlvaraOk:'Licence',
    noRatings:'No reviews', reviews:'reviews',
    review1:'"Excellent partner, delivered on time and with quality above expectations."',
    review2:'"Good communication and competitive prices. Recommended for medium-term projects."',
    sectors:{
      pedreiros:'Bricklayers & Masons', escavacao:'Excavation & Earthworks', betao_cimento:'Concrete & Cement Work',
      estruturas_metalicas:'Steel Frame Structures', demolicao:'Demolition', alvenaria:'Masonry',
      cofragem:'Formwork & Reinforcement', impermeabilizacao:'Waterproofing & Tanking',
      eletricistas:'Electricians', picheleiros:'Plumbers',
      canalizacao_saneamento:'Drainage & Sanitation', climatizacao_avac:'HVAC & Ventilation',
      gas:'Gas Installation', domotica_automacao:'Smart Home & Building Automation',
      energias_renovaveis:'Renewable Energy / Solar PV', seguranca_alarmes:'Security & Alarm Systems',
      pocos_agua:'Water Wells & Boreholes',
      pintores:'Painters & Decorators', estucadores:'Plasterers & Renderers', pavimentos:'Flooring & Floor Finishes',
      azulejos:'Tiling & Ceramics', marmoraria:'Marble & Natural Stone',
      isolamento:'Thermal & Acoustic Insulation', gesso_cartonado:'Plasterboard & Drylining',
      carpinteiros:'Carpenters & Joiners', serralharia:'Metal Fabrication', aluminios_pvc:'Aluminium & PVC Systems',
      caixilharia:'Windows & Doors', vidraceiros:'Glaziers', portoes_vedacoes:'Gates & Fencing',
      moveis_medida:'Bespoke Furniture',
      telhados_coberturas:'Roofing & Cladding', piscinas:'Swimming Pools',
      paisagismo_jardins:'Landscaping & Garden Design', jardineiros:'Gardeners', vedacoes_muros:'Boundary Walls & Fencing',
      calcetamento:'External Paving & Hard Landscaping', fachadas:'Facades & Refurbishment',
      arquitetura_projetos:'Architecture & Design', engenharia_civil:'Civil Engineering',
      topografia:'Land Surveying', gestao_obra:'Site Management',
      certificacao_energetica:'Energy Performance Certificate', seguranca_trabalho:'Health & Safety',
      design_interiores:'Interior Design', materiais_construcao:'Building Materials & Supplies',
      equipamentos_construcao:'Plant & Construction Equipment',
      chave_na_mao_construcao:'Turnkey New Build', chave_na_mao_remodelacao:'Turnkey Renovation',
      chave_na_mao_moradia:'Turnkey Houses', chave_na_mao_apartamento:'Turnkey Apartments',
      chave_na_mao_comercial:'Turnkey Commercial Fit-Out'
    },
    sectorOptions:{
      pedreiros:'Bricklayers & Masons', escavacao:'Excavation & Earthworks', betao_cimento:'Concrete & Cement Work',
      estruturas_metalicas:'Steel Frame Structures', demolicao:'Demolition', alvenaria:'Masonry',
      cofragem:'Formwork & Reinforcement', impermeabilizacao:'Waterproofing & Tanking',
      eletricistas:'Electricians', picheleiros:'Plumbers',
      canalizacao_saneamento:'Drainage & Sanitation', climatizacao_avac:'HVAC & Ventilation',
      gas:'Gas Installation', domotica_automacao:'Smart Home & Building Automation',
      energias_renovaveis:'Renewable Energy / Solar PV', seguranca_alarmes:'Security & Alarm Systems',
      pocos_agua:'Water Wells & Boreholes',
      pintores:'Painters & Decorators', estucadores:'Plasterers & Renderers', pavimentos:'Flooring & Floor Finishes',
      azulejos:'Tiling & Ceramics', marmoraria:'Marble & Natural Stone',
      isolamento:'Thermal & Acoustic Insulation', gesso_cartonado:'Plasterboard & Drylining',
      carpinteiros:'Carpenters & Joiners', serralharia:'Metal Fabrication', aluminios_pvc:'Aluminium & PVC Systems',
      caixilharia:'Windows & Doors', vidraceiros:'Glaziers', portoes_vedacoes:'Gates & Fencing',
      moveis_medida:'Bespoke Furniture',
      telhados_coberturas:'Roofing & Cladding', piscinas:'Swimming Pools',
      paisagismo_jardins:'Landscaping & Garden Design', jardineiros:'Gardeners', vedacoes_muros:'Boundary Walls & Fencing',
      calcetamento:'External Paving & Hard Landscaping', fachadas:'Facades & Refurbishment',
      arquitetura_projetos:'Architecture & Design', engenharia_civil:'Civil Engineering',
      topografia:'Land Surveying', gestao_obra:'Site Management',
      certificacao_energetica:'Energy Performance Certificate', seguranca_trabalho:'Health & Safety',
      design_interiores:'Interior Design', materiais_construcao:'Building Materials & Supplies',
      equipamentos_construcao:'Plant & Construction Equipment'
    },
    sectorGroups:{
      estrutura_fundacao:'Structure', instalacoes:'Installations', acabamentos:'Finishes',
      carpintaria:'Carpentry', serralharia_metal:'Metalwork', exterior_jardim:'Exterior', projeto_gestao:'Design', chave_na_mao:'Turnkey',
      obra_grossa:'Structural Works', redes_tecnicas:'Technical Services', revestimentos:'Finishes & Decoration',
      madeira:'Timber & Furniture', metal_vidro:'Metal, Glass & Windows', exteriores:'Outdoors & Garden', projetos:'Design & Consultancy'
    },
    regTitle:'Register New Company',
    regSub:'Fill in the data to add your company to the Hivex platform. Fields marked with',
    regSubSuffix:'are required.',
    regCompanyName:'Company Name', regNamePh:'Ex: Company Name, Ltd',
    regSectorLabel:'Activity Sector', regSectorPh:'Select sector...',
    regCae:'CAE Code', regCaePh:'Ex: CAE 41 – Construction',
    regAlvara:'Business Licence (Alvará)', regAlvaraPh:'Licence number',
    valAlvara:'Please enter the business licence number',
    regCertidao:'Permanent Commercial Certificate Code', regCertidaoPh:'Ex: 1234-5678-9012',
    regCertidaoHint:'Access code for the Portuguese commercial registry (Certidão Permanente — 12 digits, format XXXX-XXXX-XXXX).',
    valCertidao:'Please enter the Certidão Permanente code.',
    valCertidaoFormat:'Invalid Certidão Permanente code (minimum 8 alphanumeric characters).',
    regAddress:'Address', regAddressPh:'Ex: Main Street 200, Lisbon',
    regZone:'Locality / Zone',
    regEmail:'Contact Email', regEmailPh:'company@email.com',
    regPhone:'Phone / WhatsApp',
    regWebsite:'Website', regWebsitePh:'https://www.company.com',
    regLogo:'Company logo', regLogoPick:'Choose image…', regLogoRemove:'Remove', regLogoEmpty:'No image', regLogoHint:'JPG or PNG — resized and compressed automatically. Shown as the company logo.', regLogoInvalid:'Invalid image file.',
    regSpecialties:'Specialties', regTagsPh:'Ex: Civil Construction, Public Works, International',
    regTagsHint:'Separate specialties with commas.',
    regDescription:'Brief Description', regDescPh:'Brief description of the company, services provided...',
    regCancel:'Cancel', regSubmit:'Register Company',
    zones:{
      lisbon_center:'Lisbon Center', lisbon_north:'Lisbon North',
      lisbon_east:'Lisbon East / Park of Nations', lisbon_west:'Lisbon West / Belém',
      oeiras:'Oeiras', sintra:'Sintra', cascais:'Cascais',
      setubal:'Setúbal', porto:'Porto', braga:'Braga'
    },
    emailTitle:'Quote Request',
    emailSub:'Sent directly to the supplier via verified email.',
    emailSubject:'Subject', emailSubjectVal:'Quote Request – Hivex Marketplace',
    emailType:'Request Type',
    emailTypes:['Quote Request','Information Request','Partnership Proposal'],
    emailMessage:'Message',
    emailMessageVal:'Good morning,\n\nI found your company on the Hivex platform and would like to request a quote for...',
    emailAttach:'Attach file (optional)', emailCancel:'Cancel', emailSend:'Send Request',
    chatOnline:'● Online now', chatPlaceholder:'Write a message...',
    chatMsg1:'Hello! I saw your profile on Hivex. Can you send me a proposal?',
    chatMsg2:'Good morning! With pleasure. Can you share the technical specifications?',
    chatMsg3:'Perfect, here are the project details.',
    toastFiltersCleared:'All filters cleared!',
    toastWhatsapp:'Opening WhatsApp...', toastEmailSent:'Quote request sent successfully!',
    toastAutoReply:'Thank you for your message! We will reply shortly.',
    valName:'Please enter the company name.',
    valSector:'Please select the activity sector.',
    valAddress:'Please enter the address.',
    valEmail:'Please enter the contact email.',
    valTags:'Please enter at least one specialty.',
    toastRegistered: name => `"${name}" successfully registered! Visible on the map.`,
    popupNoRatings:'No ratings yet', popupNewBadge:'New Entry',
    openNow:'Open', closedNow:'Closed', newOnHivex:'New on Hivex',
    btnSearch:'Search',
    heroLabel:'B2B & B2C Marketplace',
    heroTitleMain:'Connect. Collaborate. ', heroTitleAccent:'Grow.',
    heroSub:'Hivex connects companies and individuals to the best service providers — quickly, transparently and with full control.',
    heroBtnSearch:'Explore Companies', heroBtnRegister:'Register my Company',
    whatLabel:'What is Hivex', whatTitle:'A platform for everyone',
    whatSub:'Hivex was built to simplify the way clients and suppliers find each other. Whether you\'re a company looking for strategic partners, or an individual who needs a quick service — Hivex connects you to trusted experts, with verified ratings and direct contact.',
    uc1Title:'Business to Business (B2B)', uc1Desc:'Companies looking for suppliers, subcontractors or strategic partners. Ideal for larger projects, long-term contracts and ongoing business relationships.',
    uc2Title:'Individual to Business (B2C)', uc2Desc:'Individuals who need a professional service for personal or domestic use — renovation, construction, installation or maintenance. Simple, fast and without intermediaries.',
    houseLabel:'Practical example', houseTitle:'Building a house? Find all the specialists',
    houseIntro:'Building a house involves dozens of different specialties. With Hivex, you can identify and contact companies for each phase of the work — all on one platform.',
    houseCta:'With Hivex, do a <strong>quick search with filters</strong> for each specialty, compare ratings and <strong>request quotes from multiple companies</strong> — all in one place, without phone calls or intermediaries.',
    houseSpecialties:[
      {icon:'ruler',name:'Architecture & Design',sub:'Construction project and licensing'},
      {icon:'hammer',name:'General Contractor',sub:'Work management and coordination'},
      {icon:'layers',name:'Masonry & Structures',sub:'Foundations, reinforced concrete and structure'},
      {icon:'zap',name:'Electrical Installations',sub:'Panels, wiring and lighting'},
      {icon:'droplets',name:'Plumbing & Sanitation',sub:'Water, sewage, gas and heating'},
      {icon:'square',name:'Windows & Glazing',sub:'Windows, doors and glazed surfaces'},
      {icon:'paintbrush',name:'Painting & Finishes',sub:'Walls, ceilings and coverings'},
      {icon:'scissors',name:'Carpentry & Joinery',sub:'Doors, wardrobes and fitted furniture'},
      {icon:'home',name:'Roofing & Waterproofing',sub:'Roofs, balconies and terraces'},
      {icon:'wind',name:'HVAC & Climate Control',sub:'Heating, air conditioning and ventilation'}
    ],
    stepsLabel:'How it works', stepsTitle:'In 3 simple steps',
    step1Title:'Search with filters', step1Desc:'Filter by sector, location, rating and specialty. The map updates in real time with matching companies.',
    step2Title:'Compare companies', step2Desc:'View detailed profiles, multidimensional ratings on quality, deadlines, communication and price, and each company\'s specialties.',
    step3Title:'Request quotes', step3Desc:'Contact directly via formal email, real-time internal chat or WhatsApp. No intermediaries, no delays.',
    ctaTitle:'Ready to get started?', ctaSub:'Explore available companies or register your company on Hivex today.',
    helpTitle:'Help Center', helpSubtitle:'Hivex Support — we are here to help',
    helpTabSupport:'Customer Support', helpTabAbout:'About Hivex',
    helpSupportIntro:'We are here to help! Contact us through the following channels:',
    helpChatTitle:'Live Chat', helpChatDesc:'Contact us instantly through the integrated chat on the platform.', helpChatBtn:'Open Chat',
    helpEmailTitle:'Email', helpEmailDesc:'geral.hivex@gmail.com — Response within 24 business hours.', helpEmailBtn:'Send Email',
    helpPhoneTitle:'Phone', helpPhoneDesc:'+351 XXX XXX XXX · Mon-Fri: 09h–18h', helpPhoneBtn:'Call',
    helpFaqTitle:'FAQ', helpFaqDesc:'Find answers to the most frequently asked questions.', helpFaqBtn:'View FAQ',
    helpWhoTitle:'Who We Are', helpWhoDesc:'HIVE is an innovative digital platform that connects companies, independent professionals and individuals, facilitating transparent and trustworthy business relationships. We operate in Portugal with the goal of democratising access to quality services, eliminating intermediaries and reducing costs.',
    helpStatPros:'Verified Companies', helpStatCompanies:'Registered Companies',
    helpMissionTitle:'Mission', helpMissionDesc:'To simplify and democratise access to quality professional services, creating a transparent ecosystem where companies and professionals can grow together, without unnecessary intermediaries.',
    helpVisionTitle:'Vision', helpVisionDesc:'To be the reference platform in Portugal for connecting companies and professionals, promoting economic growth and creating opportunities for all.',
    navLogin:'Login / Sign up', navHelp:'Help',
    themeToDark:'Dark', themeToLight:'Light', themeModeDark:'Dark mode', themeModeLight:'Light mode',
    testimonialPhrases:['Excellent professionalism and quality of work.','Very punctual and impeccable work. Recommended!','Great value for money. Will hire again.','Very competent and organised team.','Exceeded expectations. First-class work.','Serious, trustworthy professionals.','Fast, efficient service. Very satisfied.','Excellent service from start to finish.','Met the deadline and the budget. Recommended!','Careful work and very friendly.'],
    navFavourites:'Favourites', navFaq:'FAQ', navPrivacy:'Privacy', avatarLogout:'Sign out', avatarFaqHelp:'FAQ & Help',
    lpHeroRegisterCta:'Register your Company', lpHeroRegisterHint:'Are you a company? Get on the map in minutes.',
    lpHeroLoginHint:'Already have an account?', lpHeroLoginLink:'Sign in',
    lpHeroTitle:'Find the best<br><span class="hero-accent">construction</span> professionals',
    lpHeroSub:'Compare reviews and request quotes in minutes.',
    lpEarlyAccessText:'New platform — register your company in minutes.',
    lpTabLocation:'By Location', lpTabActivity:'By Activity',
    lpLocationLabel:'Location', lpLocationPh:'Lisbon, Porto, Braga...',
    lpActivityLabel:'Activity Area / Service', lpSelectActivity:'Select an activity...',
    lpHeroCatsLabel:'What are you looking for?',
    statCompanies:'Registered Companies', statAreas:'Activity Areas', statSpecialties:'Specialties', statCoverage:'All Portugal',
    featuredOverline:'Featured Companies', featuredTitle:'Top rated', featuredSeeAll:'View all companies →', featuredEmpty:'No featured companies yet.',
    featuredVerified:'✓ Verified', featuredReviews:'reviews',
    ubFeaturedBtn:'Featured Companies', featEmpty:'No featured companies yet.', featCta:'Want to appear here first? Feature your company', featuredBadge:'Featured',
    lpStep1Title:'Search', lpStep1Desc:'Filter by sector, location and rating. The map shows results in real time.',
    lpStep2Title:'Compare', lpStep2Desc:"View detailed profiles with multidimensional ratings and each company's specialties.",
    lpStep3Title:'Contact', lpStep3Desc:'Request quotes directly by email or chat. No intermediaries, no delays.',
    lpForWhom:'For whom?', lpPlatformTitle:'A platform for everyone',
    lpB2bBadge:'B2B · For Companies', lpB2bTitle:'Business to Business',
    lpB2bDesc:'Find suppliers, strategic partners and specialised subcontractors. Ideal for demanding projects and long-term contracts.',
    lpB2bBtn:'Explore as a company →',
    lpB2cBadge:'B2C · For Individuals', lpB2cTitle:'Individual to Business',
    lpB2cDesc:'Need repairs, renovations or installations? Compare verified professionals and request quotes hassle-free.',
    lpB2cBtn:'Find a professional →',
    // ── Missing i18n keys ──
    toastEmailUnavailable:'📧 Email not available — use WhatsApp or internal Chat',
    toastPhoneUnavailable:'📞 Phone not available',
    toastLinkCopied:'Link copied!',
    toastCopyFailed:'Could not copy',
    toastGeoNotSupported:'Geolocation not supported in this browser.',
    toastGeoPermissionDenied:'Location permission denied.',
    toastGeoPositionUnavailable:'Position unavailable.',
    toastGeoTimeout:'Location request timed out.',
    toastGeoError:'Error getting location.',
    toastLocationFound:'Current location found!',
    toastLocationFailed:'Could not get location.',
    toastLocationError:'Error searching location.',
    toastRegisterError:'Error saving. Check connection and try again.',
    emailQuoteSubject:'Quote Request',
    emailQuoteBody:'Hello,\n\nI would like to request a quote for your services.\n\nProject details:\n- Description: \n- Location: \n- Desired deadline: \n\nLooking forward to your reply.\n\nBest regards',
    searchListEmpty:'No companies found',
    searchListEmptySub:'Try adjusting the filters or increasing the search radius',
    mapHintNoResults:'No companies found in this area',
    mapHintNoResultsSub:'Try increasing the search radius or selecting another activity',
    mapHintSelectSector:'Select an activity area',
    mapHintSelectSectorSub:'to see companies on the map',
    noRatingText:'No ratings',
    regTypeCompany:'Company Registration',
    regTypeClient:'🔍 Client Registration',
    typeCompanyLabel:'Company',
    typeClientLabel:'Client',
    typeAdvertiserLabel:'Advertiser',
    avatarRegisterCompany:'Register Company',
    statusApproved:'Approved', statusPending:'Pending', statusRejected:'Rejected', statusRemoved:'🗑️ Removed',
    postRegAria:'Next steps',
    postRegWelcome:'Welcome to Hivex!', postRegWelcomeNamed:'Welcome to Hivex, {name}!',
    postRegPrompt:'What would you like to do?',
    postRegAdvertiseTitle:'Advertise my company',
    postRegAdvertiseDesc:'Register my company and appear in the marketplace',
    postRegBrowseTitle:'Just browse companies',
    postRegBrowseDesc:'Explore the marketplace to find professionals',
    postRegFooterHint:'You can advertise your company later from the account menu.',
    reportAria:'Report listing', reportTitle:'Report listing',
    reportSubtitle:'Reports are reviewed by our moderation team.',
    reportReasonLabel:'Reason', reportReasonPh:'Select a reason…',
    reportReasonFake:'Fake or non-existent company', reportReasonInappropriate:'Inappropriate content',
    reportReasonDuplicate:'Duplicate listing', reportReasonWrongInfo:'Incorrect information',
    reportReasonSpam:'Spam', reportReasonOther:'Other',
    reportDetailsLabel:'Details (optional)', reportDetailsPh:'Describe the problem (up to 500 characters)',
    reportSubmit:'Send report', btnCancel:'Cancel',
    regSuccessTitle:'Registration Received!',
    regSuccessSub:'Your registration has been received and is under review by our team. Once approved, your company will appear on the map and you will receive a confirmation email.',
    regSuccessStep1:'Under review — usually approved within <strong>24 business hours</strong>.',
    regSuccessStep2:'✉️ You will receive an <strong>email</strong> as soon as it is approved.',
    regSuccessStep3:'✏️ Edit the details anytime from <strong>My Profile</strong>.',
    heroUserGreeting:'Hello!', heroUserGreetingNamed:'Hello, {name}!',
    heroUserTagline:'Want to advertise your company on the marketplace?',
    heroUserCta:'Advertise Company',
    sectorAllLabel:'All areas',
    sectorAllSelectAll:'Select all areas',
    sectorAllDeselectAll:'Deselect all areas', sectorSelectAllHere:'Select all',
    emptySectorTitle:'Select an area of activity',
    emptySectorSub:'Pick one or more sectors above to see available companies.',
    dpFavTitle:'Save to favourites', dpEditTitle:'Edit', dpEditAria:'Edit company',
    dpCloseAria:'Close details', dpReportTitle:'Report listing',
    authWelcome:'Welcome to Hivex', authTagline:'Portugal’s largest B2B network',
    authTabLogin:'Log in', authTabRegister:'Create Account',
    authDividerEmail:'or continue with email', authDividerData:'or fill in your details',
    authEmailLabel:'Email', authPasswordLabel:'Password',
    authPasswordPh:'At least 8 characters', authPasswordHint:'At least 8 characters.',
    authLoginSubmit:'Log in', authRegisterSubmit:'Create Account',
    authNoAccount:'Don’t have an account yet?', authHasAccount:'Already have an account?',
    capsLockOn:'⚠️ Caps Lock is on', pwdToggleAria:'Show/hide password',
    authAria:'Sign in or create an account',
    toastFavRemoved:'Removed from favourites', toastFavAdded:'★ Saved to favourites',
    toastNoEditPermission:'You don’t have permission to edit this company.',
    toastCompanyUpdated:'Company updated successfully!',
    toastReportLoginRequired:'Log in to report a listing.',
    toastReportSelectReason:'Select a reason.',
    toastReportSent:'Report sent. Thank you for helping keep the platform safe.',
    toastReportFailed:'Could not send the report.',
    toastFillFields:'Fill in all fields',
    toastFillRequired:'Fill in the required fields',
    toastBadCredentials:'Wrong email or password',
    toastTooManyAttempts:'Too many attempts. Try again later.',
    toastWelcomeUser:'Welcome, {name}!',
    toastLoggedOut:'Signed out',
    toastGoogleFailed:'Google sign-in failed',
    toastRegisterFailed:'Account creation failed',
    toastPasswordTooShort:'Password must be at least 8 characters',
    regAuthNameLabel:'Full name',
    regAuthNamePh:'Your name',
    lpTabCompany:'By Company',
    lpCompanyLabel:'Company Name',
    lpCompanyPh:'E.g.: Construções Ribeiro, ElectroLux...',
    legendTitle:'🎨 Legend',
    legendEstrutura:'Structure',
    legendInstalacoes:'Installations',
    legendAcabamentos:'Finishes',
    legendCarpintaria:'Carpentry',
    legendSerralharia:'Metalwork',
    legendExterior:'Exterior',
    legendProjeto:'Design',
    legendChaveNaMao:'Turnkey',
    btnRequestQuote:'Request Quote',
    testimonial1Name:'Your company here',
    testimonial1Sector:'Register on HIVE',
    testimonial1Quote:'Join the platform and connect with new clients across Portugal.',
    testimonial2Name:'Verified professionals',
    testimonial2Sector:'Quality guaranteed',
    testimonial2Quote:'All companies are rated by clients to ensure the best service.',
    testimonial3Name:'Free quotes',
    testimonial3Sector:'No commitment',
    testimonial3Quote:'Request quotes from multiple professionals and compare prices easily.',
    testimonial4Name:'Turnkey',
    testimonial4Sector:'Complete projects',
    testimonial4Quote:'Find all the professionals for your project on one platform.',
    footerDesc:'Construction marketplace in Portugal. We connect businesses and individuals with verified professionals.',
    footerNav:'Navigation',
    footerLegal:'Legal',
    footerContact:'Contact',
    footerTerms:'Terms of Service',
    footerPrivacy:'Privacy Policy',
    footerCookies:'Cookies',
    footerRights:'Hivex — All rights reserved',
    factSince:'Since', factHours:'Hours', factVerified:'Verified', factYear:'year', factYears:'years',
    review1Author:'TechCorp Ltd.',
    review2Author:'Ibérica Solutions SA',
    logoTagline:'Construction Professionals in Portugal',
    adBadge:'🏠 Practical Example',
    adTitle:'Building a house?',
    adNavSub:'10 specialists, 1 platform',
    adMainSub:'8 areas, 1 platform',
    adCta:'Find<br>everything here',
    adHivexBadge:'Hivex',
    adHivexTitle:'From plot to home',
    adHivexSub:'Your project, step by step',
    adHivexB2C:'Clients find companies',
    adHivexB2B:'Companies find partners',
    adHivexCta:'Join<br>us',
    adStory1:'You have a plot',
    adStory2:'Open Hivex',
    adStory3:'Find specialists',
    adStory4:'Get a quote',
    adStory5:'Sign contract',
    adStory6:'House done',
    adNodeClient:'Client',
    adNodeCompany:'Company',
    footerRgpd:'GDPR',
    successTitle:'Request Sent!',
    successSub:'Your request has been received and is awaiting validation. You will receive a confirmation email once the company is approved.',
    successClose:'Close',
    sortAll:'All',
    regStep1Label:'Identity',
    regStep2Label:'Location',
    regStep3Label:'Details',
    regStepNext:'Next',
    regStepBack:'Back',
    regCountry:'Country',
    regPostalCode:'Postal Code',
    regCity:'Locality / City'
  },
  fr: {
    // ── UI coverage additions ──
    viewMap:"Carte", viewList:"Liste", resultCompany:"entreprise", resultCompanies:"entreprises",
    profileTitle:"Mon profil",
    contactTitle:"Envoyer un message", contactSub:"Votre message sera transmis directement à l'entreprise",
    contactMsgLabel:"Message", contactMsgPh:"Bonjour ! Je souhaiterais obtenir des informations sur vos services...",
    contactPrivacy:"L'e-mail de l'entreprise ne vous est jamais communiqué — Hivex transmet votre message en toute sécurité.",
    adminTitle:"Panneau d'administration", adminTabStats:"Statistiques", adminTabPending:"En attente", adminTabAll:"Toutes", adminTabReports:"Signalements",
    loadingGeneric:"Chargement...",
    statusTitle:"Statut de l'inscription", statusPrompt:"Saisissez l'e-mail utilisé pour enregistrer votre entreprise afin de vérifier le statut.", statusVerify:"Vérifier",
    dpDragClose:"tirer pour fermer", dpCloseTitle:"Fermer", dpCallTitle:"Appeler", dpShareTitle:"Partager",
    dpDirectionsTitle:"Itinéraire", routeLocating:"Localisation en cours…", routeNoLocation:"Impossible d'obtenir votre position.", routeError:"Impossible de calculer l'itinéraire.", dpMoreInfo:"Plus d'informations",
    loginGateTitle:"Connectez-vous pour voir les contacts", loginGateDesc:"Créez un compte gratuit pour accéder aux contacts, à l'adresse, aux avis et demander des devis.", loginGateBtn:"Se connecter / Créer un compte gratuit",
    reviewsHeading:"Avis", reviewFormTitle:"✍️ Votre avis", reviewPh:"Partagez votre expérience avec cette entreprise...", reviewSubmit:"Publier l'avis", reviewWrite:"+ Écrire un avis",
    closeBtn:"Fermer",
    regNifHint:"9 chiffres. Nous validons le format et le chiffre de contrôle.", regSectorPlaceholder:"Sélectionner les domaines d'activité...", regSectorMultiHint:"Vous pouvez sélectionner plusieurs domaines d'activité.",
    optionalTag:"(facultatif)", regAlvaraHint:"Numéro de permis de construction, le cas échéant.", regCountryPh:"Sélectionnez un pays",
    countryPT:"Portugal", countryES:"Espagne", countryFR:"France", countryIT:"Italie", countryDE:"Allemagne", countryUK:"Royaume-Uni", countryNL:"Pays-Bas", countryBE:"Belgique", countryCH:"Suisse", countryAT:"Autriche", countryOther:"Autre pays",
    regAddressHint:"Indiquez la rue, le numéro, l'appartement et les détails pour une localisation précise sur la carte.", regFoundedPh:"ex. 2010", regHoursPh:"ex. Lun-Ven 9h-18h, Sam 9h-13h", regPortfolioPh:"URLs séparées par des virgules (jusqu'à 12)",
    geoTitle:"Localisation bloquée", geoIntro:"Le navigateur a bloqué l'accès à la localisation. Suivez les étapes ci-dessous pour l'activer.", geoRetry:"Réessayer", geoSkip:"Continuer sans localisation",
    forgotBackLogin:"Retour à la connexion", resetNewPwdLabel:"Nouveau mot de passe", min8Chars:"Minimum 8 caractères.",
    changePwdTitle:"Changer le mot de passe", changePwdBody:"Saisissez votre mot de passe actuel puis le nouveau (minimum 8 caractères).", changePwdCurrent:"Mot de passe actuel", changePwdNew:"Nouveau mot de passe", changePwdSubmit:"Changer le mot de passe",
    delAccTitle:"Supprimer le compte", delAccWarn:"Cette action est <strong>permanente</strong>. Vos avis et favoris seront supprimés. Les entreprises que vous avez enregistrées restent sur la plateforme, mais sans propriétaire associé.", delAccConfirmPwd:"Confirmez votre mot de passe", delAccSubmit:"Supprimer définitivement",
    compareOfThree:"sur 3 sélectionnées",
    // ── JS-string coverage (toasts, dynamic labels) ──
    contactSendTo:"Envoyer un message à", sendingBtn:"Envoi...",
    toastSelectMin2:"Sélectionnez au moins 2 entreprises à comparer.", toastMapUnavailable:"⚠️ Carte indisponible — vérifiez votre connexion", toastPlaceNotFound:"Lieu introuvable. Essayez un autre nom.", toastLocationDetected:"Localisation détectée !",
    toastEnterEmail:"Indiquez votre e-mail", toastEnterEmail2:"Saisissez un e-mail", toastPwdReset:"Mot de passe réinitialisé ! Vous pouvez vous connecter.", toastLoginToRegister:"Connectez-vous pour enregistrer votre entreprise.", toastPwdChanged:"Mot de passe modifié.", toastAccountDeleted:"Compte supprimé.",
    toastSelectRating:"Sélectionnez une note (1-5 étoiles)", toastReviewPublished:"Avis publié !", toastWriteReply:"Écrivez une réponse", toastReplyPublished:"Réponse publiée", toastMsgTooShort:"Message trop court", toastMsgSent:"Message envoyé avec succès !",
    toastReportUpdated:"Signalement mis à jour", toastCompanyApproved:"Entreprise approuvée", toastCompanyRejected:"Entreprise rejetée", toastCompanyRemoved:"🗑️ Entreprise supprimée", toastLoadingStats:"Chargement des statistiques...", toastStatsError:"Erreur lors du chargement des statistiques",
    compareMaxPrefix:"Vous pouvez comparer jusqu'à", compareMaxSuffix:"entreprises. Retirez-en une pour en ajouter une autre.", showingPrefix:"Affichage de", showingMid:"entreprises à",
    // ── profile / geo-help / admin coverage ──
    profileMyCompanies:"Mes entreprises", profileAdd:"Ajouter", profileEditTitle:"Modifier l'entreprise", profileNoCompanyMsg:"Enregistrez votre entreprise pour apparaître sur la carte et recevoir des devis.", profileAccount:"Compte",
    geoIOSLabel:"iPhone / iPad (Safari)", geoIOS1:"Ouvrez les <strong>Réglages</strong> de l'iPhone", geoIOS2:"Touchez <strong>Confidentialité et sécurité</strong>", geoIOS3:"Touchez <strong>Service de localisation</strong> et assurez-vous qu'il est <strong>activé</strong>", geoIOS4:"Trouvez <strong>Safari</strong> dans la liste et sélectionnez <strong>Lors de l'utilisation</strong>", geoIOS5:"Revenez au navigateur et touchez le bouton 📍", geoIOSAlt:"Sinon : touchez le bouton <strong>aA</strong> dans la barre d'adresse de Safari → <strong>Réglages du site</strong> → <strong>Localisation → Autoriser</strong>",
    geoAndroidLabel:"Android (Chrome)", geoAndroid1:"Touchez le <strong>cadenas 🔒</strong> dans la barre d'adresse", geoAndroid2:"Touchez <strong>Autorisations</strong>", geoAndroid3:"Sous <strong>Localisation</strong>, sélectionnez <strong>Autoriser</strong>", geoAndroid4:"Rechargez la page et touchez 📍", geoAndroidAlt:"Si le cadenas n'apparaît pas : Paramètres de Chrome → Paramètres du site → Localisation → autoriser ce site.",
    geoBrowserLabel:"Navigateur", geoGeneric1:"Cliquez sur le <strong>cadenas 🔒</strong> dans la barre d'adresse", geoGeneric2:"Trouvez <strong>Localisation</strong> et définissez-la sur <strong>Autoriser</strong>", geoGeneric3:"Rechargez la page",
    admPendingPlain:"En attente", admReviewed:"Examinés", admDismissed:"Rejetés", admAll:"Tous", admNoReports:"Aucun signalement.", admReasonFake:"Fausse entreprise", admReasonInappropriate:"Contenu inapproprié", admReasonDuplicate:"Doublon", admReasonWrongInfo:"Information incorrecte", admReasonSpam:"Spam", admReasonOther:"Autre", admReportedBy:"Signalé par", admViewCompany:"Voir l'entreprise", admMarkReviewed:"Marquer comme examiné", admDismiss:"Rejeter", admError:"Erreur", admErrorLoading:"Erreur de chargement", admAnonymous:"anonyme",
    admStatApproved:"Approuvées", admStatRejected:"Rejetées", admStatUsers:"Utilisateurs", admStatReviews:"Avis", admStatEvents7d:"Événements (7 j)", admStatNew7d:"Nouvelles (7 j)", admStatTotal:"Total entreprises", admViewPendingA:"Voir", admViewPendingB:"entreprise(s) en attente →", admSearchPh:"Rechercher par nom ou e-mail...", admStatusRemoved:"Supprimées", admNoCompanies:"Aucune entreprise trouvée.", admNoAccount:"sans compte", admRestore:"Restaurer", admApprove:"Approuver", admRemove:"Supprimer", admUnfeatureTitle:"Retirer la mise en avant", admFeatureTitle:"Mettre en avant", admUnfeatureBtn:"Retirer", admFeatureBtn:"☆ Mettre en avant", admFeatured:"Entreprise mise en avant", admUnfeatured:"Mise en avant retirée", adminPanelTitle:"Panneau Admin",
    navHome:'Accueil', navSearch:'Carte', navBuyer:'Espace Acheteur',
    recentlyViewed:'Vues récemment', recentRemove:'Retirer', recentClear:'Effacer',
    navSupplier:'Espace Fournisseur', navAbout:'À propos', navRegister:'Enregistrer Entreprise',
    searchUpdated:'Recherche mise à jour !',
    importOSM:'Importer Entreprises OSM',
    filterTitle:'Filtres', clearAll:'Tout Effacer', companiesFound:'entreprises trouvées',
    sortBy:'Trier Par', sortRating:'Meilleure Évaluation', sortReviews:'Plus Évalués', sortName:'Nom A–Z',
    sectorArea:"Secteur d'Activité", minRating:'Évaluation Minimale',
    ratingAny:'Toute évaluation', ratingOrMore:'ou plus',
    searchRadius:'Rayon de Recherche', featured:'En Vedette', ignoreRadius:'Ne pas utiliser le rayon', nearbyTitle:'Entreprises à Proximité', contactYourName:'Votre nom', contactYourEmail:'Votre email (pour la réponse de l\'entreprise)', contactNameReq:'Indiquez votre nom', contactEmailReq:'Indiquez un email valide', retryBtn:'Réessayer', dpStreetTitle:'Vue de la rue (Street View)', svOpenExternal:'Ouvrir dans Google Maps ↗', svFallback:'Si la vue ne se charge pas, ', svFallbackLink:'ouvrez-la dans Google Maps', claimLink:'🏷 C\u2019est votre entreprise ? Revendiquez cette fiche', claimTitle:'Revendiquer la fiche', claimIntro:'Pour prouver que vous gérez cette entreprise, nous envoyons un code à 6 chiffres à l\u2019email public de la fiche. Une fois revendiquée, vous pouvez la modifier, répondre aux avis et voir les statistiques.', claimSendBtn:'Envoyer le code à l\u2019email de la fiche', claimSentTo:'Code envoyé à', claimVerifyBtn:'Confirmer le code', claimSuccess:'Fiche revendiquée !', claimNeedLogin:'Connectez-vous pour revendiquer la fiche', claimCodeInvalid:'Saisissez le code à 6 chiffres', rfqCta:'Devis Gratuits', rfqTitle:'Demander des devis', rfqIntro:'Décrivez les travaux — nous envoyons la demande aux bonnes entreprises de votre zone et les propositions arrivent par email.', rfqSector:'Domaine d\u2019activité', rfqDesc:'Description des travaux', rfqDescPh:'Ex. : Rénovation complète de salle de bain (~4 m²).', rfqCity:'Localité', rfqTimeline:'Délai souhaité', rfqBudget:'Budget indicatif', rfqPhone:'Téléphone (optionnel)', rfqEmail:'Votre email', rfqSend:'Envoyer la demande', rfqSentA:'Demande envoyée à', rfqSentB:'entreprises ! Les propositions arriveront par email.', rfqDescShort:'Décrivez les travaux plus en détail (min. 20 caractères)', rfqCityReq:'Indiquez la localité', tlFlex:'Flexible', tlUrgent:'Urgent', tl1m:'Le mois prochain', tl3m:'Sous 3 mois', budNS:'Je ne sais pas encore', inboxBtn:'Messages clients', inboxTitle:'Messages clients', inboxEmpty:'Pas encore de messages.', inboxReplyPh:'Écrivez votre réponse…', inboxReplySend:'Répondre', inboxReplySent:'Réponse envoyée', inboxYou:'Vous', featureBtn:'Demander la mise en avant', featureSent:'Demande envoyée à l\u2019administrateur',
    topRated:'Mieux Noté', verified:'Vérifié', newEntry:'Nouveau Enregistrement',
    specialties:'Spécialités',
    mapLive:'Carte en direct', mapCity:'Lisbonne, Portugal',
    emptyTitle:'Aucune entreprise enregistrée',
    emptyMsg:"La carte est vide. Enregistrez la première entreprise pour qu'elle apparaisse ici comme marqueur.",
    emptyBtn:'Enregistrer Entreprise',
    detailLocation:'Localisation',
    detailContact:'Canaux de Contact',
    waName:'WhatsApp Direct', waDesc:'Message pré-rempli avec contexte',
    chatChannelName:'WhatsApp / Message', chatChannelDesc:'Contact direct via WhatsApp ou SMS',
    emailChannelName:'Passerelle E-mail', emailChannelDesc:'Demande formelle directement au fournisseur',
    detailSpecialties:'Spécialités', detailReviews:'Avis Vérifiés',
    detailCredentials:'Accréditations & Domaines d\'activité',
    detailActivities:'Domaines d\'activité', detailAlvara:'Alvará (Licence)', detailCertidao:'Certificat Permanent',
    detailNoActivities:'Aucun domaine d\'activité indiqué',
    credRequired:'Obligatoire', credOptional:'Facultatif',
    credLoginToView:'Connectez-vous pour voir',
    alvaraNotApplicable:'Non applicable', certidaoPending:'En vérification',
    popupCertOk:'Certificat enregistré', popupAlvaraOk:'Licence',
    noRatings:'Sans avis', reviews:'avis',
    review1:'"Excellent partenaire, livré dans les délais et avec une qualité supérieure aux attentes."',
    review2:'"Bonne communication et prix compétitifs. Recommandé pour des projets à moyen terme."',
    sectors:{
      pedreiros:'Maçons & Briqueteurs', escavacao:'Terrassement & Excavation', betao_cimento:'Béton & Ciment',
      estruturas_metalicas:'Charpente & Structures Métalliques', demolicao:'Démolition', alvenaria:'Maçonnerie',
      cofragem:'Coffrage & Ferraillage', impermeabilizacao:'Étanchéité & Imperméabilisation',
      eletricistas:'Électriciens', picheleiros:'Plombiers-Chauffagistes',
      canalizacao_saneamento:'Plomberie & Assainissement', climatizacao_avac:'CVC / Climatisation',
      gas:'Installation Gaz', domotica_automacao:'Domotique & Automatisation',
      energias_renovaveis:'Énergies Renouvelables / Photovoltaïque', seguranca_alarmes:'Sécurité & Alarmes',
      pocos_agua:'Forages & Puits',
      pintores:'Peintres en Bâtiment', estucadores:'Plâtriers-Staffeurs', pavimentos:'Revêtements de Sol & Chapes',
      azulejos:'Carrelage & Faïence', marmoraria:'Marbre & Pierre Naturelle',
      isolamento:'Isolation Thermique & Phonique', gesso_cartonado:'Placo-Plâtre / Cloisons Sèches',
      carpinteiros:'Charpentiers / Menuisiers Bâtiment', serralharia:'Métallerie & Serrurerie', aluminios_pvc:'Aluminium & PVC',
      caixilharia:'Menuiserie Extérieure', vidraceiros:'Miroitiers & Vitriers', portoes_vedacoes:'Portails & Clôtures',
      moveis_medida:'Ébénisterie & Meubles sur Mesure',
      telhados_coberturas:'Couverture & Zinguerie', piscinas:'Piscines',
      paisagismo_jardins:'Paysagisme & Aménagement Extérieur', jardineiros:'Jardiniers & Espaces Verts', vedacoes_muros:'Murs & Clôtures',
      calcetamento:'Pavage & Dallage Extérieur', fachadas:'Façades & Rénovation',
      arquitetura_projetos:'Architecture & Maîtrise d\'Œuvre', engenharia_civil:'Génie Civil',
      topografia:'Géomètre & Topographie', gestao_obra:'Conduite de Travaux',
      certificacao_energetica:'Diagnostic de Performance Énergétique (DPE)', seguranca_trabalho:'Prévention & Sécurité',
      design_interiores:'Architecture Intérieure & Décoration', materiais_construcao:'Matériaux de Construction',
      equipamentos_construcao:'Matériel & Engins de Chantier',
      chave_na_mao_construcao:'Construction Clé en Main', chave_na_mao_remodelacao:'Rénovation Clé en Main',
      chave_na_mao_moradia:'Maisons Clé en Main', chave_na_mao_apartamento:'Appartements Clé en Main',
      chave_na_mao_comercial:'Aménagement Commercial Clé en Main'
    },
    sectorOptions:{
      pedreiros:'Maçons & Briqueteurs', escavacao:'Terrassement & Excavation', betao_cimento:'Béton & Ciment',
      estruturas_metalicas:'Charpente & Structures Métalliques', demolicao:'Démolition', alvenaria:'Maçonnerie',
      cofragem:'Coffrage & Ferraillage', impermeabilizacao:'Étanchéité & Imperméabilisation',
      eletricistas:'Électriciens', picheleiros:'Plombiers-Chauffagistes',
      canalizacao_saneamento:'Plomberie & Assainissement', climatizacao_avac:'CVC / Climatisation',
      gas:'Installation Gaz', domotica_automacao:'Domotique & Automatisation',
      energias_renovaveis:'Énergies Renouvelables / Photovoltaïque', seguranca_alarmes:'Sécurité & Alarmes',
      pocos_agua:'Forages & Puits',
      pintores:'Peintres en Bâtiment', estucadores:'Plâtriers-Staffeurs', pavimentos:'Revêtements de Sol & Chapes',
      azulejos:'Carrelage & Faïence', marmoraria:'Marbre & Pierre Naturelle',
      isolamento:'Isolation Thermique & Phonique', gesso_cartonado:'Placo-Plâtre / Cloisons Sèches',
      carpinteiros:'Charpentiers / Menuisiers Bâtiment', serralharia:'Métallerie & Serrurerie', aluminios_pvc:'Aluminium & PVC',
      caixilharia:'Menuiserie Extérieure', vidraceiros:'Miroitiers & Vitriers', portoes_vedacoes:'Portails & Clôtures',
      moveis_medida:'Ébénisterie & Meubles sur Mesure',
      telhados_coberturas:'Couverture & Zinguerie', piscinas:'Piscines',
      paisagismo_jardins:'Paysagisme & Aménagement Extérieur', jardineiros:'Jardiniers & Espaces Verts', vedacoes_muros:'Murs & Clôtures',
      calcetamento:'Pavage & Dallage Extérieur', fachadas:'Façades & Rénovation',
      arquitetura_projetos:'Architecture & Maîtrise d\'Œuvre', engenharia_civil:'Génie Civil',
      topografia:'Géomètre & Topographie', gestao_obra:'Conduite de Travaux',
      certificacao_energetica:'Diagnostic de Performance Énergétique (DPE)', seguranca_trabalho:'Prévention & Sécurité',
      design_interiores:'Architecture Intérieure & Décoration', materiais_construcao:'Matériaux de Construction',
      equipamentos_construcao:'Matériel & Engins de Chantier',
      chave_na_mao_construcao:'Construction Clé en Main', chave_na_mao_remodelacao:'Rénovation Clé en Main',
      chave_na_mao_moradia:'Maisons Clé en Main', chave_na_mao_apartamento:'Appartements Clé en Main',
      chave_na_mao_comercial:'Aménagement Commercial Clé en Main'
    },
    sectorGroups:{
      estrutura_fundacao:'Gros Œuvre', instalacoes:'Installations', acabamentos:'Finitions',
      carpintaria:'Menuiserie', serralharia_metal:'Métallerie', exterior_jardim:'Extérieur', projeto_gestao:'Conception', chave_na_mao:'Clé en Main',
      obra_grossa:'Gros Œuvre', redes_tecnicas:'Réseaux Techniques', revestimentos:'Revêtements & Peinture',
      madeira:'Bois & Mobilier', metal_vidro:'Métal, Verre & Menuiserie', exteriores:'Extérieurs & Jardin', projetos:'Projets & Conseil'
    },
    regTitle:'Enregistrer une Nouvelle Entreprise',
    regSub:"Remplissez les données pour ajouter votre entreprise à la plateforme Hivex. Les champs avec",
    regSubSuffix:'sont obligatoires.',
    regCompanyName:"Nom de l'Entreprise", regNamePh:"Ex : Nom de l'Entreprise, SA",
    regSectorLabel:"Secteur d'Activité", regSectorPh:'Sélectionner un secteur...',
    regCae:'Code CAE', regCaePh:'Ex : CAE 41 – Construction',
    regAlvara:'Licence Commerciale (Alvará)', regAlvaraPh:'Numéro de licence',
    valAlvara:'Veuillez saisir le numéro de licence commerciale',
    regCertidao:'Code du Certificat Permanent', regCertidaoPh:'Ex : 1234-5678-9012',
    regCertidaoHint:"Code d'accès au registre commercial portugais (Certidão Permanente — 12 chiffres, format XXXX-XXXX-XXXX).",
    valCertidao:'Veuillez saisir le code du Certificat Permanent.',
    valCertidaoFormat:'Code du Certificat Permanent invalide (minimum 8 caractères alphanumériques).',
    regAddress:'Adresse', regAddressPh:'Ex : Av. da Liberdade 200, Lisbonne',
    regZone:'Localité / Zone',
    regEmail:'E-mail de Contact', regEmailPh:'entreprise@email.fr',
    regPhone:'Téléphone / WhatsApp',
    regWebsite:'Site Web', regWebsitePh:'https://www.entreprise.fr',
    regLogo:'Logo de l\'entreprise', regLogoPick:'Choisir une image…', regLogoRemove:'Retirer', regLogoEmpty:'Aucune image', regLogoHint:'JPG ou PNG — redimensionné et compressé. Affiché comme logo de l\'entreprise.', regLogoInvalid:'Fichier image invalide.',
    regSpecialties:'Spécialités', regTagsPh:'Ex : Construction Civile, Travaux Publics, International',
    regTagsHint:'Séparez les spécialités par des virgules.',
    regDescription:'Description Brève', regDescPh:"Brève description de l'entreprise, services fournis...",
    regCancel:'Annuler', regSubmit:'Enregistrer Entreprise',
    zones:{
      lisbon_center:'Lisbonne Centre', lisbon_north:'Lisbonne Nord',
      lisbon_east:'Lisbonne Est / Parc des Nations', lisbon_west:'Lisbonne Ouest / Belém',
      oeiras:'Oeiras', sintra:'Sintra', cascais:'Cascais',
      setubal:'Setúbal', porto:'Porto', braga:'Braga'
    },
    emailTitle:'Demande de Devis',
    emailSub:'Envoyé directement au fournisseur via e-mail vérifié.',
    emailSubject:'Objet', emailSubjectVal:'Demande de Devis – Hivex Marketplace',
    emailType:'Type de Demande',
    emailTypes:["Demande de Devis","Demande d'Information","Proposition de Partenariat"],
    emailMessage:'Message',
    emailMessageVal:"Bonjour,\n\nJ'ai trouvé votre entreprise sur la plateforme Hivex et je souhaiterais demander un devis pour...",
    emailAttach:'Joindre un fichier (facultatif)', emailCancel:'Annuler', emailSend:'Envoyer la Demande',
    chatOnline:'● En ligne maintenant', chatPlaceholder:'Écrire un message...',
    chatMsg1:"Bonjour ! J'ai vu votre profil sur Hivex. Pouvez-vous m'envoyer une proposition ?",
    chatMsg2:'Bonjour ! Avec plaisir. Pouvez-vous partager les spécifications techniques ?',
    chatMsg3:'Parfait, voici les détails du projet.',
    toastFiltersCleared:'Tous les filtres effacés !',
    toastWhatsapp:'Ouverture de WhatsApp...', toastEmailSent:'Demande de devis envoyée avec succès !',
    toastAutoReply:'Merci pour votre message ! Nous répondrons bientôt.',
    valName:"Veuillez saisir le nom de l'entreprise.",
    valSector:"Veuillez sélectionner le secteur d'activité.",
    valAddress:"Veuillez saisir l'adresse.",
    valEmail:"Veuillez saisir l'e-mail de contact.",
    valTags:'Veuillez saisir au moins une spécialité.',
    toastRegistered: name => `"${name}" enregistrée avec succès ! Visible sur la carte.`,
    popupNoRatings:'Aucun avis encore', popupNewBadge:'Nouveau Enregistrement',
    openNow:'Ouvert', closedNow:'Fermé', newOnHivex:'Nouveau sur Hivex',
    btnSearch:'Rechercher',
    heroLabel:'Marketplace B2B & B2C',
    heroTitleMain:'Connectez. Collaborez. ', heroTitleAccent:'Grandissez.',
    heroSub:'Hivex unit entreprises et particuliers avec les meilleurs prestataires de services — rapidement, en toute transparence et avec un contrôle total.',
    heroBtnSearch:'Explorer les Entreprises', heroBtnRegister:'Enregistrer mon Entreprise',
    whatLabel:"Qu'est-ce que Hivex", whatTitle:'Une plateforme pour tous',
    whatSub:"Hivex a été créée pour simplifier la façon dont les clients et les fournisseurs se trouvent. Que vous soyez une entreprise à la recherche de partenaires stratégiques, ou un particulier ayant besoin d'un service rapide — Hivex vous connecte à des experts de confiance, avec des évaluations vérifiées et un contact direct.",
    uc1Title:'Entreprise à Entreprise (B2B)', uc1Desc:"Entreprises à la recherche de fournisseurs, sous-traitants ou partenaires stratégiques. Idéal pour des projets de grande envergure, des contrats à long terme et des relations commerciales continues.",
    uc2Title:'Particulier à Entreprise (B2C)', uc2Desc:"Particuliers ayant besoin d'un service professionnel à usage personnel ou domestique — rénovation, construction, installation ou maintenance. Simple, rapide et sans intermédiaires.",
    houseLabel:'Exemple pratique', houseTitle:'Construire une maison ? Trouvez tous les spécialistes',
    houseIntro:"La construction d'une maison implique des dizaines de spécialités différentes. Avec Hivex, vous pouvez identifier et contacter des entreprises pour chaque phase des travaux — tout sur une seule plateforme.",
    houseCta:'Avec Hivex, faites une <strong>recherche rapide avec filtres</strong> pour chaque spécialité, comparez les évaluations et <strong>demandez des devis à plusieurs entreprises</strong> — le tout au même endroit, sans appels téléphoniques ni intermédiaires.',
    houseSpecialties:[
      {icon:'ruler',name:'Architecture & Projets',sub:'Projet de construction et permis'},
      {icon:'hammer',name:'Entrepreneur Général',sub:'Gestion et coordination des travaux'},
      {icon:'layers',name:'Maçonnerie & Structures',sub:'Fondations, béton armé et structure'},
      {icon:'zap',name:'Installations Électriques',sub:'Tableaux, câblage et éclairage'},
      {icon:'droplets',name:'Plomberie & Assainissement',sub:'Eau, égouts, gaz et chauffage'},
      {icon:'square',name:'Menuiserie & Vitrage',sub:'Fenêtres, portes et vitrages'},
      {icon:'paintbrush',name:'Peinture & Finitions',sub:'Murs, plafonds et revêtements'},
      {icon:'scissors',name:'Charpenterie & Ébénisterie',sub:'Portes, armoires et mobilier intégré'},
      {icon:'home',name:'Toiture & Étanchéité',sub:'Toits, balcons et terrasses'},
      {icon:'wind',name:'Climatisation / CVC',sub:'Chauffage, climatisation et ventilation'}
    ],
    stepsLabel:'Comment ça marche', stepsTitle:'En 3 étapes simples',
    step1Title:'Recherchez avec des filtres', step1Desc:'Filtrez par secteur, localisation, évaluation et spécialité. La carte se met à jour en temps réel avec les entreprises correspondantes.',
    step2Title:'Comparez les entreprises', step2Desc:"Consultez les profils détaillés, les évaluations multidimensionnelles en qualité, délais, communication et prix, et les spécialités de chaque entreprise.",
    step3Title:'Demandez des devis', step3Desc:'Contactez directement par e-mail formel, chat interne en temps réel ou WhatsApp. Sans intermédiaires, sans délais.',
    ctaTitle:'Prêt à commencer ?', ctaSub:"Explorez les entreprises disponibles ou enregistrez votre entreprise sur Hivex dès aujourd'hui.",
    helpTitle:"Centre d'Aide", helpSubtitle:"Support Hivex — nous sommes là pour vous aider",
    helpTabSupport:'Support Client', helpTabAbout:'À propos de Hivex',
    helpSupportIntro:'Nous sommes là pour vous aider ! Contactez-nous via les canaux suivants :',
    helpChatTitle:'Chat en Temps Réel', helpChatDesc:'Contactez-nous instantanément via le chat intégré à la plateforme.', helpChatBtn:'Ouvrir le Chat',
    helpEmailTitle:'E-mail', helpEmailDesc:'geral.hivex@gmail.com — Réponse sous 24 heures ouvrables.', helpEmailBtn:"Envoyer un E-mail",
    helpPhoneTitle:'Téléphone', helpPhoneDesc:'+351 XXX XXX XXX · Lun-Ven : 09h–18h', helpPhoneBtn:'Appeler',
    helpFaqTitle:'FAQ', helpFaqDesc:'Trouvez des réponses aux questions les plus fréquentes.', helpFaqBtn:'Voir la FAQ',
    helpWhoTitle:'Qui Sommes-Nous', helpWhoDesc:"HIVE est une plateforme numérique innovante qui connecte entreprises, professionnels indépendants et particuliers, facilitant la création de relations commerciales transparentes et fiables. Nous opérons au Portugal avec l'objectif de démocratiser l'accès à des services de qualité, en éliminant les intermédiaires et en réduisant les coûts.",
    helpStatPros:'Entreprises Vérifiées', helpStatCompanies:'Entreprises Inscrites',
    helpMissionTitle:'Mission', helpMissionDesc:"Simplifier et démocratiser l'accès à des services professionnels de qualité, en créant un écosystème transparent où entreprises et professionnels peuvent grandir ensemble, sans intermédiaires inutiles.",
    helpVisionTitle:'Vision', helpVisionDesc:'Être la plateforme de référence au Portugal pour connecter entreprises et professionnels, en favorisant la croissance économique et en créant des opportunités pour tous.',
    navLogin:'Connexion / Inscription', navHelp:'Aide',
    themeToDark:'Sombre', themeToLight:'Clair', themeModeDark:'Mode sombre', themeModeLight:'Mode clair',
    testimonialPhrases:['Professionnalisme et qualité de travail excellents.','Très ponctuels et travail impeccable. Je recommande !','Excellent rapport qualité-prix. Je ferai de nouveau appel à eux.','Équipe très compétente et organisée.','Ont dépassé les attentes. Travail de premier ordre.','Des professionnels sérieux et de confiance.','Service rapide et efficace. Très satisfait.','Excellent accueil du début à la fin.','Délais et budget respectés. Je recommande !','Travail soigné et beaucoup de sympathie.'],
    navFavourites:'Favoris', navFaq:'FAQ', navPrivacy:'Confidentialité', avatarLogout:'Se déconnecter', avatarFaqHelp:'FAQ & Aide',
    lpHeroRegisterCta:'Inscrivez votre Entreprise', lpHeroRegisterHint:"Vous êtes une entreprise ? Apparaissez sur la carte en quelques minutes.",
    lpHeroLoginHint:'Vous avez déjà un compte ?', lpHeroLoginLink:'Connexion',
    lpHeroTitle:'Trouvez les meilleurs<br><span class="hero-accent">professionnels</span> du bâtiment',
    lpHeroSub:'Comparez les avis et demandez des devis en quelques minutes.',
    lpEarlyAccessText:"Plateforme récente — inscrivez votre entreprise en quelques minutes.",
    lpTabLocation:'Par Lieu', lpTabActivity:'Par Activité',
    lpLocationLabel:'Localisation', lpLocationPh:'Lisbonne, Porto, Braga...',
    lpActivityLabel:"Domaine d'Activité / Service", lpSelectActivity:'Sélectionnez une activité...',
    lpHeroCatsLabel:'Que cherchez-vous?',
    statCompanies:'Entreprises enregistrées', statAreas:"Domaines d'activité", statSpecialties:'Spécialités', statCoverage:'Tout le Portugal',
    featuredOverline:'Entreprises en vedette', featuredTitle:'Les mieux notés', featuredSeeAll:'Voir toutes les entreprises →', featuredEmpty:'Aucune entreprise en vedette encore.',
    featuredVerified:'✓ Vérifié', featuredReviews:'avis',
    ubFeaturedBtn:'Entreprises en Vedette', featEmpty:'Aucune entreprise en vedette pour l’instant.', featCta:'Vous voulez apparaître ici en premier ? Mettez votre entreprise en avant', featuredBadge:'En vedette',
    lpStep1Title:'Recherchez', lpStep1Desc:'Filtrez par secteur, lieu et évaluation. La carte affiche les résultats en temps réel.',
    lpStep2Title:'Comparez', lpStep2Desc:"Consultez des profils détaillés avec des évaluations multidimensionnelles et les spécialités de chaque entreprise.",
    lpStep3Title:'Contactez', lpStep3Desc:'Demandez des devis directement par e-mail ou chat. Sans intermédiaires, sans délais.',
    lpForWhom:'Pour qui?', lpPlatformTitle:'Une plateforme pour tous',
    lpB2bBadge:'B2B · Pour Entreprises', lpB2bTitle:'Entreprise à Entreprise',
    lpB2bDesc:'Trouvez des fournisseurs, des partenaires stratégiques et des sous-traitants spécialisés. Idéal pour des projets exigeants et des contrats à long terme.',
    lpB2bBtn:'Explorer comme entreprise →',
    lpB2cBadge:'B2C · Pour Particuliers', lpB2cTitle:'Particulier à Entreprise',
    lpB2cDesc:"Besoin de réparations, de rénovations ou d'installations? Comparez des professionnels vérifiés et demandez des devis sans complications.",
    lpB2cBtn:'Trouver un professionnel →',
    // ── Missing i18n keys ──
    toastEmailUnavailable:"📧 E-mail non disponible — utilisez WhatsApp ou le Chat interne",
    toastPhoneUnavailable:'📞 Téléphone non disponible',
    toastLinkCopied:'Lien copié !',
    toastCopyFailed:'Impossible de copier',
    toastGeoNotSupported:'Géolocalisation non supportée par ce navigateur.',
    toastGeoPermissionDenied:'Permission de localisation refusée.',
    toastGeoPositionUnavailable:'Position non disponible.',
    toastGeoTimeout:'Délai de localisation dépassé.',
    toastGeoError:'Erreur de localisation.',
    toastLocationFound:'Position actuelle trouvée !',
    toastLocationFailed:'Impossible de trouver la position.',
    toastLocationError:'Erreur lors de la recherche de localisation.',
    toastRegisterError:'Erreur lors de la sauvegarde. Vérifiez la connexion et réessayez.',
    emailQuoteSubject:'Demande de Devis',
    emailQuoteBody:"Bonjour,\n\nJe souhaiterais obtenir un devis pour vos services.\n\nDétails du projet :\n- Description : \n- Localisation : \n- Délai souhaité : \n\nDans l'attente de votre réponse.\n\nCordialement",
    searchListEmpty:'Aucune entreprise trouvée',
    searchListEmptySub:'Essayez de modifier les filtres ou augmenter le rayon de recherche',
    mapHintNoResults:'Aucune entreprise trouvée dans cette zone',
    mapHintNoResultsSub:'Essayez d\'augmenter le rayon de recherche ou sélectionnez une autre activité',
    mapHintSelectSector:'Sélectionnez un domaine d\'activité',
    mapHintSelectSectorSub:'pour voir les entreprises sur la carte',
    noRatingText:'Pas encore noté',
    regTypeCompany:"Inscription Entreprise",
    regTypeClient:'🔍 Inscription Client',
    typeCompanyLabel:'Entreprise',
    typeClientLabel:'Client',
    typeAdvertiserLabel:'Annonceur',
    avatarRegisterCompany:'Enregistrer Entreprise',
    statusApproved:'Approuvée', statusPending:'En attente', statusRejected:'Rejetée', statusRemoved:'🗑️ Supprimée',
    postRegAria:'Prochaines étapes',
    postRegWelcome:'Bienvenue sur Hivex !', postRegWelcomeNamed:'Bienvenue sur Hivex, {name} !',
    postRegPrompt:'Que souhaitez-vous faire ?',
    postRegAdvertiseTitle:'Annoncer mon entreprise',
    postRegAdvertiseDesc:'Enregistrer mon entreprise et apparaître sur le marketplace',
    postRegBrowseTitle:'Parcourir les entreprises',
    postRegBrowseDesc:'Explorer le marketplace pour trouver des professionnels',
    postRegFooterHint:'Vous pourrez annoncer votre entreprise plus tard depuis le menu du compte.',
    reportAria:'Signaler une annonce', reportTitle:'Signaler une annonce',
    reportSubtitle:'Les signalements sont examinés par notre équipe de modération.',
    reportReasonLabel:'Motif', reportReasonPh:'Sélectionner un motif…',
    reportReasonFake:'Entreprise fictive ou inexistante', reportReasonInappropriate:'Contenu inapproprié',
    reportReasonDuplicate:'Annonce en double', reportReasonWrongInfo:'Informations incorrectes',
    reportReasonSpam:'Spam', reportReasonOther:'Autre',
    reportDetailsLabel:'Détails (facultatif)', reportDetailsPh:'Décrivez le problème (jusqu’à 500 caractères)',
    reportSubmit:'Envoyer le signalement', btnCancel:'Annuler',
    regSuccessTitle:'Inscription reçue !',
    regSuccessSub:"Votre inscription a bien été reçue et est en cours de validation par notre équipe. Une fois approuvée, votre entreprise apparaîtra sur la carte et vous recevrez un email de confirmation.",
    regSuccessStep1:'En cours de validation — généralement approuvée sous <strong>24 heures ouvrables</strong>.',
    regSuccessStep2:'✉️ Vous recevrez un <strong>email</strong> dès son approbation.',
    regSuccessStep3:'✏️ Modifiez les détails depuis <strong>Mon Profil</strong>.',
    heroUserGreeting:'Bonjour !', heroUserGreetingNamed:'Bonjour, {name} !',
    heroUserTagline:'Vous souhaitez annoncer votre entreprise sur le marketplace ?',
    heroUserCta:'Annoncer Entreprise',
    sectorAllLabel:'Tous les domaines',
    sectorAllSelectAll:'Sélectionner tous les domaines',
    sectorAllDeselectAll:'Désélectionner tous les domaines', sectorSelectAllHere:'Tout sélectionner',
    emptySectorTitle:'Sélectionnez un domaine d’activité',
    emptySectorSub:'Choisissez un ou plusieurs secteurs ci-dessus pour voir les entreprises disponibles.',
    dpFavTitle:'Enregistrer dans les favoris', dpEditTitle:'Modifier', dpEditAria:'Modifier l’entreprise',
    dpCloseAria:'Fermer les détails', dpReportTitle:'Signaler l’annonce',
    authWelcome:'Bienvenue sur Hivex', authTagline:'Le plus grand réseau B2B du Portugal',
    authTabLogin:'Connexion', authTabRegister:'Créer un compte',
    authDividerEmail:'ou continuer avec un email', authDividerData:'ou remplissez les informations',
    authEmailLabel:'Email', authPasswordLabel:'Mot de passe',
    authPasswordPh:'Au moins 8 caractères', authPasswordHint:'Au moins 8 caractères.',
    authLoginSubmit:'Connexion', authRegisterSubmit:'Créer un compte',
    authNoAccount:'Pas encore de compte ?', authHasAccount:'Vous avez déjà un compte ?',
    capsLockOn:'⚠️ Verr. Maj est activée', pwdToggleAria:'Afficher/masquer le mot de passe',
    authAria:'Se connecter ou créer un compte',
    toastFavRemoved:'Retiré des favoris', toastFavAdded:'★ Ajouté aux favoris',
    toastNoEditPermission:"Vous n'êtes pas autorisé à modifier cette entreprise.",
    toastCompanyUpdated:'Entreprise mise à jour avec succès !',
    toastReportLoginRequired:'Connectez-vous pour signaler une annonce.',
    toastReportSelectReason:'Sélectionnez un motif.',
    toastReportSent:'Signalement envoyé. Merci de nous aider à garder la plateforme sûre.',
    toastReportFailed:"Impossible d'envoyer le signalement.",
    toastFillFields:'Remplissez tous les champs',
    toastFillRequired:'Remplissez les champs obligatoires',
    toastBadCredentials:'Email ou mot de passe incorrect',
    toastTooManyAttempts:'Trop de tentatives. Réessayez plus tard.',
    toastWelcomeUser:'Bienvenue, {name} !',
    toastLoggedOut:'Déconnecté',
    toastGoogleFailed:'Échec de la connexion Google',
    toastRegisterFailed:'Échec de la création du compte',
    toastPasswordTooShort:'Le mot de passe doit contenir au moins 8 caractères',
    regAuthNameLabel:'Nom complet',
    regAuthNamePh:'Votre nom',
    lpTabCompany:'Par Entreprise',
    lpCompanyLabel:"Nom de l'Entreprise",
    lpCompanyPh:'Ex : Construções Ribeiro, ElectroLux...',
    legendTitle:'🎨 Légende',
    legendEstrutura:'Structure',
    legendInstalacoes:'Installations',
    legendAcabamentos:'Finitions',
    legendCarpintaria:'Menuiserie',
    legendSerralharia:'Métallerie',
    legendExterior:'Extérieur',
    legendProjeto:'Projet',
    legendChaveNaMao:'Clé en main',
    btnRequestQuote:'Demander un Devis',
    testimonial1Name:'Votre entreprise ici',
    testimonial1Sector:'Inscrivez-vous sur HIVE',
    testimonial1Quote:'Rejoignez la plateforme et connectez-vous avec de nouveaux clients à travers le Portugal.',
    testimonial2Name:'Professionnels vérifiés',
    testimonial2Sector:'Qualité garantie',
    testimonial2Quote:'Toutes les entreprises sont évaluées par les clients pour garantir le meilleur service.',
    testimonial3Name:'Devis gratuits',
    testimonial3Sector:'Sans engagement',
    testimonial3Quote:'Demandez des devis à plusieurs professionnels et comparez les prix facilement.',
    testimonial4Name:'Clé en main',
    testimonial4Sector:'Projets complets',
    testimonial4Quote:'Trouvez tous les professionnels pour votre projet sur une seule plateforme.',
    footerDesc:'Marketplace de construction au Portugal. Nous connectons entreprises et particuliers avec des professionnels vérifiés.',
    footerNav:'Navigation',
    footerLegal:'Juridique',
    footerContact:'Contact',
    footerTerms:'Conditions de Service',
    footerPrivacy:'Politique de Confidentialité',
    footerCookies:'Cookies',
    footerRights:'Hivex — Tous droits réservés',
    factSince:'Depuis', factHours:'Horaires', factVerified:'Vérifiée', factYear:'an', factYears:'ans',
    review1Author:'TechCorp Sarl',
    review2Author:'Ibérica Solutions SA',
    logoTagline:'Professionnels du Bâtiment au Portugal',
    adBadge:'🏠 Exemple Pratique',
    adTitle:'Construire une maison?',
    adNavSub:'10 spécialistes, 1 plateforme',
    adMainSub:'8 domaines, 1 plateforme',
    adCta:'Trouvez<br>tout ici',
    adHivexBadge:'Hivex',
    adHivexTitle:'Du terrain à la maison',
    adHivexSub:'Votre projet, étape par étape',
    adHivexB2C:'Les clients trouvent des entreprises',
    adHivexB2B:'Les entreprises trouvent des partenaires',
    adHivexCta:'Rejoignez-<br>nous',
    adStory1:'Un terrain',
    adStory2:'Ouvrez Hivex',
    adStory3:'Trouvez des spécialistes',
    adStory4:'Demandez un devis',
    adStory5:'Signez le contrat',
    adStory6:'Maison construite',
    adNodeClient:'Client',
    adNodeCompany:'Entreprise',
    footerRgpd:'RGPD',
    successTitle:'Demande envoyée !',
    successSub:'Votre demande a été reçue et est en attente de validation. Vous recevrez un email de confirmation dès que l\'entreprise sera approuvée.',
    successClose:'Fermer',
    sortAll:'Toutes',
    regStep1Label:'Identité',
    regStep2Label:'Localisation',
    regStep3Label:'Détails',
    regStepNext:'Suivant',
    regStepBack:'Retour',
    regCountry:'Pays',
    regPostalCode:'Code Postal',
    regCity:'Localité / Ville'
  },

  es: {
    // ── UI coverage additions ──
    viewMap:"Mapa", viewList:"Lista", resultCompany:"empresa", resultCompanies:"empresas",
    profileTitle:"Mi perfil",
    contactTitle:"Enviar mensaje", contactSub:"Tu mensaje se entregará directamente a la empresa",
    contactMsgLabel:"Mensaje", contactMsgPh:"¡Hola! Me gustaría solicitar información sobre vuestros servicios...",
    contactPrivacy:"El correo de la empresa nunca se comparte contigo — Hivex entrega tu mensaje de forma segura.",
    adminTitle:"Panel de administración", adminTabStats:"Estadísticas", adminTabPending:"Pendientes", adminTabAll:"Todas", adminTabReports:"Reportes",
    loadingGeneric:"Cargando...",
    statusTitle:"Estado del registro", statusPrompt:"Introduce el correo con el que registraste tu empresa para verificar el estado.", statusVerify:"Verificar",
    dpDragClose:"desliza para cerrar", dpCloseTitle:"Cerrar", dpCallTitle:"Llamar", dpShareTitle:"Compartir",
    dpDirectionsTitle:"Cómo llegar", routeLocating:"Obteniendo su ubicación…", routeNoLocation:"No se pudo obtener su ubicación.", routeError:"No se pudo calcular la ruta.", dpMoreInfo:"Más información",
    loginGateTitle:"Inicia sesión para ver los contactos", loginGateDesc:"Crea una cuenta gratuita para acceder a contactos, dirección, valoraciones y pedir presupuestos.", loginGateBtn:"Iniciar sesión / Crear cuenta gratis",
    reviewsHeading:"Valoraciones", reviewFormTitle:"✍️ Tu valoración", reviewPh:"Comparte tu experiencia con esta empresa...", reviewSubmit:"Publicar valoración", reviewWrite:"+ Escribir valoración",
    closeBtn:"Cerrar",
    regNifHint:"9 dígitos. Validamos el formato y el dígito de control.", regSectorPlaceholder:"Seleccionar áreas de actividad...", regSectorMultiHint:"Puedes seleccionar varias áreas de actividad.",
    optionalTag:"(opcional)", regAlvaraHint:"Número de licencia de construcción, si procede.", regCountryPh:"Selecciona un país",
    countryPT:"Portugal", countryES:"España", countryFR:"Francia", countryIT:"Italia", countryDE:"Alemania", countryUK:"Reino Unido", countryNL:"Países Bajos", countryBE:"Bélgica", countryCH:"Suiza", countryAT:"Austria", countryOther:"Otro país",
    regAddressHint:"Incluye calle, número, piso y detalles para una ubicación precisa en el mapa.", regFoundedPh:"ej. 2010", regHoursPh:"ej. Lun-Vie 9h-18h, Sáb 9h-13h", regPortfolioPh:"URLs separadas por comas (hasta 12)",
    geoTitle:"Ubicación bloqueada", geoIntro:"El navegador bloqueó el acceso a la ubicación. Sigue los pasos siguientes para activarla.", geoRetry:"Intentar de nuevo", geoSkip:"Continuar sin ubicación",
    forgotBackLogin:"Volver a iniciar sesión", resetNewPwdLabel:"Nueva contraseña", min8Chars:"Mínimo 8 caracteres.",
    changePwdTitle:"Cambiar contraseña", changePwdBody:"Introduce tu contraseña actual y luego la nueva (mínimo 8 caracteres).", changePwdCurrent:"Contraseña actual", changePwdNew:"Nueva contraseña", changePwdSubmit:"Cambiar contraseña",
    delAccTitle:"Eliminar cuenta", delAccWarn:"Esta acción es <strong>permanente</strong>. Tus valoraciones y favoritos se eliminarán. Las empresas que registraste permanecen en la plataforma, pero sin propietario asociado.", delAccConfirmPwd:"Confirma tu contraseña", delAccSubmit:"Eliminar definitivamente",
    compareOfThree:"de 3 seleccionadas",
    // ── JS-string coverage (toasts, dynamic labels) ──
    contactSendTo:"Enviar mensaje a", sendingBtn:"Enviando...",
    toastSelectMin2:"Selecciona al menos 2 empresas para comparar.", toastMapUnavailable:"⚠️ Mapa no disponible — comprueba tu conexión", toastPlaceNotFound:"Lugar no encontrado. Prueba otro nombre.", toastLocationDetected:"¡Ubicación detectada!",
    toastEnterEmail:"Indica tu correo", toastEnterEmail2:"Introduce un correo", toastPwdReset:"¡Contraseña restablecida! Ya puedes iniciar sesión.", toastLoginToRegister:"Inicia sesión para registrar tu empresa.", toastPwdChanged:"Contraseña cambiada.", toastAccountDeleted:"Cuenta eliminada.",
    toastSelectRating:"Selecciona una valoración (1-5 estrellas)", toastReviewPublished:"¡Valoración publicada!", toastWriteReply:"Escribe una respuesta", toastReplyPublished:"Respuesta publicada", toastMsgTooShort:"Mensaje demasiado corto", toastMsgSent:"¡Mensaje enviado con éxito!",
    toastReportUpdated:"Reporte actualizado", toastCompanyApproved:"Empresa aprobada", toastCompanyRejected:"Empresa rechazada", toastCompanyRemoved:"🗑️ Empresa eliminada", toastLoadingStats:"Cargando estadísticas...", toastStatsError:"Error al cargar estadísticas",
    compareMaxPrefix:"Puedes comparar hasta", compareMaxSuffix:"empresas. Quita una para añadir otra.", showingPrefix:"Mostrando", showingMid:"empresas en",
    // ── profile / geo-help / admin coverage ──
    profileMyCompanies:"Mis empresas", profileAdd:"Añadir", profileEditTitle:"Editar empresa", profileNoCompanyMsg:"Registra tu empresa para aparecer en el mapa y recibir presupuestos.", profileAccount:"Cuenta",
    geoIOSLabel:"iPhone / iPad (Safari)", geoIOS1:"Abre los <strong>Ajustes</strong> del iPhone", geoIOS2:"Toca <strong>Privacidad y seguridad</strong>", geoIOS3:"Toca <strong>Localización</strong> y asegúrate de que está <strong>activada</strong>", geoIOS4:"Encuentra <strong>Safari</strong> en la lista y selecciona <strong>Al usar la app</strong>", geoIOS5:"Vuelve al navegador y toca el botón 📍", geoIOSAlt:"Como alternativa: toca el botón <strong>aA</strong> en la barra de direcciones de Safari → <strong>Ajustes del sitio web</strong> → <strong>Localización → Permitir</strong>",
    geoAndroidLabel:"Android (Chrome)", geoAndroid1:"Toca el <strong>candado 🔒</strong> en la barra de direcciones", geoAndroid2:"Toca <strong>Permisos</strong>", geoAndroid3:"En <strong>Ubicación</strong>, selecciona <strong>Permitir</strong>", geoAndroid4:"Recarga la página y toca 📍", geoAndroidAlt:"Si no aparece el candado: Ajustes de Chrome → Configuración de sitios → Ubicación → permitir este sitio.",
    geoBrowserLabel:"Navegador", geoGeneric1:"Haz clic en el <strong>candado 🔒</strong> en la barra de direcciones", geoGeneric2:"Encuentra <strong>Ubicación</strong> y selecciona <strong>Permitir</strong>", geoGeneric3:"Recarga la página",
    admPendingPlain:"Pendientes", admReviewed:"Revisados", admDismissed:"Descartados", admAll:"Todos", admNoReports:"Sin reportes.", admReasonFake:"Empresa falsa", admReasonInappropriate:"Contenido inapropiado", admReasonDuplicate:"Duplicada", admReasonWrongInfo:"Información incorrecta", admReasonSpam:"Spam", admReasonOther:"Otro", admReportedBy:"Reportado por", admViewCompany:"Ver empresa", admMarkReviewed:"Marcar como revisado", admDismiss:"Descartar", admError:"Error", admErrorLoading:"Error al cargar", admAnonymous:"anónimo",
    admStatApproved:"Aprobadas", admStatRejected:"Rechazadas", admStatUsers:"Usuarios", admStatReviews:"Valoraciones", admStatEvents7d:"Eventos (7d)", admStatNew7d:"Nuevas (7d)", admStatTotal:"Total empresas", admViewPendingA:"Ver", admViewPendingB:"empresa(s) pendiente(s) →", admSearchPh:"Buscar por nombre o correo...", admStatusRemoved:"Eliminadas", admNoCompanies:"No se encontraron empresas.", admNoAccount:"sin cuenta", admRestore:"Restaurar", admApprove:"Aprobar", admRemove:"Eliminar", admUnfeatureTitle:"Quitar destacado", admFeatureTitle:"Destacar", admUnfeatureBtn:"Quitar", admFeatureBtn:"☆ Destacar", admFeatured:"Empresa destacada", admUnfeatured:"Destacado eliminado", adminPanelTitle:"Panel Admin",
    navHome:'Inicio', navSearch:'Mapa', navAbout:'Sobre', navRegister:'Registrar Empresa',
    recentlyViewed:'Vistas recientemente', recentRemove:'Quitar', recentClear:'Limpiar',
    searchUpdated:'¡Búsqueda actualizada!',
    filterTitle:'Filtros', clearAll:'Borrar Todo', companiesFound:'empresas encontradas',
    sortBy:'Ordenar Por', sortRating:'Mejor Valoradas', sortReviews:'Más Valoradas', sortName:'Nombre A–Z',
    sectorArea:'Área de Actividad', minRating:'Valoración Mínima',
    ratingAny:'Cualquier valoración', ratingOrMore:'o más',
    searchRadius:'Radio de Búsqueda', featured:'Destacados', ignoreRadius:'No Usar Radio de Búsqueda', nearbyTitle:'Empresas Cercanas', contactYourName:'Su nombre', contactYourEmail:'Su email (para que la empresa responda)', contactNameReq:'Indique su nombre', contactEmailReq:'Indique un email válido', retryBtn:'Intentar de nuevo', dpStreetTitle:'Vista de calle (Street View)', svOpenExternal:'Abrir en Google Maps ↗', svFallback:'Si la vista no carga, ', svFallbackLink:'ábrala en Google Maps', claimLink:'🏷 ¿Es su empresa? Reclame esta ficha', claimTitle:'Reclamar ficha de la empresa', claimIntro:'Para demostrar que gestiona esta empresa, enviamos un código de 6 dígitos al email público de la ficha. Una vez reclamada, puede editar los datos, responder a reseñas y ver estadísticas.', claimSendBtn:'Enviar código al email de la ficha', claimSentTo:'Código enviado a', claimVerifyBtn:'Confirmar código', claimSuccess:'¡Ficha reclamada!', claimNeedLogin:'Inicie sesión para reclamar la ficha', claimCodeInvalid:'Introduzca el código de 6 dígitos', rfqCta:'Pedir Presupuestos Gratis', rfqTitle:'Pedir presupuestos', rfqIntro:'Describa el trabajo — lo enviamos a las empresas adecuadas de su zona y las propuestas llegan a su email.', rfqSector:'Área de actividad', rfqDesc:'Descripción del trabajo', rfqDescPh:'Ej.: Reforma completa de baño (~4 m²).', rfqCity:'Localidad', rfqTimeline:'Plazo deseado', rfqBudget:'Presupuesto indicativo', rfqPhone:'Teléfono (opcional)', rfqEmail:'Su email', rfqSend:'Enviar solicitud', rfqSentA:'Solicitud enviada a', rfqSentB:'empresas. Las propuestas llegarán por email.', rfqDescShort:'Describa el trabajo con más detalle (mín. 20 caracteres)', rfqCityReq:'Indique la localidad', tlFlex:'Flexible', tlUrgent:'Urgente', tl1m:'El próximo mes', tl3m:'En 3 meses', budNS:'Aún no lo sé', inboxBtn:'Mensajes de clientes', inboxTitle:'Mensajes de clientes', inboxEmpty:'Aún no hay mensajes.', inboxReplyPh:'Escriba su respuesta…', inboxReplySend:'Responder', inboxReplySent:'Respuesta enviada', inboxYou:'Usted', featureBtn:'Pedir destacado', featureSent:'Solicitud enviada al administrador',
    topRated:'Top Rated', verified:'Verificado', newEntry:'Nuevo Registro',
    specialties:'Especialidades',
    mapLive:'Mapa en tiempo real', mapCity:'Lisboa, Portugal',
    emptyTitle:'Ninguna empresa registrada',
    emptyMsg:'El mapa está vacío. Registre la primera empresa para que aparezca aquí.',
    emptyBtn:'Registrar Empresa',
    detailLocation:'Ubicación',
    detailContact:'Canales de Contacto',
    waName:'WhatsApp Directo', waDesc:'Mensaje pre-rellenado con contexto',
    chatChannelName:'WhatsApp / Mensaje', chatChannelDesc:'Contacto directo por WhatsApp o SMS',
    emailChannelName:'E-mail Gateway', emailChannelDesc:'Solicitud formal directa al proveedor',
    detailSpecialties:'Especialidades', detailReviews:'Valoraciones Verificadas',
    detailCredentials:'Credenciales y Áreas de Actividad',
    detailActivities:'Áreas de Actividad', detailAlvara:'Alvará (Licencia)', detailCertidao:'Certificado Permanente',
    detailNoActivities:'Sin áreas de actividad indicadas',
    credRequired:'Obligatorio', credOptional:'Opcional',
    credLoginToView:'Inicia sesión para ver',
    alvaraNotApplicable:'No aplicable', certidaoPending:'En verificación',
    popupCertOk:'Certificado registrado', popupAlvaraOk:'Licencia',
    noRatings:'Sin valoraciones', reviews:'reseñas',
    review1:'"Excelente socio, entregó a tiempo y con calidad superior a lo esperado."',
    review2:'"Buena comunicación y precios competitivos. Recomendado para proyectos a medio plazo."',
    sectors:{
      pedreiros:'Albañiles', escavacao:'Movimiento de Tierras & Excavación', betao_cimento:'Hormigón & Cemento',
      estruturas_metalicas:'Estructuras Metálicas', demolicao:'Demolición', alvenaria:'Albañilería & Mampostería',
      cofragem:'Encofrado & Ferrallado', impermeabilizacao:'Impermeabilización & Aislamiento Hidrófugo',
      eletricistas:'Electricistas', picheleiros:'Fontaneros & Sanitarios',
      canalizacao_saneamento:'Instalaciones de Agua & Saneamiento', climatizacao_avac:'Climatización / Calefacción / Ventilación',
      gas:'Instalaciones de Gas', domotica_automacao:'Domótica & Automatización',
      energias_renovaveis:'Energías Renovables / Fotovoltaica', seguranca_alarmes:'Seguridad & Sistemas de Alarma',
      pocos_agua:'Pozos & Sondeos',
      pintores:'Pintores', estucadores:'Yeseros & Enlucidores', pavimentos:'Solados & Pavimentos',
      azulejos:'Alicatados & Cerámica', marmoraria:'Mármol & Piedra Natural',
      isolamento:'Aislamiento Térmico & Acústico', gesso_cartonado:'Pladur / Tabiquería Seca',
      carpinteiros:'Carpinteros', serralharia:'Construcción Metálica & Estructuras', aluminios_pvc:'Carpintería de Aluminio & PVC',
      caixilharia:'Ventanas, Puertas & Carpintería Exterior', vidraceiros:'Vidrieros & Acristalamientos', portoes_vedacoes:'Puertas de Garaje & Vallados',
      moveis_medida:'Muebles a Medida & Ebanistería',
      telhados_coberturas:'Cubiertas & Tejados', piscinas:'Piscinas',
      paisagismo_jardins:'Paisajismo & Jardinería', jardineiros:'Jardineros & Mantenimiento de Zonas Verdes', vedacoes_muros:'Muros & Cerramientos',
      calcetamento:'Pavimentación Exterior & Adoquinado', fachadas:'Fachadas & Rehabilitación de Edificios',
      arquitetura_projetos:'Arquitectura & Proyectos Técnicos', engenharia_civil:'Ingeniería Civil & de Edificación',
      topografia:'Topografía & Geotecnia', gestao_obra:'Jefatura de Obra & Gestión de Proyectos',
      certificacao_energetica:'Certificado de Eficiencia Energética (CEE)', seguranca_trabalho:'Prevención de Riesgos Laborales',
      design_interiores:'Diseño de Interiores & Interiorismo', materiais_construcao:'Materiales de Construcción & Suministros',
      equipamentos_construcao:'Maquinaria & Equipos de Obra'
    },
    sectorOptions:{
      pedreiros:'Albañiles', escavacao:'Movimiento de Tierras & Excavación', betao_cimento:'Hormigón & Cemento',
      estruturas_metalicas:'Estructuras Metálicas', demolicao:'Demolición', alvenaria:'Albañilería & Mampostería',
      cofragem:'Encofrado & Ferrallado', impermeabilizacao:'Impermeabilización & Aislamiento Hidrófugo',
      eletricistas:'Electricistas', picheleiros:'Fontaneros & Sanitarios',
      canalizacao_saneamento:'Instalaciones de Agua & Saneamiento', climatizacao_avac:'Climatización / Calefacción / Ventilación',
      gas:'Instalaciones de Gas', domotica_automacao:'Domótica & Automatización',
      energias_renovaveis:'Energías Renovables / Fotovoltaica', seguranca_alarmes:'Seguridad & Sistemas de Alarma',
      pocos_agua:'Pozos & Sondeos',
      pintores:'Pintores', estucadores:'Yeseros & Enlucidores', pavimentos:'Solados & Pavimentos',
      azulejos:'Alicatados & Cerámica', marmoraria:'Mármol & Piedra Natural',
      isolamento:'Aislamiento Térmico & Acústico', gesso_cartonado:'Pladur / Tabiquería Seca',
      carpinteiros:'Carpinteros', serralharia:'Construcción Metálica & Estructuras', aluminios_pvc:'Carpintería de Aluminio & PVC',
      caixilharia:'Ventanas, Puertas & Carpintería Exterior', vidraceiros:'Vidrieros & Acristalamientos', portoes_vedacoes:'Puertas de Garaje & Vallados',
      moveis_medida:'Muebles a Medida & Ebanistería',
      telhados_coberturas:'Cubiertas & Tejados', piscinas:'Piscinas',
      paisagismo_jardins:'Paisajismo & Jardinería', jardineiros:'Jardineros & Mantenimiento de Zonas Verdes', vedacoes_muros:'Muros & Cerramientos',
      calcetamento:'Pavimentación Exterior & Adoquinado', fachadas:'Fachadas & Rehabilitación de Edificios',
      arquitetura_projetos:'Arquitectura & Proyectos Técnicos', engenharia_civil:'Ingeniería Civil & de Edificación',
      topografia:'Topografía & Geotecnia', gestao_obra:'Jefatura de Obra & Gestión de Proyectos',
      certificacao_energetica:'Certificado de Eficiencia Energética (CEE)', seguranca_trabalho:'Prevención de Riesgos Laborales',
      design_interiores:'Diseño de Interiores & Interiorismo', materiais_construcao:'Materiales de Construcción & Suministros',
      equipamentos_construcao:'Maquinaria & Equipos de Obra',
      chave_na_mao_construcao:'Construcción Llave en Mano', chave_na_mao_remodelacao:'Reforma Integral Llave en Mano',
      chave_na_mao_moradia:'Viviendas Unifamiliares Llave en Mano', chave_na_mao_apartamento:'Apartamentos Llave en Mano',
      chave_na_mao_comercial:'Locales Comerciales Llave en Mano'
    },
    sectorGroups:{
      estrutura_fundacao:'Estructura', instalacoes:'Instalaciones', acabamentos:'Acabados',
      carpintaria:'Carpintería', serralharia_metal:'Cerrajería', exterior_jardim:'Exterior', projeto_gestao:'Proyectos', chave_na_mao:'Llave en Mano',
      obra_grossa:'Obra Gruesa', redes_tecnicas:'Redes Técnicas', revestimentos:'Revestimientos & Pintura',
      madeira:'Madera & Mobiliario', metal_vidro:'Metal, Vidrio & Carpintería', exteriores:'Exteriores & Jardín', projetos:'Proyectos & Consultoría'
    },
    regTitle:'Registrar Nueva Empresa',
    regSub:'Complete los datos para añadir su empresa a la plataforma Hivex. Los campos con',
    regSubSuffix:'son obligatorios.',
    regCompanyName:'Nombre de la Empresa', regNamePh:'Ej: Construcciones García, SA',
    regSectorLabel:'Sector de Actividad', regSectorPh:'Seleccionar sector...',
    regCae:'Código CAE', regCaePh:'Ej: CAE 41 – Construcción',
    regAlvara:'Licencia', regAlvaraPh:'Nº de Licencia',
    valAlvara:'Introduzca el número de Licencia',
    regCertidao:'Código del Certificado Permanente', regCertidaoPh:'Ej: 1234-5678-9012',
    regCertidaoHint:'Código de acceso al registro mercantil portugués (Certidão Permanente — 12 dígitos, formato XXXX-XXXX-XXXX).',
    valCertidao:'Introduzca el código del Certificado Permanente.',
    valCertidaoFormat:'Código del Certificado Permanente inválido (mínimo 8 caracteres alfanuméricos).',
    regAddress:'Dirección', regAddressPh:'Ej: Calle Mayor 10, Madrid',
    regZone:'Localidad / Zona',
    regEmail:'Email de Contacto', regEmailPh:'empresa@email.es',
    regPhone:'Teléfono / WhatsApp',
    regWebsite:'Sitio Web', regWebsitePh:'https://www.empresa.es',
    regLogo:'Logotipo de la empresa', regLogoPick:'Elegir imagen…', regLogoRemove:'Quitar', regLogoEmpty:'Sin imagen', regLogoHint:'JPG o PNG — se redimensiona y comprime. Aparece como logotipo de la empresa.', regLogoInvalid:'Archivo de imagen no válido.',
    regSpecialties:'Especialidades', regTagsPh:'Ej: Construcción Civil, Obras Públicas',
    regTagsHint:'Separe las especialidades con comas.',
    regDescription:'Descripción Breve', regDescPh:'Breve descripción de la empresa, servicios y diferenciales...',
    regCancel:'Cancelar', regSubmit:'Registrar Empresa',
    zones:{
      lisbon_center:'Lisboa Centro', lisbon_north:'Lisboa Norte',
      lisbon_east:'Lisboa Este / Parque das Nações', lisbon_west:'Lisboa Oeste / Belém',
      oeiras:'Oeiras', sintra:'Sintra', cascais:'Cascais',
      setubal:'Setúbal', porto:'Porto', braga:'Braga'
    },
    emailTitle:'Solicitud de Presupuesto',
    emailSub:'Enviado directamente al proveedor por correo verificado.',
    emailSubject:'Asunto', emailSubjectVal:'Solicitud de Presupuesto – Hivex Marketplace',
    emailType:'Tipo de Solicitud',
    emailTypes:['Solicitud de Presupuesto','Solicitud de Información','Propuesta de Asociación'],
    emailMessage:'Mensaje',
    emailMessageVal:'Buenos días,\n\nEncontré su empresa en la plataforma Hivex y me gustaría solicitar un presupuesto para...',
    emailAttach:'Adjuntar archivo (opcional)', emailCancel:'Cancelar', emailSend:'Enviar Solicitud',
    chatOnline:'● En línea ahora', chatPlaceholder:'Escribir mensaje...',
    chatMsg1:'¡Hola! Vi su perfil en Hivex. ¿Pueden enviarme una propuesta?',
    chatMsg2:'¡Buenos días! Con mucho gusto. ¿Puede compartir las especificaciones técnicas?',
    chatMsg3:'Perfecto, aquí están los detalles del proyecto.',
    toastFiltersCleared:'¡Todos los filtros han sido borrados!',
    toastWhatsapp:'Abriendo WhatsApp...', toastEmailSent:'¡Solicitud de presupuesto enviada!',
    toastAutoReply:'¡Gracias por su mensaje! Le responderemos pronto.',
    valName:'Por favor introduzca el nombre de la empresa.',
    valSector:'Por favor seleccione el sector de actividad.',
    valAddress:'Por favor introduzca la dirección.',
    valEmail:'Por favor introduzca el email de contacto.',
    valTags:'Por favor introduzca al menos una especialidad.',
    toastRegistered: name => `"${name}" registrada con éxito. Visible en el mapa.`,
    popupNoRatings:'Sin valoraciones aún', popupNewBadge:'Nuevo Registro',
    openNow:'Abierto', closedNow:'Cerrado', newOnHivex:'Nuevo en Hivex',
    btnSearch:'Buscar',
    heroLabel:'Marketplace B2B & B2C',
    heroTitleMain:'Conéctese. Colabore. ', heroTitleAccent:'Crezca.',
    heroSub:'Hivex une empresas y particulares con los mejores proveedores de servicios — de forma rápida, transparente y con total control.',
    heroBtnSearch:'Explorar Empresas', heroBtnRegister:'Registrar mi Empresa',
    whatLabel:'¿Qué es Hivex?', whatTitle:'Una plataforma para todos',
    whatSub:'Hivex fue creada para simplificar la forma en que clientes y proveedores se encuentran. Ya sea una empresa buscando socios estratégicos o un particular que necesita un servicio rápido — Hivex los conecta con especialistas de confianza.',
    uc1Title:'Empresa a Empresa (B2B)', uc1Desc:'Empresas que buscan proveedores, subcontratados o socios estratégicos. Ideal para proyectos de gran envergadura y contratos a largo plazo.',
    uc2Title:'Particular a Empresa (B2C)', uc2Desc:'Particulares que necesitan un servicio profesional — renovación, obra, instalación o mantenimiento. Simple, rápido y sin intermediarios.',
    houseLabel:'Ejemplo práctico', houseTitle:'¿Construir una casa? Encuentre todos los especialistas',
    houseIntro:'La construcción de una casa requiere docenas de especialidades. Con Hivex puede identificar y contactar empresas para cada fase de la obra.',
    houseCta:'Con Hivex, realice una <strong>búsqueda rápida por filtros</strong> para cada especialidad, compare valoraciones y <strong>solicite presupuestos a varias empresas</strong> — todo en un solo lugar.',
    houseSpecialties:[
      {icon:'ruler',name:'Arquitectura & Proyectos',sub:'Proyecto de construcción y licencias'},
      {icon:'hammer',name:'Contratista General',sub:'Gestión y coordinación de obra'},
      {icon:'layers',name:'Albañilería & Estructuras',sub:'Cimentaciones, hormigón y estructura'},
      {icon:'zap',name:'Instalaciones Eléctricas',sub:'Cuadros, cableado e iluminación'},
      {icon:'droplets',name:'Fontanería & Saneamiento',sub:'Agua, alcantarillado, gas y calefacción'},
      {icon:'square',name:'Carpintería & Vidrios',sub:'Ventanas, puertas y acristalamientos'},
      {icon:'paintbrush',name:'Pintura & Acabados',sub:'Paredes, techos y revestimientos'},
      {icon:'scissors',name:'Carpintería & Ebanistería',sub:'Puertas, armarios y mobiliario fijo'},
      {icon:'home',name:'Cubierta & Impermeabilización',sub:'Tejados, balcones y terrazas'},
      {icon:'wind',name:'Climatización / HVAC',sub:'Calefacción, aire acondicionado y ventilación'}
    ],
    stepsLabel:'Cómo funciona', stepsTitle:'En 3 pasos simples',
    step1Title:'Busque con filtros', step1Desc:'Filtre por sector, ubicación, valoración y especialidad. El mapa se actualiza en tiempo real.',
    step2Title:'Compare empresas', step2Desc:'Vea perfiles detallados, valoraciones multidimensionales en calidad, plazos, comunicación y precio.',
    step3Title:'Solicite presupuestos', step3Desc:'Contacte directamente por email, chat interno o WhatsApp. Sin intermediarios, sin demoras.',
    ctaTitle:'¿Listo para empezar?', ctaSub:'Explore las empresas disponibles o registre su empresa en Hivex hoy mismo.',
    helpTitle:'Centro de Ayuda', helpSubtitle:'Soporte Hivex — estamos aquí para ayudarle',
    helpTabSupport:'Atención al Cliente', helpTabAbout:'Sobre Hivex',
    helpSupportIntro:'¡Estamos aquí para ayudarle! Contáctenos a través de los siguientes canales:',
    helpChatTitle:'Chat en Tiempo Real', helpChatDesc:'Contáctenos instantáneamente a través del chat integrado.', helpChatBtn:'Abrir Chat',
    helpEmailTitle:'Email', helpEmailDesc:'geral.hivex@gmail.com — Respuesta en 24 horas hábiles.', helpEmailBtn:'Enviar Email',
    helpPhoneTitle:'Teléfono', helpPhoneDesc:'+351 XXX XXX XXX · Lun-Vie: 09h–18h', helpPhoneBtn:'Llamar',
    helpFaqTitle:'FAQ', helpFaqDesc:'Encuentre respuestas a las preguntas más frecuentes.', helpFaqBtn:'Ver FAQ',
    helpWhoTitle:'Quiénes Somos', helpWhoDesc:'HIVE es una plataforma digital innovadora que conecta empresas, profesionales independientes y particulares, facilitando relaciones comerciales transparentes y fiables. Operamos en Portugal con el objetivo de democratizar el acceso a servicios de calidad.',
    helpStatPros:'Empresas Verificadas', helpStatCompanies:'Empresas Registradas',
    helpMissionTitle:'Misión', helpMissionDesc:'Simplificar y democratizar el acceso a servicios profesionales de calidad, creando un ecosistema transparente donde empresas y profesionales puedan crecer juntos.',
    helpVisionTitle:'Visión', helpVisionDesc:'Ser la plataforma de referencia en Portugal para conectar empresas y profesionales, fomentando el crecimiento económico y creando oportunidades para todos.',
    navLogin:'Entrar / Registrarse', navHelp:'Ayuda',
    themeToDark:'Oscuro', themeToLight:'Claro', themeModeDark:'Modo oscuro', themeModeLight:'Modo claro',
    testimonialPhrases:['Excelente profesionalidad y calidad de trabajo.','Muy puntuales y trabajo impecable. ¡Recomendado!','Gran relación calidad-precio. Volveré a contratar.','Equipo muy competente y organizado.','Superaron las expectativas. Trabajo de primera.','Profesionales serios y de confianza.','Servicio rápido y eficiente. Muy satisfecho.','Atención excelente de principio a fin.','Cumplieron los plazos y el presupuesto. ¡Recomendado!','Trabajo cuidado y mucha simpatía.'],
    navFavourites:'Favoritos', navFaq:'FAQ', navPrivacy:'Privacidad', avatarLogout:'Cerrar sesión', avatarFaqHelp:'FAQ y Ayuda',
    lpHeroRegisterCta:'Registre su Empresa', lpHeroRegisterHint:'¿Es una empresa? Aparezca en el mapa en minutos.',
    lpHeroLoginHint:'¿Ya tiene cuenta?', lpHeroLoginLink:'Entrar',
    lpHeroTitle:'Encuentre los mejores<br><span class="hero-accent">profesionales</span> de la construcción',
    lpHeroSub:'Compare valoraciones y solicite presupuestos en minutos.',
    lpEarlyAccessText:'Plataforma nueva — registre su empresa en minutos.',
    lpTabLocation:'Por Ubicación', lpTabActivity:'Por Actividad',
    lpLocationLabel:'Ubicación', lpLocationPh:'Lisboa, Porto, Braga...',
    lpActivityLabel:'Área de Actividad / Servicio', lpSelectActivity:'Seleccione una actividad...',
    lpHeroCatsLabel:'¿Qué busca?',
    statCompanies:'Empresas registradas', statAreas:'Áreas de actividad', statSpecialties:'Especialidades', statCoverage:'Todo Portugal',
    featuredOverline:'Empresas destacadas', featuredTitle:'Los mejor valorados', featuredSeeAll:'Ver todas las empresas →', featuredEmpty:'Ninguna empresa destacada aún.',
    featuredVerified:'✓ Verificado', featuredReviews:'valoraciones',
    ubFeaturedBtn:'Empresas Destacadas', featEmpty:'Aún no hay empresas destacadas.', featCta:'¿Quiere aparecer aquí primero? Destaque su empresa', featuredBadge:'Destacado',
    lpStep1Title:'Busque', lpStep1Desc:'Filtre por sector, ubicación y valoración. El mapa muestra los resultados en tiempo real.',
    lpStep2Title:'Compare', lpStep2Desc:'Vea perfiles detallados con valoraciones multidimensionales y especialidades.',
    lpStep3Title:'Contacte', lpStep3Desc:'Solicite presupuestos directamente por email o chat. Sin intermediarios.',
    lpForWhom:'¿Para quién?', lpPlatformTitle:'Una plataforma para todos',
    lpB2bBadge:'B2B · Para Empresas', lpB2bTitle:'Empresa a Empresa',
    lpB2bDesc:'Encuentre proveedores, socios estratégicos y subcontratados especializados. Ideal para proyectos exigentes y contratos a largo plazo.',
    lpB2bBtn:'Explorar como empresa →',
    lpB2cBadge:'B2C · Para Particulares', lpB2cTitle:'Particular a Empresa',
    lpB2cDesc:'¿Necesita reparaciones, reformas o instalaciones? Compare profesionales verificados y solicite presupuestos fácilmente.',
    lpB2cBtn:'Encontrar profesional →',
    toastEmailUnavailable:'📧 Email no disponible — use WhatsApp o el Chat interno',
    toastPhoneUnavailable:'📞 Teléfono no disponible',
    toastLinkCopied:'¡Enlace copiado!',
    toastCopyFailed:'No se pudo copiar',
    toastGeoNotSupported:'Geolocalización no soportada por este navegador.',
    toastGeoPermissionDenied:'Permiso de ubicación denegado.',
    toastGeoPositionUnavailable:'Posición no disponible.',
    toastGeoTimeout:'Tiempo de espera agotado.',
    toastGeoError:'Error al obtener ubicación.',
    toastLocationFound:'¡Ubicación actual encontrada!',
    toastLocationFailed:'No se pudo obtener la ubicación.',
    toastLocationError:'Error al buscar ubicación.',
    toastRegisterError:'Error al guardar. Verifique la conexión e inténtelo de nuevo.',
    emailQuoteSubject:'Solicitud de Presupuesto',
    emailQuoteBody:'Buenos días,\n\nMe gustaría solicitar un presupuesto para sus servicios.\n\nDetalles del proyecto:\n- Descripción: \n- Ubicación: \n- Plazo deseado: \n\nQuedo a la espera de su respuesta.\n\nSaludos',
    searchListEmpty:'Ninguna empresa encontrada',
    searchListEmptySub:'Intente ajustar los filtros o aumentar el radio de búsqueda',
    mapHintNoResults:'Ninguna empresa encontrada en esta área',
    mapHintNoResultsSub:'Intente aumentar el radio de búsqueda o seleccione otra actividad',
    mapHintSelectSector:'Seleccione un área de actividad',
    mapHintSelectSectorSub:'para ver empresas en el mapa',
    noRatingText:'Sin valoración',
    regTypeCompany:'Registro Empresa',
    regTypeClient:'🔍 Registro Cliente',
    typeCompanyLabel:'Empresa',
    typeClientLabel:'Cliente',
    typeAdvertiserLabel:'Anunciante',
    avatarRegisterCompany:'Registrar Empresa',
    statusApproved:'Aprobada', statusPending:'Pendiente', statusRejected:'Rechazada', statusRemoved:'🗑️ Eliminada',
    postRegAria:'Próximos pasos',
    postRegWelcome:'¡Bienvenido a Hivex!', postRegWelcomeNamed:'¡Bienvenido a Hivex, {name}!',
    postRegPrompt:'¿Qué desea hacer?',
    postRegAdvertiseTitle:'Anunciar mi empresa',
    postRegAdvertiseDesc:'Registrar mi empresa y aparecer en el marketplace',
    postRegBrowseTitle:'Solo buscar empresas',
    postRegBrowseDesc:'Explorar el marketplace para encontrar profesionales',
    postRegFooterHint:'Puede anunciar su empresa más tarde desde el menú de la cuenta.',
    reportAria:'Reportar anuncio', reportTitle:'Reportar anuncio',
    reportSubtitle:'Los reportes son revisados por nuestro equipo de moderación.',
    reportReasonLabel:'Motivo', reportReasonPh:'Seleccionar motivo…',
    reportReasonFake:'Empresa falsa o inexistente', reportReasonInappropriate:'Contenido inapropiado',
    reportReasonDuplicate:'Anuncio duplicado', reportReasonWrongInfo:'Información incorrecta',
    reportReasonSpam:'Spam', reportReasonOther:'Otro',
    reportDetailsLabel:'Detalles (opcional)', reportDetailsPh:'Describa el problema (hasta 500 caracteres)',
    reportSubmit:'Enviar reporte', btnCancel:'Cancelar',
    regSuccessTitle:'¡Registro Recibido!',
    regSuccessSub:'Su registro ha sido recibido y está en revisión por nuestro equipo. Una vez aprobada, su empresa aparecerá en el mapa y recibirá un email de confirmación.',
    regSuccessStep1:'En revisión — normalmente aprobada en <strong>24 horas hábiles</strong>.',
    regSuccessStep2:'✉️ Recibirá un <strong>email</strong> en cuanto sea aprobada.',
    regSuccessStep3:'✏️ Edite los detalles desde <strong>Mi Perfil</strong>.',
    heroUserGreeting:'¡Hola!', heroUserGreetingNamed:'¡Hola, {name}!',
    heroUserTagline:'¿Quiere anunciar su empresa en el marketplace?',
    heroUserCta:'Anunciar Empresa',
    sectorAllLabel:'Todas las áreas',
    sectorAllSelectAll:'Seleccionar todas las áreas',
    sectorAllDeselectAll:'Deseleccionar todas las áreas', sectorSelectAllHere:'Seleccionar todas',
    emptySectorTitle:'Seleccione un área de actividad',
    emptySectorSub:'Elija uno o más sectores arriba para ver las empresas disponibles.',
    dpFavTitle:'Guardar en favoritos', dpEditTitle:'Editar', dpEditAria:'Editar empresa',
    dpCloseAria:'Cerrar detalles', dpReportTitle:'Reportar anuncio',
    authWelcome:'Bienvenido a Hivex', authTagline:'La mayor red B2B de Portugal',
    authTabLogin:'Entrar', authTabRegister:'Crear Cuenta',
    authDividerEmail:'o continúa con email', authDividerData:'o rellene los datos',
    authEmailLabel:'Email', authPasswordLabel:'Contraseña',
    authPasswordPh:'Mínimo 8 caracteres', authPasswordHint:'Mínimo 8 caracteres.',
    authLoginSubmit:'Entrar', authRegisterSubmit:'Crear Cuenta',
    authNoAccount:'¿Aún no tienes cuenta?', authHasAccount:'¿Ya tienes cuenta?',
    capsLockOn:'⚠️ Bloq Mayús está activado', pwdToggleAria:'Mostrar/ocultar contraseña',
    authAria:'Iniciar sesión o crear cuenta',
    toastFavRemoved:'Eliminada de favoritos', toastFavAdded:'★ Guardada en favoritos',
    toastNoEditPermission:'No tiene permiso para editar esta empresa.',
    toastCompanyUpdated:'¡Empresa actualizada con éxito!',
    toastReportLoginRequired:'Inicie sesión para reportar un anuncio.',
    toastReportSelectReason:'Seleccione un motivo.',
    toastReportSent:'Reporte enviado. Gracias por ayudar a mantener la plataforma segura.',
    toastReportFailed:'No se pudo enviar el reporte.',
    toastFillFields:'Rellene todos los campos',
    toastFillRequired:'Rellene los campos obligatorios',
    toastBadCredentials:'Email o contraseña incorrectos',
    toastTooManyAttempts:'Demasiados intentos. Inténtelo más tarde.',
    toastWelcomeUser:'¡Bienvenido, {name}!',
    toastLoggedOut:'Sesión finalizada',
    toastGoogleFailed:'Error al iniciar sesión con Google',
    toastRegisterFailed:'Error al crear la cuenta',
    toastPasswordTooShort:'La contraseña debe tener al menos 8 caracteres',
    regAuthNameLabel:'Nombre completo',
    regAuthNamePh:'Su nombre',
    lpTabCompany:'Por Empresa',
    lpCompanyLabel:'Nombre de la Empresa',
    lpCompanyPh:'Ej: Construcciones García, ElectroTech...',
    legendTitle:'🎨 Leyenda',
    legendEstrutura:'Estructura',
    legendInstalacoes:'Instalaciones',
    legendAcabamentos:'Acabados',
    legendCarpintaria:'Carpintería',
    legendSerralharia:'Cerrajería',
    legendExterior:'Exterior',
    legendProjeto:'Proyecto',
    legendChaveNaMao:'Llave en Mano',
    btnRequestQuote:'Solicitar Presupuesto',
    testimonial1Name:'Su empresa aquí',
    testimonial1Sector:'Regístrese en HIVE',
    testimonial1Quote:'Únase a la plataforma y conéctese con nuevos clientes en todo Portugal.',
    testimonial2Name:'Profesionales verificados',
    testimonial2Sector:'Calidad garantizada',
    testimonial2Quote:'Todas las empresas son evaluadas por los clientes para garantizar el mejor servicio.',
    testimonial3Name:'Presupuestos gratuitos',
    testimonial3Sector:'Sin compromiso',
    testimonial3Quote:'Solicite presupuestos a varios profesionales y compare los precios fácilmente.',
    testimonial4Name:'Llave en Mano',
    testimonial4Sector:'Proyectos completos',
    testimonial4Quote:'Encuentre todos los profesionales para su proyecto en una sola plataforma.',
    footerDesc:'Marketplace de construcción en Portugal. Conectamos empresas y particulares con profesionales verificados.',
    footerNav:'Navegación',
    footerLegal:'Legal',
    footerContact:'Contacto',
    footerTerms:'Términos de Servicio',
    footerPrivacy:'Política de Privacidad',
    footerCookies:'Cookies',
    footerRights:'Hivex — Todos los derechos reservados',
    factSince:'Desde', factHours:'Horario', factVerified:'Verificada', factYear:'año', factYears:'años',
    importOSM:'Importar Empresas OSM',
    successTitle:'¡Solicitud Enviada!',
    successSub:'Su solicitud ha sido recibida y está a la espera de validación. Recibirá un correo de confirmación cuando la empresa sea aprobada.',
    successClose:'Cerrar',
    regStep1Label:'Identidad', regStep2Label:'Ubicación', regStep3Label:'Detalles',
    regStepNext:'Siguiente', regStepBack:'Atrás',
    review1Author:'TechCorp SL',
    review2Author:'Ibérica Solutions SA',
    logoTagline:'Profesionales de Construcción en Portugal',
    adBadge:'🏠 Ejemplo Práctico',
    adTitle:'¿Construir una casa?',
    adNavSub:'10 especialistas, 1 plataforma',
    adMainSub:'8 áreas, 1 plataforma',
    adCta:'Encuentre<br>todo aquí',
    adHivexBadge:'Hivex',
    adHivexTitle:'Del terreno a la casa',
    adHivexSub:'Tu proyecto, paso a paso',
    adHivexB2C:'Los clientes encuentran empresas',
    adHivexB2B:'Las empresas encuentran socios',
    adHivexCta:'Únete<br>a nosotros',
    adStory1:'Tienes un terreno',
    adStory2:'Abre Hivex',
    adStory3:'Busca especialistas',
    adStory4:'Pide presupuesto',
    adStory5:'Firma contrato',
    adStory6:'Casa construida',
    adNodeClient:'Cliente',
    adNodeCompany:'Empresa',
    footerRgpd:'RGPD',
    sortAll:'Todos',
    regCountry:'País',
    regPostalCode:'Código Postal',
    regCity:'Localidad / Ciudad'
  },

  de: {
    // ── UI coverage additions ──
    viewMap:"Karte", viewList:"Liste", resultCompany:"Unternehmen", resultCompanies:"Unternehmen",
    profileTitle:"Mein Profil",
    contactTitle:"Nachricht senden", contactSub:"Ihre Nachricht wird direkt an das Unternehmen übermittelt",
    contactMsgLabel:"Nachricht", contactMsgPh:"Hallo! Ich hätte gerne Informationen zu Ihren Leistungen...",
    contactPrivacy:"Die E-Mail-Adresse des Unternehmens wird nie an Sie weitergegeben — Hivex übermittelt Ihre Nachricht sicher.",
    adminTitle:"Admin-Bereich", adminTabStats:"Statistiken", adminTabPending:"Ausstehend", adminTabAll:"Alle", adminTabReports:"Meldungen",
    loadingGeneric:"Wird geladen...",
    statusTitle:"Registrierungsstatus", statusPrompt:"Geben Sie die E-Mail-Adresse ein, mit der Sie Ihr Unternehmen registriert haben, um den Status zu prüfen.", statusVerify:"Prüfen",
    dpDragClose:"zum Schließen ziehen", dpCloseTitle:"Schließen", dpCallTitle:"Anrufen", dpShareTitle:"Teilen",
    dpDirectionsTitle:"Route", routeLocating:"Standort wird ermittelt…", routeNoLocation:"Standort konnte nicht ermittelt werden.", routeError:"Route konnte nicht berechnet werden.", dpMoreInfo:"Weitere Informationen",
    loginGateTitle:"Anmelden, um Kontakte zu sehen", loginGateDesc:"Erstellen Sie ein kostenloses Konto für Zugriff auf Kontakte, Adresse, Bewertungen und Angebotsanfragen.", loginGateBtn:"Anmelden / Kostenloses Konto erstellen",
    reviewsHeading:"Bewertungen", reviewFormTitle:"✍️ Ihre Bewertung", reviewPh:"Teilen Sie Ihre Erfahrung mit diesem Unternehmen...", reviewSubmit:"Bewertung veröffentlichen", reviewWrite:"+ Bewertung schreiben",
    closeBtn:"Schließen",
    regNifHint:"9 Ziffern. Wir prüfen Format und Prüfziffer.", regSectorPlaceholder:"Tätigkeitsbereiche auswählen...", regSectorMultiHint:"Sie können mehrere Tätigkeitsbereiche auswählen.",
    optionalTag:"(optional)", regAlvaraHint:"Baugenehmigungsnummer, falls zutreffend.", regCountryPh:"Land auswählen",
    countryPT:"Portugal", countryES:"Spanien", countryFR:"Frankreich", countryIT:"Italien", countryDE:"Deutschland", countryUK:"Vereinigtes Königreich", countryNL:"Niederlande", countryBE:"Belgien", countryCH:"Schweiz", countryAT:"Österreich", countryOther:"Anderes Land",
    regAddressHint:"Geben Sie Straße, Nummer, Wohnung und Details für eine genaue Position auf der Karte an.", regFoundedPh:"z. B. 2010", regHoursPh:"z. B. Mo-Fr 9-18 Uhr, Sa 9-13 Uhr", regPortfolioPh:"Durch Kommas getrennte URLs (bis zu 12)",
    geoTitle:"Standort blockiert", geoIntro:"Der Browser hat den Standortzugriff blockiert. Folgen Sie den Schritten unten, um ihn zu aktivieren.", geoRetry:"Erneut versuchen", geoSkip:"Ohne Standort fortfahren",
    forgotBackLogin:"Zurück zur Anmeldung", resetNewPwdLabel:"Neues Passwort", min8Chars:"Mindestens 8 Zeichen.",
    changePwdTitle:"Passwort ändern", changePwdBody:"Geben Sie Ihr aktuelles und dann das neue Passwort ein (mindestens 8 Zeichen).", changePwdCurrent:"Aktuelles Passwort", changePwdNew:"Neues Passwort", changePwdSubmit:"Passwort ändern",
    delAccTitle:"Konto löschen", delAccWarn:"Diese Aktion ist <strong>endgültig</strong>. Ihre Bewertungen und Favoriten werden entfernt. Von Ihnen registrierte Unternehmen bleiben auf der Plattform, jedoch ohne zugeordneten Eigentümer.", delAccConfirmPwd:"Bestätigen Sie Ihr Passwort", delAccSubmit:"Endgültig löschen",
    compareOfThree:"von 3 ausgewählt",
    // ── JS-string coverage (toasts, dynamic labels) ──
    contactSendTo:"Nachricht senden an", sendingBtn:"Wird gesendet...",
    toastSelectMin2:"Wählen Sie mindestens 2 Unternehmen zum Vergleich.", toastMapUnavailable:"⚠️ Karte nicht verfügbar — prüfen Sie Ihre Verbindung", toastPlaceNotFound:"Ort nicht gefunden. Versuchen Sie einen anderen Namen.", toastLocationDetected:"Standort erkannt!",
    toastEnterEmail:"Geben Sie Ihre E-Mail-Adresse an", toastEnterEmail2:"Geben Sie eine E-Mail-Adresse ein", toastPwdReset:"Passwort zurückgesetzt! Sie können sich anmelden.", toastLoginToRegister:"Melden Sie sich an, um Ihr Unternehmen zu registrieren.", toastPwdChanged:"Passwort geändert.", toastAccountDeleted:"Konto gelöscht.",
    toastSelectRating:"Wählen Sie eine Bewertung (1-5 Sterne)", toastReviewPublished:"Bewertung veröffentlicht!", toastWriteReply:"Schreiben Sie eine Antwort", toastReplyPublished:"Antwort veröffentlicht", toastMsgTooShort:"Nachricht zu kurz", toastMsgSent:"Nachricht erfolgreich gesendet!",
    toastReportUpdated:"Meldung aktualisiert", toastCompanyApproved:"Unternehmen genehmigt", toastCompanyRejected:"Unternehmen abgelehnt", toastCompanyRemoved:"🗑️ Unternehmen entfernt", toastLoadingStats:"Statistiken werden geladen...", toastStatsError:"Fehler beim Laden der Statistiken",
    compareMaxPrefix:"Sie können bis zu", compareMaxSuffix:"Unternehmen vergleichen. Entfernen Sie eines, um ein weiteres hinzuzufügen.", showingPrefix:"Zeige", showingMid:"Unternehmen in",
    // ── profile / geo-help / admin coverage ──
    profileMyCompanies:"Meine Unternehmen", profileAdd:"Hinzufügen", profileEditTitle:"Unternehmen bearbeiten", profileNoCompanyMsg:"Registrieren Sie Ihr Unternehmen, um auf der Karte zu erscheinen und Angebote zu erhalten.", profileAccount:"Konto",
    geoIOSLabel:"iPhone / iPad (Safari)", geoIOS1:"Öffnen Sie die <strong>Einstellungen</strong> des iPhones", geoIOS2:"Tippen Sie auf <strong>Datenschutz & Sicherheit</strong>", geoIOS3:"Tippen Sie auf <strong>Ortungsdienste</strong> und stellen Sie sicher, dass sie <strong>aktiviert</strong> sind", geoIOS4:"Suchen Sie <strong>Safari</strong> in der Liste und wählen Sie <strong>Beim Verwenden der App</strong>", geoIOS5:"Kehren Sie zum Browser zurück und tippen Sie auf die Schaltfläche 📍", geoIOSAlt:"Alternativ: Tippen Sie auf die Schaltfläche <strong>aA</strong> in der Adressleiste von Safari → <strong>Website-Einstellungen</strong> → <strong>Standort → Erlauben</strong>",
    geoAndroidLabel:"Android (Chrome)", geoAndroid1:"Tippen Sie auf das <strong>Schloss 🔒</strong> in der Adressleiste", geoAndroid2:"Tippen Sie auf <strong>Berechtigungen</strong>", geoAndroid3:"Wählen Sie unter <strong>Standort</strong> die Option <strong>Erlauben</strong>", geoAndroid4:"Laden Sie die Seite neu und tippen Sie auf 📍", geoAndroidAlt:"Falls das Schloss nicht erscheint: Chrome-Einstellungen → Website-Einstellungen → Standort → diese Website zulassen.",
    geoBrowserLabel:"Browser", geoGeneric1:"Klicken Sie auf das <strong>Schloss 🔒</strong> in der Adressleiste", geoGeneric2:"Suchen Sie <strong>Standort</strong> und setzen Sie ihn auf <strong>Erlauben</strong>", geoGeneric3:"Laden Sie die Seite neu",
    admPendingPlain:"Ausstehend", admReviewed:"Geprüft", admDismissed:"Verworfen", admAll:"Alle", admNoReports:"Keine Meldungen.", admReasonFake:"Gefälschtes Unternehmen", admReasonInappropriate:"Unangemessener Inhalt", admReasonDuplicate:"Duplikat", admReasonWrongInfo:"Falsche Informationen", admReasonSpam:"Spam", admReasonOther:"Sonstiges", admReportedBy:"Gemeldet von", admViewCompany:"Unternehmen ansehen", admMarkReviewed:"Als geprüft markieren", admDismiss:"Verwerfen", admError:"Fehler", admErrorLoading:"Fehler beim Laden", admAnonymous:"anonym",
    admStatApproved:"Genehmigt", admStatRejected:"Abgelehnt", admStatUsers:"Nutzer", admStatReviews:"Bewertungen", admStatEvents7d:"Ereignisse (7T)", admStatNew7d:"Neue (7T)", admStatTotal:"Unternehmen gesamt", admViewPendingA:"", admViewPendingB:"ausstehende(s) Unternehmen ansehen →", admSearchPh:"Nach Name oder E-Mail suchen...", admStatusRemoved:"Entfernt", admNoCompanies:"Keine Unternehmen gefunden.", admNoAccount:"kein Konto", admRestore:"Wiederherstellen", admApprove:"Genehmigen", admRemove:"Entfernen", admUnfeatureTitle:"Hervorhebung entfernen", admFeatureTitle:"Hervorheben", admUnfeatureBtn:"Entfernen", admFeatureBtn:"☆ Hervorheben", admFeatured:"Unternehmen hervorgehoben", admUnfeatured:"Hervorhebung entfernt", adminPanelTitle:"Admin-Bereich",
    navHome:'Start', navSearch:'Karte', navAbout:'Über uns', navRegister:'Unternehmen registrieren',
    recentlyViewed:'Kürzlich angesehen', recentRemove:'Entfernen', recentClear:'Leeren',
    searchUpdated:'Suche aktualisiert!',
    filterTitle:'Filter', clearAll:'Alle löschen', companiesFound:'Unternehmen',
    sortBy:'Sortieren nach', sortRating:'Beste Bewertung', sortReviews:'Meiste Bewertungen', sortName:'Name A–Z',
    sectorArea:'Tätigkeitsbereich', minRating:'Mindestbewertung',
    ratingAny:'Beliebige Bewertung', ratingOrMore:'oder mehr',
    searchRadius:'Suchradius', featured:'Empfohlen', ignoreRadius:'Suchradius nicht verwenden', nearbyTitle:'Unternehmen in der Nähe', contactYourName:'Ihr Name', contactYourEmail:'Ihre E-Mail (für die Antwort der Firma)', contactNameReq:'Geben Sie Ihren Namen an', contactEmailReq:'Geben Sie eine gültige E-Mail an', retryBtn:'Erneut versuchen', dpStreetTitle:'Straßenansicht (Street View)', svOpenExternal:'In Google Maps öffnen ↗', svFallback:'Wenn die Ansicht nicht lädt, ', svFallbackLink:'in Google Maps öffnen', claimLink:'🏷 Ist das Ihr Unternehmen? Eintrag übernehmen', claimTitle:'Eintrag übernehmen', claimIntro:'Zum Nachweis senden wir einen 6-stelligen Code an die öffentliche E-Mail des Eintrags. Danach können Sie Daten bearbeiten, auf Bewertungen antworten und Statistiken sehen.', claimSendBtn:'Code an die Eintrags-E-Mail senden', claimSentTo:'Code gesendet an', claimVerifyBtn:'Code bestätigen', claimSuccess:'Eintrag übernommen!', claimNeedLogin:'Zum Übernehmen bitte anmelden', claimCodeInvalid:'6-stelligen Code eingeben', rfqCta:'Kostenlose Angebote', rfqTitle:'Angebote anfragen', rfqIntro:'Beschreiben Sie die Arbeit — wir senden die Anfrage an passende Firmen in Ihrer Region; Angebote kommen per E-Mail.', rfqSector:'Tätigkeitsbereich', rfqDesc:'Beschreibung der Arbeit', rfqDescPh:'z. B.: Komplette Badsanierung (~4 m²).', rfqCity:'Ort', rfqTimeline:'Gewünschter Zeitrahmen', rfqBudget:'Ungefähres Budget', rfqPhone:'Telefon (optional)', rfqEmail:'Ihre E-Mail', rfqSend:'Anfrage senden', rfqSentA:'Anfrage gesendet an', rfqSentB:'Firmen! Angebote kommen per E-Mail.', rfqDescShort:'Bitte ausführlicher beschreiben (mind. 20 Zeichen)', rfqCityReq:'Ort angeben', tlFlex:'Flexibel', tlUrgent:'Dringend', tl1m:'Im nächsten Monat', tl3m:'In 3 Monaten', budNS:'Weiß noch nicht', inboxBtn:'Kundennachrichten', inboxTitle:'Kundennachrichten', inboxEmpty:'Noch keine Nachrichten.', inboxReplyPh:'Antwort schreiben…', inboxReplySend:'Antworten', inboxReplySent:'Antwort gesendet', inboxYou:'Sie', featureBtn:'Hervorhebung anfragen', featureSent:'Anfrage an den Administrator gesendet',
    topRated:'Top-Bewertet', verified:'Verifiziert', newEntry:'Neu eingetragen',
    specialties:'Fachbereiche',
    mapLive:'Live-Karte', mapCity:'Lissabon, Portugal',
    emptyTitle:'Keine Unternehmen registriert',
    emptyMsg:'Die Karte ist leer. Registrieren Sie das erste Unternehmen, damit es auf der Karte erscheint.',
    emptyBtn:'Unternehmen registrieren',
    detailLocation:'Standort',
    detailContact:'Kontaktkanäle',
    waName:'WhatsApp-Direktkontakt', waDesc:'Vorausgefüllte Kontextinformationen',
    chatChannelName:'WhatsApp / Nachricht', chatChannelDesc:'Direktkontakt per WhatsApp oder SMS',
    emailChannelName:'E-Mail', emailChannelDesc:'Formelle Anfragen direkt an den Anbieter',
    detailSpecialties:'Fachbereiche', detailReviews:'Verifizierte Bewertungen',
    detailCredentials:'Nachweise & Tätigkeitsbereiche',
    detailActivities:'Tätigkeitsbereiche', detailAlvara:'Alvará (Lizenz)', detailCertidao:'Handelsregisterauszug',
    detailNoActivities:'Keine Tätigkeitsbereiche angegeben',
    credRequired:'Erforderlich', credOptional:'Optional',
    credLoginToView:'Zum Anzeigen anmelden',
    alvaraNotApplicable:'Nicht zutreffend', certidaoPending:'In Prüfung',
    popupCertOk:'Auszug hinterlegt', popupAlvaraOk:'Lizenz',
    noRatings:'Noch keine Bewertungen', reviews:'Bewertungen',
    review1:'"Ausgezeichneter Partner – pünktliche Lieferung, Qualität hat unsere Erwartungen übertroffen."',
    review2:'"Gute Kommunikation, wettbewerbsfähige Preise. Empfehlenswert für mittlere Projekte."',
    sectors:{
      pedreiros:'Maurer & Verputzer', escavacao:'Erdarbeiten & Baugrubenaushub', betao_cimento:'Betonbau',
      estruturas_metalicas:'Stahlbau & Tragkonstruktionen', demolicao:'Abbrucharbeiten', alvenaria:'Mauerwerk & Ziegelarbeiten',
      cofragem:'Schalung & Bewehrung', impermeabilizacao:'Abdichtung & Feuchtigkeitsschutz',
      eletricistas:'Elektroinstallation', picheleiros:'Klempner & Heizungsbauer',
      canalizacao_saneamento:'Sanitär & Abwassertechnik', climatizacao_avac:'Heizung, Lüftung & Klima (HLK)',
      gas:'Gasinstallation', domotica_automacao:'Gebäudeautomation & Smart Home',
      energias_renovaveis:'Erneuerbare Energien / Photovoltaik', seguranca_alarmes:'Sicherheitssysteme & Alarmanlagen',
      pocos_agua:'Brunnenbau & Bohrungen',
      pintores:'Maler & Lackierer', estucadores:'Verputzer & Trockenbauer', pavimentos:'Bodenbeläge & Estrich',
      azulejos:'Fliesen & Keramik', marmoraria:'Natur- & Werkstein (Marmor/Granit)',
      isolamento:'Wärme- & Schalldämmung', gesso_cartonado:'Trockenbau / Gipskarton',
      carpinteiros:'Zimmerer & Tischler', serralharia:'Metallbau & Schlosserei', aluminios_pvc:'Aluminium- & PVC-Fenster/Türen',
      caixilharia:'Fenster- & Türmontage', vidraceiros:'Glaserei & Fassadenverglasung', portoes_vedacoes:'Tore & Einzäunungen',
      moveis_medida:'Maßmöbel & Einbauschränke',
      telhados_coberturas:'Dachdeckerei & Dachbau', piscinas:'Schwimmbad- & Poolbau',
      paisagismo_jardins:'Landschaftsbau & Gartengestaltung', jardineiros:'Gartenpflege & Grünanlagen', vedacoes_muros:'Einfriedungen & Stützmauern',
      calcetamento:'Außenpflasterung & Wegebau', fachadas:'Fassadensanierung & Außenputz',
      arquitetura_projetos:'Architektur & Entwurfsplanung', engenharia_civil:'Bauingenieurwesen & Tragwerksplanung',
      topografia:'Vermessung & Baugrunduntersuchung', gestao_obra:'Bauleitung & Projektmanagement',
      certificacao_energetica:'Energieausweis (EnEV/GEG)', seguranca_trabalho:'Arbeitssicherheit (ASiG/DGUV)',
      design_interiores:'Innenarchitektur & Raumgestaltung', materiais_construcao:'Baustoffe & Baustoffhandel',
      equipamentos_construcao:'Baumaschinen & Geräteverleih'
    },
    sectorOptions:{
      pedreiros:'Maurer & Verputzer', escavacao:'Erdarbeiten & Baugrubenaushub', betao_cimento:'Betonbau',
      estruturas_metalicas:'Stahlbau & Tragkonstruktionen', demolicao:'Abbrucharbeiten', alvenaria:'Mauerwerk & Ziegelarbeiten',
      cofragem:'Schalung & Bewehrung', impermeabilizacao:'Abdichtung & Feuchtigkeitsschutz',
      eletricistas:'Elektroinstallation', picheleiros:'Klempner & Heizungsbauer',
      canalizacao_saneamento:'Sanitär & Abwassertechnik', climatizacao_avac:'Heizung, Lüftung & Klima (HLK)',
      gas:'Gasinstallation', domotica_automacao:'Gebäudeautomation & Smart Home',
      energias_renovaveis:'Erneuerbare Energien / Photovoltaik', seguranca_alarmes:'Sicherheitssysteme & Alarmanlagen',
      pocos_agua:'Brunnenbau & Bohrungen',
      pintores:'Maler & Lackierer', estucadores:'Verputzer & Trockenbauer', pavimentos:'Bodenbeläge & Estrich',
      azulejos:'Fliesen & Keramik', marmoraria:'Natur- & Werkstein (Marmor/Granit)',
      isolamento:'Wärme- & Schalldämmung', gesso_cartonado:'Trockenbau / Gipskarton',
      carpinteiros:'Zimmerer & Tischler', serralharia:'Metallbau & Schlosserei', aluminios_pvc:'Aluminium- & PVC-Fenster/Türen',
      caixilharia:'Fenster- & Türmontage', vidraceiros:'Glaserei & Fassadenverglasung', portoes_vedacoes:'Tore & Einzäunungen',
      moveis_medida:'Maßmöbel & Einbauschränke',
      telhados_coberturas:'Dachdeckerei & Dachbau', piscinas:'Schwimmbad- & Poolbau',
      paisagismo_jardins:'Landschaftsbau & Gartengestaltung', jardineiros:'Gartenpflege & Grünanlagen', vedacoes_muros:'Einfriedungen & Stützmauern',
      calcetamento:'Außenpflasterung & Wegebau', fachadas:'Fassadensanierung & Außenputz',
      arquitetura_projetos:'Architektur & Entwurfsplanung', engenharia_civil:'Bauingenieurwesen & Tragwerksplanung',
      topografia:'Vermessung & Baugrunduntersuchung', gestao_obra:'Bauleitung & Projektmanagement',
      certificacao_energetica:'Energieausweis (EnEV/GEG)', seguranca_trabalho:'Arbeitssicherheit (ASiG/DGUV)',
      design_interiores:'Innenarchitektur & Raumgestaltung', materiais_construcao:'Baustoffe & Baustoffhandel',
      equipamentos_construcao:'Baumaschinen & Geräteverleih',
      chave_na_mao_construcao:'Schlüsselfertiger Neubau', chave_na_mao_remodelacao:'Schlüsselfertige Sanierung',
      chave_na_mao_moradia:'Schlüsselfertiges Einfamilienhaus', chave_na_mao_apartamento:'Schlüsselfertige Wohnungsrenovierung',
      chave_na_mao_comercial:'Schlüsselfertiger Gewerbebau'
    },
    sectorGroups:{
      estrutura_fundacao:'Rohbau', instalacoes:'Gebäudetechnik', acabamentos:'Ausbau',
      carpintaria:'Holzbau', serralharia_metal:'Metallbau', exterior_jardim:'Außenanlagen', projeto_gestao:'Planung', chave_na_mao:'Schlüsselfertig',
      obra_grossa:'Rohbau', redes_tecnicas:'Haustechnik', revestimentos:'Bekleidung & Beschichtung',
      madeira:'Holz & Möbel', metal_vidro:'Metall, Glas & Bauelemente', exteriores:'Außen- & Grünanlagen', projetos:'Planung & Beratung'
    },
    regTitle:'Neues Unternehmen registrieren',
    regSub:'Füllen Sie das Formular aus, um Ihr Unternehmen auf der Hivex-Plattform einzutragen. Mit',
    regSubSuffix:'markierte Felder sind Pflichtfelder.',
    regCompanyName:'Unternehmensname', regNamePh:'z. B. Musterbau GmbH',
    regSectorLabel:'Tätigkeitsbereich', regSectorPh:'Bereich auswählen...',
    regCae:'CAE-Code', regCaePh:'z. B. CAE 41 – Hochbau',
    regAlvara:'Gewerbeschein', regAlvaraPh:'Gewerberegisternummer',
    valAlvara:'Bitte Gewerberegisternummer eingeben.',
    regCertidao:'Code des Handelsregisterauszugs', regCertidaoPh:'z. B. 1234-5678-9012',
    regCertidaoHint:'Zugangscode zum portugiesischen Handelsregister (Certidão Permanente — 12-stellig, Format XXXX-XXXX-XXXX).',
    valCertidao:'Bitte den Code des Handelsregisterauszugs eingeben.',
    valCertidaoFormat:'Ungültiger Code (mindestens 8 alphanumerische Zeichen).',
    regAddress:'Adresse', regAddressPh:'z. B. Hauptstraße 200, Lissabon',
    regZone:'Stadt/Region',
    regEmail:'Kontakt-E-Mail', regEmailPh:'firma@email.com',
    regPhone:'Telefon/WhatsApp',
    regWebsite:'Website', regWebsitePh:'https://www.firma.de',
    regLogo:'Firmenlogo', regLogoPick:'Bild wählen…', regLogoRemove:'Entfernen', regLogoEmpty:'Kein Bild', regLogoHint:'JPG oder PNG — wird verkleinert und komprimiert. Erscheint als Firmenlogo.', regLogoInvalid:'Ungültige Bilddatei.',
    regSpecialties:'Fachbereiche', regTagsPh:'z. B. Tiefbau, Öffentliche Aufträge',
    regTagsHint:'Fachbereiche durch Komma trennen.',
    regDescription:'Kurzbeschreibung', regDescPh:'Unternehmensprofil, angebotene Leistungen und Stärken...',
    regCancel:'Abbrechen', regSubmit:'Unternehmen registrieren',
    zones:{
      lisbon_center:'Lissabon-Mitte', lisbon_north:'Lissabon-Nord',
      lisbon_east:'Lissabon-Ost', lisbon_west:'Lissabon-West',
      oeiras:'Oeiras', sintra:'Sintra', cascais:'Cascais',
      setubal:'Setúbal', porto:'Porto', braga:'Braga'
    },
    emailTitle:'Angebotsanfrage',
    emailSub:'Direkt an den Anbieter per verifizierter E-Mail senden.',
    emailSubject:'Betreff', emailSubjectVal:'Angebotsanfrage – Hivex Marketplace',
    emailType:'Anfragetyp',
    emailTypes:['Angebotsanfrage','Informationsanfrage','Kooperationsvorschlag'],
    emailMessage:'Nachricht',
    emailMessageVal:'Sehr geehrte Damen und Herren,\n\nIch habe Ihr Unternehmen auf der Hivex-Plattform gefunden und möchte ein Angebot anfragen...',
    emailAttach:'Anhang (optional)', emailCancel:'Abbrechen', emailSend:'Anfrage senden',
    chatOnline:'● Jetzt online', chatPlaceholder:'Nachricht eingeben...',
    chatMsg1:'Guten Tag! Ich habe Ihr Profil auf Hivex gesehen – können Sie mir ein Angebot schicken?',
    chatMsg2:'Guten Tag! Sehr gerne. Bitte teilen Sie uns die technischen Spezifikationen mit.',
    chatMsg3:'Gut, hier sind die Projektdetails.',
    toastFiltersCleared:'Alle Filter wurden zurückgesetzt!',
    toastWhatsapp:'WhatsApp wird geöffnet...', toastEmailSent:'Angebotsanfrage erfolgreich gesendet!',
    toastAutoReply:'Vielen Dank für Ihre Nachricht! Wir melden uns so schnell wie möglich.',
    valName:'Bitte Unternehmensnamen eingeben.',
    valSector:'Bitte Tätigkeitsbereich auswählen.',
    valAddress:'Bitte Adresse eingeben.',
    valEmail:'Bitte Kontakt-E-Mail eingeben.',
    valTags:'Bitte mindestens einen Fachbereich eingeben.',
    toastRegistered: name => `„${name}" wurde erfolgreich registriert und erscheint jetzt auf der Karte.`,
    popupNoRatings:'Noch keine Bewertungen', popupNewBadge:'Neu eingetragen',
    openNow:'Geöffnet', closedNow:'Geschlossen', newOnHivex:'Neu bei Hivex',
    btnSearch:'Suchen',
    heroLabel:'B2B & B2C Marktplatz',
    heroTitleMain:'Vernetzen. Zusammenarbeiten.', heroTitleAccent:'Wachsen.',
    heroSub:'Hivex verbindet Unternehmen und Privatpersonen mit den besten Dienstleistern – schnell, transparent und vollständig in Ihrer Hand.',
    heroBtnSearch:'Unternehmen entdecken', heroBtnRegister:'Mein Unternehmen registrieren',
    whatLabel:'Was ist Hivex', whatTitle:'Die Plattform für alle',
    whatSub:'Hivex vereinfacht die Verbindung zwischen Auftraggebern und Anbietern. Ob Unternehmen, das strategische Partner sucht, oder Privatperson mit Bedarf an schneller Unterstützung – Hivex bringt sie mit vertrauenswürdigen Fachleuten zusammen.',
    uc1Title:'Business-to-Business (B2B)', uc1Desc:'Für Unternehmen auf der Suche nach Lieferanten, Nachunternehmern oder strategischen Partnern. Ideal für Großprojekte und Rahmenverträge.',
    uc2Title:'Privat-zu-Unternehmen (B2C)', uc2Desc:'Für Privatpersonen, die professionelle Leistungen benötigen – Sanierung, Bau, Installation oder Wartung. Einfach, schnell, ohne Zwischenhändler.',
    houseLabel:'Praxisbeispiel', houseTitle:'Ein Haus bauen? Finden Sie alle Fachleute',
    houseIntro:'Ein Hausbau erfordert Dutzende Fachgewerke. Mit Hivex finden und kontaktieren Sie passende Unternehmen für jede Bauphase.',
    houseCta:'Mit Hivex können Sie für jedes Gewerk <strong>gezielt filtern</strong>, Bewertungen vergleichen und <strong>bei mehreren Unternehmen Angebote anfragen</strong> – alles auf einer Plattform.',
    houseSpecialties:[
      {icon:'ruler',name:'Architektur & Planung',sub:'Baugenehmigung & Entwurf'},
      {icon:'hammer',name:'Generalunternehmer',sub:'Bauleitung & Koordination'},
      {icon:'layers',name:'Maurer & Rohbau',sub:'Fundament, Stahlbeton & Tragwerk'},
      {icon:'zap',name:'Elektroinstallation',sub:'Verteiler, Verkabelung & Beleuchtung'},
      {icon:'droplets',name:'Sanitär & Heizung',sub:'Wasser, Abwasser, Gas & Heizung'},
      {icon:'square',name:'Fenster, Türen & Glas',sub:'Fenster, Türen & Fassadenverglasung'},
      {icon:'paintbrush',name:'Maler & Verputzer',sub:'Wände, Decken & Beläge'},
      {icon:'scissors',name:'Zimmerer & Tischler',sub:'Türen, Einbauschränke & feste Möbel'},
      {icon:'home',name:'Dachdeckerei & Abdichtung',sub:'Dach, Balkone & Terrassen'},
      {icon:'wind',name:'Heizung, Lüftung & Klima',sub:'Heizung, Klimaanlage & Lüftung'}
    ],
    stepsLabel:'So funktioniert es', stepsTitle:'Drei einfache Schritte',
    step1Title:'Filtern & Suchen', step1Desc:'Nach Gewerk, Standort, Bewertung und Fachbereich filtern. Die Karte aktualisiert sich in Echtzeit.',
    step2Title:'Unternehmen vergleichen', step2Desc:'Detailprofile, Bewertungen nach Qualität/Termintreue/Kommunikation/Preis und Fachbereiche einsehen.',
    step3Title:'Angebot anfragen', step3Desc:'Direkt per E-Mail, Chat oder WhatsApp kontaktieren. Ohne Zwischenhändler, ohne Verzögerung.',
    ctaTitle:'Bereit loszulegen?', ctaSub:'Verfügbare Unternehmen entdecken oder Ihr Unternehmen jetzt auf Hivex registrieren.',
    helpTitle:'Hilfecenter', helpSubtitle:'Hivex-Support – wir sind für Sie da',
    helpTabSupport:'Kundensupport', helpTabAbout:'Über Hivex',
    helpSupportIntro:'Wir helfen Ihnen gerne weiter! Kontaktieren Sie uns über folgende Kanäle:',
    helpChatTitle:'Live-Chat', helpChatDesc:'Sofort über den plattformeigenen Chat erreichbar.', helpChatBtn:'Chat öffnen',
    helpEmailTitle:'E-Mail', helpEmailDesc:'geral.hivex@gmail.com — Antwort innerhalb von 24 Arbeitsstunden.', helpEmailBtn:'E-Mail senden',
    helpPhoneTitle:'Telefon', helpPhoneDesc:'+351 XXX XXX XXX · Mo–Fr: 09:00–18:00 Uhr', helpPhoneBtn:'Anrufen',
    helpFaqTitle:'Häufige Fragen', helpFaqDesc:'Antworten auf die häufigsten Fragen finden.', helpFaqBtn:'FAQ ansehen',
    helpWhoTitle:'Über uns', helpWhoDesc:'HIVE ist eine innovative digitale Plattform, die Unternehmen, freie Fachleute und Privatpersonen vernetzt und transparente, verlässliche Geschäftsbeziehungen fördert. Wir sind in Portugal tätig und haben es uns zur Aufgabe gemacht, Zwischenhändler zu eliminieren, Kosten zu senken und hochwertige Dienstleistungen für alle zugänglich zu machen.',
    helpStatPros:'Verifizierte Unternehmen', helpStatCompanies:'Registrierte Unternehmen',
    helpMissionTitle:'Mission', helpMissionDesc:'Den Zugang zu hochwertigen Fachleistungen vereinfachen und demokratisieren – ein transparentes Ökosystem schaffen, in dem Unternehmen und Fachleute gemeinsam wachsen können, ohne unnötige Zwischenhändler.',
    helpVisionTitle:'Vision', helpVisionDesc:'Die führende Plattform in Portugal zur Vernetzung von Unternehmen und Fachleuten werden, Wirtschaftswachstum fördern und Chancen für alle schaffen.',
    navLogin:'Anmelden / Registrieren', navHelp:'Hilfe',
    themeToDark:'Dunkel', themeToLight:'Hell', themeModeDark:'Dunkelmodus', themeModeLight:'Heller Modus',
    testimonialPhrases:['Hervorragende Professionalität und Arbeitsqualität.','Sehr pünktlich und tadellose Arbeit. Empfehlenswert!','Tolles Preis-Leistungs-Verhältnis. Gerne wieder.','Sehr kompetentes und organisiertes Team.','Haben die Erwartungen übertroffen. Erstklassige Arbeit.','Seriöse und vertrauenswürdige Fachleute.','Schneller und effizienter Service. Sehr zufrieden.','Ausgezeichneter Service von Anfang bis Ende.','Termin und Budget eingehalten. Empfehlenswert!','Sorgfältige Arbeit und sehr freundlich.'],
    navFavourites:'Favoriten', navFaq:'FAQ', navPrivacy:'Datenschutz', avatarLogout:'Abmelden', avatarFaqHelp:'FAQ & Hilfe',
    lpHeroRegisterCta:'Unternehmen registrieren', lpHeroRegisterHint:'Sind Sie ein Unternehmen? In Minuten auf der Karte erscheinen.',
    lpHeroLoginHint:'Schon ein Konto?', lpHeroLoginLink:'Anmelden',
    lpHeroTitle:'Die besten<br><span class="hero-accent">Baufachleute</span> finden',
    lpHeroSub:'Bewertungen vergleichen und Angebote in Minuten anfragen.',
    lpEarlyAccessText:'Neue Plattform – registrieren Sie Ihr Unternehmen in Minuten.',
    lpTabLocation:'Nach Standort', lpTabActivity:'Nach Tätigkeit',
    lpLocationLabel:'Standort', lpLocationPh:'Lissabon, Porto, Braga...',
    lpActivityLabel:'Tätigkeitsbereich / Leistung', lpSelectActivity:'Tätigkeit auswählen...',
    lpHeroCatsLabel:'Wonach suchen Sie?',
    statCompanies:'Registrierte Unternehmen', statAreas:'Tätigkeitsbereiche', statSpecialties:'Fachbereiche', statCoverage:'Ganz Portugal',
    featuredOverline:'Empfohlene Unternehmen', featuredTitle:'Bestbewertet', featuredSeeAll:'Alle Unternehmen ansehen →', featuredEmpty:'Noch keine empfohlenen Unternehmen.',
    featuredVerified:'✓ Verifiziert', featuredReviews:'Bewertungen',
    ubFeaturedBtn:'Empfohlene Unternehmen', featEmpty:'Noch keine empfohlenen Unternehmen.', featCta:'Möchten Sie hier zuerst erscheinen? Heben Sie Ihr Unternehmen hervor', featuredBadge:'Empfohlen',
    lpStep1Title:'Suchen', lpStep1Desc:'Nach Gewerk, Standort und Bewertung filtern. Die Karte zeigt Ergebnisse in Echtzeit.',
    lpStep2Title:'Vergleichen', lpStep2Desc:'Detailprofile, Bewertungsübersichten und Fachbereiche der Unternehmen einsehen.',
    lpStep3Title:'Kontaktieren', lpStep3Desc:'Direkt per E-Mail oder Chat anfragen. Ohne Zwischenhändler.',
    lpForWhom:'Für wen?', lpPlatformTitle:'Die Plattform für alle',
    lpB2bBadge:'B2B · Für Unternehmen', lpB2bTitle:'Business-to-Business',
    lpB2bDesc:'Auf der Suche nach Fachanbieter, strategischen Partnern oder Nachunternehmern. Ideal für anspruchsvolle Projekte und Rahmenverträge.',
    lpB2bBtn:'Als Unternehmen entdecken →',
    lpB2cBadge:'B2C · Für Privatpersonen', lpB2cTitle:'Privat-zu-Unternehmen',
    lpB2cDesc:'Sie benötigen eine Reparatur, Sanierung oder Installation? Vergleichen Sie zertifizierte Fachleute und fordern Sie einfach Angebote an.',
    lpB2cBtn:'Fachleute finden →',
    toastEmailUnavailable:'📧 E-Mail nicht verfügbar — bitte WhatsApp oder Chat nutzen',
    toastPhoneUnavailable:'📞 Telefon nicht verfügbar',
    toastLinkCopied:'Link kopiert!',
    toastCopyFailed:'Kopieren fehlgeschlagen',
    toastGeoNotSupported:'Dieser Browser unterstützt keine Geolokalisierung.',
    toastGeoPermissionDenied:'Standortzugriff verweigert.',
    toastGeoPositionUnavailable:'Standort nicht verfügbar.',
    toastGeoTimeout:'Standortermittlung hat zu lange gedauert.',
    toastGeoError:'Fehler beim Abrufen des Standorts.',
    toastLocationFound:'Aktueller Standort gefunden!',
    toastLocationFailed:'Standort konnte nicht ermittelt werden.',
    toastLocationError:'Fehler bei der Standortsuche.',
    toastRegisterError:'Fehler beim Speichern. Bitte Netzwerkverbindung prüfen und erneut versuchen.',
    emailQuoteSubject:'Angebotsanfrage',
    emailQuoteBody:'Sehr geehrte Damen und Herren,\n\nIch möchte ein Angebot für Ihre Leistungen anfragen.\n\nProjektdetails:\n- Beschreibung:\n- Standort:\n- Gewünschter Fertigstellungstermin:\n\nIch freue mich auf Ihre Rückmeldung.\n\nMit freundlichen Grüßen',
    searchListEmpty:'Keine Unternehmen gefunden',
    searchListEmptySub:'Filter anpassen oder Suchradius vergrößern',
    mapHintNoResults:'Keine Unternehmen in diesem Bereich gefunden',
    mapHintNoResultsSub:'Suchradius vergrößern oder anderen Tätigkeitsbereich wählen',
    mapHintSelectSector:'Tätigkeitsbereich auswählen',
    mapHintSelectSectorSub:'um Unternehmen auf der Karte anzuzeigen',
    noRatingText:'Noch keine Bewertung',
    regTypeCompany:'Unternehmensregistrierung',
    regTypeClient:'🔍 Kundenregistrierung',
    typeCompanyLabel:'Unternehmen',
    typeClientLabel:'Kunde',
    typeAdvertiserLabel:'Inserent',
    statusApproved:'Genehmigt', statusPending:'Ausstehend', statusRejected:'Abgelehnt', statusRemoved:'🗑️ Entfernt',
    postRegAria:'Nächste Schritte',
    postRegWelcome:'Willkommen bei Hivex!', postRegWelcomeNamed:'Willkommen bei Hivex, {name}!',
    postRegPrompt:'Was möchten Sie tun?',
    postRegAdvertiseTitle:'Mein Unternehmen inserieren',
    postRegAdvertiseDesc:'Mein Unternehmen registrieren und im Marketplace erscheinen',
    postRegBrowseTitle:'Nur Unternehmen suchen',
    postRegBrowseDesc:'Marketplace erkunden und Fachleute finden',
    postRegFooterHint:'Sie können Ihr Unternehmen später über das Kontomenü inserieren.',
    reportAria:'Eintrag melden', reportTitle:'Eintrag melden',
    reportSubtitle:'Meldungen werden von unserem Moderationsteam geprüft.',
    reportReasonLabel:'Grund', reportReasonPh:'Grund auswählen…',
    reportReasonFake:'Falsches oder nicht existierendes Unternehmen', reportReasonInappropriate:'Unangemessener Inhalt',
    reportReasonDuplicate:'Doppelter Eintrag', reportReasonWrongInfo:'Falsche Informationen',
    reportReasonSpam:'Spam', reportReasonOther:'Sonstiges',
    reportDetailsLabel:'Details (optional)', reportDetailsPh:'Problem beschreiben (bis zu 500 Zeichen)',
    reportSubmit:'Meldung senden', btnCancel:'Abbrechen',
    regSuccessTitle:'Registrierung erhalten!',
    regSuccessSub:'Ihre Registrierung ist eingegangen und wird von unserem Team geprüft. Nach der Freigabe erscheint Ihr Unternehmen auf der Karte und Sie erhalten eine Bestätigungs-E-Mail.',
    regSuccessStep1:'In Prüfung — meist innerhalb von <strong>24 Werkstunden</strong> freigegeben.',
    regSuccessStep2:'✉️ Sie erhalten eine <strong>E-Mail</strong>, sobald es freigegeben ist.',
    regSuccessStep3:'✏️ Details jederzeit unter <strong>Mein Profil</strong> bearbeiten.',
    heroUserGreeting:'Hallo!', heroUserGreetingNamed:'Hallo, {name}!',
    heroUserTagline:'Möchten Sie Ihr Unternehmen im Marketplace inserieren?',
    heroUserCta:'Unternehmen inserieren',
    sectorAllLabel:'Alle Bereiche',
    sectorAllSelectAll:'Alle Bereiche auswählen',
    sectorAllDeselectAll:'Auswahl aller Bereiche aufheben', sectorSelectAllHere:'Alle auswählen',
    emptySectorTitle:'Wählen Sie einen Tätigkeitsbereich',
    emptySectorSub:'Wählen Sie oben einen oder mehrere Bereiche, um verfügbare Unternehmen anzuzeigen.',
    dpFavTitle:'In Favoriten speichern', dpEditTitle:'Bearbeiten', dpEditAria:'Unternehmen bearbeiten',
    dpCloseAria:'Details schließen', dpReportTitle:'Eintrag melden',
    authWelcome:'Willkommen bei Hivex', authTagline:'Das größte B2B-Netzwerk Portugals',
    authTabLogin:'Anmelden', authTabRegister:'Konto erstellen',
    authDividerEmail:'oder mit E-Mail fortfahren', authDividerData:'oder Daten eingeben',
    authEmailLabel:'E-Mail', authPasswordLabel:'Passwort',
    authPasswordPh:'Mindestens 8 Zeichen', authPasswordHint:'Mindestens 8 Zeichen.',
    authLoginSubmit:'Anmelden', authRegisterSubmit:'Konto erstellen',
    authNoAccount:'Noch kein Konto?', authHasAccount:'Sie haben bereits ein Konto?',
    capsLockOn:'⚠️ Feststelltaste ist aktiviert', pwdToggleAria:'Passwort ein-/ausblenden',
    authAria:'Anmelden oder Konto erstellen',
    toastFavRemoved:'Aus Favoriten entfernt', toastFavAdded:'★ Zu Favoriten hinzugefügt',
    toastNoEditPermission:'Keine Berechtigung, dieses Unternehmen zu bearbeiten.',
    toastCompanyUpdated:'Unternehmen erfolgreich aktualisiert!',
    toastReportLoginRequired:'Bitte anmelden, um einen Eintrag zu melden.',
    toastReportSelectReason:'Bitte einen Grund auswählen.',
    toastReportSent:'Meldung gesendet. Danke, dass Sie helfen, die Plattform sicher zu halten.',
    toastReportFailed:'Meldung konnte nicht gesendet werden.',
    toastFillFields:'Bitte alle Felder ausfüllen',
    toastFillRequired:'Bitte die Pflichtfelder ausfüllen',
    toastBadCredentials:'Falsche E-Mail oder falsches Passwort',
    toastTooManyAttempts:'Zu viele Versuche. Bitte später erneut versuchen.',
    toastWelcomeUser:'Willkommen, {name}!',
    toastLoggedOut:'Abgemeldet',
    toastGoogleFailed:'Google-Anmeldung fehlgeschlagen',
    toastRegisterFailed:'Konto konnte nicht erstellt werden',
    toastPasswordTooShort:'Das Passwort muss mindestens 8 Zeichen lang sein',
    avatarRegisterCompany:'Unternehmen registrieren',
    regAuthNameLabel:'Vollständiger Name',
    regAuthNamePh:'Ihr Name',
    lpTabCompany:'Nach Unternehmen',
    lpCompanyLabel:'Unternehmensname',
    lpCompanyPh:'z. B. Musterbau GmbH...',
    legendTitle:'🎨 Legende',
    legendEstrutura:'Rohbau',
    legendInstalacoes:'Haustechnik',
    legendAcabamentos:'Ausbau',
    legendCarpintaria:'Holzbau',
    legendSerralharia:'Metallbau',
    legendExterior:'Außenanlagen',
    legendProjeto:'Planung',
    legendChaveNaMao:'Schlüsselfertig',
    btnRequestQuote:'Angebot anfragen',
    testimonial1Name:'Ihr Unternehmen hier',
    testimonial1Sector:'Auf HIVE registrieren',
    testimonial1Quote:'Der Plattform beitreten und neue Kunden in ganz Portugal gewinnen.',
    testimonial2Name:'Zertifizierte Fachleute',
    testimonial2Sector:'Qualität garantiert',
    testimonial2Quote:'Alle Unternehmen werden von Kunden bewertet, um höchste Servicequalität sicherzustellen.',
    testimonial3Name:'Kostenlose Angebote',
    testimonial3Sector:'Ohne Verpflichtung',
    testimonial3Quote:'Bei mehreren Fachleuten Angebote anfragen und Preise einfach vergleichen.',
    testimonial4Name:'Schlüsselfertig',
    testimonial4Sector:'Komplettlösungen',
    testimonial4Quote:'Alle Fachleute für Ihr Projekt auf einer einzigen Plattform finden.',
    footerDesc:'Portugiesischer Baumarktplatz. Vernetzt Unternehmen und Privatpersonen mit zertifizierten Fachleuten.',
    footerNav:'Navigation',
    footerLegal:'Rechtliches',
    footerContact:'Kontakt',
    footerTerms:'Nutzungsbedingungen',
    footerPrivacy:'Datenschutzerklärung',
    footerCookies:'Cookies',
    footerRights:'Hivex – Alle Rechte vorbehalten',
    factSince:'Seit', factHours:'Öffnungszeiten', factVerified:'Verifiziert', factYear:'Jahr', factYears:'Jahre',
    review1Author:'TechCorp GmbH',
    review2Author:'Ibérica Solutions SA',
    logoTagline:'Baufachleute in Portugal',
    adBadge:'🏠 Praxisbeispiel',
    adTitle:'Ein Haus bauen?',
    adNavSub:'10 Fachleute, 1 Plattform',
    adMainSub:'8 Gewerke, 1 Plattform',
    adCta:'Hier alles<br>finden',
    adHivexBadge:'Hivex',
    adHivexTitle:'Vom Grundstück zum Haus',
    adHivexSub:'Ihr Projekt, Schritt für Schritt',
    adHivexB2C:'Kunden finden Unternehmen',
    adHivexB2B:'Unternehmen finden Partner',
    adHivexCta:'Mach<br>mit',
    adStory1:'Ihr Grundstück',
    adStory2:'Hivex öffnen',
    adStory3:'Spezialisten finden',
    adStory4:'Angebot anfragen',
    adStory5:'Vertrag schließen',
    adStory6:'Haus fertig',
    adNodeClient:'Kunde',
    adNodeCompany:'Firma',
    footerRgpd:'DSGVO',
    sortAll:'Alle',
    regCountry:'Land',
    regPostalCode:'Postleitzahl',
    regCity:'Ort / Stadt'
  }
};

// ── LANGUAGE STATE ─────────────────────────────────────────────────────────────
let currentLang = (function() { try { return localStorage.getItem('hive_lang') || 'pt'; } catch(_) { return 'pt'; } })();

// shorthand helper
function t(key) {
  return translations[currentLang][key] || translations.pt[key] || key;
}

// Locale-aware name collator — built once. Intl.Collator.compare is a
// pre-compiled comparator and is meaningfully faster than calling
// String.prototype.localeCompare per pair during a sort.
const _nameCollator = new Intl.Collator('pt', { sensitivity: 'base', numeric: true });

// ── LUCIDE ICON REFRESH (debounced) ───────────────────────────────────────────
// lucide.createIcons() scans the entire DOM for [data-lucide] every call.
// Coalesce multiple consecutive callers into a single rAF/idle scan.
let _lucidePending = false;
function refreshLucide() {
  if (_lucidePending || typeof lucide === 'undefined') return;
  _lucidePending = true;
  const run = () => {
    _lucidePending = false;
    try { lucide.createIcons(); } catch (_) {}
  };
  (window.requestIdleCallback || ((cb) => requestAnimationFrame(cb)))(run, { timeout: 500 });
}

// ── TAB NAVIGATION ─────────────────────────────────────────────────────────────
function showTab(name) {
  // Notify listeners (e.g. casa animation, IO observers) so they can pause
  // work when the tab they care about is hidden.
  try { document.dispatchEvent(new CustomEvent('hive:tab-change', { detail: name })); } catch (_) {}
  const home   = document.getElementById('tab-home');
  const search = document.getElementById('tab-search');
  const about  = document.getElementById('tab-about');

  // Close mobile filter drawer on tab switch
  closeMobileFilter();

  // Always restore nav visibility when switching tabs — the scroll-hide handler
  // can hide the nav while browsing the home page; switching tabs must reset it.
  try {
    const _navEl = document.querySelector('nav');
    if (_navEl) _navEl.classList.remove('scrolled');
    lastScrollTop = 0;
  } catch(e) { /* lastScrollTop not yet initialised — safe to ignore */ }

  // Hide all tabs
  home.style.display   = 'none';
  search.style.display = 'none';
  if (about) about.style.display = 'none';

  // Show selected tab
  if (name === 'home') {
    home.style.display = 'flex';
    // Hero (above the fold) must render synchronously so first paint is fast.
    populateHeroServiceDropdown();
    renderHeroCats();
    updateLandingStats();
    // Defer below-the-fold work to the next idle slot. The featured carousel
    // already shows skeleton placeholders so users see structure immediately;
    // populating it 50–200 ms later is invisible while the user is still on
    // the hero. Same for the testimonial banner.
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 80));
    idle(() => { try { renderFeaturedCompanies(); } catch (_) {} }, { timeout: 1000 });
    idle(() => { try { renderTestimonialBanner();  } catch (_) {} }, { timeout: 1500 });
    idle(() => { refreshLucide(); }, { timeout: 1500 });
  } else if (name === 'search') {
    search.style.display = 'flex';

    // First-time hint: tell users they can click pins to see details.
    // localStorage flag means it shows only once per browser.
    try {
      if (!localStorage.getItem('hive_pin_hint_shown')) {
        setTimeout(() => {
          showToast(t('mapPinHint') || '💡 Toque num pin para ver os detalhes da empresa.');
          try { localStorage.setItem('hive_pin_hint_shown', '1'); } catch(_) {}
        }, 1200);
      }
    } catch(_) {}

    // On mobile: render the mobile search panel (replaces desktop sidebar)
    if (window.innerWidth <= 768) {
      renderMobileSearchPanel();
    }

    // Tell Leaflet to recalculate the container size and reload any grey tiles.
    // Must run after the browser has painted the newly-visible container.
    requestAnimationFrame(() => {
      if (map) {
        map.invalidateSize({ animate: false });
        if (!window._mapEverShown) {
          window._mapEverShown = true;
          // The map always opens zoomed OUT (the whole country); the user chooses
          // whether to zoom into their location via the locate button. We still
          // request their position so the "you are here" marker + 50 km radius
          // circle are shown — but without changing the zoom.
          map.setView(PORTUGAL_CENTER, 7);
          if (!_locationObtained) {
            // Only auto-centre for users who already granted location — never
            // surface the OS prompt or the help modal without an explicit tap.
            setTimeout(autoDetectLocationIfGranted, 200);
          }
        }
      }
    });
  } else if (name === 'about') {
    if (about) about.style.display = 'flex';
    refreshLucide();
  }

  document.querySelectorAll('.nav-link[data-tab]').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === name);
  });

  // Map page (desktop): lay the header out as a grid — logo+tabs (top-left),
  // search (under them), banner (wide centre), auth (top-right).
  try { dockMapSearchControls(name === 'search'); } catch (_) {}
}

// Desktop header grid: the banner sits in the wide centre on EVERY page (Home
// and Map), so the publicity banner is in the same position throughout. The
// search controls (.ub-search) additionally dock under the logo/tabs only on
// the Map page (where they exist). On mobile, the nav uses its normal layout
// and the search returns to the unified bar.
function dockMapSearchControls(active) {
  const nav        = document.querySelector('nav');
  const ubSearch   = document.querySelector('.ub-search');
  const unifiedBar = document.querySelector('.unified-bar');
  if (!nav || !ubSearch || !unifiedBar) return;
  const isDesktop = window.innerWidth > 1024;

  // Grid header (banner centred) on all desktop pages.
  nav.classList.toggle('nav-map-grid', isDesktop);

  // Dock the search into the header only on the Map page.
  if (active && isDesktop) {
    if (ubSearch.parentNode !== nav) nav.appendChild(ubSearch);
    ubSearch.classList.add('ub-search-in-nav');
  } else if (ubSearch.classList.contains('ub-search-in-nav')) {
    unifiedBar.insertBefore(ubSearch, unifiedBar.firstChild);
    ubSearch.classList.remove('ub-search-in-nav');
  }

  // Banner publicitário: vive sempre na coluna central da grelha do nav
  // (grid-area "banner"), igual no Início e no Mapa — sem migração por JS.
}

// Re-evaluate the header layout when crossing the desktop/mobile boundary on the map.
window.addEventListener('resize', () => {
  const onMap = document.getElementById('tab-search') &&
                getComputedStyle(document.getElementById('tab-search')).display !== 'none';
  try { dockMapSearchControls(onMap); } catch (_) {}
}, { passive: true });

// ── LANDING PAGE SEARCH ────────────────────────────────────────────────────────

const _heroGroupIcons = {
  'estrutura_fundacao':'🏗️','instalacoes':'⚡','acabamentos':'🎨',
  'carpintaria':'🪚','serralharia_metal':'🔩','exterior_jardim':'🌿',
  'projeto_gestao':'📐','chave_na_mao':'🔑'
};

// ── Toggle between "location" and "activity" search modes ──────────────────
function heroSetMode(mode) {
  try { hideHeroSuggest(); } catch (_) {}   // close any open typeahead when switching modes
  const wrap     = document.getElementById('heroSearchWrap');
  const locWrap  = document.getElementById('heroLocationWrap');
  const actWrap  = document.getElementById('heroActivityWrap');
  const compWrap = document.getElementById('heroCompanyWrap');
  const tabLoc   = document.getElementById('tabBtnLocation');
  const tabAct   = document.getElementById('tabBtnActivity');
  const tabComp  = document.getElementById('tabBtnCompany');
  const field    = document.getElementById('heroMainField');

  if (!wrap) return;
  wrap.dataset.mode = mode;

  locWrap.style.display = 'none';
  actWrap.style.display = 'none';
  if (compWrap) compWrap.style.display = 'none';
  tabLoc.classList.remove('active');
  tabAct.classList.remove('active');
  if (tabComp) tabComp.classList.remove('active');
  tabLoc.setAttribute('aria-pressed', 'false');
  tabAct.setAttribute('aria-pressed', 'false');
  if (tabComp) tabComp.setAttribute('aria-pressed', 'false');
  field.classList.remove('open');

  if (mode === 'location') {
    locWrap.style.display = 'flex';
    tabLoc.classList.add('active');
    tabLoc.setAttribute('aria-pressed', 'true');
    setTimeout(() => document.getElementById('heroLocation')?.focus(), 50);
  } else if (mode === 'activity') {
    actWrap.style.display = 'flex';
    tabAct.classList.add('active');
    tabAct.setAttribute('aria-pressed', 'true');
    setTimeout(() => field.classList.add('open'), 80);
  } else if (mode === 'company') {
    if (compWrap) compWrap.style.display = 'flex';
    if (tabComp) {
      tabComp.classList.add('active');
      tabComp.setAttribute('aria-pressed', 'true');
    }
    setTimeout(() => document.getElementById('heroCompanyName')?.focus(), 50);
  }
}

// ── Fuzzy match helper ────────────────────────────────────────────────────
function _fuzzyMatch(query, text) {
  if (!query) return 1;
  const q = _normalizeText(query);
  const t = _normalizeText(text);
  // Exact substring match — highest score
  if (t.includes(q)) return 1;
  // Word-start match (e.g. "elec" matches "electricidade")
  const words = t.split(/\s+/);
  for (const w of words) { if (w.startsWith(q)) return 0.9; }
  // Fuzzy character-sequence match
  let qi = 0, consecutive = 0, maxConsec = 0, firstMatch = -1;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      if (firstMatch < 0) firstMatch = ti;
      qi++; consecutive++;
      if (consecutive > maxConsec) maxConsec = consecutive;
    } else { consecutive = 0; }
  }
  if (qi < q.length) return 0; // not all chars matched
  // Score based on consecutive run length and position
  return 0.3 + (maxConsec / q.length) * 0.4 + (firstMatch === 0 ? 0.2 : 0);
}
function _normalizeText(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// ── Build the activity dropdown panel ──────────────────────────────────────
function populateHeroServiceDropdown() {
  const panel   = document.getElementById('heroServicePanel');
  const trigger = document.getElementById('heroServiceTrigger');
  const field   = document.getElementById('heroMainField');
  if (!panel) return;

  const tr = translations[currentLang] || translations.pt;
  const sg = tr.sectorGroups || {};
  const sc = tr.sectors || {};

  panel.innerHTML = '';

  // Search input at top
  const searchWrap = document.createElement('div');
  searchWrap.className = 'hs-search-wrap';
  searchWrap.innerHTML = '<input type="text" class="hs-search-input" id="heroServiceSearch" placeholder="Pesquisar atividade..." autocomplete="off"/>';
  panel.appendChild(searchWrap);
  // Prevent clicks inside search from closing dropdown
  searchWrap.addEventListener('click', (e) => e.stopPropagation());

  // "All services" row
  const allRow = document.createElement('div');
  allRow.className = 'hs-option-all';
  allRow.dataset.searchable = 'todos servicos all services';
  allRow.innerHTML = '<span>🌐</span><span>Todos os serviços</span>';
  allRow.addEventListener('click', () => _heroSelectOption('__all__', 'Todos os serviços'));
  panel.appendChild(allRow);

  // Groups → subcategories
  Object.entries(SECTOR_HIERARCHY).forEach(([groupKey, group]) => {
    const icon = _heroGroupIcons[groupKey] || '🔧';
    const groupLabel = sg[groupKey] || group.label;

    const groupTitle = document.createElement('div');
    groupTitle.className = 'hs-group-title';
    groupTitle.innerHTML = `<span class="hs-group-icon">${icon}</span><span>${groupLabel}</span>`;
    panel.appendChild(groupTitle);

    Object.values(group.categories).forEach(cat => {
      Object.entries(cat.subcategories).forEach(([subKey, subLabel]) => {
        const label = sc[subKey] || subLabel;
        const opt = document.createElement('div');
        opt.className = 'hs-option';
        opt.dataset.value = subKey;
        opt.dataset.searchable = `${label} ${subLabel} ${groupLabel}`;
        opt.textContent = label;
        opt.addEventListener('click', () => _heroSelectOption(subKey, label));
        panel.appendChild(opt);
      });
    });
  });

  // No results message (hidden by default)
  const noResults = document.createElement('div');
  noResults.className = 'hs-no-results';
  noResults.id = 'hsNoResults';
  noResults.style.display = 'none';
  noResults.textContent = 'Nenhuma atividade encontrada';
  panel.appendChild(noResults);

  // Wire up search input filtering
  const searchInput = document.getElementById('heroServiceSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      const options = panel.querySelectorAll('.hs-option');
      const groups = panel.querySelectorAll('.hs-group-title');
      const allOpt = panel.querySelector('.hs-option-all');
      let visibleCount = 0;

      if (!query) {
        // Show everything
        options.forEach(o => { o.style.display = ''; o.style.order = ''; });
        groups.forEach(g => g.style.display = '');
        if (allOpt) allOpt.style.display = '';
        noResults.style.display = 'none';
        return;
      }

      // Hide "all services" when searching
      if (allOpt) allOpt.style.display = 'none';

      // Score and filter each option
      const scored = [];
      options.forEach(o => {
        const text = o.dataset.searchable || o.textContent;
        const score = _fuzzyMatch(query, text);
        if (score > 0) {
          o.style.display = '';
          scored.push({ el: o, score });
          visibleCount++;
        } else {
          o.style.display = 'none';
        }
      });

      // Sort by score (best first) via CSS order
      scored.sort((a, b) => b.score - a.score);
      scored.forEach((item, i) => { item.el.style.order = i; });

      // Hide groups that have no visible children
      groups.forEach(g => {
        let next = g.nextElementSibling;
        let hasVisible = false;
        while (next && !next.classList.contains('hs-group-title') && !next.classList.contains('hs-no-results')) {
          if (next.classList.contains('hs-option') && next.style.display !== 'none') hasVisible = true;
          next = next.nextElementSibling;
        }
        g.style.display = hasVisible ? '' : 'none';
      });

      noResults.style.display = visibleCount === 0 ? '' : 'none';
    });

    // Focus search input when panel opens
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { field.classList.remove('open'); }
    });
  }

  // Wire up inline activity input (the text field in the trigger area)
  const activityInput = document.getElementById('heroActivityInput');
  if (activityInput) {
    activityInput.addEventListener('focus', () => {
      field.classList.add('open');
    });
    activityInput.addEventListener('input', () => {
      // Open the panel and sync the filter
      if (!field.classList.contains('open')) field.classList.add('open');
      // Use the same fuzzy filter logic as the panel search
      const query = activityInput.value.trim();
      const options = panel.querySelectorAll('.hs-option');
      const groups = panel.querySelectorAll('.hs-group-title');
      const allOpt = panel.querySelector('.hs-option-all');
      let visibleCount = 0;

      if (!query) {
        options.forEach(o => { o.style.display = ''; o.style.order = ''; });
        groups.forEach(g => g.style.display = '');
        if (allOpt) allOpt.style.display = '';
        noResults.style.display = 'none';
        if (searchInput) searchInput.value = '';
        return;
      }
      if (allOpt) allOpt.style.display = 'none';
      if (searchInput) searchInput.value = query;

      const scored = [];
      options.forEach(o => {
        const text = o.dataset.searchable || o.textContent;
        const score = _fuzzyMatch(query, text);
        if (score > 0) {
          o.style.display = '';
          scored.push({ el: o, score });
          visibleCount++;
        } else {
          o.style.display = 'none';
        }
      });
      scored.sort((a, b) => b.score - a.score);
      scored.forEach((item, i) => { item.el.style.order = i; });

      groups.forEach(g => {
        let next = g.nextElementSibling;
        let hasVisible = false;
        while (next && !next.classList.contains('hs-group-title') && !next.classList.contains('hs-no-results')) {
          if (next.classList.contains('hs-option') && next.style.display !== 'none') hasVisible = true;
          next = next.nextElementSibling;
        }
        g.style.display = hasVisible ? '' : 'none';
      });
      noResults.style.display = visibleCount === 0 ? '' : 'none';
    });
    activityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { field.classList.remove('open'); }
    });
  }

  // Trigger arrow click → toggle panel open/closed
  const arrowBtn = panel.parentElement?.querySelector('.hs-arrow');
  if (arrowBtn) {
    arrowBtn.style.cursor = 'pointer';
    arrowBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = field.classList.toggle('open');
      if (isOpen && activityInput) {
        setTimeout(() => activityInput.focus(), 100);
      }
    });
  }

  // Close panel on outside click (register once)
  if (!window._heroDropdownOutside) {
    window._heroDropdownOutside = true;
    document.addEventListener('click', (e) => {
      const f = document.getElementById('heroMainField');
      if (f && !f.contains(e.target)) f.classList.remove('open');
    });
  }
}

function _heroSelectOption(value, label) {
  const hidden = document.getElementById('heroService');
  if (hidden) hidden.value = value;

  // Update both the old text element and the new input field
  const textEl = document.getElementById('heroServiceText');
  if (textEl) { textEl.textContent = label; textEl.classList.add('has-value'); }

  const actInput = document.getElementById('heroActivityInput');
  if (actInput) { actInput.value = label; }

  const panel = document.getElementById('heroServicePanel');
  if (panel) {
    panel.querySelectorAll('.hs-option,.hs-option-all').forEach(o => o.classList.remove('selected'));
    panel.querySelectorAll(`[data-value="${value}"]`).forEach(o => o.classList.add('selected'));
    // Reset filter — show all options again
    panel.querySelectorAll('.hs-option').forEach(o => { o.style.display = ''; o.style.order = ''; });
    panel.querySelectorAll('.hs-group-title').forEach(g => g.style.display = '');
    const allOpt = panel.querySelector('.hs-option-all');
    if (allOpt) allOpt.style.display = '';
    const noRes = document.getElementById('hsNoResults');
    if (noRes) noRes.style.display = 'none';
    const searchInp = document.getElementById('heroServiceSearch');
    if (searchInp) searchInp.value = '';
  }

  const field = document.getElementById('heroMainField');
  if (field) field.classList.remove('open');
}

// ── Execute the search and jump to the map page ────────────────────────────
// ── Hero search typeahead (Location + Company) ────────────────────────────────
let _heroSuggestTimer = null, _heroSuggestSeq = 0;
function hideHeroSuggest() { const p = document.getElementById('heroSuggestPanel'); if (p) { p.style.display = 'none'; p.innerHTML = ''; } }
window.hideHeroSuggest = hideHeroSuggest;

function _renderHeroSuggest(items, onPick, icon) {
  const p = document.getElementById('heroSuggestPanel');
  if (!p) return;
  if (!items || !items.length) { hideHeroSuggest(); return; }
  p.innerHTML = '';
  items.forEach(it => {
    const row = document.createElement('div');
    row.className = 'hs-suggest-opt';
    row.innerHTML = '<span class="hs-suggest-ico">' + (icon || '') + '</span><span class="hs-suggest-txt"></span>';
    row.querySelector('.hs-suggest-txt').textContent = it.label;
    // mousedown fires before the input's blur so the pick isn't lost.
    row.addEventListener('mousedown', (e) => { e.preventDefault(); onPick(it); });
    p.appendChild(row);
  });
  p.style.display = 'block';
}

// Location — OpenStreetMap (Nominatim) geocoder, Portugal only, debounced.
function heroLocationInput(val) {
  const q = (val || '').trim();
  clearTimeout(_heroSuggestTimer);
  if (q.length < 3) { hideHeroSuggest(); return; }
  _heroSuggestTimer = setTimeout(async () => {
    const seq = ++_heroSuggestSeq;
    try {
      const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1'
        + '&countrycodes=pt&limit=6&accept-language=pt&q=' + encodeURIComponent(q);
      const data = await fetch(url, { headers: { 'Accept': 'application/json' } }).then(r => r.json());
      if (seq !== _heroSuggestSeq) return;                     // a newer keystroke won
      const seen = new Set();
      const items = (data || []).map(d => {
        const a = d.address || {};
        const name   = d.name || (d.display_name || '').split(',')[0].trim();
        const region = a.district || a.state || a.municipality || a.county || '';
        const label  = (name && region && name.toLowerCase() !== region.toLowerCase())
          ? (name + ', ' + region) : (name || d.display_name);
        return { label };
      }).filter(it => { if (!it.label || seen.has(it.label)) return false; seen.add(it.label); return true; });
      _renderHeroSuggest(items, (it) => {
        const inp = document.getElementById('heroLocation');
        if (inp) inp.value = it.label;
        hideHeroSuggest();
        heroSearch();
      }, '📍');
    } catch (e) { hideHeroSuggest(); }
  }, 320);
}
window.heroLocationInput = heroLocationInput;

// Company — filter the loaded catalogue by name (starts-with first, then contains).
function heroCompanyInput(val) {
  const q = (val || '').trim().toLowerCase();
  if (q.length < 1) { hideHeroSuggest(); return; }
  const list = (typeof companies !== 'undefined' && Array.isArray(companies)) ? companies : [];
  const starts = [], contains = [], seen = new Set();
  for (const c of list) {
    if (!c || !c.name) continue;
    const nl = c.name.toLowerCase();
    if (seen.has(nl)) continue;
    if (nl.startsWith(q)) { seen.add(nl); starts.push({ label: c.name }); }
    else if (nl.includes(q)) { seen.add(nl); contains.push({ label: c.name }); }
  }
  _renderHeroSuggest(starts.concat(contains).slice(0, 8), (it) => {
    const inp = document.getElementById('heroCompanyName');
    if (inp) inp.value = it.label;
    hideHeroSuggest();
    heroSearch();
  }, '🏢');
}
window.heroCompanyInput = heroCompanyInput;

function heroSearch() {
  const wrap    = document.getElementById('heroSearchWrap');
  const mode    = wrap?.dataset.mode || 'location';
  const location = mode === 'location' ? (document.getElementById('heroLocation')?.value.trim() || '') : '';
  const service  = mode === 'activity'  ? (document.getElementById('heroService')?.value || '')        : '';
  const companyName = mode === 'company' ? (document.getElementById('heroCompanyName')?.value.trim() || '') : '';

  showTab('search');
  activeSectors.clear();
  _keywordFilter = '';

  if (mode === 'company' && companyName) {
    // Select all sectors so the keyword filter can search across everything
    Object.values(SECTOR_HIERARCHY).forEach(group =>
      Object.values(group.categories).forEach(cat =>
        Object.keys(cat.subcategories).forEach(k => activeSectors.add(k))
      )
    );
    _keywordFilter = companyName;
    const uniInput = document.getElementById('searchUnified');
    if (uniInput) uniInput.value = companyName;
  } else if (service && service !== '__all__') {
    activeSectors.add(service);
  } else if (service === '__all__') {
    Object.values(SECTOR_HIERARCHY).forEach(group =>
      Object.values(group.categories).forEach(cat =>
        Object.keys(cat.subcategories).forEach(k => activeSectors.add(k))
      )
    );
  }

  if (location) {
    document.getElementById('searchUnified').value = location;
    geocodeLocation(location);
  }

  updateSectorActiveStates();
  renderSectorFilters();
  applyFilters.now();
}

// ── HERO CATEGORY STRIP ───────────────────────────────────────────────────
function renderHeroCats() {
  const strip = document.getElementById('lpHeroCats');
  if (!strip) return;
  strip.innerHTML = LP_CATS.map(cat => {
    const label = t(cat.labelKey) || cat.label;
    return `
    <button class="lp-hero-cat" onclick="lpCatSearch('${cat.key}')" title="${label}">
      <img src="${cat.photo}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()"/>
      <div class="lp-hero-cat-overlay">
        <span class="lp-hero-cat-name">${label}</span>
      </div>
    </button>`;
  }).join('');
}

// ── LANDING PAGE — Category grid + Featured companies ──────────────────────

const LP_CATS = [
  // Estrutura: reinforced concrete formwork under construction
  { key:'estrutura_fundacao', emoji:'🏗️', label:'Estrutura',    labelKey:'legendEstrutura',
    photo:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&auto=format&fit=crop&crop=center' },
  // Instalações: electrician wiring panel
  { key:'instalacoes',        emoji:'⚡',  label:'Instalações',  labelKey:'legendInstalacoes',
    photo:'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80&auto=format&fit=crop&crop=center' },
  // Acabamentos: painter with roller on a white wall
  { key:'acabamentos',        emoji:'🎨',  label:'Acabamentos',  labelKey:'legendAcabamentos',
    photo:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop&crop=center' },
  // Carpintaria: carpenter planing wood in workshop
  { key:'carpintaria',        emoji:'🪚',  label:'Carpintaria',  labelKey:'legendCarpintaria',
    photo:'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80&auto=format&fit=crop&crop=center' },
  // Serralharia: welding sparks / metal fabrication
  { key:'serralharia_metal',  emoji:'🔩',  label:'Serralharia',  labelKey:'legendSerralharia',
    photo:'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=80&auto=format&fit=crop&crop=center' },
  // Exterior: beautiful house pool with lush lawn and garden
  { key:'exterior_jardim',    emoji:'🌿',  label:'Exterior',     labelKey:'legendExterior',
    photo:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80&auto=format&fit=crop&crop=center' },
  // Projeto: architect working on blueprints
  { key:'projeto_gestao',     emoji:'📐',  label:'Projeto',      labelKey:'legendProjeto',
    photo:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80&auto=format&fit=crop&crop=center' },
  // Chave na Mão: modern house exterior — key handover moment
  { key:'chave_na_mao',       emoji:'🔑',  label:'Chave na Mão', labelKey:'legendChaveNaMao',
    photo:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80&auto=format&fit=crop&crop=center' },
];

function lpCatSearch(groupKey) {
  showTab('search');
  activeSectors.clear();
  _keywordFilter = '';
  const group = SECTOR_HIERARCHY[groupKey];
  if (group) {
    Object.values(group.categories).forEach(cat => {
      Object.keys(cat.subcategories).forEach(k => activeSectors.add(k));
    });
  }
  updateSectorActiveStates();
  renderSectorFilters();
  applyFilters.now();
}

function renderFeaturedCompanies() {
  const grid = document.getElementById('lpFeaturedGrid');
  if (!grid) return;
  if (companies.length === 0) {
    grid.innerHTML = `<p style="color:#9ca3af;text-align:center;padding:32px;grid-column:1/-1">${(translations[currentLang] || translations.pt).featuredEmpty || 'Nenhuma empresa em destaque ainda.'}</p>`;
    return;
  }
  const tr = translations[currentLang] || translations.pt;
  const sc = tr.sectors || {};
  const featured = [...companies]
    .sort((a, b) => (b.rating * Math.log10((b.reviews || 0) + 10)) - (a.rating * Math.log10((a.reviews || 0) + 10)))
    .slice(0, 3);
  grid.innerHTML = featured.map(c => {
    const filled = Math.round(c.rating);
    const stars  = '★'.repeat(filled) + '☆'.repeat(5 - filled);
    const tags   = (c.tags || []).slice(0, 3).map(t => `<span class="lp-cc-tag">${t}</span>`).join('');
    const sectorLabel = sc[c.sector] || c.sector || '';
    return `
      <div class="lp-company-card" style="--cc:${(typeof getSectorColor === 'function' ? getSectorColor(c) : (c.color || '#2563eb'))}" onclick="lpOpenCompany(${c.id})">
        <div class="lp-cc-header">
          <div class="lp-cc-emoji${c.logo ? '' : ' logo-mono'}"${c.logo ? ` style="background:url('${c.logo}') center/cover no-repeat"` : ''}>${c.logo ? '' : companyMonogram(c)}</div>
          <div class="lp-cc-info">
            <div class="lp-cc-name" title="${c.name}">${c.name}</div>
            <div class="lp-cc-sector">${sectorLabel}</div>
          </div>
          ${c.verified ? `<div class="lp-cc-badge-verified" title="${(tr.verifiedTooltip || 'Empresa cuja certidão permanente foi confirmada pela equipa Hivex.')}" tabindex="0" aria-label="${(tr.verifiedTooltip || 'Empresa cuja certidão permanente foi confirmada pela equipa Hivex.')}">${tr.featuredVerified || '✓ Verificado'}</div>` : ''}
        </div>
        <div class="lp-cc-rating">
          <span class="lp-cc-stars">${stars}</span>
          <span class="lp-cc-rating-num">${c.rating.toFixed(1)}</span>
          <span class="lp-cc-reviews">(${c.reviews || 0} ${tr.featuredReviews || 'avaliações'})</span>
        </div>
        ${tags ? `<div class="lp-cc-tags">${tags}</div>` : ''}
        <div class="lp-cc-address">${c.address || 'Portugal'}</div>
      </div>`;
  }).join('');
}

function renderTestimonialBanner() {
  const track = document.getElementById('lpTestimonialTrack');
  if (!track) return;

  // Simple "what customers say" cards: a 5-star rating, a short comment, and
  // who it's from + which company it's about (picked at random from the list).
  const _trp = (translations[currentLang] || translations.pt).testimonialPhrases;
  const phrases = (Array.isArray(_trp) && _trp.length) ? _trp : [
    'Excelente profissionalismo e qualidade de trabalho.',
    'Muito pontuais e trabalho impecável. Recomendo!',
    'Ótima relação qualidade-preço. Voltarei a contratar.',
    'Equipa muito competente e organizada.',
    'Superaram as expectativas. Trabalho de primeira.',
    'Profissionais sérios e de confiança.',
    'Serviço rápido e eficiente. Muito satisfeito.',
    'Atendimento excelente do início ao fim.',
    'Cumpriram os prazos e o orçamento. Recomendo!',
    'Trabalho cuidado e muita simpatia.'
  ];
  const authors = ['João M.', 'Ana R.', 'Pedro S.', 'Marta C.', 'Rui F.', 'Sofia L.', 'Tiago A.', 'Inês P.', 'Bruno G.', 'Carla D.'];

  // Companies to attribute the comments to (random). Falls back to a generic
  // label until the catalogue has loaded.
  const pool = (Array.isArray(companies) ? companies : []).filter(c => c && c.name);

  const N = 8;
  const cards = [];
  for (let i = 0; i < N; i++) {
    const phrase  = phrases[i % phrases.length];
    const author  = authors[i % authors.length];
    const company = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    const companyName = company ? company.name : 'Hivex';
    const initial = (author.trim()[0] || '?').toUpperCase();
    const open    = company ? `onclick="lpOpenCompany(${company.id})" style="cursor:pointer"` : '';
    cards.push(`
      <div class="lp-testimonial-card" ${open}>
        <div class="lp-tc-stars">★★★★★</div>
        <div class="lp-tc-quote">"${phrase}"</div>
        <div class="lp-tc-attrib">
          <span class="lp-tc-avatar">${initial}</span>
          <span class="lp-tc-meta">
            <span class="lp-tc-author">${author}</span>
            <span class="lp-tc-company">${companyName}</span>
          </span>
        </div>
      </div>`);
  }
  // Duplicate the set for the seamless infinite scroll.
  track.innerHTML = cards.join('') + cards.join('');
}

function lpOpenCompany(companyId) {
  const company = companies.find(c => c.id === companyId);
  if (!company) return;
  showTab('search');
  setTimeout(() => {
    if (typeof openDetail === 'function') openDetail(company.id);
  }, 400);
}

function updateLandingStats() {
  // Empresas registadas — real count
  const elCompanies = document.getElementById('lpStatCompanies');
  if (elCompanies) elCompanies.textContent = companies.length;

  // Painel lateral de Empresas Destacadas (25% à direita das categorias)
  try { renderLpFeatured(); } catch (_) {}

  // Early-access banner + hero category strip — both hidden while the
  // catalogue is still bootstrapping (≤10 companies). Tapping a category with
  // a near-empty result set is a dead-end UX; we lift the register CTA above
  // the fold instead. Once the catalogue grows past the threshold both come
  // back automatically.
  const smallCatalogue = companies.length <= 10;
  const banner = document.getElementById('lpEarlyAccessBanner');
  if (banner) banner.hidden = !smallCatalogue;
  const cats = document.getElementById('lpHeroCats');
  if (cats) cats.hidden = smallCatalogue;
  const catsLabel = document.querySelector('.lp-hero-cats-label');
  if (catsLabel) catsLabel.hidden = smallCatalogue;

  // Áreas de atividade — count the top-level groups in SECTOR_HIERARCHY
  const elAreas = document.getElementById('lpStatAreas');
  if (elAreas) {
    elAreas.textContent = Object.keys(SECTOR_HIERARCHY).length;
  }

  // Especialidades — total subcategories available in the platform
  const elSpec = document.getElementById('lpStatSpecialties');
  if (elSpec) {
    let totalSubs = 0;
    Object.values(SECTOR_HIERARCHY).forEach(g => {
      Object.values(g.categories).forEach(cat => {
        totalSubs += Object.keys(cat.subcategories).length;
      });
    });
    elSpec.textContent = totalSubs;
  }
}

// ── LANGUAGE SWITCHER ──────────────────────────────────────────────────────────
function toggleLangMenu() {
  const menu = document.getElementById('langMenu');
  const btn  = document.getElementById('langBtn');

  if (!menu.classList.contains('open')) {
    // Position the menu below the button
    const btnRect = btn.getBoundingClientRect();
    menu.style.top = (btnRect.bottom + 8) + 'px';
    menu.style.right = (window.innerWidth - btnRect.right) + 'px';
  }

  menu.classList.toggle('open');
  btn.classList.toggle('open');
}

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!document.getElementById('langSwitcher').contains(e.target)) {
    document.getElementById('langMenu').classList.remove('open');
    document.getElementById('langBtn').classList.remove('open');
  }
});

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  try { localStorage.setItem('hive_lang', lang); } catch(_) {}

  // Update button — flags are real images (Windows can't render emoji flags),
  // but fall back to the emoji glyph for any element still using a <span>.
  const flags = {pt:'🇵🇹', en:'🇬🇧', fr:'🇫🇷', es:'🇪🇸', de:'🇩🇪'};
  const codes  = {pt:'PT',  en:'EN',  fr:'FR',  es:'ES',  de:'DE'};
  const cc = {pt:'pt', en:'gb', fr:'fr', es:'es', de:'de'};
  const setFlag = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'IMG') el.src = 'https://flagcdn.com/' + cc[lang] + '.svg';
    else el.textContent = flags[lang];
  };
  setFlag('langFlag'); setFlag('mobileLangFlag'); setFlag('navLangFlag');
  const _langCodeEl = document.getElementById('langCode');
  if (_langCodeEl) _langCodeEl.textContent = codes[lang];
  const mobileCode = document.getElementById('mobileLangCode');
  if (mobileCode) mobileCode.textContent = codes[lang];
  const navLangCode = document.getElementById('navLangCode');
  if (navLangCode) navLangCode.textContent = codes[lang];

  // Highlight active option
  document.querySelectorAll('.lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });

  // Close menu
  document.getElementById('langMenu').classList.remove('open');
  document.getElementById('langBtn').classList.remove('open');

  // Apply all translations
  applyI18n();
}

// Cycle through PT → EN → FR → ES → ZH → PT for the mobile flag button
function cycleLang() {
  const order = ['pt', 'en', 'fr', 'es', 'de'];
  const next = order[(order.indexOf(currentLang) + 1) % order.length];
  setLanguage(next);
}

// ── i18n DOM cache ──────────────────────────────────────────────────────────
// querySelectorAll over a 700 KB DOM is one of the slowest things we do, and
// applyI18n() used to do it 4 times per call. Cache the four element lists
// once and refresh when dynamic content (sector filters, register tabs, etc.)
// is re-rendered. Refresh is O(elements-with-data-i18n*), still 4 selectors
// total but all of them on the same painted DOM and amortised across many
// language switches and tab changes.
const _i18nCache = { text: null, html: null, ph: null, val: null, title: null, aria: null, dirty: true };
function _i18nMarkDirty()  { _i18nCache.dirty = true; }
function _i18nRefreshLists() {
  _i18nCache.text  = document.querySelectorAll('[data-i18n]');
  _i18nCache.html  = document.querySelectorAll('[data-i18n-html]');
  _i18nCache.ph    = document.querySelectorAll('[data-i18n-ph]');
  _i18nCache.val   = document.querySelectorAll('[data-i18n-val]');
  _i18nCache.title = document.querySelectorAll('[data-i18n-title]');
  _i18nCache.aria  = document.querySelectorAll('[data-i18n-aria]');
  _i18nCache.dirty = false;
}

function applyI18n() {
  const tr = translations[currentLang];
  if (_i18nCache.dirty) _i18nRefreshLists();

  for (const el of _i18nCache.text) {
    const k = el.getAttribute('data-i18n');
    if (tr[k] !== undefined) el.textContent = tr[k];
  }
  for (const el of _i18nCache.html) {
    const k = el.getAttribute('data-i18n-html');
    if (tr[k] !== undefined) el.innerHTML = tr[k];
  }
  for (const el of _i18nCache.ph) {
    const k = el.getAttribute('data-i18n-ph');
    if (tr[k] !== undefined) el.placeholder = tr[k];
  }
  for (const el of _i18nCache.val) {
    const k = el.getAttribute('data-i18n-val');
    if (tr[k] !== undefined) el.value = tr[k];
  }
  for (const el of _i18nCache.title) {
    const k = el.getAttribute('data-i18n-title');
    if (tr[k] !== undefined) el.title = tr[k];
  }
  for (const el of _i18nCache.aria) {
    const k = el.getAttribute('data-i18n-aria');
    if (tr[k] !== undefined) el.setAttribute('aria-label', tr[k]);
  }

  // Unified search placeholder (one element, no querySelectorAll cost)
  const _uniEl = document.getElementById('searchUnified');
  if (_uniEl) _uniEl.placeholder = {
    pt: 'Cidade, empresa ou atividade...',
    en: 'City, company or activity...',
    fr: 'Ville, entreprise ou activité...',
    es: 'Ciudad, empresa o actividad...',
    de: 'Stadt, Firma oder Tätigkeit...'
  }[currentLang] || 'Cidade, empresa ou atividade...';

  // Chat input placeholder (lone element)
  const _chatIn = document.getElementById('chatInput');
  if (_chatIn) _chatIn.placeholder = tr.chatPlaceholder;

  // Re-render *only* the dynamic sections that hold their own translations.
  // Mark the cache dirty so the freshly-rendered nodes get translated next
  // time round.
  renderRegisterSectorSelect(); _i18nMarkDirty();
  renderRegisterZoneSelect();
  renderEmailTypeSelect();
  refreshSectorFilterLabels();
  renderTagCloud();
  document.title = 'Hivex – B2B Marketplace';
  applyFilters.now();

  // Skip home-page-only renders when the user isn't looking at the home tab.
  // showTab('home') will re-fire them on next nav, so this saves real work.
  if (isHomeTabActive()) {
    renderHeroCats();
    renderFeaturedCompanies();
    renderTestimonialBanner();
    updateLandingStats();
  }

  // Auth area (login button / avatar menu) is rendered via t() at build time,
  // so re-render it on language change to keep its labels in sync.
  try { updateNavAuth(); } catch (_) {}

  // Theme toggle label ("Escuro"/"Claro" etc.) is set in JS, so re-sync it
  // to the current language too.
  try { _syncThemeToggle(); } catch (_) {}

  // Re-fit the sector bar: a longer-language label set must shrink to keep the
  // bar one row (constant banner height). Deferred so the new labels lay out.
  try { setTimeout(fitSectorBar, 0); } catch (_) {}

  // Defer Lucide icon re-init to the next idle slot so it doesn't compete
  // with paint of the just-translated DOM.
  refreshLucide();
}

// ── SPECIALTY ILLUSTRATIONS ────────────────────────────────────────────────────
const SPECIALTY_SVG = {
  ruler: '<svg viewBox="0 0 80 80"><rect x="15" y="25" width="50" height="8" fill="#2563eb"/><line x1="20" y1="20" x2="20" y2="38" stroke="#2563eb" stroke-width="1.5"/><line x1="30" y1="20" x2="30" y2="38" stroke="#2563eb" stroke-width="1.5"/><line x1="40" y1="20" x2="40" y2="38" stroke="#2563eb" stroke-width="1.5"/><line x1="50" y1="20" x2="50" y2="38" stroke="#2563eb" stroke-width="1.5"/><line x1="60" y1="20" x2="60" y2="38" stroke="#2563eb" stroke-width="1.5"/><circle cx="40" cy="55" r="6" fill="none" stroke="#2563eb" stroke-width="2"/><line x1="35" y1="55" x2="45" y2="55" stroke="#2563eb" stroke-width="1.5"/><line x1="40" y1="50" x2="40" y2="60" stroke="#2563eb" stroke-width="1.5"/></svg>',
  hammer: '<svg viewBox="0 0 80 80"><rect x="50" y="20" width="18" height="18" fill="#2563eb" rx="2"/><rect x="56" y="38" width="6" height="28" fill="#8b4513" rx="1"/><path d="M 30 60 Q 35 50 40 55 Q 35 60 30 60" fill="#1d4ed8"/><circle cx="35" cy="58" r="2" fill="#2563eb"/></svg>',
  layers: '<svg viewBox="0 0 80 80"><polygon points="40,20 65,32 40,44 15,32" fill="#2563eb" opacity="0.8"/><polygon points="40,38 65,50 40,62 15,50" fill="#2563eb" opacity="0.6"/><polygon points="40,56 65,68 40,80 15,68" fill="#2563eb" opacity="0.4"/><line x1="40" y1="20" x2="40" y2="80" stroke="#2563eb" stroke-width="1" stroke-dasharray="2,2"/></svg>',
  zap: '<svg viewBox="0 0 80 80"><polygon points="40,15 55,40 45,40 55,70 25,40 35,40 25,15" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5" stroke-linejoin="round"/><circle cx="40" cy="42" r="3" fill="#ffeb3b"/></svg>',
  droplets: '<svg viewBox="0 0 80 80"><path d="M 40 15 Q 35 25 35 35 Q 35 48 40 55 Q 45 48 45 35 Q 45 25 40 15" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5"/><path d="M 25 50 Q 22 58 22 65 Q 22 73 28 76 Q 34 73 34 65 Q 34 58 25 50" fill="#60a5fa" opacity="0.7"/><path d="M 55 55 Q 52 62 52 68 Q 52 75 58 78 Q 64 75 64 68 Q 64 62 55 55" fill="#60a5fa" opacity="0.7"/></svg>',
  square: '<svg viewBox="0 0 80 80"><rect x="15" y="15" width="50" height="50" fill="none" stroke="#2563eb" stroke-width="3" rx="2"/><line x1="40" y1="15" x2="40" y2="65" stroke="#2563eb" stroke-width="2" opacity="0.4"/><line x1="15" y1="40" x2="65" y2="40" stroke="#2563eb" stroke-width="2" opacity="0.4"/><rect x="25" y="25" width="10" height="10" fill="#2563eb" opacity="0.3"/><rect x="45" y="45" width="10" height="10" fill="#2563eb" opacity="0.3"/></svg>',
  paintbrush: '<svg viewBox="0 0 80 80"><rect x="32" y="15" width="16" height="30" fill="#8b4513" rx="1"/><path d="M 28 45 L 52 45 Q 50 55 40 58 Q 30 55 28 45" fill="#2563eb"/><path d="M 38 48 L 42 48 L 41 56 L 39 56 Z" fill="#fbbf24" opacity="0.6"/><ellipse cx="40" cy="58" rx="8" ry="4" fill="#2563eb" opacity="0.4"/></svg>',
  scissors: '<svg viewBox="0 0 80 80"><circle cx="28" cy="30" r="6" fill="none" stroke="#2563eb" stroke-width="2"/><circle cx="28" cy="50" r="6" fill="none" stroke="#2563eb" stroke-width="2"/><circle cx="52" cy="40" r="6" fill="none" stroke="#2563eb" stroke-width="2"/><line x1="34" y1="30" x2="46" y2="40" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/><line x1="34" y1="50" x2="46" y2="40" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/><path d="M 52 34 L 58 28 Q 60 30 58 36" fill="#2563eb" opacity="0.3"/></svg>',
  home: '<svg viewBox="0 0 80 80"><polygon points="40,18 20,35 25,35 25,60 55,60 55,35 60,35" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5" stroke-linejoin="round"/><rect x="35" y="40" width="10" height="12" fill="#ffb6c1" opacity="0.5"/><line x1="25" y1="55" x2="55" y2="55" stroke="#8b4513" stroke-width="2"/></svg>',
  wind: '<svg viewBox="0 0 80 80"><g stroke="#2563eb" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M 15 30 Q 30 25 45 30"/><path d="M 20 45 Q 35 40 55 45"/><path d="M 10 60 Q 28 55 50 60"/><circle cx="40" cy="45" r="18" fill="none" stroke="#2563eb" stroke-width="2" opacity="0.3"/><g transform="translate(40,45)"><line x1="0" y1="-12" x2="0" y2="12"/><line x1="-12" y1="0" x2="12" y2="0"/><line x1="-8" y1="-8" x2="8" y2="8"/><line x1="-8" y1="8" x2="8" y2="-8"/></g></g></svg>'
};

// ── SECTOR PIN COLORS ────────────────────────────────────────────────────────
const SECTOR_COLORS = {
  'estrutura_fundacao':  '#e74c3c',   // red
  'instalacoes':         '#f1c40f',   // yellow
  'acabamentos':         '#9b59b6',   // purple
  'carpintaria':         '#8B4513',   // brown
  'serralharia_metal':   '#607d8b',   // blue-grey
  'exterior_jardim':     '#2ecc71',   // green
  'projeto_gestao':      '#3498db',   // blue
  'chave_na_mao':        '#f97316',   // orange
};

// ── DATA ───────────────────────────────────────────────────────────────────────
const companies = [];

// ── DEMO COMPANIES (dev only) ────────────────────────────────────────────────
// The ~100 demo records live in demo-companies.js and are loaded lazily, only on
// localhost, only when the API has no data (see loadCompaniesFromDB's catch).
// Production never requests the file, so real users don't download it.
let _demoLoadPromise = null;
function loadDemoCompanies() {
  if (Array.isArray(window.DEMO_COMPANIES)) return Promise.resolve(window.DEMO_COMPANIES);
  if (_demoLoadPromise) return _demoLoadPromise;
  _demoLoadPromise = new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'demo-companies.js';
    s.onload = () => resolve(window.DEMO_COMPANIES || []);
    s.onerror = () => resolve([]);
    document.head.appendChild(s);
  });
  return _demoLoadPromise;
}


// ── STORAGE ──────────────────────────────────────────────────────────────────

// Convert a DB row to the internal company object format. The Postgres `pg`
// client returns BIGINT as a string, but inline onclick="fn(${c.id})" template
// literals inject the number form — so any `companies.find(x => x.id === id)`
// comparison would fail with "1" === 1. Coerce here at the boundary so every
// downstream comparison is between numbers and works.
function dbRowToCompany(row) {
  return {
    id:        Number(row.id),
    name:      row.name,
    nif:       row.nif       || '',
    cae:       row.cae       || '',
    alvara:    row.alvara    || '',
    certidao_permanente: row.certidao_permanente || '',
    sector:    row.sector    || (row.sectors || [])[0] || '',
    sectors:   row.sectors   || [],
    rating:    parseFloat(row.rating) || 0,
    reviews:   row.reviews   || 0,
    topRated:  row.top_rated || false,
    verified:  row.verified  || false,
    featured:  row.featured  || false,
    isNew:     row.is_new    !== undefined ? row.is_new : true,
    tags:      row.tags      || [],
    email:     row.email     || '',
    phone:     row.phone     || '',
    website:   row.website   || '',
    facebook:  row.facebook  || '',
    instagram: row.instagram || '',
    linkedin:  row.linkedin  || '',
    logo:      row.logo      || '',
    description: row.description || '',
    founded_year:     row.founded_year     || null,
    business_hours:   row.business_hours   || '',
    portfolio_images: row.portfolio_images || [],
    emoji:     row.emoji     || '🏢',
    color:     row.color     || '#2563eb',
    pinType:   row.pin_type  || 'std',
    lat:       row.lat,
    lng:       row.lng,
    address:   row.address   || '',
    city:      row.city      || '',
    country:   row.country   || 'pt',
    // Same coercion as id above so isOwner checks (created_by === user.id) match.
    created_by: row.created_by != null ? Number(row.created_by) : null,
  };
}

// Returns the highest numeric id + 1; falls back to current if no numeric ids
// (e.g. server returns UUIDs). Avoids -Infinity / NaN from Math.max on empty/non-numeric.
function computeNextCompanyId(list, current) {
  const nums = list.map(c => Number(c.id)).filter(n => Number.isFinite(n));
  return nums.length ? Math.max(...nums) + 1 : (current || 1);
}

// Collapse duplicate company records into one entry so each real business
// gets exactly one pin, no matter how many times it was registered/seeded or
// how many activities it lists. Two records are "the same company" when they
// share a NIF, or (lacking that) the same name at the same coordinates.
// Merged records keep the union of their sectors + tags, and backfill any
// empty field (credentials, contacts, description) from their duplicates.
function dedupeCompanies(list) {
  const _norm = s => String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const identity = c => {
    const nif = String(c.nif || '').replace(/\s+/g, '');
    if (nif) return 'nif:' + nif;
    // ~1m precision — same name pinned at the same spot is the same business
    return 'loc:' + _norm(c.name) + '|' + Number(c.lat).toFixed(5) + '|' + Number(c.lng).toFixed(5);
  };
  const _union = (a, b) => Array.from(new Set([...(a || []), ...(b || [])]));
  const byKey = new Map();
  for (const c of list) {
    const key = identity(c);
    const kept = byKey.get(key);
    if (!kept) { byKey.set(key, c); continue; }
    // Merge this duplicate into the record we're keeping.
    kept.sectors = _union(kept.sectors, c.sectors);
    kept.tags    = _union(kept.tags, c.tags);
    if (!kept.sector && c.sector) kept.sector = c.sector;
    for (const f of ['alvara', 'certidao_permanente', 'cae', 'nif', 'email',
                     'phone', 'website', 'description', 'address', 'city',
                     'business_hours', 'founded_year']) {
      if (!kept[f] && c[f]) kept[f] = c[f];
    }
    if ((c.portfolio_images || []).length && !(kept.portfolio_images || []).length) {
      kept.portfolio_images = c.portfolio_images;
    }
    // Prefer the strongest trust signals across the duplicates.
    kept.rating   = Math.max(kept.rating || 0, c.rating || 0);
    kept.reviews  = Math.max(kept.reviews || 0, c.reviews || 0);
    kept.featured = kept.featured || c.featured;
    kept.verified = kept.verified || c.verified;
    kept.topRated = kept.topRated || c.topRated;
  }
  return Array.from(byKey.values());
}

// ── FAVOURITES (saved companies) ───────────────────────────────────────────
// Two-tier persistence:
//   • Logged-in users: stored in user_favourites table on the server, fetched
//     on session start, every toggle calls the API. Same set is reachable
//     from any device.
//   • Logged-out users: localStorage only (anonymous). When the user later
//     logs in we lift the localStorage set to the server with bulkAdd, so the
//     companies they saved while browsing logged-out aren't lost.
const _FAV_KEY = 'hive_favourite_ids';
let _favIds = new Set();
try {
  const raw = localStorage.getItem(_FAV_KEY);
  if (raw) JSON.parse(raw).forEach(id => _favIds.add(Number(id)));
} catch (_) {}

function _isLoggedIn() {
  try { return !!JSON.parse(localStorage.getItem('hive_user') || 'null'); }
  catch (_) { return false; }
}
function _saveFavs() {
  try { localStorage.setItem(_FAV_KEY, JSON.stringify([..._favIds])); } catch (_) {}
}

// Pull the user's server-side favourites and reconcile with anything saved
// locally. Called once after login (and on page load if a session is already
// active). Safe to call repeatedly.
async function syncFavouritesFromServer() {
  if (!_isLoggedIn()) return;
  try {
    // If there are local-only favourites, push them up first so we don't
    // lose them after the GET overwrites _favIds.
    const local = [..._favIds];
    if (local.length > 0) {
      try { await api.bulkAddFavourites(local); } catch (_) {}
    }
    const remote = await api.getFavourites();
    _favIds = new Set((remote || []).map(Number));
    _saveFavs();
    // Refresh any visible UI
    document.querySelectorAll('.slc-fav').forEach(btn => {
      const card = btn.closest('.search-list-card');
      const id = card && Number(card.dataset.companyId);
      if (!id) return;
      const fav = _favIds.has(id);
      btn.classList.toggle('is-fav', fav);
      btn.textContent = fav ? '★' : '☆';
    });
    _updateFavBadge();
  } catch (e) {
    // 401 = session expired; silently fall back to local state
    if (e && e.status !== 401) console.warn('favourites sync failed:', e.message);
  }
}
window.syncFavouritesFromServer = syncFavouritesFromServer;

function toggleFavourite(id) {
  id = Number(id);
  const wasFav = _favIds.has(id);
  if (wasFav) {
    _favIds.delete(id);
    showToast(t('toastFavRemoved'));
  } else {
    _favIds.add(id);
    showToast(t('toastFavAdded'));
  }
  _saveFavs();
  // Fire the server call in the background when logged in. Failure rolls
  // back the local change so the UI reflects reality.
  if (_isLoggedIn()) {
    const call = wasFav ? api.removeFavourite(id) : api.addFavourite(id);
    call.catch(e => {
      if (wasFav) _favIds.add(id); else _favIds.delete(id);
      _saveFavs();
      _updateFavBadge();
      showToast(e.message || 'Erro ao guardar favorito');
    });
  }
  // Sync any visible cards with the new state
  document.querySelectorAll('.search-list-card').forEach(card => {
    if (Number(card.dataset.companyId) !== id) return;
    const btn = card.querySelector('.slc-fav');
    if (!btn) return;
    const fav = _favIds.has(id);
    btn.classList.toggle('is-fav', fav);
    btn.textContent = fav ? '★' : '☆';
  });
  // Sync the detail panel star if the same company is currently open
  if (typeof selectedId !== 'undefined' && Number(selectedId) === id) {
    try { _refreshDpFavBtn(); } catch (_) {}
  }
  _updateFavBadge();
}
function _updateFavBadge() {
  const badge = document.getElementById('avMenuFavCount');
  if (!badge) return;
  if (_favIds.size > 0) { badge.textContent = _favIds.size; badge.hidden = false; }
  else { badge.hidden = true; }
}

function openMyFavourites() {
  const ov = document.getElementById('favOverlay');
  if (!ov) return;
  const body = document.getElementById('favBody');
  if (!body) return;
  const ids = [..._favIds];
  if (ids.length === 0) {
    body.innerHTML = '<div style="text-align:center;color:var(--muted);padding:32px 12px;font-size:13px">Nenhuma empresa guardada ainda.<br><span style="font-size:12px">Toque na ☆ de uma empresa na pesquisa para a guardar aqui.</span></div>';
  } else {
    const items = ids.map(id => companies.find(c => Number(c.id) === id)).filter(Boolean);
    body.innerHTML = items.map(c => `
      <div class="mini-list-item" onclick="closeMyFavourites();openDetail(${c.id})">
        <div class="mini-list-emoji logo-mono">${companyMonogram(c)}</div>
        <div class="mini-list-text">
          <div class="mini-list-name">${escHtml(c.name)}</div>
          <div class="mini-list-sub">${c.rating ? '★ ' + c.rating.toFixed(1) + ' · ' : ''}${escHtml(c.city || c.address || '—')}</div>
        </div>
        <button class="mini-list-action" onclick="event.stopPropagation();toggleFavourite(${c.id});openMyFavourites()" title="Remover">×</button>
      </div>`).join('');
  }
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMyFavourites() {
  const ov = document.getElementById('favOverlay');
  if (ov) ov.classList.remove('open');
  document.body.style.overflow = '';
}
window.toggleFavourite   = toggleFavourite;
window.openMyFavourites  = openMyFavourites;
window.closeMyFavourites = closeMyFavourites;
// Initialise the badge when the page first paints
setTimeout(() => { try { _updateFavBadge(); } catch (_) {} }, 300);

// ── RECENTLY VIEWED ────────────────────────────────────────────────────────
// Tracks the last 6 companies the user opened in the detail panel. Stored in
// localStorage as an array of ids. Rendered as a chip strip above the map.
const _RECENT_KEY = 'hive_recently_viewed';
const _RECENT_MAX = 6;
function _getRecentIds() {
  try { return JSON.parse(localStorage.getItem(_RECENT_KEY) || '[]').map(Number); }
  catch (_) { return []; }
}
function _pushRecent(id) {
  id = Number(id);
  let arr = _getRecentIds().filter(x => x !== id);
  arr.unshift(id);
  arr = arr.slice(0, _RECENT_MAX);
  try { localStorage.setItem(_RECENT_KEY, JSON.stringify(arr)); } catch (_) {}
  _renderRecentStrip();
}
function _renderRecentStrip() {
  const strip = document.getElementById('recentStrip');
  if (!strip) return;
  const ids = _getRecentIds();
  // Resolve to companies the user can actually click. If `companies` isn't
  // populated yet (script loads top-down), defer.
  if (typeof companies === 'undefined' || !companies.length) { strip.innerHTML = ''; strip.hidden = true; return; }
  const items = ids.map(id => companies.find(c => Number(c.id) === id)).filter(Boolean);
  if (items.length === 0) { strip.innerHTML = ''; strip.hidden = true; return; }
  strip.hidden = false;
  const labelTxt  = (typeof t === 'function') ? t('recentlyViewed') : 'Vistas recentemente';
  const removeTxt = (typeof t === 'function') ? t('recentRemove')   : 'Remover';
  const clearTxt  = (typeof t === 'function') ? t('recentClear')    : 'Limpar';
  strip.innerHTML =
    '<span class="recent-strip-label">' + labelTxt + '</span>' +
    items.map(c => `
      <span class="recent-chip" title="${escHtml(c.name)}">
        <span style="display:inline-flex;align-items:center;gap:6px;cursor:pointer" onclick="openDetail(${c.id})">
          <span class="recent-chip-emoji logo-mono">${companyMonogram(c)}</span>
          <span class="recent-chip-name">${escHtml(c.name)}</span>
        </span>
        <button type="button" class="recent-chip-x" aria-label="${removeTxt}" title="${removeTxt}" onclick="event.stopPropagation();_removeRecent(${c.id})">×</button>
      </span>`).join('') +
    `<button type="button" class="recent-clear-btn" onclick="_clearRecent()" title="${clearTxt}">🗑️ ${clearTxt}</button>`;
}
function _removeRecent(id) {
  id = Number(id);
  const arr = _getRecentIds().filter(x => x !== id);
  try { localStorage.setItem(_RECENT_KEY, JSON.stringify(arr)); } catch (_) {}
  _renderRecentStrip();
}
function _clearRecent() {
  try { localStorage.removeItem(_RECENT_KEY); } catch (_) {}
  _renderRecentStrip();
}
window._renderRecentStrip = _renderRecentStrip;
window._removeRecent     = _removeRecent;
window._clearRecent      = _clearRecent;

// ── openDetail / closeDetail hook registry ─────────────────────────────────
// Anything that should fire when a company detail panel opens/closes registers
// itself here instead of wrapping the function. Replaces 4 layered overrides
// of openDetail (recently-viewed, title, analytics, reviews) and 1 of
// closeDetail (title) — easier to reason about, easier to add new hooks.
const _openDetailHooks  = [];
const _closeDetailHooks = [];
function _addOpenDetailHook(fn)  { if (typeof fn === 'function') _openDetailHooks.push(fn); }
function _addCloseDetailHook(fn) { if (typeof fn === 'function') _closeDetailHooks.push(fn); }
const _baseOpenDetail  = openDetail;
const _baseCloseDetail = closeDetail;
openDetail = function(id) {
  _baseOpenDetail(id);
  for (const hook of _openDetailHooks) {
    try { hook(id); } catch (err) { console.error('openDetail hook failed:', err); }
  }
};
closeDetail = function() {
  _baseCloseDetail();
  for (const hook of _closeDetailHooks) {
    try { hook(); } catch (err) { console.error('closeDetail hook failed:', err); }
  }
};

// Hook 1: track recently-viewed companies in the homepage strip
_addOpenDetailHook((id) => { _pushRecent(id); });

// ── COMPARE COMPANIES (up to 3) ────────────────────────────────────────────
// _compareIds is a Set of company ids the user has ticked for comparison.
// Persisted in sessionStorage so navigating between tabs keeps the selection.
const _COMPARE_MAX = 3;
const _COMPARE_KEY = 'hive_compare_ids';
let _compareIds = new Set();
try {
  const raw = sessionStorage.getItem(_COMPARE_KEY);
  if (raw) JSON.parse(raw).forEach(id => _compareIds.add(Number(id)));
} catch (_) {}

function _saveCompare() {
  try { sessionStorage.setItem(_COMPARE_KEY, JSON.stringify([..._compareIds])); } catch (_) {}
}

function toggleCompare(id) {
  id = Number(id);
  if (_compareIds.has(id)) {
    _compareIds.delete(id);
  } else {
    if (_compareIds.size >= _COMPARE_MAX) {
      showToast(t('compareMaxPrefix') + ' ' + _COMPARE_MAX + ' ' + t('compareMaxSuffix'));
      // Re-sync the checkbox visually
      _renderCompareBar();
      _syncCompareCheckboxes();
      return;
    }
    _compareIds.add(id);
  }
  _saveCompare();
  _renderCompareBar();
  _syncCompareCheckboxes();
}

function clearCompare() {
  _compareIds.clear();
  _saveCompare();
  _renderCompareBar();
  _syncCompareCheckboxes();
}

function _syncCompareCheckboxes() {
  document.querySelectorAll('.search-list-card').forEach(card => {
    const id = Number(card.dataset.companyId);
    const cb = card.querySelector('.slc-compare input[type="checkbox"]');
    if (cb) cb.checked = _compareIds.has(id);
  });
  // Nearby-panel cards carry the same toggle
  document.querySelectorAll('.nearby-card').forEach(card => {
    const id = Number(card.dataset.companyId);
    const cb = card.querySelector('.nc-compare input[type="checkbox"]');
    if (cb) cb.checked = _compareIds.has(id);
  });
}

function _renderCompareBar() {
  const bar = document.getElementById('compareBar');
  if (!bar) return;
  if (_compareIds.size === 0) { bar.hidden = true; return; }
  bar.hidden = false;
  document.getElementById('compareBarLabel').textContent =
    _compareIds.size + ' ' + t('compareOfThree');
  const chips = document.getElementById('compareBarChips');
  chips.innerHTML = '';
  _compareIds.forEach(id => {
    const c = companies.find(x => Number(x.id) === id);
    if (!c) return;
    const chip = document.createElement('span');
    chip.className = 'compare-bar-chip';
    chip.innerHTML = `<span title="${escHtml(c.name)}">${escHtml(c.name)}</span><button onclick="toggleCompare(${id})" aria-label="Remover">×</button>`;
    chips.appendChild(chip);
  });
  const goBtn = document.getElementById('compareBarGo');
  if (goBtn) goBtn.disabled = _compareIds.size < 2;
}

function openCompareModal() {
  if (_compareIds.size < 2) {
    showToast(t('toastSelectMin2'));
    return;
  }
  const ids = [..._compareIds];
  const cos = ids.map(id => companies.find(x => Number(x.id) === id)).filter(Boolean);
  const tr = translations[currentLang] || translations.pt;
  const loggedIn = !!JSON.parse(localStorage.getItem('hive_user') || 'null');

  // Distance to the user's location (or searched location / map centre) —
  // same reference the "Empresas Próximas" panel uses.
  const [refLat, refLng] = _nearbyRefPoint();
  const dist = new Map(cos.map(c => [c.id, calculateDistance(refLat, refLng, c.lat, c.lng)]));
  const fmtKm = d => d < 10 ? d.toFixed(1).replace('.', ',') + ' km' : Math.round(d) + ' km';

  // Winners per metric — the automatic part of the comparison: the best value
  // in each row gets a green "Melhor" highlight so the table reads itself.
  const bestScore   = Math.max(...cos.map(c => c.rating || 0));
  const bestReviews = Math.max(...cos.map(c => c.reviews || 0));
  const bestDist    = Math.min(...cos.map(c => dist.get(c.id)));
  const docCount    = c => (c.alvara ? 1 : 0) + (c.certidao_permanente ? 1 : 0);
  const bestDocs    = Math.max(...cos.map(docCount));

  // Credentials/contacts are redacted server-side for anonymous visitors.
  const lockedCell = '<span style="color:var(--muted)">🔒 requer sessão</span>';

  // Build a side-by-side table. First column is the field labels.
  const fields = [
    { key:'header',   label:'',                renderer: c => `<div class="compare-co-header">${c.logo ? `<span class="compare-co-logo" style="background-image:url('${c.logo}')"></span>` : `<span class="compare-co-emoji logo-mono">${companyMonogram(c)}</span>`}${escHtml(c.name)}</div>` },
    { key:'score',    label:'Pontuação média', best: c => (c.rating||0) > 0 && c.rating === bestScore,
      renderer: c => c.rating ? `<span class="compare-co-rating">★ ${c.rating.toFixed(1)}</span>` : `<span class="badge-new">${t('newOnHivex')}</span>` },
    { key:'reviews',  label:'N.º de avaliações', best: c => (c.reviews||0) > 0 && (c.reviews||0) === bestReviews,
      renderer: c => (c.reviews||0) > 0 ? `<strong>${c.reviews}</strong>` : '<span style="color:var(--muted)">0</span>' },
    { key:'distance', label:'Distância',       best: c => dist.get(c.id) === bestDist,
      renderer: c => fmtKm(dist.get(c.id)) },
    { key:'city',     label:'Localização',     renderer: c => escHtml(c.city || c.address || '—') },
    { key:'docs',     label:'Documentação',    best: c => loggedIn && docCount(c) > 0 && docCount(c) === bestDocs,
      renderer: c => {
        if (!loggedIn) return lockedCell;
        const badges = [];
        if (c.alvara) badges.push('<span class="compare-doc-badge">⚒ Alvará</span>');
        if (c.certidao_permanente) badges.push('<span class="compare-doc-badge ok">✓ Certidão Permanente</span>');
        return badges.join(' ') || '<span style="color:var(--muted)">—</span>';
      } },
    { key:'verified', label:'Verificada',      renderer: c => c.verified ? '<span style="color:#16a34a;font-weight:700">✓ Sim</span>' : '<span style="color:var(--muted)">—</span>' },
    { key:'sector',   label:'Setor principal', renderer: c => escHtml((tr.sectors && tr.sectors[c.sector]) || c.sector || '—') },
    { key:'sectors',  label:'Áreas',           renderer: c => (c.sectors||[]).map(s => `<span class="tag" style="margin-right:4px">${escHtml((tr.sectors&&tr.sectors[s])||s)}</span>`).join('') || '—' },
    { key:'phone',    label:'Telefone',        renderer: c => c.phone ? `<a href="tel:${escHtml(c.phone)}">${escHtml(c.phone)}</a>` : (loggedIn ? '<span style="color:var(--muted)">—</span>' : lockedCell) },
    { key:'email',    label:'Email',           renderer: c => c.email ? `<a href="mailto:${escHtml(c.email)}">${escHtml(c.email)}</a>` : (loggedIn ? '<span style="color:var(--muted)">—</span>' : lockedCell) },
    { key:'website',  label:'Website',         renderer: c => c.website ? `<a href="${escHtml(c.website)}" target="_blank" rel="noopener">${escHtml(c.website)}</a>` : '<span style="color:var(--muted)">—</span>' },
    { key:'tags',     label:'Especialidades',  renderer: c => (c.tags||[]).slice(0, 6).map(tag => `<span class="tag" style="margin-right:4px">${escHtml(tag)}</span>`).join('') || '—' },
    { key:'action',   label:'',                renderer: c => `<button class="btn-submit" style="font-size:22px;padding:15px 34px" onclick="closeCompareModal();setTimeout(()=>openDetail(${c.id}),200)">Ver perfil</button>` },
  ];

  let html = '<table class="compare-table"><tbody>';
  fields.forEach(f => {
    html += '<tr>';
    html += `<th>${f.label}</th>`;
    cos.forEach(c => {
      const isBest = !!(f.best && f.best(c));
      html += `<td${isBest ? ' class="compare-best"' : ''}>${f.renderer(c)}${isBest ? ' <span class="compare-best-chip">Melhor</span>' : ''}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';

  document.getElementById('compareBody').innerHTML = html;
  const ov = document.getElementById('compareOverlay');
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCompareModal() {
  const ov = document.getElementById('compareOverlay');
  if (ov) ov.classList.remove('open');
  document.body.style.overflow = '';
}

window.toggleCompare      = toggleCompare;
window.clearCompare       = clearCompare;
window.openCompareModal   = openCompareModal;
window.closeCompareModal  = closeCompareModal;

// Show the bar on first paint if there's a saved selection
setTimeout(() => { try { _renderCompareBar(); } catch (_) {} }, 200);

// Load companies from backend API; renders markers when done.
// Two-phase load: the first call is scoped to the user's country (much smaller
// payload → pins appear sooner as the catalogue grows), then the full
// catalogue is fetched once in the background and re-ingested. Pass
// {full:true} to skip the scoping (used by the background phase and retry).
let _fullCatalogueLoaded = false;
async function loadCompaniesFromDB(opts) {
  const scoped = !(opts && opts.full) && !_fullCatalogueLoaded;
  let loadErrMsg = null; // set on failure; injected into the map hint AFTER the render pipeline (which overwrites the hint)
  try {
    // The catalogue is Portugal-only. Scoping this fetch by the VISITOR's
    // country (_userCountry from geolocation) made every company vanish for
    // anyone browsing from abroad or on a VPN — ?country=ch returns []. Same
    // failure class as the "Todo o país" filter bug; always fetch 'pt'.
    const data = await api.getCompanies(scoped ? { country: 'pt' } : undefined);
    if (!scoped) _fullCatalogueLoaded = true;
    // Clear only now that fresh data is in hand — clearing before the await
    // would let a failed background refresh wipe what's already on screen.
    companies.length = 0;
    if (data && data.length > 0) {
      // Sort featured companies to top client-side (avoids full-table-scan ORDER BY in DB)
      data.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      data.forEach(row => companies.push(dbRowToCompany(row)));
      nextCompanyId = computeNextCompanyId(companies, nextCompanyId);
    }
  } catch(e) {
    // A failed refresh must NEVER disturb a working page: whatever set is
    // already on screen (scoped boot or full catalogue) stays, and we simply
    // try again later. Only a failure with nothing loaded shows the error UI.
    if (companies.length > 0) return;
    companies.length = 0;
    // Distinguish between actual network failure (no connection) and a server
    // error response — the latter is much more actionable to debug.
    const msg = (e.status === 0 || e.status === undefined)
      ? 'Sem ligação ao servidor. Tente novamente em instantes.'
      : `Não foi possível carregar as empresas (erro ${e.status}). Tente novamente.`;
    showToast(msg);
    loadErrMsg = msg;
    if (e.status && e.status >= 500) console.error('Companies API error:', e.message, e.body || '');
    // IMPORTANT: never inject DEMO_COMPANIES on the live site. A transient API
    // error would otherwise flood the map with ~100 fake "random" companies the
    // admin never created. Demo data is for local development only.
    const isLocalDev = /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);
    if (isLocalDev) {
      const demoData = await loadDemoCompanies();
      demoData.forEach(d => {
        companies.push({
          id: d.id, name: d.name, cae: d.cae || '', sector: d.sector,
          sectors: d.sectors || [d.sector], rating: d.rating || 0,
          reviews: d.reviews || 0, topRated: d.topRated || false,
          verified: d.verified || false, isNew: d.isNew !== undefined ? d.isNew : true,
          tags: d.tags || [], email: d.email || '', phone: d.phone || '',
          website: d.website || '', description: d.description || '',
          emoji: d.emoji || '🏢', color: d.color || '#2563eb',
          pinType: d.pinType || 'std', lat: d.lat, lng: d.lng,
          address: d.address || '', city: d.city || '', country: d.country || 'pt',
        });
      });
      if (companies.length > 0) nextCompanyId = computeNextCompanyId(companies, nextCompanyId);
    }
  }
  // Drop any markers from a previous load so re-loads start clean. We do this
  // here (after the await) instead of at the top of the function, because the
  // first call to loadCompaniesFromDB() runs synchronously past this point
  // before the rest of the script defines _visibleMarkerIds (TDZ).
  if (typeof markerClusterGroup !== 'undefined' && markerClusterGroup) {
    try { markerClusterGroup.clearLayers(); } catch(_) {}
  }
  for (const id in markerMap) delete markerMap[id];
  if (typeof _visibleMarkerIds !== 'undefined') _visibleMarkerIds = new Set();

  // Collapse duplicate records so each business is a single pin. Mutate the
  // shared `companies` array in place (it's a const used elsewhere by reference).
  const _deduped = dedupeCompanies(companies);
  if (_deduped.length !== companies.length) {
    companies.length = 0;
    _deduped.forEach(c => companies.push(c));
  }

  // Render
  // Pre-compute a lowercase search index per company so fuzzySearch
  // never re-builds the haystack string during filtering
  companies.forEach(c => {
    c._searchIndex = [c.name, c.cae, ...(c.tags || [])].join(' ').toLowerCase();
    addCompanyMarker(c);
  });
  renderSectorFilters();
  renderTagCloud();
  applyFilters.now();
  renderFeaturedCompanies();
  renderTestimonialBanner();
  // Cache das destacadas: o painel do Início enche instantaneamente no
  // próximo arranque (antes da API responder) — ver renderLpFeatured()
  try {
    const _feat = companies.filter(c => c.featured);
    if (_feat.length) localStorage.setItem('hivex_featured_cache', JSON.stringify(_feat.slice(0, 20)));
  } catch (_) {}
  updateLandingStats();
  if (typeof _renderRecentStrip === 'function') _renderRecentStrip();

  // Dead-end fix: on failure give the user a retry button right on the map
  // instead of requiring a full page reload. Injected here (after the render
  // pipeline) because applyFilters.now() above rewrites the hint contents.
  if (loadErrMsg && companies.length === 0) {
    try {
      const hint = document.getElementById('mapEmptyHint');
      const hintText = document.getElementById('mapEmptyHintText');
      if (hint && hintText) {
        hint.classList.remove('hidden');
        hintText.innerHTML = '<strong>' + escHtml(loadErrMsg) + '</strong>' +
          '<div style="margin-top:14px"><button onclick="retryLoadCompanies(this)" class="lp-see-all-cta" style="padding:13px 22px;font-size:16px">🔄 ' + escHtml(t('retryBtn') || 'Tentar novamente') + '</button></div>';
      }
    } catch (_) {}
  }

  // Background phase: pull the rest of the catalogue (other countries) once,
  // shortly after first paint. Re-runs this same function un-scoped — the
  // ingest pipeline is idempotent, so the merge is just a full re-ingest.
  if (scoped && !loadErrMsg) {
    setTimeout(() => { loadCompaniesFromDB({ full: true }).catch(() => {}); }, 2500);
  }
}

// Retry handler for the "couldn't load companies" dead end (button lives in
// the map empty-hint). Retries un-scoped so it can't fail into a smaller set.
async function retryLoadCompanies(btn) {
  if (btn) { btn.disabled = true; btn.textContent = '…'; }
  try { await loadCompaniesFromDB({ full: true }); } finally { if (btn) btn.disabled = false; }
}
window.retryLoadCompanies = retryLoadCompanies;

// Save a new company to the backend API; returns the persisted record (with DB id)
async function saveCompanyToDB(company) {
  // Let errors propagate — the caller (processRegistration) handles them
  const saved = await api.createCompany({
    name:        company.name,
    sectors:     company.sectors,
    sector:      company.sector,
    nif:                 company.nif                 || null,
    cae:                 company.cae                 || null,
    alvara:              company.alvara              || null,
    certidao_permanente: company.certidao_permanente || null,
    address:     company.address     || null,
    postal_code: company.postalCode  || null,
    city:        company.city        || null,
    country:     company.country     || 'pt',
    zone:        company.zone        || null,
    email:       company.email,
    phone:       company.phone,
    website:     company.website     || null,
    facebook:    company.facebook    || null,
    instagram:   company.instagram   || null,
    linkedin:    company.linkedin    || null,
    logo:        company.logo        || null,
    tags:        company.tags        || [],
    description: company.description || null,
    founded_year:     company.founded_year     || null,
    business_hours:   company.business_hours   || null,
    portfolio_images: company.portfolio_images || [],
    lat:         company.lat,
    lng:         company.lng,
    emoji:       company.emoji,
    color:       company.color,
    pin_type:    company.pinType     || 'std',
    // One-time code proving control of the company's contact email (only
    // required by the server when it differs from the account email).
    email_code:  window._companyEmailCode || null,
  });
  window._companyEmailCode = null;   // single-use — burned server-side too
  return dbRowToCompany(saved);
}

// ── ADMIN MODE ──────────────────────────────────────────────────────────────
// Admin status is server-authoritative — derived from JWT user claim
let isAdminMode = (function() {
  try {
    const u = JSON.parse(localStorage.getItem('hive_user') || 'null');
    return u && u.is_admin === true;
  } catch { return false; }
})();

function updateAdminUI() {
  const editBtn = document.getElementById('dpEditBtn');
  if (!editBtn || !selectedId) return;
  // Show the edit button when the viewer is an admin OR the owner of this listing.
  const me = JSON.parse(localStorage.getItem('hive_user') || 'null');
  const c  = companies.find(x => x.id === selectedId);
  // me.id arrives from sessionStorage as a string (BIGINT-safe round-trip);
  // c.created_by is a number after dbRowToCompany. Coerce both sides.
  const myId = me ? Number(me.id) : null;
  const isOwner = !!(me && c && c.created_by != null && c.created_by === myId);
  editBtn.style.display = (isAdminMode || isOwner) ? 'flex' : 'none';
}

function openEditCompany() {
  if (!selectedId) return;
  // Capture the id BEFORE closeDetail() — that function nulls selectedId, so
  // passing `selectedId` after close means profileEditCompany(null) → no-op.
  const id = selectedId;
  const me = JSON.parse(localStorage.getItem('hive_user') || 'null');
  const c  = companies.find(x => x.id === id);
  const myId = me ? Number(me.id) : null;
  const isOwner = !!(me && c && c.created_by != null && c.created_by === myId);
  if (!isAdminMode && !isOwner) {
    showToast(t('toastNoEditPermission'));
    return;
  }
  // Reuse the full pre-filled-form flow already used from the profile panel.
  closeDetail();
  if (typeof profileEditCompany === 'function') profileEditCompany(id);
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const LISBON = [38.7223, -9.1393];
const AROUCA = [40.9319, -8.2374]; // Fallback location
let currentMapCenter = LISBON; // Start with Lisbon as default

// Hierarchical sector structure — focused on Construction only
const SECTOR_HIERARCHY = {
  'estrutura_fundacao': {
    label: 'Estrutura',
    icon: 'layers',
    categories: {
      'obra_grossa': {
        label: 'Obra Grossa',
        subcategories: {
          'pedreiros': 'Pedreiros / Trolhas',
          'escavacao': 'Escavação & Terraplanagem',
          'betao_cimento': 'Betão & Cimento',
          'demolicao': 'Demolição',
          'alvenaria': 'Alvenaria',
          'cofragem': 'Cofragem & Armação',
          'impermeabilizacao': 'Impermeabilização'
        }
      }
    }
  },
  'instalacoes': {
    label: 'Instalações',
    icon: 'zap',
    categories: {
      'redes_tecnicas': {
        label: 'Redes Técnicas',
        subcategories: {
          'eletricistas': 'Eletricistas',
          'picheleiros': 'Picheleiros / Canalizadores',
          'canalizacao_saneamento': 'Canalização & Saneamento',
          'climatizacao_avac': 'Climatização / AVAC',
          'gas': 'Instalações de Gás',
          'domotica_automacao': 'Domótica & Automação',
          'energias_renovaveis': 'Energias Renováveis / Solar',
          'seguranca_alarmes': 'Segurança & Alarmes',
          'pocos_agua': 'Poços de Água / Furos'
        }
      }
    }
  },
  'acabamentos': {
    label: 'Acabamentos',
    icon: 'paintbrush',
    categories: {
      'revestimentos': {
        label: 'Revestimentos & Pintura',
        subcategories: {
          'pintores': 'Pintores',
          'estucadores': 'Estucadores',
          'pavimentos': 'Pavimentos & Revestimentos',
          'azulejos': 'Azulejos & Cerâmica',
          'marmoraria': 'Marmoraria & Pedra',
          'isolamento': 'Isolamento Térmico & Acústico',
          'gesso_cartonado': 'Gesso Cartonado / Pladur'
        }
      }
    }
  },
  'carpintaria': {
    label: 'Carpintaria',
    icon: 'axe',
    categories: {
      'madeira': {
        label: 'Madeira & Mobiliário',
        subcategories: {
          'carpinteiros': 'Carpinteiros',
          'moveis_medida': 'Móveis por Medida'
        }
      }
    }
  },
  'serralharia_metal': {
    label: 'Serralharia',
    icon: 'anvil',
    categories: {
      'metal_vidro': {
        label: 'Metal, Vidro & Caixilharia',
        subcategories: {
          'serralharia': 'Serralharia',
          'estruturas_metalicas': 'Estruturas Metálicas',
          'aluminios_pvc': 'Alumínios & PVC',
          'caixilharia': 'Caixilharia',
          'vidraceiros': 'Vidraceiros',
          'portoes_vedacoes': 'Portões & Vedações'
        }
      }
    }
  },
  'exterior_jardim': {
    label: 'Exterior',
    icon: 'trees',
    categories: {
      'exteriores': {
        label: 'Exteriores & Jardim',
        subcategories: {
          'telhados_coberturas': 'Telhados & Coberturas',
          'piscinas': 'Piscinas',
          'paisagismo_jardins': 'Paisagismo & Jardins',
          'jardineiros': 'Jardineiros',
          'vedacoes_muros': 'Vedações & Muros',
          'calcetamento': 'Calçada & Pavimento Exterior',
          'fachadas': 'Fachadas & Reabilitação'
        }
      }
    }
  },
  'projeto_gestao': {
    label: 'Projeto',
    icon: 'ruler',
    categories: {
      'projetos': {
        label: 'Projetos & Consultoria',
        subcategories: {
          'arquitetura_projetos': 'Arquitetura & Projetos',
          'engenharia_civil': 'Engenharia Civil',
          'topografia': 'Topografia',
          'gestao_obra': 'Gestão de Obra',
          'certificacao_energetica': 'Certificação Energética',
          'seguranca_trabalho': 'Segurança no Trabalho',
          'design_interiores': 'Design de Interiores',
          'materiais_construcao': 'Materiais de Construção',
          'equipamentos_construcao': 'Equipamentos de Construção'
        }
      }
    }
  },
  'chave_na_mao': {
    label: 'Chave na Mão',
    icon: 'key-round',
    categories: {
      'turnkey': {
        label: 'Chave na Mão',
        subcategories: {
          'chave_na_mao_construcao': 'Construção Chave na Mão',
          'chave_na_mao_remodelacao': 'Remodelação Chave na Mão',
          'chave_na_mao_moradia': 'Moradias Chave na Mão',
          'chave_na_mao_apartamento': 'Apartamentos Chave na Mão',
          'chave_na_mao_comercial': 'Espaços Comerciais Chave na Mão'
        }
      }
    }
  }
};

// Map subcategory keys → parent sector key for color lookup
const SUB_TO_SECTOR = {};
Object.entries(SECTOR_HIERARCHY).forEach(([sectorKey, sectorObj]) => {
  Object.values(sectorObj.categories).forEach(cat => {
    Object.keys(cat.subcategories).forEach(subKey => {
      SUB_TO_SECTOR[subKey] = sectorKey;
    });
  });
});

// Representative photo per top-level category (reuses the home hero photos),
// so mobile result cards can be photo-led like Idealista's property cards.
const CAT_PHOTO = {};
LP_CATS.forEach(cat => { CAT_PHOTO[cat.key] = cat.photo; });
// Resolve a company → its top-level category key (handles sub-sectors and the
// sectors[] array), then to a photo. Falls back to 'chave_na_mao' so every
// company always has an image.
function companyCatKey(c) {
  const resolve = (k) => k && (CAT_PHOTO[k] ? k : (SUB_TO_SECTOR[k] || null));
  let key = resolve(c && c.sector);
  if (!key && c && Array.isArray(c.sectors)) {
    for (const s of c.sectors) { key = resolve(s); if (key) break; }
  }
  return key || 'chave_na_mao';
}
function companyPhoto(c) { return CAT_PHOTO[companyCatKey(c)]; }

function getSectorColor(c) {
  if (SECTOR_COLORS[c.sector]) return SECTOR_COLORS[c.sector];
  if (SUB_TO_SECTOR[c.sector]) return SECTOR_COLORS[SUB_TO_SECTOR[c.sector]];
  if (c.sectors) {
    for (const s of c.sectors) {
      if (SECTOR_COLORS[s]) return SECTOR_COLORS[s];
      if (SUB_TO_SECTOR[s]) return SECTOR_COLORS[SUB_TO_SECTOR[s]];
    }
  }
  return '#2563eb';
}

const SECTOR_KEYS = [
  'pedreiros','escavacao','betao_cimento','demolicao','alvenaria','cofragem','impermeabilizacao',
  'eletricistas','picheleiros','canalizacao_saneamento','climatizacao_avac','gas','domotica_automacao','energias_renovaveis','seguranca_alarmes','pocos_agua',
  'pintores','estucadores','pavimentos','azulejos','marmoraria','isolamento','gesso_cartonado',
  'carpinteiros','moveis_medida',
  'serralharia','estruturas_metalicas','aluminios_pvc','caixilharia','vidraceiros','portoes_vedacoes',
  'telhados_coberturas','piscinas','paisagismo_jardins','jardineiros','vedacoes_muros','calcetamento','fachadas',
  'arquitetura_projetos','engenharia_civil','topografia','gestao_obra','certificacao_energetica','seguranca_trabalho','design_interiores','materiais_construcao','equipamentos_construcao',
  'chave_na_mao_construcao','chave_na_mao_remodelacao','chave_na_mao_moradia','chave_na_mao_apartamento','chave_na_mao_comercial'
];
const SECTOR_ICONS = {
  pedreiros:            'hammer',
  escavacao:            'shovel',
  betao_cimento:        'box',
  estruturas_metalicas: 'construction',
  demolicao:            'hammer',
  alvenaria:            'layers',
  cofragem:             'frame',
  impermeabilizacao:    'droplets',
  eletricistas:         'zap',
  picheleiros:          'wrench',
  canalizacao_saneamento:'pipette',
  climatizacao_avac:    'wind',
  gas:                  'flame',
  domotica_automacao:   'cpu',
  energias_renovaveis:  'sun',
  seguranca_alarmes:    'shield',
  pocos_agua:           'droplets',
  pintores:             'paintbrush',
  estucadores:          'paintbrush',
  pavimentos:           'square',
  azulejos:             'grid-3x3',
  marmoraria:           'gem',
  isolamento:           'thermometer',
  gesso_cartonado:      'panel-top',
  carpinteiros:         'axe',
  serralharia:          'anvil',
  aluminios_pvc:        'door-open',
  caixilharia:          'app-window',
  vidraceiros:          'glasses',
  portoes_vedacoes:     'fence',
  moveis_medida:        'armchair',
  telhados_coberturas:  'home',
  piscinas:             'waves',
  paisagismo_jardins:   'trees',
  jardineiros:          'flower-2',
  vedacoes_muros:       'wall',
  calcetamento:         'footprints',
  fachadas:             'building-2',
  arquitetura_projetos: 'ruler',
  engenharia_civil:     'hard-hat',
  topografia:           'map-pin',
  gestao_obra:          'clipboard-list',
  certificacao_energetica:'badge-check',
  seguranca_trabalho:   'shield-check',
  design_interiores:    'palette',
  materiais_construcao: 'package',
  equipamentos_construcao:'truck',
  chave_na_mao_construcao:'key-round',
  chave_na_mao_remodelacao:'key-round',
  chave_na_mao_moradia:'key-round',
  chave_na_mao_apartamento:'key-round',
  chave_na_mao_comercial:'key-round'
};

// Cities by country (with districts and sub-localities)
const CITIES_BY_COUNTRY = {
  pt: [
    // LISBOA
    'Lisboa', 'Alcântara', 'Almada', 'Amadora', 'Cascais', 'Loures', 'Mafra', 'Odivelas', 'Oeiras', 'Sintra', 'Queluz', 'Ericeira',
    // PORTO
    'Porto', 'Vila do Conde', 'Maia', 'Matosinhos', 'Gaia', 'Avintes', 'Espinho', 'Santa Maria da Feira', 'Santo Tirso',
    // BRAGA
    'Braga', 'Guimarães', 'Barcelos', 'Famalicão', 'Valpaços', 'Arcos de Valdevez',
    // AVEIRO (com Arouca!)
    'Aveiro', 'Arouca', 'Ovar', 'Oliveira de Azeméis', 'Ílhavo', 'Vagos', 'Murtosa', 'São João da Madeira', 'Estarreja',
    // COVILHÃ & BEIRA INTERIOR
    'Covilhã', 'Guarda', 'Castelo Branco', 'Pinhel', 'Sabugal', 'Belmonte',
    // COIMBRA
    'Coimbra', 'Cantanhede', 'Condeixa', 'Figueira da Foz', 'Buarcos', 'Sousela',
    // VISEU & SERRA DA ESTRELA
    'Viseu', 'Seia', 'Gouveia', 'Fornos de Algodres', 'Mangualde',
    // LEIRIA
    'Leiria', 'Caldas da Rainha', 'Batalha', 'Fátima', 'Alcobaça', 'Nazaré', 'Peniche', 'Óbidos',
    // SANTARÉM
    'Santarém', 'Torres Novas', 'Abrantes', 'Tomar', 'Almerim', 'Almeirim',
    // SETÚBAL
    'Setúbal', 'Barreiro', 'Alcochete', 'Moita', 'Caparica', 'Seixal', 'Sesimbra',
    // ÉVORA
    'Évora', 'Arraiolos', 'Montemor-o-Novo', 'Portel', 'Estremoz',
    // BEJA
    'Beja', 'Serpa', 'Moura', 'Castro Verde', 'Barrancos',
    // FARO
    'Faro', 'Olhão', 'Silves', 'Portimão', 'Lagos', 'Albufeira', 'Loulé', 'Vilamoura', 'Quarteira', 'Tavira', 'Altura',
    // AÇORES
    'Ponta Delgada', 'Angra do Heroísmo', 'Horta',
    // MADEIRA
    'Funchal', 'Câmara de Lobos', 'Santa Cruz', 'Machico', 'Porto Santo'
  ],
  es: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'Ávila', 'Salamanca', 'Segovia', 'Toledo', 'Cuenca', 'Teruel'],
  fr: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Bordeaux', 'Lille', 'Rennes', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Villeurbanne', 'Le Mans', 'Aix-en-Provence', 'Brest'],
  it: ['Roma', 'Milano', 'Napoli', 'Torino', 'Palermo', 'Genova', 'Bologna', 'Firenze', 'Bari', 'Catania', 'Venezia', 'Verona', 'Messina', 'Padova', 'Trieste', 'Brescia', 'Parma', 'Taranto', 'Prato', 'Reggio Calabria'],
  de: ['Berlin', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Dresden', 'Hamburg', 'Hannover', 'Nürnberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster', 'Karlsruhe'],
  uk: ['Londres', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bristol', 'Edimburgo', 'Liverpool', 'Leicester', 'Coventry', 'Norwich', 'Nottingham', 'Derby', 'Stoke-on-Trent', 'Wolverhampton', 'Plymouth', 'Southampton', 'Brighton'],
  nl: ['Amsterdão', 'Roterdão', 'Haia', 'Utrecht', 'Eindhoven', 'Groningen', 'Tilburg', 'Almelo', 'Arnhem', 'Haarlem', 'Antuérpia', 'Leeuwarden', 'Alkmaar', 'Dordrecht', 'Enschede', 'Helmond', 'Breda', 'Apeldoorn', 'Nijmegen', 'Zwolle'],
  be: ['Bruxelas', 'Antuérpia', 'Gand', 'Charleroi', 'Liège', 'Brujas', 'Namur', 'Leuven', 'Mons', 'Tournai', 'Ostend', 'Arlon', 'Seraing', 'Verviers', 'Mechelen', 'Hasselt', 'Waterloo', 'Ypres', 'Eupen', 'Marche-en-Famenne'],
  ch: ['Zurique', 'Genebra', 'Basileia', 'Berna', 'Lausana', 'Lucerna', 'Saint-Gallen', 'Winterthur', 'Schaffhausen', 'Neuchâtel', 'Bellinzona', 'Friburgo', 'Solothurn', 'Liestal', 'Appenzell', 'Chur', 'Glarus', 'Altdorf', 'Sarnen', 'Stans'],
  at: ['Viena', 'Graz', 'Linz', 'Salzburgo', 'Insbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sant. Pölten', 'Steyr', 'Eisenstadt', 'Feldkirch', 'Dornbirn', 'Wiener Neustadt', 'Wr. Neustadt', 'Stockerau', 'Tulln', 'Krems', 'Enns', 'Traun'],
  other: ['Outro']
};

// Localities/Areas by City
const LOCALITIES_BY_CITY = {
  'Lisboa': ['Centro', 'Norte', 'Leste', 'Oeste', 'Alvalade', 'Alcântara', 'Belém', 'Benfica', 'Campo de Ourique', 'Estrela', 'Marvila', 'Misericórdia', 'Olivais', 'Penha de França', 'Santa Maria Maior', 'Santo António', 'São Bento', 'São Jorge', 'São Vicente', 'Ajuda', 'Avenidas Novas', 'Parque das Nações', 'Parque Mayer'],
  'Porto': ['Centro', 'Norte', 'Sul', 'Leste', 'Oeste', 'Aliados', 'Bolhão', 'Cedofeita', 'Coliseu', 'Matosinhos', 'Massarelos', 'Miragaia', 'Ribeira', 'Santo Ildefonso', 'Sé', 'Vitória', 'Bonfim', 'Clérigos'],
  'Braga': ['Centro', 'Leste', 'Oeste', 'Norte', 'Sul', 'Nogueira', 'Gualtar'],
  'Covilhã': ['Centro', 'Leste', 'Oeste'],
  'Aveiro': ['Centro', 'Norte', 'Sul', 'Costa'],
  'Coimbra': ['Centro', 'Leste', 'Oeste', 'Baixa', 'Alta'],
  'Viseu': ['Centro', 'Norte', 'Sul', 'Este'],
  'Guarda': ['Centro'],
  'Castelo Branco': ['Centro', 'Norte', 'Sul'],
  'Leiria': ['Centro', 'Vale', 'Marrazes'],
  'Santarém': ['Centro'],
  'Setúbal': ['Centro', 'Norte', 'Sul', 'Arrabida'],
  'Évora': ['Centro', 'Histórico'],
  'Beja': ['Centro'],
  'Faro': ['Centro', 'Este', 'Oeste', 'Lagoa'],
  'Funchal': ['Centro', 'Funchal Centro', 'Santa Luzia'],
  'Ponta Delgada': ['Centro', 'Zona Histórica']
};

const ZONE_KEYS   = ['lisbon_center','lisbon_north','lisbon_east','lisbon_west',
                     'oeiras','sintra','cascais','setubal','porto','braga'];
const zoneCoords  = {
  lisbon_center:[38.7223,-9.1393], lisbon_north:[38.7530,-9.1560],
  lisbon_east:[38.7688,-9.0980],   lisbon_west:[38.7052,-9.1435],
  oeiras:[38.6967,-9.3150],        sintra:[38.8029,-9.3817],
  cascais:[38.6979,-9.4215],       setubal:[38.5244,-8.8882],
  porto:[41.1579,-8.6291],         braga:[41.5454,-8.4265],
  arouca:[40.9319,-8.2374]         // Added Arouca zone
};

// Mapeamento de localidades para coordenadas precisas (evita problemas de geocoding)
const LOCALITY_COORDS = {
  // AVEIRO
  'Arouca': [40.9319, -8.2374],
  'Ovar': [40.8731, -8.6425],
  'Oliveira de Azeméis': [40.7831, -8.4769],
  'Ílhavo': [40.6142, -8.6583],
  'Vagos': [40.5556, -8.6625],
  'Murtosa': [40.4497, -8.7692],
  'São João da Madeira': [40.8136, -8.4978],
  'Estarreja': [40.6681, -8.6469],
  // PORTO
  'Vila do Conde': [41.3384, -8.7614],
  'Maia': [41.2250, -8.6342],
  'Matosinhos': [41.1917, -8.6817],
  'Gaia': [41.1350, -8.6275],
  'Espinho': [40.9556, -8.6442],
  'Santa Maria da Feira': [40.8489, -8.5356],
  'Santo Tirso': [41.3453, -8.4789],
  // BRAGA
  'Guimarães': [41.4406, -8.2955],
  'Barcelos': [41.5375, -8.6186],
  'Famalicão': [41.4056, -8.5192],
  'Valpaços': [41.6781, -7.7631],
  'Arcos de Valdevez': [41.8056, -8.4328],
  // COVILHÃ & BEIRA INTERIOR
  'Guarda': [40.5372, -7.2686],
  'Castelo Branco': [40.2833, -7.5],
  'Pinhel': [40.7631, -7.0306],
  'Sabugal': [40.3392, -6.9778],
  'Belmonte': [40.3533, -7.3881],
  // COIMBRA
  'Cantanhede': [40.3389, -8.2867],
  'Condeixa': [40.1097, -8.4950],
  'Figueira da Foz': [40.1408, -8.8633],
  'Sousela': [40.1556, -8.4919],
  // VISEU
  'Seia': [40.7042, -7.6136],
  'Gouveia': [40.4939, -7.5881],
  'Fornos de Algodres': [40.7269, -7.4703],
  'Mangualde': [40.6281, -7.7306],
  // LEIRIA
  'Caldas da Rainha': [39.3703, -9.1714],
  'Batalha': [39.6633, -8.7681],
  'Fátima': [39.6306, -8.6531],
  'Alcobaça': [39.5533, -8.9786],
  'Nazaré': [39.6033, -9.0728],
  'Peniche': [39.3575, -9.3817],
  'Óbidos': [39.3628, -9.1556],
  // SANTARÉM
  'Torres Novas': [39.4656, -8.5186],
  'Abrantes': [39.4656, -8.1947],
  'Tomar': [39.6094, -8.4089],
  'Almerim': [39.0878, -8.5939],
  // SETÚBAL
  'Barreiro': [38.6658, -9.0758],
  'Alcochete': [38.7592, -9.0358],
  'Moita': [38.6364, -9.0542],
  'Caparica': [38.6542, -9.1906],
  'Seixal': [38.6425, -9.1003],
  'Sesimbra': [38.4367, -9.1031],
  // ÉVORA
  'Arraiolos': [38.6689, -7.9917],
  'Montemor-o-Novo': [38.6933, -8.2167],
  'Portel': [38.2917, -8.0667],
  'Estremoz': [38.8544, -7.6025],
  // BEJA
  'Serpa': [37.9456, -7.6083],
  'Moura': [37.9711, -8.1394],
  'Castro Verde': [37.6392, -8.0894],
  // FARO
  'Olhão': [37.2633, -7.8428],
  'Silves': [37.1844, -8.4464],
  'Portimão': [37.1467, -8.5289],
  'Lagos': [37.0981, -8.6728],
  'Albufeira': [37.0894, -8.2506],
  'Loulé': [37.1411, -8.0186],
  // AÇORES
  'Ponta Delgada': [37.7412, -25.6756],
  'Angra do Heroísmo': [38.6547, -27.2263],
  // MADEIRA
  'Câmara de Lobos': [32.6464, -17.0053],
  'Santa Cruz': [32.6768, -16.8384],
  'Machico': [32.7331, -16.9753]
};

const defaultEmojis = ['🏢','🏭','💼','🔧','🌟','🔶','🔷','💡','🎯','🚀','🌿','🔑'];
const defaultColors = ['#6366f1','#8b5cf6','#ec4899','#14b8a6','#f97316','#84cc16','#06b6d4','#f43f5e','#a855f7','#22c55e','#0ea5e9','#f59e0b'];
let nextCompanyId = 1;

// ════════════════════════════════════════════════════════════════════════════
//  SUPABASE — REAL DATABASE CONFIGURATION
//
//  Setup (5 minutes, free):
//  1. Go to https://supabase.com → "Start your project" → create a free project
//  2. In your project dashboard: Settings → API
//     Copy "Project URL"  →  paste as SUPABASE_URL below
//     Copy "anon public"  →  paste as SUPABASE_ANON below
//  3. Go to SQL Editor → paste and run this SQL to create the table:
//
//  CREATE TABLE companies (
//    id          BIGSERIAL PRIMARY KEY,
//    name        TEXT NOT NULL,
//    sectors     TEXT[] NOT NULL DEFAULT '{}',
//    sector      TEXT,
//    cae         TEXT,
//    address     TEXT,
//    postal_code TEXT,
//    city        TEXT,
//    country     TEXT DEFAULT 'pt',
//    zone        TEXT,
//    email       TEXT NOT NULL,
//    phone       TEXT NOT NULL,
//    website     TEXT,
//    tags        TEXT[] DEFAULT '{}',
//    description TEXT,
//    lat         DOUBLE PRECISION NOT NULL,
//    lng         DOUBLE PRECISION NOT NULL,
//    rating      DECIMAL(3,1) DEFAULT 0,
//    reviews     INTEGER DEFAULT 0,
//    top_rated   BOOLEAN DEFAULT FALSE,
//    verified    BOOLEAN DEFAULT FALSE,
//    is_new      BOOLEAN DEFAULT TRUE,
//    emoji       TEXT,
//    color       TEXT,
//    pin_type    TEXT DEFAULT 'std',
//    status      TEXT DEFAULT 'approved',
//    created_at  TIMESTAMPTZ DEFAULT NOW()
//  );
//  ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
//  CREATE POLICY "public_insert" ON companies FOR INSERT WITH CHECK (true);
//  CREATE POLICY "public_select" ON companies FOR SELECT USING (true);
//
// ════════════════════════════════════════════════════════════════════════════
// Backend API — api.js (loaded in <head>) sets API_BASE to '/api' by default.
// Override only for local dev: window.API_BASE = 'http://localhost:4000/api';
const sb = null; // Supabase removed — kept so residual if(sb) checks are safe

// ── STATE ──────────────────────────────────────────────────────────────────────
let selectedId    = null;
let chatOpen      = false;
const markerMap   = {};
let activeSectors = new Set();
let _keywordFilter = '';  // separate keyword filter (NOT location text)
let activeTag     = null;

// ── MAP INIT ──────────────────────────────────────────────────────────────────
const PORTUGAL_CENTER = [39.5, -8.0];
let map = null;
let radiusCircle = null;

try {
  if (typeof L === 'undefined') throw new Error('Leaflet not loaded');
  const _tabSearchEl = document.getElementById('tab-search');
  if (_tabSearchEl) { _tabSearchEl.style.display = 'flex'; _tabSearchEl.style.visibility = 'hidden'; }
  // preferCanvas renders vector overlays (the radius circle, popups) on a
  // single Canvas instead of one SVG node each — lower memory + smoother on
  // mobile when the user pans. fadeAnimation off cuts a paint per zoom step.
  map = L.map('map', {
    center: PORTUGAL_CENTER,
    zoom: 7,
    zoomControl: true,
    preferCanvas: true,
    fadeAnimation: false,
    zoomAnimation: true,
    markerZoomAnimation: false,   // marker positions tween over zoom — pricey
  });
  // CartoDB Voyager: light land, soft-blue sea — better contrast than light_all
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    // Only request @2x tiles when the device actually has a high-DPR screen
    // and isn't a low-power mobile (saves up to ~3x bandwidth on cellular).
    detectRetina: window.devicePixelRatio > 1.5 && (navigator.connection?.effectiveType !== '3g'),
    // Keep low-zoom tiles cached so panning back doesn't refetch
    keepBuffer: 4,
    updateWhenIdle: true,    // skip tile fetches mid-pan, only on settle
    updateWhenZooming: false,
  }).addTo(map);
  if (_tabSearchEl) { _tabSearchEl.style.display = 'none'; _tabSearchEl.style.visibility = ''; }
  // Slate-blue instead of orange: the radius is context, not a call to action —
  // keeps orange reserved for primary CTAs (credibility pass).
  radiusCircle = L.circle(PORTUGAL_CENTER, {
    radius: 600000, color:'#64748b', fillColor:'#64748b',
    fillOpacity: 0.08, weight: 2, dashArray:'5,4'
  }).addTo(map);
} catch(e) {
  console.error('Map init failed:', e);
  // Surface a visible message on the map container so users see something is wrong
  const mapEl = document.getElementById('map');
  if (mapEl) {
    mapEl.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:24px;text-align:center;color:#6b7280;background:#f5f7fa;font-family:Segoe UI,system-ui,sans-serif">'
      + '<div style="font-size:48px;margin-bottom:12px">🗺️</div>'
      + '<div style="font-size:16px;font-weight:700;color:#374151;margin-bottom:6px">Não foi possível carregar o mapa</div>'
      + '<div style="font-size:13px;max-width:340px;line-height:1.5">Verifique a sua ligação e recarregue a página. Se o problema persistir, alguma extensão do browser pode estar a bloquear o serviço de mapas.</div>'
      + '<button onclick="location.reload()" style="margin-top:16px;background:#2563eb;color:#fff;border:0;padding:10px 24px;border-radius:8px;font-weight:700;cursor:pointer">Recarregar</button>'
      + '</div>';
  }
  // Defer toast so showToast is defined by the time we call it
  setTimeout(() => { try { showToast(t('toastMapUnavailable')); } catch(_) {} }, 500);
}

// Map drag does NOT move the search/radius center.
// currentMapCenter is only updated on explicit location search or geolocation.
// This keeps the radius filter anchored to where the user searched.

// Load companies from Supabase if configured, otherwise show demo companies
loadCompaniesFromDB();

// Sync radius label + circle with the slider's initial value on page load
updateRadius(parseInt(document.getElementById('radiusSlider')?.value || 50, 10));

// Auto-detect location at startup — but NEVER trigger the OS permission prompt
// or a help modal without an explicit user action. We only silently auto-center
// for users who have ALREADY granted permission; everyone else just gets a gentle
// pulse on the locate button inviting them to opt in by tapping it.
async function autoDetectLocationIfGranted() {
  if (_locationObtained || !navigator.geolocation || !navigator.permissions) return;
  try {
    const perm = await navigator.permissions.query({ name: 'geolocation' });
    if (perm.state === 'granted') detectUserLocation(true);
    // 'prompt' / 'denied' → do nothing; the user opts in via the locate button.
  } catch (_) {}
}
document.addEventListener('DOMContentLoaded', async () => {
  if (!navigator.geolocation) return;
  try {
    if (navigator.permissions) {
      const perm = await navigator.permissions.query({ name: 'geolocation' });
      if (perm.state === 'granted') {
        detectUserLocation(true);            // already allowed → silent auto-center
      } else {
        // 'prompt' or 'denied' — do NOT prompt or open the modal on load. Just a
        // gentle pulse on the locate button so the user knows they can opt in.
        const b = document.getElementById('btnLocate');
        if (b) { b.classList.add('pulse-hint'); setTimeout(() => b.classList.remove('pulse-hint'), 5000); }
      }
      // If the user later enables location (e.g. from OS settings) auto-center;
      // never auto-open the modal on a denial.
      perm.onchange = () => {
        if (perm.state === 'granted') { closeGeoHelp(); detectUserLocation(true); }
      };
    }
    // No Permissions API → no auto-detect; the user opts in via the locate button.
  } catch (_) {}
});

// ── MARKERS ───────────────────────────────────────────────────────────────────
// Marker icons are memoized on a small key — (sectorColor, pinType, featured,
// emoji). Two companies in the same sector with the same emoji share the same
// icon object instead of spawning a fresh one each. With ~1000 companies but
// ~30 sectors and a handful of emojis, the working set drops to dozens.
const _markerIconCache = new Map();
function _hexToGlow(hex) {
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},.4)`;
}
// Professional fallback when a company has no logo: a monogram with the
// company's initials (LinkedIn-style tile) instead of a consumer-grade emoji.
function companyMonogram(c) {
  const stop = new Set(['de','da','do','das','dos','e','a','o','&','-','lda','lda.','sa','s.a.','s.a','unipessoal','sociedade']);
  const words = String((c && c.name) || '').split(/\s+/)
    .filter(w => w && !stop.has(w.toLowerCase().replace(/[.,()]/g, '')));
  const src = words.length ? words : String((c && c.name) || '?').split(/\s+/);
  const ini = (src[0] ? src[0][0] : '') + (src[1] ? src[1][0] : '');
  return (ini || '?').toUpperCase();
}
window.companyMonogram = companyMonogram;

function createMarkerIcon(c) {
  const sectorColor = getSectorColor(c);
  const bg = c.pinType === 'gold' ? '#f59e0b' : sectorColor;
  const featured = !!c.featured;
  const mono = companyMonogram(c);
  const key = c.logo ? ('logo|' + c.id + '|' + (featured ? '1' : '0'))
                     : (bg + '|' + (featured ? '1' : '0') + '|' + mono);
  let icon = _markerIconCache.get(key);
  if (icon) return icon;

  const glow = c.pinType === 'gold' ? 'rgba(245,158,11,.4)' : _hexToGlow(sectorColor);
  const featuredBorder = featured ? '3px solid #f59e0b' : '2.5px solid #fff';
  const featuredShadow = featured ? `0 3px 12px ${glow},0 0 0 4px rgba(245,158,11,.25)` : `0 3px 12px ${glow}`;
  const featuredBadge  = featured ? `<span style="position:absolute;top:-8px;right:-6px;background:#f59e0b;color:#fff;font-size:9px;font-weight:900;border-radius:8px;padding:1px 4px;line-height:1.4;z-index:1">⭐</span>` : '';
  // Branded honeycomb/hexagon marker (pointy-top hex with a bottom vertex that
  // acts as the location "tip"). Border is simulated by a slightly larger hex
  // behind the coloured one; drop-shadow respects the clip-path.
  const hex = 'polygon(50% 0,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)';
  const borderColor = featured ? '#f59e0b' : '#ffffff';
  icon = L.divIcon({
    className: '',
    html: `<div style="width:40px;height:42px;position:relative;cursor:pointer;filter:drop-shadow(0 3px 5px ${glow})${featured ? ' drop-shadow(0 0 2px rgba(245,158,11,.9))' : ''}">${featuredBadge}<div style="position:absolute;inset:0;background:${borderColor};clip-path:${hex}"></div><div style="position:absolute;inset:3px;background:${bg};clip-path:${hex};display:flex;align-items:center;justify-content:center;overflow:hidden">${c.logo ? `<img src="${c.logo}" alt="" style="width:100%;height:100%;object-fit:cover;display:block"/>` : `<span style="font-size:12px;font-weight:800;color:#fff;letter-spacing:.3px;display:block;line-height:1;font-family:inherit">${mono}</span>`}</div></div>`,
    iconSize:[40,42], iconAnchor:[20,42], popupAnchor:[0,-44]
  });
  _markerIconCache.set(key, icon);
  return icon;
}

function buildPopupHtml(c) {
  const tr = translations[currentLang];
  let starsHtml;
  if (c.rating > 0) {
    const fullStars = Math.floor(c.rating);
    const hasHalf = c.rating % 1 !== 0;
    const stars = '★'.repeat(fullStars) + (hasHalf ? '½' : '') + '☆'.repeat(5 - Math.ceil(c.rating));
    starsHtml = `<div style="color:#f59e0b;font-size:19px;margin-bottom:5px">${stars} <strong style="color:#1e293b">${c.rating.toFixed(1)}</strong> <span style="color:#64748b;font-size:16px">(${c.reviews} ${tr.reviews})</span></div>`;
  } else {
    starsHtml = `<div style="margin-bottom:5px"><span class="badge-new">${tr.newOnHivex || 'Novo na Hivex'}</span></div>`;
  }
  const sc = (tr && tr.sectors) || {};
  const sectorsArr = (c.sectors && c.sectors.length) ? c.sectors : (c.sector ? [c.sector] : []);
  const shown = sectorsArr.slice(0, 3);
  const extra = Math.max(0, sectorsArr.length - shown.length);
  const sectorsHtml = sectorsArr.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 9px">
    ${shown.map(s => `<span style="background:#eff6ff;color:#1e40af;font-size:15px;font-weight:600;padding:4px 11px;border-radius:8px;border:1px solid rgba(37,99,235,.18);line-height:1.3">${escHtml(sc[s] || s)}</span>`).join('')}
    ${extra > 0 ? `<span style="font-size:15px;color:#64748b;font-weight:700;padding:4px 5px;align-self:center">+${extra}</span>` : ''}
  </div>` : '';
  // Credentials are only present on the company object for logged-in users
  // (the backend redacts them for anonymous traffic).
  const certBadge = c.certidao_permanente
    ? `<span style="font-size:14px;color:#166534;background:#dcfce7;border-radius:6px;padding:4px 9px;display:inline-flex;align-items:center;gap:4px;font-weight:700">✓ ${escHtml(tr.popupCertOk || 'Certidão registada')}</span>`
    : '';
  const alvaraBadge = c.alvara
    ? `<span style="font-size:14px;color:#1e40af;background:#eff6ff;border:1px solid rgba(37,99,235,.25);border-radius:6px;padding:4px 9px;display:inline-flex;align-items:center;gap:4px;font-weight:700">⚒ ${escHtml(tr.popupAlvaraOk || 'Alvará')}</span>`
    : '';
  const newBadge = c.isNew
    ? `<span style="font-size:14px;color:#166534;background:#dcfce7;border-radius:6px;padding:4px 9px;display:inline-flex;align-items:center;font-weight:700">${escHtml(tr.popupNewBadge)}</span>`
    : '';
  const badges = [certBadge, alvaraBadge, newBadge].filter(Boolean).join('');
  return `<div style="min-width:290px;max-width:380px">
    <div style="font-size:22px;font-weight:800;color:#1e293b;margin-bottom:5px">${c.emoji} ${escHtml(c.name)}</div>
    ${sectorsHtml}
    ${starsHtml}
    ${c.address ? `<div style="font-size:16px;color:#64748b;line-height:1.4">${escHtml(c.address)}</div>` : ''}
    ${badges ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:9px">${badges}</div>` : ''}
  </div>`;
}

// Marker cluster group for performance with many markers
let markerClusterGroup = null;
function ensureClusterGroup() {
  if (markerClusterGroup) return markerClusterGroup;
  if (!map || typeof L === 'undefined' || !L.markerClusterGroup) return null;
  markerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: 60,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 16,
    // Perf knobs that matter on mobile + large datasets:
    //  • chunkedLoading lets the cluster batch-add markers in async chunks
    //    instead of blocking the main thread for hundreds of ms.
    //  • removeOutsideVisibleBounds skips DOM creation for markers outside
    //    the current viewport, then revives them on pan/zoom.
    chunkedLoading: true,
    chunkInterval: 100,
    chunkDelay: 30,
    removeOutsideVisibleBounds: true,
    // Disable per-cluster animations on mobile (CPU-heavy).
    animate: window.matchMedia && window.matchMedia('(max-width: 768px)').matches ? false : true,
    animateAddingMarkers: false,
  });
  map.addLayer(markerClusterGroup);
  return markerClusterGroup;
}

function addCompanyMarker(c) {
  if (!map || typeof L === 'undefined') return;
  const m = L.marker([c.lat, c.lng], { icon: createMarkerIcon(c) });
  // Lazy popup: content built only when the popup is actually opened,
  // so language changes and filter runs don't rebuild HTML for all markers
  m.bindPopup(() => buildPopupHtml(c), { maxWidth: 400, minWidth: 300 });
  // When the mobile results-sheet is open, a pin tap highlights that company's
  // card in the list instead of opening the full detail; otherwise open detail.
  m.on('click', () => {
    if (_resultsSheetOpen && _highlightSheetCard(c.id)) return;
    openDetail(c.id);
  });
  markerMap[c.id] = m;
  // Ensure the cluster layer exists so updateMarkers() has something to add to,
  // but DO NOT add this marker yet — visibility is owned by applyFilters() so
  // that filters and the radius constraint are honoured from first paint.
  ensureClusterGroup();
}

// Logarithmic slider: slider 0-100 → real km 5-500.
// slider=0 → 5km, slider=50 → 50km (default), slider=100 → "Todo".
function sliderToKm(sliderVal) {
  const s = parseFloat(sliderVal);
  if (s >= 100) return 500;
  if (s <= 0) return 5;
  // Log scale anchored so the midpoint (50) is exactly 50 km: 5 * 100^(s/100).
  return Math.round(5 * Math.pow(100, s / 100));
}

function getRadiusKm() {
  const slider = document.getElementById('radiusSlider');
  if (!slider) return 250;
  // Slider at max = "Todo o país" → effectively unlimited so every company passes.
  return parseInt(slider.value, 10) >= 100 ? 99999 : sliderToKm(slider.value);
}

function updateRadius(sliderVal) {
  // Slider at max = "Todo o país" → no radius limit.
  const isAll = parseInt(sliderVal, 10) >= 100;
  const km = isAll ? 99999 : sliderToKm(sliderVal);
  // Live label in the sidebar
  const liveEl = document.getElementById('radiusLiveVal');
  if (liveEl) liveEl.textContent = isAll ? 'Todo' : (km + ' km');
  // Update the orange circle on the map (Leaflet takes metres). When "all",
  // hide the circle entirely since there's no distance limit.
  try {
    if (radiusCircle && typeof radiusCircle.setRadius === 'function') {
      if (isAll) {
        radiusCircle.setStyle({ opacity: 0, fillOpacity: 0 });
      } else {
        radiusCircle.setStyle({ opacity: 1, fillOpacity: 0.12 });
        radiusCircle.setRadius(km * 1000);
      }
    }
  } catch (e) {
    console.error('Error updating radius:', e);
  }
}

// Used by the empty-state buttons to bump the radius slider and re-run filters.
function _expandRadiusTo(sliderVal) {
  const slider = document.getElementById('radiusSlider');
  if (slider) { slider.value = sliderVal; updateRadius(sliderVal); }
  if (typeof applyFilters === 'function' && applyFilters.now) applyFilters.now();
}
window._expandRadiusTo = _expandRadiusTo;

// Checkbox: ignore the search radius entirely → show companies everywhere.
function toggleIgnoreRadius() {
  const on = document.getElementById('ignoreRadius')?.checked;
  const slider = document.getElementById('radiusSlider');
  if (slider) slider.disabled = !!on;
  const sec = document.querySelector('.radius-section');
  if (sec) sec.classList.toggle('radius-off', !!on);
  // Hide the orange radius circle while ignoring; restore it when turned back off.
  try {
    if (on) { if (radiusCircle) radiusCircle.setStyle({ opacity: 0, fillOpacity: 0 }); }
    else { updateRadius(slider ? slider.value : 50); }
  } catch (_) {}
  if (typeof applyFilters === 'function' && applyFilters.now) applyFilters.now();
}
window.toggleIgnoreRadius = toggleIgnoreRadius;

// Geocode location and center map
function geocodeLocation(location) {
  if (!location || location.trim() === '') return;

  const query = encodeURIComponent(location);
  // Search worldwide without country restrictions
  fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
    .then(r => r.json())
    .then(data => {
      if (data && data.length > 0) {
        const place = data[0];
        const lat = parseFloat(place.lat);
        const lng = parseFloat(place.lon);
        // Zoom to the location with appropriate zoom level
        const zoom = place.type === 'amenity' || place.type === 'building' ? 16 :
                     place.type === 'village' ? 13 :
                     place.type === 'town' ? 12 :
                     place.type === 'city' ? 11 :
                     place.type === 'county' ? 10 : 9;
        map.setView([lat, lng], zoom, { animate: true });
        // Update current map center
        currentMapCenter = [lat, lng];
        invalidateDistanceCache();
        // Update radius circle center
        if (radiusCircle) radiusCircle.setLatLng([lat, lng]);
        // Show location name in toast
        showToast(`${place.name || location}`);
      } else {
        showToast(t('toastPlaceNotFound'));
      }
    })
    .catch(e => {
      console.error('Geocoding error:', e);
      showToast(t('toastLocationError'));
    });
}

// ── DYNAMIC SELECT RENDERING ──────────────────────────────────────────────────

function renderRegisterZoneSelect(city = '') {
  const sel = document.getElementById('regZone');
  if (!sel) return;

  // Get localities for the selected city
  const localities = city && LOCALITIES_BY_CITY[city] ? LOCALITIES_BY_CITY[city] : [];

  const cur = sel.value;
  if (localities.length > 0) {
    // Show city-specific localities
    sel.innerHTML = `<option value="">Selecionar localidade...</option>` +
      localities.map(loc => `<option value="${loc}">${loc}</option>`).join('');
  } else {
    // Fallback to zone-based system (legacy)
    const tr = translations[currentLang];
    sel.innerHTML = `<option value="">Selecionar zona...</option>` +
      ZONE_KEYS.map(k => `<option value="${k}">${tr.zones[k]}</option>`).join('');
  }

  if (cur && localities.includes(cur)) sel.value = cur;
}

function renderEmailTypeSelect() {
  const tr  = translations[currentLang];
  const sel = document.getElementById('emailTypeSelect');
  if (!sel) return;
  sel.innerHTML = tr.emailTypes.map(o => `<option>${o}</option>`).join('');
}

// ── FILTER SIDEBAR ────────────────────────────────────────────────────────────
function renderSectorFilters() {
  const container = document.getElementById('sectorFilters');
  container.innerHTML = '';

  const tr = translations[currentLang] || translations.pt;
  const sg = tr.sectorGroups || {};
  const sc = tr.sectors || {};

  // Collect every subcategory key across every group — used by the master
  // "select all areas" toggle below.
  const _allSubKeysGlobal = [];
  Object.values(SECTOR_HIERARCHY).forEach(group => {
    Object.values(group.categories).forEach(cat => {
      Object.keys(cat.subcategories).forEach(k => _allSubKeysGlobal.push(k));
    });
  });
  const _allSelected = _allSubKeysGlobal.length > 0 && _allSubKeysGlobal.every(k => activeSectors.has(k));

  // Master toggle: select all activities across all areas in one click.
  const allBtn = document.createElement('button');
  allBtn.type = 'button';
  allBtn.className = 'cat-item cat-item-master' + (_allSelected ? ' active' : '');
  allBtn.title = _allSelected ? t('sectorAllDeselectAll') : t('sectorAllSelectAll');
  allBtn.innerHTML = `
    ${_allSelected ? '<span class="cat-icon" style="line-height:1">✓</span>' : ''}
    <span class="cat-label">${t('sectorAllLabel')}</span>
  `;
  allBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (_allSubKeysGlobal.every(k => activeSectors.has(k))) {
      _allSubKeysGlobal.forEach(k => activeSectors.delete(k));
    } else {
      _allSubKeysGlobal.forEach(k => activeSectors.add(k));
    }
    renderSectorFilters();
    applyFilters();
  });
  container.appendChild(allBtn);

  // Company count per subcategory — total count regardless of radius
  const subCounts = {};
  companies.forEach(c => {
    (c.sectors || [c.sector]).forEach(s => { subCounts[s] = (subCounts[s] || 0) + 1; });
  });

  const filterContainer = document.createElement('div');
  filterContainer.className = 'sector-filter-container';

  Object.entries(SECTOR_HIERARCHY).forEach(([groupKey, group]) => {
    const allSubKeys = [];
    Object.values(group.categories).forEach(cat => {
      Object.keys(cat.subcategories).forEach(k => allSubKeys.push(k));
    });

    const groupIsActive = allSubKeys.some(k => activeSectors.has(k));
    const catItem = document.createElement('div');
    catItem.className = 'cat-item' + (groupIsActive ? ' active' : '');
    catItem.dataset.group = groupKey;

    // Translated group label
    const shortName = sg[groupKey] || group.label;

    // Build dropdown HTML with translated labels
    let dropdownHTML = `<div class="cat-dropdown">`;
    dropdownHTML += `<div class="cat-dd-all" data-group="${groupKey}">☰ ${t('sectorSelectAllHere')} · ${shortName}</div>`;

    Object.entries(group.categories).forEach(([catKey, cat]) => {
      const catLabel = sg[catKey] || cat.label;
      dropdownHTML += `<div class="cat-dd-head" data-cat="${catKey}">${catLabel}</div>`;
      Object.entries(cat.subcategories).forEach(([subKey, subLabel]) => {
        const isActive = activeSectors.has(subKey) ? ' active' : '';
        const tLabel = sc[subKey] || subLabel;
        const cnt = subCounts[subKey] || 0;
        dropdownHTML += `<div class="cat-dd-item${isActive}" data-sector="${subKey}"><span class="cat-dd-label">${tLabel}</span>${cnt > 0 ? ` <span style="opacity:.5;font-size:9px">(${cnt})</span>` : ''}</div>`;
      });
    });
    dropdownHTML += `</div>`;

    catItem.innerHTML = `
      <span class="cat-label">${shortName}</span>
      <span class="cat-arrow" aria-hidden="true">▾</span>
      ${dropdownHTML}
    `;

    // Click on "Todas em..." = select ALL subcategories of this group
    const allBtn = catItem.querySelector('.cat-dd-all');
    allBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const allSelected = allSubKeys.every(k => activeSectors.has(k));
      if (allSelected) {
        allSubKeys.forEach(k => activeSectors.delete(k));
      } else {
        allSubKeys.forEach(k => activeSectors.add(k));
      }
      updateSectorActiveStates();
      applyFilters();
    });

    // Click on individual subcategory
    catItem.querySelectorAll('.cat-dd-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const sector = item.dataset.sector;
        // Toggle immediately in the UI (active highlight) before re-render
        item.classList.toggle('active', !activeSectors.has(sector));
        toggleSector(sector);
      });
    });

    // Click to toggle dropdown (fixed position)
    const dropdown = catItem.querySelector('.cat-dropdown');
    catItem.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('show');
      // Close all other open dropdowns
      document.querySelectorAll('.cat-dropdown.show').forEach(d => d.classList.remove('show'));
      document.querySelectorAll('.cat-item.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) {
        // The desktop body uses `zoom` (see the >=1160px rule). A position:fixed
        // element inside a zoomed body has its top/left MULTIPLIED by that zoom,
        // while getBoundingClientRect() already returns scaled (visual) coords.
        // So convert every target coordinate to layout px by dividing by zoom,
        // otherwise the menu renders offset (and right-side ones fall off-screen).
        const z = parseFloat(getComputedStyle(document.body).zoom) || 1;
        const rect = catItem.getBoundingClientRect();
        const vpW = window.innerWidth / z;   // viewport width in layout px
        dropdown.style.top = ((rect.bottom + 2) / z) + 'px';
        dropdown.style.maxWidth = (vpW - 8) + 'px';
        // Constrain height so it doesn't go below the bottom nav bar.
        const bottomBar = window.innerWidth <= 768 ? 64 : 0;
        dropdown.style.maxHeight = Math.min(560, (window.innerHeight - rect.bottom - bottomBar - 8) / z) + 'px';
        dropdown.classList.add('show');
        catItem.classList.add('open');
        // Measure the ACTUAL (layout) width now it's visible, then clamp left so
        // the whole dropdown — and every activity — stays on screen (never
        // clipped on the right, e.g. for right-side areas like "Chave na Mão").
        const dw = dropdown.offsetWidth || 320;
        dropdown.style.left = Math.min(Math.max(4, rect.left / z), Math.max(4, vpW - dw - 6)) + 'px';
      }
    });
    // Keep dropdown open when clicking inside it (don't close)
    dropdown.addEventListener('click', (e) => e.stopPropagation());

    filterContainer.appendChild(catItem);
  });

  // Clear-all sectors button — always in DOM, shown/hidden via updateSectorActiveStates
  const clearSectors = document.createElement('button');
  clearSectors.className = 'cat-clear-btn';
  clearSectors.id = 'sectorClearBtn';
  clearSectors.title = 'Limpar áreas de atividade';
  clearSectors.style.display = activeSectors.size > 0 ? '' : 'none';
  clearSectors.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
  clearSectors.addEventListener('click', (e) => {
    e.stopPropagation();
    activeSectors.clear();
    updateSectorActiveStates();
    applyFilters();
  });
  filterContainer.appendChild(clearSectors);

  container.appendChild(filterContainer);

  // Close all dropdowns when clicking outside
  if (!window._sectorDropdownOutsideListener) {
    window._sectorDropdownOutsideListener = true;
    document.addEventListener('click', () => {
      document.querySelectorAll('.cat-dropdown.show').forEach(d => d.classList.remove('show'));
      document.querySelectorAll('.cat-item.open').forEach(d => d.classList.remove('open'));
    });
  }

  refreshLucide();
}

// Lightweight: only swap translated text in the already-rendered sector
// filters. Avoids the full DOM rebuild + listener re-attach that
// renderSectorFilters() does on every language change.
function refreshSectorFilterLabels() {
  const container = document.getElementById('sectorFilters');
  if (!container || !container.children.length) {
    renderSectorFilters();
    return;
  }
  const tr = translations[currentLang] || translations.pt;
  const sg = tr.sectorGroups || {};
  const sc = tr.sectors || {};
  container.querySelectorAll('.cat-item[data-group]').forEach(item => {
    const key = item.dataset.group;
    const group = SECTOR_HIERARCHY[key];
    if (!group) return;
    const label = sg[key] || group.label;
    const labelEl = item.querySelector('.cat-label');
    if (labelEl) labelEl.textContent = label;
    const all = item.querySelector('.cat-dd-all');
    if (all) all.textContent = '☰ ' + label;
  });
  container.querySelectorAll('.cat-dd-head[data-cat]').forEach(h => {
    const cat = h.dataset.cat;
    h.textContent = sg[cat] || h.textContent;
  });
  container.querySelectorAll('.cat-dd-item[data-sector]').forEach(it => {
    const labelEl = it.querySelector('.cat-dd-label');
    if (!labelEl) return;
    const sub = it.dataset.sector;
    if (sc[sub]) labelEl.textContent = sc[sub];
  });
}

// Memoized: only rebuild when the underlying tag set changes, otherwise just
// flip the .active class on existing pills.
let _tagCloudKey = null;
let _tagCloudActive = null;
function renderTagCloud() {
  const container = document.getElementById('tagsCloud');
  if (!container) return;
  const allTags = [...new Set(companies.flatMap(c => c.tags))].sort();
  const key = allTags.join('|');
  if (key === _tagCloudKey) {
    if (activeTag !== _tagCloudActive) {
      container.querySelectorAll('.tag-pill').forEach(p => {
        p.classList.toggle('active', p.textContent === activeTag);
      });
      _tagCloudActive = activeTag;
    }
    return;
  }
  _tagCloudKey = key;
  _tagCloudActive = activeTag;
  container.innerHTML = '';
  allTags.forEach(tag => {
    const span = document.createElement('span');
    span.className   = 'tag-pill' + (activeTag === tag ? ' active' : '');
    span.textContent = tag;
    span.addEventListener('click', () => toggleTagFilter(tag));
    container.appendChild(span);
  });
}

// Lightweight in-place update of sector button + dropdown item states
// Called on every toggle so the DOM is never rebuilt (no blink)
function updateSectorActiveStates() {
  // Update each top-level cat-item active class
  document.querySelectorAll('.cat-item[data-group]').forEach(catItem => {
    const group = SECTOR_HIERARCHY[catItem.dataset.group];
    if (!group) return;
    const allSubKeys = [];
    Object.values(group.categories).forEach(cat => Object.keys(cat.subcategories).forEach(k => allSubKeys.push(k)));
    catItem.classList.toggle('active', allSubKeys.some(k => activeSectors.has(k)));
  });
  // Update each dropdown item's active class
  document.querySelectorAll('.cat-dd-item[data-sector]').forEach(item => {
    item.classList.toggle('active', activeSectors.has(item.dataset.sector));
  });
  // Master "Todas as áreas": checked only while EVERY activity is selected.
  // This used to be computed only when the bar was rebuilt, so the clear-all ✕
  // (and deselecting an individual activity) left a stale ✓ on the button.
  const master = document.querySelector('.cat-item-master');
  if (master) {
    const allKeys = [];
    Object.values(SECTOR_HIERARCHY).forEach(g =>
      Object.values(g.categories).forEach(cat =>
        Object.keys(cat.subcategories).forEach(k => allKeys.push(k))));
    const allSel = allKeys.length > 0 && allKeys.every(k => activeSectors.has(k));
    master.classList.toggle('active', allSel);
    master.title = allSel ? t('sectorAllDeselectAll') : t('sectorAllSelectAll');
    const check = master.querySelector('.cat-icon');
    if (allSel && !check) master.insertAdjacentHTML('afterbegin', '<span class="cat-icon" style="line-height:1">✓</span>');
    else if (!allSel && check) check.remove();
  }
  // Show/hide clear-all button
  const clearBtn = document.getElementById('sectorClearBtn');
  if (clearBtn) clearBtn.style.display = activeSectors.size > 0 ? '' : 'none';
  // Keep mobile chip bar in sync
  if (document.getElementById('mspChipBar')) mspUpdateChips();
}

function toggleSector(sector) {
  if (activeSectors.has(sector)) activeSectors.delete(sector);
  else activeSectors.add(sector);
  updateSectorActiveStates();
  applyFilters();
}

function toggleTagFilter(tag) {
  activeTag = (activeTag === tag) ? null : tag;
  renderTagCloud();
  applyFilters();
}

// ── Mobile filter chip bar + bottom sheet ─────────────────────────────────────
const _mspEmojis = {
  'estrutura_fundacao':'🏗️','instalacoes':'⚡','acabamentos':'🎨',
  'carpintaria':'🪚','serralharia_metal':'🔩','exterior_jardim':'🌿',
  'projeto_gestao':'📐','chave_na_mao':'🔑'
};

let _mspActiveSheet = null;

function mspOpenSheet(type) {
  if (_mspActiveSheet === type) { mspCloseSheet(); return; }
  _mspActiveSheet = type;
  const backdrop = document.getElementById('mspBackdrop');
  const sheet    = document.getElementById('mspSheet');
  const title    = document.getElementById('mspSheetTitleText');
  const body     = document.getElementById('mspSheetBody');
  if (!sheet) return;

  const tr = translations[currentLang] || translations.pt;
  const sg = tr.sectorGroups || {};
  const sc = tr.sectors || {};

  // Mark chip as open
  document.querySelectorAll('.msp-chip').forEach(c => c.classList.remove('open'));
  const chipId = {area:'mspChipArea',sort:'mspChipSort',rating:'mspChipRating',status:'mspChipStatus',radius:'mspChipRadius',location:'mspChipLocation'}[type];
  if (chipId) document.getElementById(chipId)?.classList.add('open');

  if (type === 'area') {
    title.textContent = 'Áreas de Atividade';
    let html = '<div class="msp-sheet-row">';
    Object.entries(SECTOR_HIERARCHY).forEach(([groupKey, group]) => {
      const allSubKeys = [];
      Object.values(group.categories).forEach(cat =>
        Object.keys(cat.subcategories).forEach(k => allSubKeys.push(k)));
      const isActive = allSubKeys.some(k => activeSectors.has(k));
      html += `<button class="msp-sheet-btn${isActive?' active':''}" data-group="${groupKey}"
        onclick="mspToggleSector('${groupKey}');mspRefreshAreaSheet()">
        ${_mspEmojis[groupKey]||'📦'} ${sg[groupKey]||group.label}
      </button>`;
    });
    html += '</div>';
    // Sub-activities for active groups
    Object.entries(SECTOR_HIERARCHY).forEach(([groupKey, group]) => {
      const allSubKeys = [];
      Object.values(group.categories).forEach(cat =>
        Object.keys(cat.subcategories).forEach(k => allSubKeys.push(k)));
      if (!allSubKeys.some(k => activeSectors.has(k))) return;
      html += `<div class="msp-sheet-section-label">${_mspEmojis[groupKey]||''} ${sg[groupKey]||group.label}</div>`;
      Object.values(group.categories).forEach(cat => {
        Object.entries(cat.subcategories).forEach(([subKey, subLabel]) => {
          const checked = activeSectors.has(subKey) ? 'checked' : '';
          html += `<label class="msp-sub-item">
            <input type="checkbox" ${checked}
              onchange="mspOnSubToggle('${subKey}','${groupKey}')">
            ${sc[subKey]||subLabel}
          </label>`;
        });
      });
    });
    body.innerHTML = html;

  } else if (type === 'sort') {
    title.textContent = 'Ordenar Por';
    const current = (() => {
      if (document.getElementById('sortRating')?.checked) return 'rating';
      if (document.getElementById('sortReviews')?.checked) return 'reviews';
      if (document.getElementById('sortName')?.checked) return 'name';
      return 'all';
    })();
    const opts = [
      {val:'all',    label:'Todos'},
      {val:'rating', label:'Melhor Avaliação'},
      {val:'reviews',label:'💬 Mais Avaliados'},
      {val:'name',   label:'A–Z'},
    ];
    body.innerHTML = `<div class="msp-sheet-row">${opts.map(o =>
      `<button class="msp-sheet-btn${o.val===current?' active':''}" data-sort="${o.val}"
        onclick="mspSetSort('${o.val}');mspCloseSheet()">${o.label}</button>`
    ).join('')}</div>`;

  } else if (type === 'rating') {
    title.textContent = 'Avaliação Mínima';
    const current = parseFloat([...document.querySelectorAll('input[name="minRating"]')]
      .find(r => r.checked)?.value || '0');
    const opts = [
      {val:0,   label:'Qualquer'},
      {val:4.0, label:'★★★★☆ 4.0+'},
      {val:4.5, label:'★★★★☆ 4.5+'},
      {val:4.8, label:'★★★★★ 4.8+'},
      {val:5.0, label:'★★★★★ 5.0'},
    ];
    body.innerHTML = `<div class="msp-sheet-row">${opts.map(o =>
      `<button class="msp-sheet-btn${o.val===current?' active':''}" data-rating="${o.val}"
        onclick="mspSetRating(${o.val});mspCloseSheet()">${o.label}</button>`
    ).join('')}</div>`;

  } else if (type === 'status') {
    title.textContent = 'Destaque';
    const topRated = document.getElementById('filterTopRated')?.checked;
    const verified = document.getElementById('filterVerified')?.checked;
    const isNew    = document.getElementById('filterNew')?.checked;
    body.innerHTML = `<div class="msp-sheet-row">
      <button class="msp-sheet-btn${topRated?' active':''}" data-status="topRated"
        onclick="mspToggleStatus('topRated');this.classList.toggle('active')">⭐ Top Rated</button>
      <button class="msp-sheet-btn${verified?' active':''}" data-status="verified"
        onclick="mspToggleStatus('verified');this.classList.toggle('active')">✅ Verificado</button>
      <button class="msp-sheet-btn${isNew?' active':''}" data-status="new"
        onclick="mspToggleStatus('new');this.classList.toggle('active')">🆕 Novo</button>
    </div>`;

  } else if (type === 'radius') {
    title.textContent = 'Raio de Pesquisa';
    const slider = document.getElementById('radiusSlider');
    const currentVal = slider ? parseInt(slider.value) : 50;
    const kmLabels = {0:'5 km',25:'15 km',50:'50 km',75:'165 km',100:'Todo'};
    body.innerHTML = `
      <div style="padding:8px 4px 20px">
        <div style="font-size:28px;font-weight:800;color:var(--text);text-align:center;margin-bottom:6px" id="mspRadiusDisplay">${kmLabels[currentVal]||'50 km'}</div>
        <div style="color:var(--muted);font-size:12px;text-align:center;margin-bottom:20px">Distância máxima ao centro do mapa</div>
        <input type="range" class="radius-slider" min="0" max="100" step="25" value="${currentVal}"
          oninput="mspRadiusInput(this.value)" onchange="mspRadiusApply(this.value)"/>
        <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;color:var(--muted);margin-top:10px;padding:0 2px">
          <span>5 km</span><span>15 km</span><span>50 km</span><span>165 km</span><span>Todo</span>
        </div>
      </div>`;

  } else if (type === 'location') {
    title.textContent = 'A Minha Localização';
    const hasLoc = !!window._locationObtained;
    body.innerHTML = `
      <div style="text-align:center;padding:12px 4px 20px">
        <div style="font-size:44px;margin-bottom:12px">${hasLoc ? '📍' : '📡'}</div>
        <div style="font-weight:700;font-size:15px;color:var(--text);margin-bottom:6px">${hasLoc ? 'Localização ativa' : 'Localização não ativada'}</div>
        <div style="font-size:13px;color:var(--muted);margin-bottom:20px;line-height:1.5">${hasLoc ? 'O mapa está centrado na sua posição atual.' : 'Ative o GPS para centrar o mapa na sua localização e encontrar fornecedores perto de si.'}</div>
        <button onclick="mspRequestLocation()" style="background:var(--primary);color:#fff;border:none;border-radius:10px;padding:13px 28px;font-size:14px;font-weight:700;cursor:pointer;width:100%;font-family:inherit">
          ${hasLoc ? '🔄 Atualizar Localização' : '📍 Ativar GPS'}
        </button>
        ${hasLoc ? `<button onclick="mspClearLocation()" style="background:none;color:var(--muted);border:none;font-size:13px;cursor:pointer;margin-top:14px;font-family:inherit;width:100%">Limpar localização</button>` : ''}
      </div>`;
  }

  if (backdrop) { backdrop.style.display = 'block'; requestAnimationFrame(() => backdrop.classList.add('open')); }
  sheet.classList.add('open');
}

// Per-group active state cache so a checkbox toggle that doesn't transition
// the group's state can skip the full rebuild.
function _mspGroupActiveSet() {
  const s = new Set();
  Object.entries(SECTOR_HIERARCHY).forEach(([groupKey, group]) => {
    Object.values(group.categories).forEach(cat => {
      for (const k of Object.keys(cat.subcategories)) {
        if (activeSectors.has(k)) { s.add(groupKey); return; }
      }
    });
  });
  return s;
}

// Called from inline checkbox onchange — does only the work that's needed.
function mspOnSubToggle(subKey, groupKey) {
  const before = _mspGroupActiveSet();
  if (activeSectors.has(subKey)) activeSectors.delete(subKey); else activeSectors.add(subKey);
  const after = _mspGroupActiveSet();
  updateSectorActiveStates();
  applyFilters();
  mspUpdateChips();
  // Fast path: if this group's active state didn't transition (still has /
  // still empty), the only thing that changed is one checkbox — already in
  // the right state from the user's click. No rebuild needed.
  if (before.has(groupKey) === after.has(groupKey)) {
    const btn = document.querySelector(`#mspSheetBody .msp-sheet-btn[data-group="${groupKey}"]`);
    if (btn) btn.classList.toggle('active', after.has(groupKey));
    return;
  }
  mspRefreshAreaSheet();
}

function mspRefreshAreaSheet() {
  // Re-render just the area sheet body in place (keeps sheet open)
  if (_mspActiveSheet !== 'area') return;
  mspUpdateChips();
  const body = document.getElementById('mspSheetBody');
  if (!body) return;
  const tr = translations[currentLang] || translations.pt;
  const sg = tr.sectorGroups || {};
  const sc = tr.sectors || {};
  let html = '<div class="msp-sheet-row">';
  Object.entries(SECTOR_HIERARCHY).forEach(([groupKey, group]) => {
    const allSubKeys = [];
    Object.values(group.categories).forEach(cat =>
      Object.keys(cat.subcategories).forEach(k => allSubKeys.push(k)));
    const isActive = allSubKeys.some(k => activeSectors.has(k));
    html += `<button class="msp-sheet-btn${isActive?' active':''}" data-group="${groupKey}"
      onclick="mspToggleSector('${groupKey}');mspRefreshAreaSheet()">
      ${_mspEmojis[groupKey]||'📦'} ${sg[groupKey]||group.label}
    </button>`;
  });
  html += '</div>';
  Object.entries(SECTOR_HIERARCHY).forEach(([groupKey, group]) => {
    const allSubKeys = [];
    Object.values(group.categories).forEach(cat =>
      Object.keys(cat.subcategories).forEach(k => allSubKeys.push(k)));
    if (!allSubKeys.some(k => activeSectors.has(k))) return;
    html += `<div class="msp-sheet-section-label">${_mspEmojis[groupKey]||''} ${sg[groupKey]||group.label}</div>`;
    Object.values(group.categories).forEach(cat => {
      Object.entries(cat.subcategories).forEach(([subKey, subLabel]) => {
        const checked = activeSectors.has(subKey) ? 'checked' : '';
        html += `<label class="msp-sub-item">
          <input type="checkbox" ${checked}
            onchange="mspOnSubToggle('${subKey}','${groupKey}')">
          ${sc[subKey]||subLabel}
        </label>`;
      });
    });
  });
  body.innerHTML = html;
}

function mspCloseSheet() {
  _mspActiveSheet = null;
  const backdrop = document.getElementById('mspBackdrop');
  const sheet    = document.getElementById('mspSheet');
  document.querySelectorAll('.msp-chip').forEach(c => c.classList.remove('open'));
  sheet?.classList.remove('open');
  if (backdrop) {
    backdrop.classList.remove('open');
    setTimeout(() => { backdrop.style.display = 'none'; }, 240);
  }
}

function mspUpdateChips() {
  // Area chip
  const areaActive = activeSectors.size > 0;
  const areaChip = document.getElementById('mspChipArea');
  const areaLabel = document.getElementById('mspChipAreaLabel');
  if (areaChip) areaChip.classList.toggle('active', areaActive);
  if (areaLabel) areaLabel.textContent = areaActive ? `Área (${activeSectors.size})` : 'Área';

  // Sort chip
  const sortChip  = document.getElementById('mspChipSort');
  const sortLabel = document.getElementById('mspChipSortLabel');
  let sortVal = 'Ordenar';
  if (document.getElementById('sortRating')?.checked)  sortVal = 'Melhor Avaliação';
  if (document.getElementById('sortReviews')?.checked) sortVal = 'Mais Avaliados';
  if (document.getElementById('sortName')?.checked)    sortVal = 'A–Z';
  const sortActive = sortVal !== 'Ordenar';
  if (sortChip)  sortChip.classList.toggle('active', sortActive);
  if (sortLabel) sortLabel.textContent = sortVal;

  // Rating chip
  const ratingChip  = document.getElementById('mspChipRating');
  const ratingLabel = document.getElementById('mspChipRatingLabel');
  const ratingVal = parseFloat([...document.querySelectorAll('input[name="minRating"]')].find(r=>r.checked)?.value||'0');
  const ratingActive = ratingVal > 0;
  if (ratingChip)  ratingChip.classList.toggle('active', ratingActive);
  if (ratingLabel) ratingLabel.textContent = ratingActive ? `★ ${ratingVal}+` : 'Avaliação';

  // Status chip
  const statusChip  = document.getElementById('mspChipStatus');
  const statusLabel = document.getElementById('mspChipStatusLabel');
  const statusCount = [
    document.getElementById('filterTopRated')?.checked,
    document.getElementById('filterVerified')?.checked,
    document.getElementById('filterNew')?.checked
  ].filter(Boolean).length;
  if (statusChip)  statusChip.classList.toggle('active', statusCount > 0);
  if (statusLabel) statusLabel.textContent = statusCount > 0 ? `Destaque (${statusCount})` : 'Destaque';

  // Radius chip
  const radiusChip  = document.getElementById('mspChipRadius');
  const radiusLabel = document.getElementById('mspChipRadiusLabel');
  const slider = document.getElementById('radiusSlider');
  if (radiusChip && radiusLabel && slider) {
    const km = sliderToKm ? sliderToKm(slider.value) : null;
    const radiusActive = parseInt(slider.value) < 100;
    radiusChip.classList.toggle('active', radiusActive);
    radiusLabel.textContent = radiusActive && km ? `Raio ${km} km` : 'Raio';
  }

  // Location chip
  const locChip  = document.getElementById('mspChipLocation');
  const locLabel = document.getElementById('mspChipLocationLabel');
  if (locChip && locLabel) {
    const hasLoc = !!window._locationObtained;
    locChip.classList.toggle('active', hasLoc);
    locLabel.textContent = hasLoc ? '📍 Localizado' : 'Localização';
  }

  // Clear button
  const clearBtn = document.getElementById('mspChipClear');
  const anyActive = areaActive || sortActive || ratingActive || statusCount > 0;
  if (clearBtn) clearBtn.style.display = anyActive ? '' : 'none';
}

function mspClearAll() {
  activeSectors.clear();
  ['sortAll'].forEach(id => { const el = document.getElementById(id); if(el) el.checked = true; });
  document.querySelectorAll('input[name="minRating"]').forEach(r => r.checked = (parseFloat(r.value)===0));
  ['filterTopRated','filterVerified','filterNew'].forEach(id => { const el = document.getElementById(id); if(el) el.checked = false; });
  updateSectorActiveStates();
  applyFilters();
  mspUpdateChips();
  mspCloseSheet();
}

// ── Mobile radius helpers ─────────────────────────────────────────────────────
function mspRadiusInput(val) {
  const labels = {0:'5 km',25:'15 km',50:'50 km',75:'165 km',100:'Todo'};
  const display = document.getElementById('mspRadiusDisplay');
  if (display) display.textContent = labels[val] || val + ' km';
}

function mspRadiusApply(val) {
  // Sync the desktop radius slider
  const desktopSlider = document.getElementById('radiusSlider');
  if (desktopSlider) {
    desktopSlider.value = val;
    if (typeof updateRadius === 'function') updateRadius(val);
    if (typeof applyFilters === 'function') applyFilters();
  }
  mspUpdateChips();
}

// ── Mobile location helpers ───────────────────────────────────────────────────
function mspRequestLocation() {
  mspCloseSheet();
  if (typeof detectUserLocation === 'function') {
    detectUserLocation(false);
    // Refresh chip state after a short delay to pick up the result
    setTimeout(mspUpdateChips, 4000);
  }
}

function mspClearLocation() {
  window._locationObtained = false;
  mspUpdateChips();
  mspCloseSheet();
  if (map && typeof PORTUGAL_CENTER !== 'undefined') map.setView(PORTUGAL_CENTER, 7);
}

// Renamed stubs kept for backwards-compat (called from updateSectorActiveStates)
function renderMobileSearchPanel() { mspUpdateChips(); }

function mspToggleSector(groupKey) {
  const group = SECTOR_HIERARCHY[groupKey];
  if (!group) return;
  const allSubKeys = [];
  Object.values(group.categories).forEach(cat =>
    Object.keys(cat.subcategories).forEach(k => allSubKeys.push(k)));
  const allSelected = allSubKeys.every(k => activeSectors.has(k));
  if (allSelected) allSubKeys.forEach(k => activeSectors.delete(k));
  else             allSubKeys.forEach(k => activeSectors.add(k));
  updateSectorActiveStates();
  applyFilters();
  mspUpdateChips();
}

function mspSetSort(value) {
  const map = { all:'sortAll', rating:'sortRating', reviews:'sortReviews', name:'sortName' };
  const radio = document.getElementById(map[value]);
  if (radio) radio.checked = true;
  applyFilters();
  mspUpdateChips();
}

function mspSetRating(value) {
  document.querySelectorAll('input[name="minRating"]').forEach(r => {
    r.checked = parseFloat(r.value) === value;
  });
  applyFilters();
  mspUpdateChips();
}

function mspToggleStatus(statusKey) {
  const idMap = { topRated:'filterTopRated', verified:'filterVerified', new:'filterNew' };
  const checkbox = document.getElementById(idMap[statusKey]);
  if (checkbox) checkbox.checked = !checkbox.checked;
  applyFilters();
  mspUpdateChips();
}

// ── Mobile filter panel: sector grid + sub-activities ─────────────────────────
const _sectorEmojis = {
  'estrutura_fundacao':'🏗️','instalacoes':'⚡','acabamentos':'🎨',
  'carpintaria':'🪚','serralharia_metal':'🔩','exterior_jardim':'🌿',
  'projeto_gestao':'📐','chave_na_mao':'🔑'
};

function renderMobileFilterPanel() {
  const grid = document.getElementById('mobileSectorGrid');
  const subs = document.getElementById('mobileSubActivities');
  if (!grid || !subs) return;

  const tr = translations[currentLang] || translations.pt;
  const sg = tr.sectorGroups || {};
  const sc = tr.sectors || {};

  // ── Sector group buttons ──
  grid.innerHTML = '';
  Object.entries(SECTOR_HIERARCHY).forEach(([groupKey, group]) => {
    const allSubKeys = [];
    Object.values(group.categories).forEach(cat =>
      Object.keys(cat.subcategories).forEach(k => allSubKeys.push(k)));
    const isActive = allSubKeys.some(k => activeSectors.has(k));

    const btn = document.createElement('button');
    btn.className = 'mobile-sector-btn' + (isActive ? ' active' : '');
    btn.dataset.group = groupKey;
    const label = sg[groupKey] || group.label;
    btn.innerHTML = `<span class="msb-emoji">${_sectorEmojis[groupKey] || '📦'}</span><span class="msb-label">${label}</span>`;

    btn.addEventListener('click', () => {
      const allSelected = allSubKeys.every(k => activeSectors.has(k));
      if (allSelected) { allSubKeys.forEach(k => activeSectors.delete(k)); }
      else             { allSubKeys.forEach(k => activeSectors.add(k)); }
      renderMobileFilterPanel();
      updateSectorActiveStates();
      applyFilters();
    });
    grid.appendChild(btn);
  });

  // ── Sub-activities for active sectors ──
  subs.innerHTML = '';
  Object.entries(SECTOR_HIERARCHY).forEach(([groupKey, group]) => {
    const allSubKeys = [];
    Object.values(group.categories).forEach(cat =>
      Object.keys(cat.subcategories).forEach(k => allSubKeys.push(k)));
    if (!allSubKeys.some(k => activeSectors.has(k))) return; // group not active

    const label = sg[groupKey] || group.label;
    const section = document.createElement('div');
    section.className = 'mobile-sub-section';

    let html = `<div class="mobile-sub-title">${_sectorEmojis[groupKey] || ''} ${label}</div>`;
    Object.values(group.categories).forEach(cat => {
      Object.entries(cat.subcategories).forEach(([subKey, subLabel]) => {
        const checked = activeSectors.has(subKey) ? 'checked' : '';
        const tLabel = sc[subKey] || subLabel;
        html += `<label class="mobile-sub-item">
          <input type="checkbox" ${checked} onchange="
            if(this.checked) activeSectors.add('${subKey}');
            else activeSectors.delete('${subKey}');
            renderMobileFilterPanel();updateSectorActiveStates();applyFilters();">
          <span>${tLabel}</span>
        </label>`;
      });
    });
    section.innerHTML = html;
    subs.appendChild(section);
  });
}

// ── FILTER LOGIC ──────────────────────────────────────────────────────────────
// Calculate distance between two coordinates (Haversine formula) - returns km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ── FUZZY SEARCH ──────────────────────────────────────────────────────────────
function levenshtein(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const row = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i-1] === b[j-1] ? row[j-1] : 1 + Math.min(row[j-1], row[j], prev);
      row[j-1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

function fuzzyMatchToken(needle, haystack) {
  if (haystack.includes(needle)) return true;
  // Adaptive tolerance: 0 for short words, 1 for medium, 2 for long
  const threshold = needle.length <= 3 ? 0 : needle.length <= 6 ? 1 : 2;
  const words = haystack.split(/[\s,\/\-\.]+/);
  for (const word of words) {
    if (word.length < 2) continue;
    if (Math.abs(word.length - needle.length) > threshold + 1) continue;
    if (levenshtein(needle, word) <= threshold) return true;
  }
  return false;
}

// Unified search: detects if input is a city/location or a keyword/company name
function handleUnifiedSearch(val) {
  if (!val || !val.trim()) { _keywordFilter = ''; applyFilters(); return; }
  val = val.trim();
  // Known Portuguese city patterns — geocode the location, do NOT use as keyword filter
  const cityPatterns = /portugal|lisboa|porto|braga|faro|coimbra|aveiro|leiria|viseu|setúbal|setubal|évora|evora|arouca|guimarães|guimaraes|funchal|sintra|cascais|almada|amadora|vila nova|santarém|santarem|beja|castelo branco|viana|bragança|braganca|guarda|portalegre/i;
  if (cityPatterns.test(val) || /,\s*(pt|portugal)/i.test(val)) {
    geocodeLocation(val);
    _keywordFilter = '';  // location, not keyword
  } else {
    _keywordFilter = val;  // actual keyword search
  }
  applyFilters();
}

// Explicit search (Enter / search button). Smarter than the live oninput handler:
// if the term matches a loaded company/activity, keep it as a keyword filter and
// leave the map where it is; otherwise treat it as a PLACE — geocode it (restricted
// to Portugal so results are accurate) and recenter the map. This is what makes the
// box actually centre on any location typed, not just a hardcoded city list.
function submitUnifiedSearch(val) {
  if (!val || !val.trim()) { _keywordFilter = ''; applyFilters(); return; }
  val = val.trim();
  const companyMatch = (typeof companies !== 'undefined' ? companies : []).some(c => {
    try { return fuzzySearch(val, c); } catch (_) { return false; }
  });
  if (companyMatch) { _keywordFilter = val; applyFilters(); return; }
  fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=pt&q=${encodeURIComponent(val)}`)
    .then(r => r.json())
    .then(data => {
      if (data && data.length > 0) {
        const p = data[0], lat = parseFloat(p.lat), lng = parseFloat(p.lon);
        const zoom = (p.type === 'amenity' || p.type === 'building') ? 16 :
                     p.type === 'village' ? 13 : p.type === 'town' ? 12 :
                     p.type === 'city' ? 11 : p.type === 'county' ? 10 : 12;
        if (typeof map !== 'undefined' && map) map.setView([lat, lng], zoom, { animate: true });
        currentMapCenter = [lat, lng];
        if (typeof invalidateDistanceCache === 'function') invalidateDistanceCache();
        if (typeof radiusCircle !== 'undefined' && radiusCircle) radiusCircle.setLatLng([lat, lng]);
        _keywordFilter = '';
        showToast(`${(p.display_name || val).split(',')[0]}`);
      } else {
        _keywordFilter = val; // not a place → keyword filter
        showToast(t('toastPlaceNotFound'));
      }
      applyFilters();
    })
    .catch(() => { _keywordFilter = val; applyFilters(); });
}
window.submitUnifiedSearch = submitUnifiedSearch;

function fuzzySearch(kw, company) {
  // Use pre-computed _searchIndex (built at load time) to avoid repeated string join
  const hay = company._searchIndex || [company.name, company.cae, ...(company.tags || [])].join(' ').toLowerCase();
  const tokens = kw.toLowerCase().split(/\s+/).filter(t => t.length > 0);
  return tokens.every(token => fuzzyMatchToken(token, hay));
}

// ── DISTANCE CACHE ────────────────────────────────────────────────────────────
// Avoids recomputing Haversine for every company when the map center hasn't moved
let _distCacheCenter = null; // {lat, lng} string key
let _distCache = {};         // company id → km

function _getCachedDistance(centerLat, centerLng, c) {
  const cacheKey = `${centerLat.toFixed(5)},${centerLng.toFixed(5)}`;
  if (_distCacheCenter !== cacheKey) {
    _distCache = {};
    _distCacheCenter = cacheKey;
  }
  if (_distCache[c.id] === undefined) {
    _distCache[c.id] = calculateDistance(centerLat, centerLng, c.lat, c.lng);
  }
  return _distCache[c.id];
}

// Call this when the map center moves to invalidate the distance cache
function invalidateDistanceCache() { _distCacheCenter = null; _distCache = {}; }

function getFiltered() {
  const searchRadius = getRadiusKm();
  // Checkbox: ignore the radius entirely → show companies everywhere (country/world).
  const ignoreRadius = document.getElementById('ignoreRadius')?.checked;
  // "Todo o país" (radius at max) → ignore distance and scope to the user's current country instead.
  const isAllCountry = searchRadius >= 99999;
  const userCountry = (window._userCountry || '').toLowerCase();
  const cc = radiusCircle ? radiusCircle.getLatLng() : { lat: currentMapCenter[0], lng: currentMapCenter[1] };

  const ratingEl  = document.querySelector('input[name="minRating"]:checked');
  const minRating = ratingEl ? parseFloat(ratingEl.value) : 0;
  const filterTopRated = document.getElementById('filterTopRated')?.checked;
  const filterVerified = document.getElementById('filterVerified')?.checked;
  const filterNew      = document.getElementById('filterNew')?.checked;
  const kw = _keywordFilter || '';
  const sort = document.querySelector('input[name="sort"]:checked')?.value || 'all';
  const hasSectorFilter = activeSectors.size > 0;

  // Sem área selecionada = "Todas as áreas": o mapa mostra TODAS as empresas
  // por defeito (pedido do dono); os filtros só estreitam quando o utilizador
  // os aplica. O clustering do Leaflet mantém a performance com o catálogo todo.

  // Single-pass filter (no intermediate array copies)
  const res = [];
  for (let i = 0; i < companies.length; i++) {
    const c = companies[i];
    // Sector — only applied when the user has selected at least one sector
    if (hasSectorFilter && !activeSectors.has(c.sector) && !(c.sectors && c.sectors.some(s => activeSectors.has(s)))) continue;
    // Radius (cached Haversine) — skipped entirely when "ignore radius" is on.
    // "Todo o país" (slider at max) shows EVERY company. It used to scope to the
    // visitor's own country, which zeroed out results for anyone browsing from
    // abroad (all companies are PT) — real user feedback: "seleciono o mapa
    // inteiro e todas as especialidades e não encontra empresas".
    if (!ignoreRadius && !isAllCountry) {
      if (_getCachedDistance(cc.lat, cc.lng, c) > searchRadius) continue;
    }
    // Rating
    if (minRating > 0 && c.rating < minRating) continue;
    // Checkboxes
    if (filterTopRated && !c.topRated) continue;
    if (filterVerified && c.verified !== true) continue;
    if (filterNew && c.isNew !== true) continue;
    // Tag
    if (activeTag && !(c.tags && c.tags.includes(activeTag))) continue;
    // Keyword (uses pre-built _searchIndex)
    if (kw && !fuzzySearch(kw, c)) continue;
    // Sort pre-filter
    if (sort === 'rating' && c.rating < 4) continue;
    if (sort === 'reviews' && (c.reviews || 0) < 100) continue;
    res.push(c);
  }

  // Sort only when something will actually consume the order. The marker
  // cluster groups spatially, so it ignores order entirely. The list view
  // is the only consumer that relies on it — skip the sort when it's hidden.
  const listEl = document.getElementById('searchListView');
  const listVisible = listEl && listEl.style.display !== 'none';
  if (listVisible) {
    // Destacadas primeiro em qualquer ordenação (colocação paga); dentro de
    // cada grupo aplica-se o critério escolhido pelo utilizador
    const featFirst = (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (sort === 'rating') res.sort((a,b) => featFirst(a,b) || b.rating - a.rating);
    else if (sort === 'reviews') res.sort((a,b) => featFirst(a,b) || (b.reviews||0) - (a.reviews||0));
    else if (sort === 'name') {
      const cmp = _nameCollator.compare;
      res.sort((a,b) => featFirst(a,b) || cmp(a.name, b.name));
    }
    else res.sort((a,b) => featFirst(a,b) || b.rating - a.rating);
  }

  return res;
}

// ── DEBOUNCED applyFilters ─────────────────────────────────────────────────────
// All filter UI calls go through here — rapid changes (slider, typing) are
// coalesced into a single run 150 ms after the last event, eliminating jank.
let _afTimer = null;
function applyFilters() {
  clearTimeout(_afTimer);
  _afTimer = setTimeout(_runApplyFilters, 150);
}
// Call .now() when an immediate run is needed (init, clear-all, language change)
applyFilters.now = function() { clearTimeout(_afTimer); _runApplyFilters(); };

function _runApplyFilters() {
  const filtered = getFiltered();
  // The company open in the detail panel always keeps its pin, even when the
  // active filters wouldn't include it (e.g. arriving from the home "mais bem
  // avaliadas" cards with no area selected — the map used to zoom to nothing).
  let markerList = filtered;
  if (selectedId != null) {
    const sel = companies.find(x => x.id === selectedId);
    if (sel && !filtered.includes(sel)) markerList = filtered.concat(sel);
  }
  updateMarkers(markerList);
  try { renderNearbyPanel(filtered); } catch (_) {}
  document.getElementById('countNum').textContent = filtered.length;
  // Show/hide the empty-state map hint
  const hint = document.getElementById('mapEmptyHint');
  const hintText = document.getElementById('mapEmptyHintText');
  if (hint && hintText) {
    if (filtered.length > 0) {
      hint.classList.add('hidden');
    } else {
      hint.classList.remove('hidden');
      // No sectors picked → guide the user to choose one rather than offering
      // to widen the radius (which won't help).
      if (activeSectors.size === 0) {
        hintText.innerHTML =
          '<strong>' + t('emptySectorTitle') + '</strong><br>' +
          '<span>' + t('emptySectorSub') + '</span>';
      } else {
        // If the only thing pruning results is the radius, suggest expanding it.
        const slider = document.getElementById('radiusSlider');
        const sliderVal = parseInt(slider?.value || 100, 10);
        const km = (typeof sliderToKm === 'function') ? sliderToKm(sliderVal) : sliderVal;
        const showRadiusActions = sliderVal < 100; // not already "all of Portugal"
        let html = t('mapHintNoResults') + '<br><span>' + t('mapHintNoResultsSub') + '</span>';
        if (showRadiusActions) {
          // Aim for ~2x the current radius and a "all country" fallback.
          // Translate that target km back into a slider value (inverse of sliderToKm).
          const wantKm = Math.min(600, km * 2);
          const wantSlider = wantKm >= 600 ? 100 : Math.round(100 * Math.log(wantKm / 5) / Math.log(120));
          html += `<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
            <button onclick="_expandRadiusTo(${wantSlider})" class="lp-see-all-cta" style="padding:13px 22px;font-size:16px">📍 Aumentar para ${wantKm} km</button>
            <button onclick="_expandRadiusTo(100)" class="lp-see-all-cta" style="padding:13px 22px;font-size:16px;background:transparent;color:#fff;border:1px solid var(--primary);box-shadow:none">Todo o país</button>
          </div>`;
        }
        hintText.innerHTML = html;
      }
    }
  }
  // Filter badge count — single-pass DOM read, then arithmetic on locals
  const clearBtn = document.getElementById('ubClearBtn');
  const filterBadge = document.getElementById('filterBadge');
  {
    const fTop = document.getElementById('filterTopRated');
    const fVer = document.getElementById('filterVerified');
    const fNew = document.getElementById('filterNew');
    const rAny = document.getElementById('ratingAny');
    const rSld = document.getElementById('radiusSlider');
    let filterCount = activeSectors.size;
    if (activeTag) filterCount++;
    if (fTop && fTop.checked) filterCount++;
    if (fVer && fVer.checked) filterCount++;
    if (fNew && fNew.checked) filterCount++;
    if (rAny && !rAny.checked) filterCount++;
    if (_keywordFilter !== '') filterCount++;
    if (rSld && parseInt(rSld.value, 10) < 100) filterCount++;
    const hasFilters = filterCount > 0;
    if (clearBtn) clearBtn.dataset.active = hasFilters ? 'true' : 'false';
    if (filterBadge) {
      filterBadge.textContent = filterCount;
      filterBadge.style.display = hasFilters ? '' : 'none';
    }
  }
  // Result count label + list view (pass filtered so list doesn't re-compute)
  const countEl = document.getElementById('viewResultCount');
  if (countEl) countEl.textContent = filtered.length + ' ' + t(filtered.length === 1 ? 'resultCompany' : 'resultCompanies');
  // Mobile results-sheet peek count
  const sheetCount = document.getElementById('mapSheetCount');
  if (sheetCount) sheetCount.textContent = filtered.length;
  // Footer trust counter — reflects total loaded companies (not the filtered set)
  const _tc = document.getElementById('trustCompanyCount');
  if (_tc) _tc.textContent = companies.length;
  // Keep the visible list fresh: on mobile the sheet's list is always mounted
  // (just translated off-screen when collapsed), so re-render whenever filters
  // change; on desktop only re-render when the list view is actually showing.
  if (_isMobileSheet() || document.getElementById('searchListView')?.style.display !== 'none') renderSearchList(filtered);
}

// ── MARKER DIFF UPDATE ─────────────────────────────────────────────────────────
// Only add/remove the markers that actually changed instead of clearLayers+addLayers
let _visibleMarkerIds = new Set();
function updateMarkers(filtered) {
  const newIds = new Set(filtered.map(c => c.id));
  const cluster = markerClusterGroup;
  if (cluster) {
    const toAdd    = filtered.filter(c => !_visibleMarkerIds.has(c.id) && markerMap[c.id]).map(c => markerMap[c.id]);
    const toRemove = [];
    _visibleMarkerIds.forEach(id => { if (!newIds.has(id) && markerMap[id]) toRemove.push(markerMap[id]); });
    if (toRemove.length) cluster.removeLayers(toRemove);
    if (toAdd.length)    cluster.addLayers(toAdd);
  } else {
    filtered.forEach(c => {
      if (markerMap[c.id] && !map.hasLayer(markerMap[c.id])) markerMap[c.id].addTo(map);
    });
    _visibleMarkerIds.forEach(id => {
      if (!newIds.has(id) && markerMap[id] && map.hasLayer(markerMap[id])) map.removeLayer(markerMap[id]);
    });
  }
  _visibleMarkerIds = newIds;
}

function clearAllFilters() {
  activeSectors.clear();
  activeTag = null;
  _keywordFilter = '';
  document.querySelectorAll('#sectorFilters input[type=checkbox]').forEach(cb => cb.checked = false);
  document.getElementById('filterTopRated').checked = false;
  document.getElementById('filterVerified').checked = false;
  document.getElementById('filterNew').checked      = false;
  document.getElementById('ratingAny').checked      = true;
  const _uniInput = document.getElementById('searchUnified'); if(_uniInput) _uniInput.value = '';
  document.getElementById('sortAll').checked         = true;
  document.getElementById('radiusSlider').value     = 100;   // "Todo o país" (novo defeito)
  const _ir = document.getElementById('ignoreRadius');
  if (_ir && _ir.checked) { _ir.checked = false; toggleIgnoreRadius(); }
  updateRadius(100);
  renderTagCloud();
  applyFilters.now();
  showToast(t('toastFiltersCleared'));
}

// ── MAP / LIST VIEW TOGGLE ──────────────────────────────────────────────────
function setSearchView(mode) {
  const mapEl = document.getElementById('map');
  const listEl = document.getElementById('searchListView');
  const btnMap = document.getElementById('btnViewMap');
  const btnList = document.getElementById('btnViewList');
  const hints = document.querySelectorAll('.map-empty-hint,.map-info-box,.btn-my-location,.mobile-filter-btn');
  // Mobile: the list is a draggable bottom-sheet over the map (never hide the map).
  // All the legacy callers — list-card taps, "Pedir Orçamento", etc. — funnel
  // through here, so on phones 'map' just collapses the sheet and 'list' opens it.
  if (window.matchMedia('(max-width:768px)').matches) {
    if (mode === 'list') openResultsSheet(); else closeResultsSheet();
    return;
  }
  if (mode === 'list') {
    if (mapEl) mapEl.style.display = 'none';
    if (listEl) listEl.style.display = 'grid';
    btnMap?.classList.remove('active');
    btnList?.classList.add('active');
    hints.forEach(h => h.style.visibility = 'hidden');
    renderSearchList();
  } else {
    if (mapEl) mapEl.style.display = 'block';
    if (listEl) listEl.style.display = 'none';
    btnMap?.classList.add('active');
    btnList?.classList.remove('active');
    hints.forEach(h => h.style.visibility = '');
    if (typeof map !== 'undefined' && map) setTimeout(() => map.invalidateSize(), 100);
  }
}

// ── Mobile results bottom-sheet ────────────────────────────────────────────────
// The sheet peeks at the bottom of the map showing the result count; dragging the
// handle up (or tapping it) reveals the scrollable list. Desktop is untouched —
// these run only on phones.
let _resultsSheetOpen = false;
function _isMobileSheet() { return window.matchMedia('(max-width:768px)').matches; }
function openResultsSheet() {
  const panel = document.querySelector('.map-panel');
  if (!panel) return;
  panel.classList.add('sheet-open');
  _resultsSheetOpen = true;
  _updateSheetCta();
  renderSearchList();   // populate with the current filtered results
  if (typeof map !== 'undefined' && map) setTimeout(() => map.invalidateSize(), 360);
}
function closeResultsSheet() {
  const panel = document.querySelector('.map-panel');
  if (!panel) return;
  panel.classList.remove('sheet-open');
  _resultsSheetOpen = false;
  _updateSheetCta();
  if (typeof map !== 'undefined' && map) setTimeout(() => map.invalidateSize(), 360);
}
function toggleResultsSheet() { _resultsSheetOpen ? closeResultsSheet() : openResultsSheet(); }
function _updateSheetCta() {
  const cta = document.getElementById('mapSheetCta');
  if (cta) cta.textContent = _resultsSheetOpen ? (t('viewMap') || 'Mapa') : (t('viewList') || 'Ver lista');
}
// Scroll to + flash a card when its map pin is tapped (sheet open). Returns
// false if the card isn't currently in the DOM so the caller can fall back.
function _highlightSheetCard(id) {
  const card = document.querySelector(`.search-list-card[data-company-id="${id}"]`);
  if (!card) return false;
  card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  card.classList.remove('slc-flash');
  void card.offsetWidth;            // restart the animation if re-tapped
  card.classList.add('slc-flash');
  setTimeout(() => card.classList.remove('slc-flash'), 1600);
  return true;
}
// Drag + tap handling on the sheet handle (pointer events cover touch + mouse).
function _initResultsSheetDrag() {
  const handle = document.getElementById('mapSheetHandle');
  const sheet  = document.getElementById('mapSheet');
  if (!handle || !sheet) return;
  let dragging = false, startY = 0, moved = 0, peek = 76, sheetH = 0;
  handle.addEventListener('pointerdown', (e) => {
    if (!_isMobileSheet()) return;
    dragging = true; moved = 0;
    startY = e.clientY;
    sheetH = sheet.getBoundingClientRect().height;
    sheet.style.transition = 'none';
    try { handle.setPointerCapture(e.pointerId); } catch (_) {}
  });
  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    moved = e.clientY - startY;                       // +down / -up
    const base = _resultsSheetOpen ? 0 : (sheetH - peek);
    let ty = Math.max(0, Math.min(sheetH - peek, base + moved));
    sheet.style.transform = `translateY(${ty}px)`;
    if (e.cancelable) e.preventDefault();
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    sheet.style.transition = '';
    sheet.style.transform = '';                        // hand back to the CSS class
    if (Math.abs(moved) < 8) toggleResultsSheet();      // treat as a tap
    else if (moved < 0) openResultsSheet();
    else closeResultsSheet();
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
}
if (document.readyState !== 'loading') _initResultsSheetDrag();
else document.addEventListener('DOMContentLoaded', _initResultsSheetDrag);

const _LIST_PAGE = 40; // cards rendered per batch
let _listRenderedCount = 0;
let _listCurrentData = [];

function renderSearchList(filtered) {
  const listEl = document.getElementById('searchListView');
  if (!listEl) return;
  // Accept pre-computed results or compute fresh (e.g. direct call from list-view toggle)
  const data = filtered !== undefined ? filtered : getFiltered();
  _listCurrentData = data;
  _listRenderedCount = 0;

  if (data.length === 0) {
    // Mirror the expand-radius CTAs from the map empty hint, so the list
    // view also gives the user a way out when their filters are too tight.
    const slider = document.getElementById('radiusSlider');
    const sliderVal = parseInt(slider?.value || 100, 10);
    const km = (typeof sliderToKm === 'function') ? sliderToKm(sliderVal) : sliderVal;
    const showActions = sliderVal < 100;
    let actionsHtml = '';
    if (showActions) {
      const wantKm = Math.min(600, km * 2);
      const wantSlider = wantKm >= 600 ? 100 : Math.round(100 * Math.log(wantKm / 5) / Math.log(120));
      actionsHtml = `<div style="margin-top:18px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
        <button onclick="_expandRadiusTo(${wantSlider})" class="lp-see-all-cta" style="padding:13px 22px;font-size:16px">📍 Aumentar para ${wantKm} km</button>
        <button onclick="_expandRadiusTo(100)" class="lp-see-all-cta" style="padding:13px 22px;font-size:16px;background:transparent;color:#fff;border:1px solid var(--primary);box-shadow:none">Todo o país</button>
      </div>`;
    }
    listEl.innerHTML = '<div class="empty-state" style="grid-column:1/-1">' +
      '<div class="empty-state-ico">🐝</div>' +
      '<div class="empty-state-title">' + t('searchListEmpty') + '</div>' +
      '<div class="empty-state-text">' + t('searchListEmptySub') + '</div>' +
      actionsHtml +
      '</div>';
    return;
  }

  // Render first batch synchronously, append more on scroll
  const frag = document.createDocumentFragment();
  _appendListCards(frag, data, 0, Math.min(_LIST_PAGE, data.length));
  _listRenderedCount = Math.min(_LIST_PAGE, data.length);
  listEl.innerHTML = '';
  listEl.appendChild(frag);

  // Sentinel element for IntersectionObserver-based infinite scroll
  if (_listRenderedCount < data.length) {
    const sentinel = document.createElement('div');
    sentinel.id = 'slcSentinel';
    sentinel.style.cssText = 'height:1px;grid-column:1/-1';
    listEl.appendChild(sentinel);
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      const start = _listRenderedCount;
      const end   = Math.min(start + _LIST_PAGE, _listCurrentData.length);
      const f = document.createDocumentFragment();
      _appendListCards(f, _listCurrentData, start, end);
      _listRenderedCount = end;
      // Remove old sentinel, append new cards, add new sentinel if more remain
      sentinel.remove();
      listEl.appendChild(f);
      if (_listRenderedCount < _listCurrentData.length) {
        const next = sentinel.cloneNode();
        next.id = 'slcSentinel';
        listEl.appendChild(next);
        // Observe the new sentinel next tick so layout is settled
        requestAnimationFrame(() => obs.observe(next));
      }
    }, { rootMargin: '200px' });
    obs.observe(sentinel);
  }
}

function _appendListCards(frag, data, start, end) {
  const tr = translations[currentLang] || translations.pt;
  for (let i = start; i < end; i++) {
    const c = data[i];
    const sectorLabel = (tr.sectors && tr.sectors[c.sector]) || c.sector || '';
    const stars = c.rating > 0 ? '★'.repeat(Math.round(c.rating)) + ` ${c.rating.toFixed(1)}` : `<span class="badge-new">${t('newOnHivex')}</span>`;
    const tags = (c.tags || []).slice(0, 3).map(tag => `<span class="slc-tag">${tag}</span>`).join('');
    const phoneFrag = c.phone ? `<a class="slc-phone" href="tel:${c.phone}" onclick="event.stopPropagation()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>${c.phone}</a>` : '';
    const div = document.createElement('div');
    div.className = 'search-list-card';
    div.dataset.companyId = c.id;
    div.onclick = () => { setSearchView('map'); setTimeout(() => openDetail(c.id), 300); };
    const isCompared = _compareIds && _compareIds.has(c.id);
    const isFav = _favIds && _favIds.has(c.id);
    // Photo banner (shown on mobile only, hidden on desktop via CSS) — makes the
    // card photo-led like Idealista. Image resolves from the company's sector.
    const photo = companyPhoto(c);
    const ratingPill = c.rating > 0
      ? `★ ${c.rating.toFixed(1)}${c.reviews ? ` (${c.reviews})` : ''}`
      : t('noRatingText');
    const photoBadge = c.verified
      ? '<span class="slc-photo-badge slc-badge-verified">✓ Verificado</span>'
      : (c.topRated ? '<span class="slc-photo-badge slc-badge-top">★ Top</span>' : '');
    div.innerHTML = `<div class="slc-photo" aria-hidden="true">
        <img src="${photo}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.style.display='none'"/>
        <div class="slc-photo-grad"></div>
        ${photoBadge}
        <span class="slc-photo-rating">${ratingPill}</span>
      </div>
      <button class="slc-fav ${isFav ? 'is-fav' : ''}" onclick="event.stopPropagation();toggleFavourite(${c.id})" aria-label="Guardar favorito" title="Guardar favorito">${isFav ? '★' : '☆'}</button>
      <label class="slc-compare" onclick="event.stopPropagation()" title="Adicionar à comparação">
        <input type="checkbox" ${isCompared ? 'checked' : ''} onchange="toggleCompare(${c.id})"/>
        <span>Comparar</span>
      </label>
      <div class="slc-header">
        ${c.logo ? `<div class="slc-emoji" style="background:url('${c.logo}') center/cover no-repeat"></div>` : `<div class="slc-emoji logo-mono">${companyMonogram(c)}</div>`}
        <div class="slc-info">
          <div class="slc-name">${c.name}</div>
          <div class="slc-sector-badge"><span style="width:8px;height:8px;border-radius:50%;background:${c.color};display:inline-block;flex-shrink:0"></span>${sectorLabel}</div>
        </div>
        <div class="slc-rating">${stars}</div>
      </div>
      <div class="slc-address">${c.city || c.address || 'Portugal'}</div>
      ${tags ? `<div class="slc-tags">${tags}</div>` : ''}
      <div class="slc-footer">
        ${phoneFrag}
        <button class="btn-slc-contact" onclick="event.stopPropagation();setSearchView('map');setTimeout(()=>{openDetail(${c.id});},300)" data-i18n="btnRequestQuote">Pedir Orçamento</button>
      </div>`;
    frag.appendChild(div);
  }
}

// ── NEARBY COMPANIES PANEL (right side of the map, desktop) ───────────────────
// Scrollable list of the filtered companies ordered by distance to the user's
// location (blue "you are here" marker) or, failing that, the searched location
// (radius circle centre) / map centre. Re-rendered on every filter run.
const _NEARBY_PAGE = 25;
let _nearbyData = [];
let _nearbyRendered = 0;
let _nearbyObs = null;

function _nearbyRefPoint() {
  // Priority: real user location → searched location (radius circle) → map centre
  if (typeof userLocationMarker !== 'undefined' && userLocationMarker) {
    try { const ll = userLocationMarker.getLatLng(); return [ll.lat, ll.lng]; } catch (_) {}
  }
  if (typeof radiusCircle !== 'undefined' && radiusCircle) {
    try { const ll = radiusCircle.getLatLng(); return [ll.lat, ll.lng]; } catch (_) {}
  }
  return currentMapCenter;
}

function renderNearbyPanel(filtered) {
  const listEl = document.getElementById('nearbyList');
  const countEl = document.getElementById('nearbyCount');
  const panel = document.getElementById('nearbyPanel');
  if (!listEl || !panel) return;
  // Skip work when the panel is hidden by layout (mobile/tablet bottom sheet,
  // or the map tab is inactive). Our own empty-state display:none must NOT be
  // treated as "layout-hidden", otherwise a later re-show would be blocked.
  const hiddenByLayout = getComputedStyle(panel).display === 'none' && panel.style.display !== 'none';
  if (hiddenByLayout) return;

  if (_nearbyObs) { _nearbyObs.disconnect(); _nearbyObs = null; }

  // The panel only appears when at least one company is on the map; otherwise
  // hide the whole section (no empty-state placeholder).
  if (!filtered.length) {
    panel.style.display = 'none';
    _nearbyData = []; _nearbyRendered = 0;
    if (countEl) countEl.textContent = 0;
    return;
  }
  panel.style.display = '';   // restore the CSS default (flex) when populated

  if (countEl) countEl.textContent = filtered.length;

  const [refLat, refLng] = _nearbyRefPoint();
  // Sort a copy — never mutate the caller's array (markers use it).
  // Destacadas (colocação paga) primeiro, mesmo que fiquem mais longe —
  // mas só as que já passaram o raio/filtros; depois, por proximidade.
  _nearbyData = filtered.map(c => ({ c, d: calculateDistance(refLat, refLng, c.lat, c.lng) }))
                        .sort((a, b) => ((b.c.featured ? 1 : 0) - (a.c.featured ? 1 : 0)) || a.d - b.d);
  listEl.innerHTML = '';
  _nearbyRendered = 0;
  _appendNearbyCards(listEl, Math.min(_NEARBY_PAGE, _nearbyData.length));

  // Infinite scroll within the panel
  if (_nearbyRendered < _nearbyData.length) {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'height:1px;flex-shrink:0';
    listEl.appendChild(sentinel);
    _nearbyObs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      _appendNearbyCards(listEl, Math.min(_nearbyRendered + _NEARBY_PAGE, _nearbyData.length), sentinel);
      if (_nearbyRendered >= _nearbyData.length) { _nearbyObs.disconnect(); _nearbyObs = null; sentinel.remove(); }
    }, { root: listEl, rootMargin: '300px' });
    _nearbyObs.observe(sentinel);
  }
}

// Open/closed right now, on the Europe/Lisbon clock regardless of the
// visitor's timezone. Companies without their own schedule (c.opening_hours,
// JSON keyed by weekday 0-6 with [h1,m1,h2,m2] windows) fall back to the
// sector norm for PT construction trades: weekdays 08:00-18:00.
const _DEFAULT_HOURS = { 1:[[8,0,18,0]], 2:[[8,0,18,0]], 3:[[8,0,18,0]], 4:[[8,0,18,0]], 5:[[8,0,18,0]], 6:null, 0:null };
function _openStatus(c) {
  let sched = _DEFAULT_HOURS;
  if (c && c.opening_hours) {
    try {
      const p = typeof c.opening_hours === 'string' ? JSON.parse(c.opening_hours) : c.opening_hours;
      if (p && typeof p === 'object') sched = p;
    } catch (_) {}
  }
  let dow, mins;
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const get = ty => (parts.find(p => p.type === ty) || {}).value;
    dow = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 }[get('weekday')];
    mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
  } catch (_) { const d = new Date(); dow = d.getDay(); mins = d.getHours() * 60 + d.getMinutes(); }
  const windows = sched[dow];
  if (!Array.isArray(windows)) return false;
  return windows.some(w => Array.isArray(w) && w.length >= 4 &&
    mins >= w[0] * 60 + w[1] && mins < w[2] * 60 + w[3]);
}

function _openBadgeHtml(c) {
  const open = _openStatus(c);
  return `<span class="nc-open ${open ? 'is-open' : 'is-closed'}">● ${open ? t('openNow') : t('closedNow')}</span>`;
}

function _appendNearbyCards(listEl, upTo, sentinel) {
  const tr = translations[currentLang] || translations.pt;
  const sc = tr.sectors || {};
  const frag = document.createDocumentFragment();
  for (let i = _nearbyRendered; i < upTo; i++) {
    const { c, d } = _nearbyData[i];
    const distStr = d < 10 ? d.toFixed(1).replace('.', ',') + ' km' : Math.round(d) + ' km';
    const sectorLabel = sc[c.sector] || c.sector || '';
    const rating = c.rating > 0
      ? `<span class="nc-stars">${'★'.repeat(Math.round(c.rating))}</span> <strong>${c.rating.toFixed(1)}</strong> <span class="nc-reviews">(${c.reviews || 0})</span>`
      : `<span class="badge-new">${t('newOnHivex')}</span>`;
    const logo = c.logo
      ? `<div class="nc-logo" style="background:url('${c.logo}') center/cover no-repeat"></div>`
      : `<div class="nc-logo logo-mono">${companyMonogram(c)}</div>`;
    const div = document.createElement('div');
    div.className = 'nearby-card';
    div.dataset.companyId = c.id;
    div.onclick = () => openDetail(c.id);
    div.innerHTML = `
      <div class="nc-top">
        ${logo}
        <div class="nc-main">
          <div class="nc-name">${escHtml(c.name)}${c.verified ? ' <span class="badge-verified" title="Empresa verificada">✓ Verificada</span>' : ''}</div>
          <div class="nc-sector"><span class="nc-dot" style="background:${c.color}"></span>${escHtml(sectorLabel)}</div>
        </div>
        <div class="nc-side">${c.featured ? '<span class="nc-feat-badge">★ ' + escHtml(t('featuredBadge')) + '</span>' : ''}<span class="nc-dist">${distStr}</span>${_openBadgeHtml(c)}</div>
      </div>
      <div class="nc-rating">${rating}</div>
      ${c.address || c.city ? `<div class="nc-address">${escHtml(c.address || c.city)}</div>` : ''}
      <label class="nc-compare" onclick="event.stopPropagation()" title="Adicionar à comparação">
        <input type="checkbox" ${_compareIds.has(Number(c.id)) ? 'checked' : ''} onchange="toggleCompare(${c.id})"/>
        <span>Comparar</span>
      </label>`;
    frag.appendChild(div);
  }
  if (sentinel) listEl.insertBefore(frag, sentinel); else listEl.appendChild(frag);
  _nearbyRendered = upTo;
}
window.renderNearbyPanel = renderNearbyPanel;

// ── REGISTER COMPANY ──────────────────────────────────────────────────────────
function openRegister() {
  // The ACCOUNT email must be confirmed before registering a company (user
  // feedback). Only block when the flag is explicitly false — sessions from
  // before this feature lack the field, and the server re-checks anyway.
  try {
    const meV = JSON.parse(localStorage.getItem('hive_user') || 'null');
    if (meV && meV.email_verified === false && !window._editingCompanyId) {
      apiFetch('/auth/send-verify', { method: 'POST', body: {} }).catch(() => {});
      openVerifyModal('user', meV.email,
        'Para registar uma empresa, confirme primeiro o email da sua conta. Enviámos um código para ' + meV.email + '.',
        () => openRegister());
      return;
    }
  } catch (_) {}
  document.getElementById('registerOverlay').classList.add('open');
  try { clearRegLogo(); } catch (_) {}   // start with a blank logo (edit flow re-applies after)

  // Initialize dropdowns
  renderRegisterSectorSelect();
  renderRegisterCountrySelect();
  renderRegisterCitySelect('pt');
  renderRegisterZoneSelect('Lisboa');

  // Setup event listeners (remove old ones first to avoid duplication)
  const countrySelect = document.getElementById('regCountry');
  const citySelect = document.getElementById('regCity');

  if (countrySelect) {
    // Clone to remove old event listeners
    const newCountrySelect = countrySelect.cloneNode(true);
    countrySelect.parentNode.replaceChild(newCountrySelect, countrySelect);

    newCountrySelect.addEventListener('change', function() {
      const selectedCountry = this.value;
      renderRegisterCitySelect(selectedCountry);
      renderRegisterZoneSelect(''); // Reset localities when country changes
    });
  }

  // Update city select reference after potential replacement
  const updatedCitySelect = document.getElementById('regCity');
  if (updatedCitySelect) {
    const newCitySelect = updatedCitySelect.cloneNode(true);
    updatedCitySelect.parentNode.replaceChild(newCitySelect, updatedCitySelect);

    newCitySelect.addEventListener('change', function() {
      const selectedCity = this.value;
      renderRegisterZoneSelect(selectedCity); // Update localities based on city
    });
  }
}

function closeRegister() { document.getElementById('registerOverlay').classList.remove('open'); regGoStep(1); }
function closeRegisterIfBg(e) { if (e.target === document.getElementById('registerOverlay')) closeRegister(); }

// ── Multi-select sector state ─────────────────────────────────────────────────
let _regSelectedSectors = [];

function renderRegisterSectorSelect() {
  const panel = document.getElementById('regSectorPanel');
  if (!panel) return;
  const tr = translations[currentLang];
  let html = '';
  Object.entries(SECTOR_HIERARCHY).forEach(([gk, group]) => {
    html += `<div class="reg-ms-group">${group.label}</div>`;
    Object.values(group.categories).forEach(cat => {
      Object.entries(cat.subcategories).forEach(([sk, sl]) => {
        const label = (tr.sectorOptions && tr.sectorOptions[sk]) || sl;
        const checked = _regSelectedSectors.includes(sk);
        html += `<label class="reg-ms-item${checked ? ' checked' : ''}">
          <input type="checkbox" value="${sk}" ${checked ? 'checked' : ''}
                 onchange="regSectorToggle('${sk}', this.checked, this.closest('.reg-ms-item'))"/>
          ${label}
        </label>`;
      });
    });
  });
  panel.innerHTML = html;
  _updateRegSectorTrigger();
}

function toggleRegSectorPanel() {
  const wrap = document.getElementById('regSectorWrap');
  if (wrap) wrap.classList.toggle('open');
}

function regSectorToggle(sk, checked, itemEl) {
  if (checked) {
    if (!_regSelectedSectors.includes(sk)) _regSelectedSectors.push(sk);
  } else {
    _regSelectedSectors = _regSelectedSectors.filter(s => s !== sk);
  }
  if (itemEl) itemEl.classList.toggle('checked', checked);
  _updateRegSectorTrigger();
}

function _updateRegSectorTrigger() {
  const el = document.getElementById('regSectorText');
  if (!el) return;
  const tr = translations[currentLang];
  if (_regSelectedSectors.length === 0) {
    el.textContent = tr.regSectorPh || 'Selecionar áreas de atividade...';
    el.classList.remove('has-value');
  } else {
    const labels = _regSelectedSectors.map(sk => {
      for (const group of Object.values(SECTOR_HIERARCHY)) {
        for (const cat of Object.values(group.categories)) {
          for (const [k, v] of Object.entries(cat.subcategories)) {
            if (k === sk) return (tr.sectorOptions && tr.sectorOptions[sk]) || v;
          }
        }
      }
      return sk;
    });
    el.textContent = labels.join(', ');
    el.classList.add('has-value');
  }
}

// Close multi-select when clicking outside
document.addEventListener('click', (e) => {
  const wrap = document.getElementById('regSectorWrap');
  if (wrap && !wrap.contains(e.target)) wrap.classList.remove('open');
});

function renderRegisterCountrySelect() {
  const sel = document.getElementById('regCountry');
  if (!sel) return;
  // Country select already has options from HTML
  sel.addEventListener('change', function() {
    renderRegisterCitySelect(this.value);
  });
}

function renderRegisterCitySelect(country) {
  const sel = document.getElementById('regCity');
  if (!sel) return;

  const cities = CITIES_BY_COUNTRY[country] || ['Selecione um país primeiro'];
  sel.innerHTML = '<option value="">Selecione uma cidade</option>' +
    cities.map(c => `<option value="${c}">${c}</option>`).join('');
}

// Portuguese NIF (Número de Identificação Fiscal) checksum check — mirrors
// the backend so we catch typos before submitting. 9 digits, mod-11 checksum.
function isValidPortugueseNIF(input) {
  if (input == null) return false;
  const nif = String(input).replace(/\s+/g, '');
  if (!/^\d{9}$/.test(nif)) return false;
  if (!'123568945'.includes(nif[0])) return false;
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += parseInt(nif[i], 10) * (9 - i);
  const remainder = sum % 11;
  const check = remainder < 2 ? 0 : 11 - remainder;
  return check === parseInt(nif[8], 10);
}

// Real-time NIF duplicate check — warns the user before they fill the whole form.
async function checkNifAvailability() {
  const el = document.getElementById('regNif');
  if (!el) return;
  const nif = (el.value || '').replace(/\s+/g, '');
  // Only check well-formed, checksum-valid NIFs; format errors are caught at submit.
  if (!/^\d{9}$/.test(nif) || !isValidPortugueseNIF(nif)) return;
  try {
    const r = await apiFetch('/companies/check-nif?nif=' + encodeURIComponent(nif));
    if (r && r.exists) markFieldError('regNif', 'Esta empresa (NIF) já está registada na Hivex.');
    else clearFieldError('regNif');
  } catch (_) { /* not logged in / offline — the submit-time check still applies */ }
}

function submitRegister() {
  const name    = document.getElementById('regName').value.trim();
  const sectors = _regSelectedSectors.slice(); // multi-select values
  const sector  = sectors[0] || '';            // primary sector (backward compat)
  const nif     = (document.getElementById('regNif')?.value || '').replace(/\s+/g, '');
  const cae     = document.getElementById('regCae').value.trim();
  const address = document.getElementById('regAddress').value.trim();
  const country = document.getElementById('regCountry').value;
  const city    = document.getElementById('regCity').value;
  const postalCode = document.getElementById('regPostalCode').value.trim();
  const email   = document.getElementById('regEmail').value.trim();
  const phone   = document.getElementById('regPhone').value.trim();
  const tagsRaw = document.getElementById('regTags').value.trim();
  const alvara  = document.getElementById('regAlvara')?.value.trim() || '';
  const certidao = (document.getElementById('regCertidao')?.value || '').trim();
  const foundedYearRaw = document.getElementById('regFoundedYear')?.value.trim() || '';
  const foundedYear    = foundedYearRaw ? parseInt(foundedYearRaw, 10) : null;
  const businessHours  = document.getElementById('regBusinessHours')?.value.trim() || '';
  const portfolioRaw   = document.getElementById('regPortfolioImages')?.value.trim() || '';
  const portfolioImgs  = portfolioRaw
    ? portfolioRaw.split(',').map(s => s.trim()).filter(s => /^https?:\/\//.test(s)).slice(0, 12)
    : [];

  // Clear any stale field errors on the registration overlay before re-checking
  if (typeof clearAllFieldErrors === 'function') clearAllFieldErrors(document.getElementById('registerOverlay'));

  if (!name)           { failField('regName',       t('valName'));    return; }
  if (sectors.length === 0) { showToast(t('valSector'));  return; }
  // NIF is mandatory for PT companies and must pass the checksum.
  const ccLower = (document.getElementById('regCountry').value || 'pt').toLowerCase();
  if (ccLower === 'pt') {
    if (!nif) { failField('regNif', 'Introduza o NIF da empresa.'); return; }
    if (!isValidPortugueseNIF(nif)) { failField('regNif', 'NIF inválido. Verifique os 9 dígitos.'); return; }
  }
  if (!certidao)       { failField('regCertidao',   t('valCertidao')); return; }
  if (certidao.replace(/[\s-]/g, '').length < 8) { failField('regCertidao', t('valCertidaoFormat')); return; }
  if (!country)        { failField('regCountry',    'Selecione um país'); return; }
  if (!city)           { failField('regCity',       'Selecione uma cidade'); return; }
  if (!postalCode)     { failField('regPostalCode', 'Introduza o código postal'); return; }
  if (!address)        { failField('regAddress',    t('valAddress')); return; }
  if (!email)          { failField('regEmail',      t('valEmail'));   return; }
  if (!phone)          { failField('regPhone',      'Introduza o número de telemóvel da empresa'); return; }

  // Especialidades: closed vocabulary. The free-text field invited invented
  // terms and duplicated step 1 (user feedback) — derive the tags from the
  // selected activity areas' PT labels instead. Edits of older companies keep
  // whatever tags they already had (the hidden field is pre-filled then).
  const ptSectors = (translations.pt && translations.pt.sectors) || {};
  const tags = tagsRaw
    ? tagsRaw.split(',').map(s => s.trim()).filter(Boolean)
    : sectors.map(s => ptSectors[s] || s).slice(0, 8);

  // The company's contact email is confirmed separately when it differs from
  // the (already verified) account email — send a code, collect it in the
  // verify modal, then resume this submit with the code attached.
  try {
    const meU = JSON.parse(localStorage.getItem('hive_user') || 'null');
    const differs = meU && meU.email &&
      email.toLowerCase() !== String(meU.email).toLowerCase();
    if (!window._editingCompanyId && differs && !window._companyEmailCode && !(meU && meU.is_admin)) {
      apiFetch('/companies/send-email-code', { method: 'POST', body: { email } })
        .then(() => openVerifyModal('company', email,
          'O email da empresa (' + email + ') é diferente do da sua conta. Enviámos-lhe um código de confirmação — introduza-o para continuar o registo.',
          () => submitRegister()))
        .catch(e => showToast(e.message || 'Não foi possível enviar o código de confirmação.'));
      return;
    }
  } catch (_) {}
  const idx    = nextCompanyId % defaultEmojis.length;
  const tr     = translations[currentLang];
  const zone   = document.getElementById('regZone').value;
  const defaultCoords = zoneCoords[zone] || LISBON;

  // GEOCODING STRATEGY (precise → coarse). Constrain every query to Portugal
  // (countrycodes=pt) + validate the result falls inside PT bounds — that's what
  // prevents Nominatim from drifting to e.g. Italy, WITHOUT sacrificing street
  // precision. We try the full street address FIRST so two companies in the same
  // city land on their real addresses (not a shared city centroid).
  const fullAddress = `${address}, ${postalCode}, ${city}, ${country}`;
  // Bounds cover mainland + Madeira + Azores.
  const _inPT = (la, lo) => la >= 32.0 && la <= 42.3 && lo >= -31.6 && lo <= -6.0;
  const _geo = (q) =>
    fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=pt&q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(d => {
        if (d && d.length) {
          const la = parseFloat(d[0].lat), lo = parseFloat(d[0].lon);
          if (_inPT(la, lo)) return { lat: la, lng: lo };
        }
        return null;
      })
      .catch(() => null);

  (async () => {
    let result =
      await _geo(fullAddress) ||                                  // 1) precise street address
      await _geo(`${address}, ${city}, ${country}`) ||            // 2) street + city (no postcode)
      await _geo(`${postalCode}, ${city}, ${country}`) ||         // 3) postcode + city
      await _geo(`${postalCode}, ${country}`);                    // 4) postcode only
    if (!result) {
      // 5) last resort: city centroid + small jitter (~200m) so multiple
      //    companies in the same town don't stack on one pixel.
      const base = LOCALITY_COORDS[city] || zoneCoords[zone] || LISBON;
      result = { lat: base[0] + (Math.random() - 0.5) * 0.004, lng: base[1] + (Math.random() - 0.5) * 0.004 };
    }
    processRegistration(result.lat, result.lng);
  })().catch(e => {
    console.error('Geocoding error:', e);
    showToast(t('toastLocationError'));
  });

  async function processRegistration(lat, lng) {
    const website     = document.getElementById('regWebsite')?.value?.trim() || '';
    const facebook    = document.getElementById('regFacebook')?.value?.trim()  || '';
    const instagram   = document.getElementById('regInstagram')?.value?.trim() || '';
    const linkedin    = document.getElementById('regLinkedin')?.value?.trim()  || '';
    const description = document.getElementById('regDesc')?.value?.trim()    || '';

    const newCompany = {
      id:          nextCompanyId++,
      name,
      nif:         nif || '',
      cae:         cae || '',
      alvara:      alvara || '',
      certidao_permanente: certidao,
      founded_year:     foundedYear,
      business_hours:   businessHours,
      portfolio_images: portfolioImgs,
      sector,
      sectors,
      rating:      0, reviews: 0,
      topRated:    false, verified: false, isNew: true,
      tags,
      email, phone, website, facebook, instagram, linkedin, description,
      logo:        _regLogoData || '',
      color:       defaultColors[idx],
      emoji:       defaultEmojis[idx],
      pinType:     'std',
      lat, lng,
      address:     fullAddress,
      postalCode, city, country, zone,
    };

    // Show a saving indicator
    const submitBtn = document.querySelector('#registerOverlay .btn-submit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'A guardar...'; }

    try {
      const editId = window._editingCompanyId;
      if (editId) {
        // PUT — update existing company
        await api.updateCompany(editId, {
          name, sectors, sector: sectors[0] || '', nif: nif || null,
          cae: cae || null,
          alvara: alvara || null, certidao_permanente: certidao || null,
          address, postal_code: postalCode, city, country,
          lat, lng,  // re-geocoded from the (possibly edited) address — repositions the pin
          email, phone, website: website || null,
          facebook: facebook || null, instagram: instagram || null, linkedin: linkedin || null,
          logo: _regLogoData, // '' = remover; data URL = substituir (null manteria a existente)
          tags, description: document.getElementById('regDesc')?.value.trim() || null,
          founded_year:     foundedYear,
          business_hours:   businessHours || null,
          portfolio_images: portfolioImgs,
        });
        // Refresh local companies list + move the marker to the new position
        const idx2 = companies.findIndex(x => x.id === editId);
        if (idx2 >= 0) {
          Object.assign(companies[idx2], { name, sectors, sector: sectors[0] || '', nif, cae, alvara,
            certidao_permanente: certidao,
            address, postal_code: postalCode, city, country, lat, lng, email, phone, website, facebook, instagram, linkedin, tags,
            description: document.getElementById('regDesc')?.value.trim() || '',
            founded_year: foundedYear, business_hours: businessHours, portfolio_images: portfolioImgs });
          // Reposition the existing marker (remove + re-add) so the pin reflects the new coords
          try {
            if (markerMap[editId]) {
              if (markerClusterGroup) markerClusterGroup.removeLayer(markerMap[editId]);
              else if (map && map.hasLayer(markerMap[editId])) map.removeLayer(markerMap[editId]);
              delete markerMap[editId];
              _visibleMarkerIds.delete(editId);
            }
            if (typeof addCompanyMarker === 'function') addCompanyMarker(companies[idx2]);
            if (typeof applyFilters === 'function') applyFilters();  // re-show the marker (visibility owned by filters)
          } catch (_) {}
        }
        window._editingCompanyId = null;
        closeRegister();
        showToast(t('toastCompanyUpdated'));
      } else {
        // POST — new company (auto-approved). Push the persisted record into
        // the in-memory list and add a marker so it appears on the map without
        // a full page reload.
        const saved = await saveCompanyToDB(newCompany);
        if (saved) {
          // New submissions are 'pending' — only show on the map once an admin
          // approves them (status becomes 'approved'). Avoids a ghost marker
          // that vanishes on the next reload.
          if (saved.status === 'approved') {
            saved._searchIndex = [saved.name, saved.cae, ...(saved.tags || [])].join(' ').toLowerCase();
            companies.push(saved);
            if (typeof addCompanyMarker === 'function') addCompanyMarker(saved);
            if (typeof applyFilters === 'function') applyFilters();
          }
          _lastRegisteredCompany = saved;
        } else {
          _lastRegisteredCompany = newCompany;
        }
        // Re-render the avatar menu so the new "Anunciante" badge appears now
        // that the user owns at least one listing.
        if (typeof updateNavAuth === 'function') updateNavAuth();
        document.getElementById('regSuccessName').textContent = name;
        document.getElementById('regSuccessOverlay').classList.add('open');
      }

      // Reset form
      ['regName','regNif','regCae','regAlvara','regCertidao','regAddress','regEmail','regPhone','regWebsite','regTags','regDesc','regPostalCode','regFoundedYear','regBusinessHours','regPortfolioImages']
        .forEach(fid => { const el = document.getElementById(fid); if(el) el.value = ''; });
      _regSelectedSectors = [];
      renderRegisterSectorSelect();
      document.getElementById('regSectorWrap').classList.remove('open');
      document.getElementById('regCountry').value = '';
      document.getElementById('regCity').value    = '';
      closeRegister();
    } catch(e) {
      console.error('Erro ao guardar empresa:', e);
      // Server-side email-verification gates → reopen the right verify modal
      // (covers stale local sessions that bypassed the client-side gates).
      let srvCode = null;
      try { srvCode = JSON.parse(e.body || '{}').code || null; } catch (_) {}
      if (srvCode === 'EMAIL_NOT_VERIFIED') {
        apiFetch('/auth/send-verify', { method: 'POST', body: {} }).catch(() => {});
        openVerifyModal('user', '', 'Confirme o email da sua conta para concluir o registo. Enviámos-lhe um código.', () => submitRegister());
      } else if (srvCode === 'COMPANY_EMAIL_NOT_VERIFIED') {
        window._companyEmailCode = null;
        apiFetch('/companies/send-email-code', { method: 'POST', body: { email } }).catch(() => {});
        openVerifyModal('company', email, 'Confirme o email de contacto da empresa com o código que enviámos para ' + email + '.', () => submitRegister());
      } else {
        // Surface the server's actual message — it's already translated and
        // tells the user *what* is wrong (e.g. "certidão é obrigatório")
        // instead of a useless generic "Erro ao guardar".
        showToast(e.message || t('toastRegisterError'));
      }
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i data-lucide="check-circle"></i> ' + t('regSubmit'); refreshLucide(); }
    }
  }
}

// ── DRIVING DIRECTIONS (OSRM) ─────────────────────────────────────────────────
// Draw a road route from the user's current location to the selected company,
// with distance + ETA — like a "Como chegar" on Google Maps. Uses the free
// public OSRM demo server (no API key).
let _routeLayer = null;

function clearRoute() {
  try { if (_routeLayer) { _routeLayer.remove(); _routeLayer = null; } } catch (_) {}
  const ri = document.getElementById('routeInfo');
  if (ri) ri.hidden = true;
}
window.clearRoute = clearRoute;

function _routeUserLatLng() {
  if (typeof userLocationMarker !== 'undefined' && userLocationMarker) {
    try { const ll = userLocationMarker.getLatLng(); return [ll.lat, ll.lng]; } catch (_) {}
  }
  return null;
}

async function routeToCompany(id) {
  const cid = (id != null) ? id : selectedId;
  const c = companies.find(x => x.id === cid);
  if (!c || c.lat == null || c.lng == null) return;

  // The route lives on the map, so make sure the map view is showing.
  try { setSearchView('map'); } catch (_) {}

  // Origin = the user's GPS position. Reuse it if we already have it, else ask.
  let origin = _routeUserLatLng();
  if (!origin) {
    if (!navigator.geolocation) { showToast(t('toastGeoNotSupported')); return; }
    showToast(t('routeLocating'));
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej,
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 }));
      origin = [pos.coords.latitude, pos.coords.longitude];
      // Drop a lightweight "you are here" marker WITHOUT running the locate
      // flow (detectUserLocation), which narrows the search radius to 50 km and
      // re-filters the map around the user — that would hide every company
      // farther than 50 km. Directions must never change what's on the map.
      try {
        if (map && typeof L !== 'undefined') {
          if (userLocationMarker) { userLocationMarker.remove(); }
          const youIcon = L.divIcon({
            className: '',
            html: '<div style="width:18px;height:18px;background:#2563eb;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.5)"></div>',
            iconSize: [18, 18], iconAnchor: [9, 9],
          });
          userLocationMarker = L.marker(origin, { icon: youIcon, zIndexOffset: 1000 }).addTo(map);
        }
      } catch (_) {}
    } catch (e) { showToast(t('routeNoLocation')); return; }
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/`
      + `${origin[1]},${origin[0]};${c.lng},${c.lat}?overview=full&geometries=geojson`;
    const data = await fetch(url).then(r => r.json());
    if (data.code !== 'Ok' || !data.routes || !data.routes.length) { showToast(t('routeError')); return; }

    const route = data.routes[0];
    const latlngs = route.geometry.coordinates.map(p => [p[1], p[0]]); // GeoJSON [lng,lat] → [lat,lng]

    if (_routeLayer) { _routeLayer.remove(); _routeLayer = null; }
    _routeLayer = L.layerGroup([
      L.polyline(latlngs, { color: '#0b1220', weight: 9, opacity: 0.25 }),   // casing
      L.polyline(latlngs, { color: '#1a73e8', weight: 5, opacity: 0.95 })    // route
    ]).addTo(map);
    try { map.fitBounds(L.latLngBounds(latlngs), { padding: [60, 60], maxZoom: 15 }); } catch (_) {}

    const km = route.distance / 1000;
    const kmStr = (km < 10 ? km.toFixed(1) : Math.round(km)) + ' km';
    const mins = Math.max(1, Math.round(route.duration / 60));
    const timeStr = mins >= 60 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`;

    const ri = document.getElementById('routeInfo');
    if (ri) {
      const dest = document.getElementById('routeInfoDest');
      const dist = document.getElementById('routeInfoDist');
      const time = document.getElementById('routeInfoTime');
      if (dest) dest.textContent = c.name || '';
      if (dist) dist.textContent = kmStr;
      if (time) time.textContent = timeStr;
      ri.hidden = false;
    }
  } catch (e) { showToast(t('routeError')); }
}
window.routeToCompany = routeToCompany;

// Expand/collapse the "Mais informação" (additional info) section in the panel.
function toggleDpMore() {
  const body = document.getElementById('dpMoreInfo');
  const tgl  = document.getElementById('dpMoreToggle');
  if (!body) return;
  const willOpen = body.hidden;
  body.hidden = !willOpen;
  if (tgl) { tgl.classList.toggle('open', willOpen); tgl.setAttribute('aria-expanded', String(willOpen)); }
  try { refreshLucide(); } catch (_) {}
}
window.toggleDpMore = toggleDpMore;

// ── DETAIL PANEL ──────────────────────────────────────────────────────────────
async function openDetail(id) {
  const c  = companies.find(x => x.id === id);
  if (!c) return;
  selectedId = id;
  // Guarantee this company's pin is on the map right away (deep links / home
  // cards land here before any area filter is active — see _runApplyFilters).
  try {
    if (map && !markerMap[id]) {
      addCompanyMarker(c);   // covers markers not built yet (deep-link races)
      applyFilters.now();
    }
  } catch (_) {}
  try { clearRoute(); } catch (_) {}   // clear any route from a previously opened company
  // Collapse the "additional information" section for each newly opened company.
  try {
    const _more = document.getElementById('dpMoreInfo');
    const _mt = document.getElementById('dpMoreToggle');
    if (_more) _more.hidden = true;
    if (_mt) { _mt.classList.remove('open'); _mt.setAttribute('aria-expanded', 'false'); }
  } catch (_) {}

  // Sync URL ?company=<id> so the panel is shareable + browser-back works.
  // _suppressCompanyHistory is flipped by the popstate listener and the
  // initial-load handler so we don't double-push.
  if (!window._suppressCompanyHistory) {
    try {
      const url = new URL(window.location.href);
      if (String(url.searchParams.get('company')) !== String(id)) {
        url.searchParams.set('company', String(id));
        history.pushState({ company: Number(id) }, '', url.toString());
      }
    } catch (_) {}
  }

  // Paint immediately from the cached list data so the panel feels instant,
  // then fetch the authoritative record — full detail fields, any edits, and
  // credentials gated for this viewer — and re-render.
  _renderDetailPanel(c);
  try { _sizeDetailPanel(); } catch (_) {}
  document.getElementById('detailPanel').classList.add('open');
  if (map) map.flyTo([c.lat, c.lng], 15, { animate: true, duration: 1.2 });
  setTimeout(() => markerMap[c.id]?.openPopup(), 1300);

  try {
    const fresh = await api.getCompany(id);
    if (fresh && String(fresh.id) === String(id) && selectedId === id) {
      const merged = dbRowToCompany(fresh);
      // Keep any sectors/tags the dedup step merged in from duplicate records.
      merged.sectors = Array.from(new Set([...(c.sectors || []), ...(merged.sectors || [])]));
      merged.tags    = Array.from(new Set([...(c.tags || []), ...(merged.tags || [])]));
      Object.assign(c, merged);
      if (selectedId === id) _renderDetailPanel(c);
    }
  } catch (_) { /* keep the cached render */ }
}

/* Alinha a largura do painel de detalhe com o painel que fica por baixo
   (Empresas Destacadas no Início; Empresas Próximas no Mapa) para as bordas
   coincidirem. O painel tem zoom:.7 e o body zoom fluido (--z), por isso as
   medidas visuais convertem-se em px de CSS dividindo por (z × .7). As
   larguras entram como variáveis CSS para não partir a animação de deslize. */
function _sizeDetailPanel() {
  const panel = document.getElementById('detailPanel');
  if (!panel) return;
  const clear = () => { panel.style.removeProperty('--dp-w'); panel.style.removeProperty('--dp-right'); };
  if (window.innerWidth <= 1023) { clear(); return; }
  const homeEl = document.getElementById('tab-home');
  const onHome = homeEl && getComputedStyle(homeEl).display !== 'none';
  const ref = onHome ? document.getElementById('lpFeatPanel') : document.querySelector('.nearby-panel');
  if (!ref || getComputedStyle(ref).display === 'none') { clear(); return; }
  const r = ref.getBoundingClientRect();
  if (r.width < 80 || r.height < 40) { clear(); return; }
  const z = parseFloat(getComputedStyle(document.body).zoom) || 1;
  const f = z * 0.7;
  panel.style.setProperty('--dp-w', Math.round(r.width / f) + 'px');
  panel.style.setProperty('--dp-right', Math.round((window.innerWidth - r.right) / f) + 'px');
}
window._sizeDetailPanel = _sizeDetailPanel;
window.addEventListener('resize', () => { try { _sizeDetailPanel(); } catch (_) {} }, { passive: true });

function _renderDetailPanel(c) {
  const tr = translations[currentLang];
  const _dpLogoEl = document.getElementById('dpLogo');
  if (c.logo) { _dpLogoEl.textContent = ''; _dpLogoEl.classList.remove('logo-mono'); _dpLogoEl.style.background = 'url("' + c.logo + '") center/cover no-repeat'; }
  else        { _dpLogoEl.textContent = companyMonogram(c); _dpLogoEl.classList.add('logo-mono'); _dpLogoEl.style.background = ''; }
  document.getElementById('dpName').innerHTML =
    escHtml(c.name) + (c.verified ? ' <span class="badge-verified" title="Empresa verificada">✓ Verificada</span>' : '');

  // Sub-line: primary activity + city, plus a compact rating when present.
  // The raw CAE classification code is intentionally dropped — it carries no
  // value for someone browsing the marketplace.
  const _sectorLabels = (tr && tr.sectors) || {};
  const _primarySector = c.sector ? (_sectorLabels[c.sector] || c.sector)
    : (c.sectors && c.sectors[0] ? (_sectorLabels[c.sectors[0]] || c.sectors[0]) : '');
  const _subParts = [];
  if (_primarySector) _subParts.push(_primarySector);
  if (c.city) _subParts.push(c.city);
  if (c.rating > 0) _subParts.push(`★ ${c.rating.toFixed(1)} (${c.reviews})`);
  document.getElementById('dpSub').textContent = _subParts.join('  ·  ');
  document.getElementById('dpAddress').textContent = c.address;

  // Specialties (free-form tags) — hidden entirely when the company has none.
  document.getElementById('dpTags').innerHTML = c.tags.map(tag =>
    `<span class="tag">${escHtml(tag)}</span>`).join('');
  const specialtiesSection = document.getElementById('dpSpecialtiesSection');
  if (specialtiesSection) specialtiesSection.style.display = (c.tags && c.tags.length) ? '' : 'none';

  // Credenciais & Áreas de Atividade — sectors are public; the alvará and
  // certidão permanente are private credentials the backend only returns to
  // authenticated users, so anonymous visitors get a "sign in to view" prompt.
  const dpActivities = document.getElementById('dpActivities');
  if (dpActivities) {
    const sc = (tr && tr.sectors) || {};
    const sectorsArr = (c.sectors && c.sectors.length) ? c.sectors : (c.sector ? [c.sector] : []);
    dpActivities.innerHTML = sectorsArr.length
      ? sectorsArr.map(s => `<span class="dp-cred-chip">${escHtml(sc[s] || s)}</span>`).join('')
      : `<span class="dp-cred-empty">${escHtml((tr && tr.detailNoActivities) || '—')}</span>`;
  }
  // NIF — public registry identifier, shown to everyone; hidden only when absent.
  const dpNifBlock = document.getElementById('dpNifBlock');
  const dpNif = document.getElementById('dpNif');
  if (dpNifBlock && dpNif) {
    if (c.nif) {
      dpNifBlock.style.display = '';
      dpNif.textContent = c.nif;
    } else {
      dpNifBlock.style.display = 'none';
    }
  }
  const _fillCredential = (el, value, emptyText) => {
    if (!el) return;
    el.classList.remove('empty', 'locked');
    if (!_isLoggedIn()) {
      el.classList.add('locked');
      el.innerHTML = `<button type="button" class="dp-cred-lock" onclick="closeDetail();openLogin()">`
        + `🔒 <span>${escHtml((tr && tr.credLoginToView) || 'Inicie sessão para ver')}</span></button>`;
    } else if (value) {
      el.textContent = value;
    } else {
      el.classList.add('empty');
      el.textContent = emptyText;
    }
  };
  _fillCredential(document.getElementById('dpCertidao'), c.certidao_permanente,
    (tr && tr.certidaoPending) || 'Em verificação');
  _fillCredential(document.getElementById('dpAlvara'), c.alvara,
    (tr && tr.alvaraNotApplicable) || 'Não aplicável');

  document.getElementById('chatName').textContent = c.name;
  document.getElementById('dpReviewsSection').style.display = c.isNew ? 'none' : 'block';

  // Quick facts (founded year, business hours) — only render rows we have data for
  const facts = document.getElementById('dpFacts');
  if (facts) {
    const items = [];
    if (c.founded_year) {
      const yrs = new Date().getFullYear() - Number(c.founded_year);
      const yrLabel = yrs === 1 ? t('factYear') : t('factYears');
      items.push(`<span class="dp-fact"><span class="dp-fact-icon">📅</span><span class="dp-fact-label">${t('factSince')}</span><span class="dp-fact-value">${c.founded_year}${yrs > 0 ? ` · ${yrs} ${yrLabel}` : ''}</span></span>`);
    }
    if (c.business_hours) {
      items.push(`<span class="dp-fact"><span class="dp-fact-icon">🕒</span><span class="dp-fact-label">${t('factHours')}</span><span class="dp-fact-value">${escHtml(c.business_hours)}</span></span>`);
    }
    if (c.verified) {
      items.push(`<span class="dp-fact" title="${escHtml(t('verifiedTooltip') || '')}"><span class="dp-fact-icon" style="color:#16a34a">✓</span><span class="dp-fact-value" style="color:#166534">${t('factVerified')}</span></span>`);
    }
    if (items.length) {
      facts.innerHTML = items.join('');
      facts.style.display = 'flex';
    } else {
      facts.style.display = 'none';
    }
  }

  // Website + social links row (lucide icons; brand colour on hover)
  const socialEl = document.getElementById('dpSocial');
  if (socialEl) {
    const norm = u => (/^https?:\/\//i.test(u) ? u : 'https://' + u);
    const defs = [
      ['website',   c.website,   'globe'],
      ['facebook',  c.facebook,  'facebook'],
      ['instagram', c.instagram, 'instagram'],
      ['linkedin',  c.linkedin,  'linkedin'],
    ];
    const links = defs
      .filter(([, u]) => u && String(u).trim())
      .map(([key, u, icon]) => `<a href="${escHtml(norm(String(u).trim()))}" target="_blank" rel="noopener" class="dp-social-link dp-social-${key}" title="${key.charAt(0).toUpperCase() + key.slice(1)}" aria-label="${key}"><i data-lucide="${icon}"></i></a>`);
    if (links.length) {
      socialEl.innerHTML = links.join('');
      socialEl.style.display = 'flex';
      if (typeof refreshLucide === 'function') refreshLucide();
    } else {
      socialEl.style.display = 'none';
    }
  }

  // Portfolio gallery — render up to 12 thumbnails. Click opens the image
  // full-screen via window.open (simple, no extra modal needed).
  const portfolioWrap = document.getElementById('dpPortfolioWrap');
  const portfolio     = document.getElementById('dpPortfolio');
  if (portfolioWrap && portfolio) {
    const imgs = (c.portfolio_images || []).filter(u => /^https?:\/\//.test(u)).slice(0, 12);
    if (imgs.length) {
      portfolio.innerHTML = imgs.map(u =>
        `<img src="${escHtml(u)}" alt="" loading="lazy" decoding="async" onclick="window.open('${escHtml(u)}','_blank','noopener')" onerror="this.style.display='none'"/>`
      ).join('');
      portfolioWrap.style.display = '';
    } else {
      portfolioWrap.style.display = 'none';
    }
  }

  // Auth gate: contact DETAILS (telefone, email, credenciais) stay behind
  // login, but the message relay is guest-safe — the backend accepts guest
  // messages (name+email form) and never exposes the company's email. So
  // guests keep the action bar with the buttons that work logged out:
  // Enviar Mensagem, Como chegar, Partilhar. Ligar (phone is redacted for
  // anonymous traffic) and Reportar (backend requires auth) stay gated.
  const loggedIn = !!JSON.parse(localStorage.getItem('hive_user') || 'null');
  const quoteBar = document.getElementById('dpQuoteBar');
  const loginGate = document.getElementById('dpLoginGate');
  const gatedSections = document.getElementById('dpGatedSections');
  if (quoteBar) {
    quoteBar.style.display = '';
    quoteBar.querySelectorAll('.qs-call,.qs-report').forEach(b => { b.style.display = loggedIn ? '' : 'none'; });
  }
  if (loginGate) loginGate.style.display = loggedIn ? 'none' : '';
  if (gatedSections) gatedSections.style.display = loggedIn ? '' : 'none';

  // Claim row: hidden when the viewer already owns this listing.
  const claimRow = document.getElementById('dpClaimRow');
  if (claimRow) {
    const me = JSON.parse(localStorage.getItem('hive_user') || 'null');
    const isOwner = !!(me && c.created_by != null && Number(c.created_by) === Number(me.id));
    claimRow.style.display = isOwner ? 'none' : '';
  }

  // SEO: per-company LocalBusiness structured data + page meta.
  try { _injectCompanySeo(c); } catch (_) {}

  updateAdminUI();
  _refreshDpFavBtn();
}

// Toggles the favourite state for the currently-open company in the detail
// panel. Goes through the normal toggleFavourite() so it reuses the
// localStorage + server-sync paths.
function dpToggleFav() {
  if (!selectedId) return;
  toggleFavourite(selectedId);
  _refreshDpFavBtn();
}
function _refreshDpFavBtn() {
  const btn = document.getElementById('dpFavBtn');
  if (!btn || !selectedId) return;
  const fav = _favIds && _favIds.has(Number(selectedId));
  btn.classList.toggle('is-fav', !!fav);
  btn.textContent = fav ? '★' : '☆';
  btn.setAttribute('aria-label', fav ? 'Remover dos favoritos' : 'Guardar nos favoritos');
  btn.title = fav ? 'Remover dos favoritos' : 'Guardar nos favoritos';
}
window.dpToggleFav = dpToggleFav;
window._refreshDpFavBtn = _refreshDpFavBtn;

function closeDetail() {
  document.getElementById('detailPanel').classList.remove('open');
  selectedId = null;
  // Drop ?company from the URL unless the close was triggered by popstate.
  if (!window._suppressCompanyHistory) {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('company')) {
        url.searchParams.delete('company');
        history.pushState({ company: null }, '', url.toString());
      }
    } catch (_) {}
  }
  // Return to the location user was viewing. Guarded: flying a hidden or
  // zero-size map throws "Invalid LatLng (NaN, NaN)" (the projection has no
  // pixel space) — happens when the detail is closed from the list view or
  // right after a tab switch, and the throw breaks the caller mid-flow.
  try {
    if (map && map.getSize().x > 0) {
      map.flyTo(currentMapCenter, 12, { animate: true, duration: 1 });
    }
  } catch (_) {}
}

// ── CALL / SHARE ────────────────────────────────────────────────────────────
function callCompany() {
  const c = companies.find(x => x.id === selectedId);
  if (!c) return;
  if (c.phone) {
    window.open('tel:' + c.phone.replace(/\s/g, ''), '_blank');
  } else {
    showToast(t('toastPhoneUnavailable'));
  }
}

function shareCompany() {
  const c = companies.find(x => x.id === selectedId);
  if (!c) return;
  const text = c.name + ' — ' + c.description + '\n⭐ ' + c.rating + '/5 · ' + c.city;
  if (navigator.share) {
    navigator.share({ title: c.name, text: text, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text + '\n' + window.location.href).then(() => {
      showToast(t('toastLinkCopied'));
    }).catch(() => showToast(t('toastCopyFailed')));
  }
}

// ── STREET VIEW ───────────────────────────────────────────────────────────────
// Embedded in-site via Google's keyless legacy embed (output=svembed) — the
// only Street View endpoint that allows framing without a Maps API key. The
// header link and the fallback line always offer the official new-tab deep
// link, so if Google ever retires the legacy endpoint nothing dead-ends.
function openStreetView() {
  const c = companies.find(x => x.id === selectedId);
  if (!c || !isFinite(c.lat) || !isFinite(c.lng)) { showToast(t('toastNoLocation') || 'Localização indisponível'); return; }
  const deep = 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + c.lat + ',' + c.lng;
  const ov = document.getElementById('streetViewOverlay');
  const frame = document.getElementById('svFrame');
  if (ov && frame) {
    frame.src = 'https://maps.google.com/maps?layer=c&cbll=' + c.lat + ',' + c.lng +
                '&cbp=11,0,0,0,0&hl=' + encodeURIComponent(currentLang || 'pt') + '&output=svembed';
    const title = document.getElementById('svTitle');
    if (title) title.textContent = (t('dpStreetTitle') || 'Vista de Rua') + ' — ' + c.name;
    const ext = document.getElementById('svExternal');
    if (ext) ext.href = deep;
    const fb = document.getElementById('svFallbackLink');
    if (fb) fb.href = deep;
    ov.classList.add('open');
  } else {
    window.open(deep, '_blank', 'noopener');
  }
  try { api.trackEvent(c.id, 'streetview'); } catch (_) {}
}
function closeStreetView() {
  const ov = document.getElementById('streetViewOverlay');
  if (ov) ov.classList.remove('open');
  // Unload the embed so it stops consuming CPU/network behind the page
  const frame = document.getElementById('svFrame');
  if (frame) frame.src = 'about:blank';
}
window.openStreetView = openStreetView;
window.closeStreetView = closeStreetView;

// ═══════════════════════════════════════════════════════════════════════════════
// MARKETPLACE v2 — claim de fichas, pedidos de orçamento (RFQ), inbox, destaque
// ═══════════════════════════════════════════════════════════════════════════════

// ── CLAIM ──────────────────────────────────────────────────────────────────────
let _claimCompanyId = null;
function openClaimModal() {
  const me = JSON.parse(localStorage.getItem('hive_user') || 'null');
  if (!me) { showToast(t('claimNeedLogin')); openLogin(); return; }
  if (!selectedId) return;
  _claimCompanyId = selectedId;
  document.getElementById('claimStep1').style.display = '';
  document.getElementById('claimStep2').style.display = 'none';
  const code = document.getElementById('claimCode'); if (code) code.value = '';
  document.getElementById('claimOverlay').classList.add('open');
}
function closeClaimModal() { document.getElementById('claimOverlay').classList.remove('open'); }
async function claimSendCode(btn) {
  if (!_claimCompanyId) return;
  if (btn) { btn.disabled = true; btn.textContent = t('sendingBtn'); }
  try {
    const r = await api.requestClaimCode(_claimCompanyId);
    document.getElementById('claimSentEmail').textContent = r.sentTo || '';
    document.getElementById('claimStep1').style.display = 'none';
    document.getElementById('claimStep2').style.display = '';
    setTimeout(() => document.getElementById('claimCode')?.focus(), 150);
  } catch (e) {
    showToast(e.message || 'Erro ao enviar código');
  } finally { if (btn) { btn.disabled = false; btn.textContent = t('claimSendBtn'); } }
}
async function claimVerify(btn) {
  const code = (document.getElementById('claimCode')?.value || '').trim();
  if (code.length !== 6) { showToast(t('claimCodeInvalid')); return; }
  if (btn) btn.disabled = true;
  try {
    await api.verifyClaim(_claimCompanyId, code);
    // Reflect the new ownership locally so ✎ / inbox appear immediately.
    const me = JSON.parse(localStorage.getItem('hive_user') || 'null');
    const c = companies.find(x => Number(x.id) === Number(_claimCompanyId));
    if (c && me) c.created_by = me.id;
    closeClaimModal();
    showToast(t('claimSuccess'));
    if (selectedId === _claimCompanyId) { try { openDetail(_claimCompanyId); } catch (_) {} }
  } catch (e) {
    showToast(e.message || 'Código inválido');
  } finally { if (btn) btn.disabled = false; }
}
window.openClaimModal = openClaimModal;
window.closeClaimModal = closeClaimModal;
window.claimSendCode = claimSendCode;
window.claimVerify = claimVerify;

// ── RFQ (pedido de orçamento multi-empresa) ────────────────────────────────────
function openRfqModal(prefSector) {
  // Populate the sector select from the current language's option labels.
  const sel = document.getElementById('rfqSector');
  if (sel && !sel.options.length) {
    const opts = (translations[currentLang] || translations.pt).sectorOptions || {};
    sel.innerHTML = Object.entries(opts).map(([k, v]) => `<option value="${k}">${escHtml(v)}</option>`).join('');
  }
  if (sel && prefSector && [...sel.options].some(o => o.value === prefSector)) sel.value = prefSector;
  // Logged users don't need the name/email fields.
  const me = JSON.parse(localStorage.getItem('hive_user') || 'null');
  const guest = document.getElementById('rfqGuestFields');
  if (guest) guest.style.display = me ? 'none' : 'grid';
  document.getElementById('rfqOverlay').classList.add('open');
  setTimeout(() => document.getElementById('rfqDesc')?.focus(), 150);
}
function closeRfqModal() { document.getElementById('rfqOverlay').classList.remove('open'); }
async function submitRfq(btn) {
  const me = JSON.parse(localStorage.getItem('hive_user') || 'null');
  const desc = (document.getElementById('rfqDesc')?.value || '').trim();
  const city = (document.getElementById('rfqCity')?.value || '').trim();
  const body = {
    sector: document.getElementById('rfqSector')?.value || '',
    description: desc,
    city,
    timeline: document.getElementById('rfqTimeline')?.value || '',
    budget_range: document.getElementById('rfqBudget')?.value || '',
    phone: document.getElementById('rfqPhone')?.value || '',
    website: document.getElementById('rfqWebsite')?.value || '', // honeypot
  };
  if (!me) {
    body.name = (document.getElementById('rfqName')?.value || '').trim();
    body.email = (document.getElementById('rfqEmail')?.value || '').trim();
    if (!body.name) { showToast(t('contactNameReq')); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email)) { showToast(t('contactEmailReq')); return; }
  }
  if (desc.length < 20) { showToast(t('rfqDescShort')); return; }
  if (!city) { showToast(t('rfqCityReq')); return; }
  // Geocode the locality (best-effort) so the backend can pick the nearest companies.
  try {
    const res = await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=pt&q=' + encodeURIComponent(city + ', Portugal'));
    const js = await res.json();
    if (js[0]) { body.lat = Number(js[0].lat); body.lng = Number(js[0].lon); }
  } catch (_) {}
  if (btn) { btn.disabled = true; btn.textContent = t('sendingBtn'); }
  try {
    const r = await api.createQuoteRequest(body);
    closeRfqModal();
    showToast(t('rfqSentA') + ' ' + (r.notified || 0) + ' ' + t('rfqSentB'));
    const d = document.getElementById('rfqDesc'); if (d) d.value = '';
  } catch (e) {
    showToast(e.message || 'Erro ao enviar pedido');
  } finally { if (btn) { btn.disabled = false; btn.textContent = t('rfqSend'); } }
}
window.openRfqModal = openRfqModal;
window.closeRfqModal = closeRfqModal;
window.submitRfq = submitRfq;

// ── INBOX (donos de empresa) ───────────────────────────────────────────────────
// ── CHAT empresa↔cliente (mensagens + documentos; retenção 90 dias) ───────────
// Dois modos sobre o mesmo overlay: 'owner' (dono da empresa vê o inbox dela,
// fios agrupados por cliente) e 'client' (o utilizador vê as suas conversas
// com as várias empresas). Identidade = email da sessão.
let _chatMode = 'owner';
let _chatCompanyId = null;   // owner: a empresa; client: o fio selecionado
let _chatPeer = null;        // owner: email do cliente selecionado
let _chatThreads = [];
let _chatFiles = [];         // anexos pendentes [{name,mime,size,data}]

const _CHAT_ACCEPT = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'text/plain',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

function _chatEl(id) { return document.getElementById(id); }

function openInbox(companyId) {
  _chatMode = 'owner';
  _chatCompanyId = Number(companyId);
  _openChatOverlay();
  _loadOwnerThreads();
}
function openMyChats() {
  const u = JSON.parse(localStorage.getItem('hive_user') || 'null');
  if (!u) { openLogin(); return; }
  _chatMode = 'client';
  _chatCompanyId = null;
  _openChatOverlay();
  _loadClientThreads();
}
function _openChatOverlay() {
  _chatFiles = []; _chatPeer = null; _chatThreads = [];
  _renderPendingFiles();
  _chatEl('chatHead').textContent = '';
  _chatEl('chatMsgs').innerHTML = '';
  _chatEl('chatThreads').innerHTML = '<div class="chat-loading">' + t('loadingGeneric') + '</div>';
  _chatEl('inboxOverlay').classList.add('open');
}
function closeInbox() { _chatEl('inboxOverlay').classList.remove('open'); }

async function _loadOwnerThreads() {
  try {
    const msgs = await apiFetch('/messages/company/' + _chatCompanyId);
    const map = new Map();
    msgs.forEach(m => {
      const k = (m.client_email || '').toLowerCase();
      if (!map.has(k)) map.set(k, { key: k, email: m.client_email, name: m.client_name, items: [] });
      const th = map.get(k);
      th.items.push(m);
      if (m.client_name) th.name = m.client_name;
    });
    _chatThreads = [...map.values()];
    _chatThreads.forEach(th => th.items.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)));
    _renderThreadList(_chatThreads.map(th => ({ id: th.key, title: th.name || th.email, sub: th.email, unread: 0 })));
    if (_chatThreads.length) _selectOwnerThread(_chatThreads[0].key); else _chatEmpty();
  } catch (e) { _chatError(e); }
}
function _selectOwnerThread(key) {
  _chatPeer = key;
  const th = _chatThreads.find(x => x.key === key);
  if (!th) return;
  _chatEl('chatHead').innerHTML = escHtml(th.name || th.email) +
    ' <span class="chat-head-sub">' + escHtml(th.email) + '</span>';
  _renderMsgs(th.items, 'company');
  _markThreadActive(key);
}

async function _loadClientThreads() {
  try {
    const rows = await apiFetch('/messages/mine');
    _chatThreads = rows;
    _renderThreadList(rows.map(r => ({
      id: String(r.company_id), title: r.company_name,
      sub: (r.last_body || '').slice(0, 46), unread: r.unread,
    })));
    if (rows.length) _selectClientThread(rows[0].company_id); else _chatEmpty();
  } catch (e) { _chatError(e); }
}
async function _selectClientThread(companyId) {
  _chatCompanyId = Number(companyId);
  _markThreadActive(String(companyId));
  const th = _chatThreads.find(r => Number(r.company_id) === Number(companyId));
  _chatEl('chatHead').textContent = th ? th.company_name : '';
  _chatEl('chatMsgs').innerHTML = '<div class="chat-loading">' + t('loadingGeneric') + '</div>';
  try {
    const msgs = await apiFetch('/messages/thread/' + companyId);
    _renderMsgs(msgs, 'client');
  } catch (e) { _chatError(e); }
}

function _renderThreadList(items) {
  _chatEl('chatThreads').innerHTML = items.map(i => `
    <button class="chat-thread" data-tid="${escHtml(String(i.id))}" onclick="chatSelectThread(this.dataset.tid)">
      <span class="chat-thread-title">${escHtml(i.title || '')}</span>
      <span class="chat-thread-sub">${escHtml(i.sub || '')}</span>
      ${i.unread ? `<span class="chat-unread">${i.unread}</span>` : ''}
    </button>`).join('') || '<div class="chat-loading">Sem conversas ainda</div>';
}
function chatSelectThread(id) {
  if (_chatMode === 'owner') _selectOwnerThread(id);
  else _selectClientThread(Number(id));
}
function _markThreadActive(id) {
  document.querySelectorAll('.chat-thread').forEach(b =>
    b.classList.toggle('active', b.dataset.tid === String(id)));
}

function _renderMsgs(msgs, mySender) {
  const box = _chatEl('chatMsgs');
  box.innerHTML = msgs.map(m => {
    const mine = m.sender === mySender;
    const files = (m.files || []).map(f =>
      `<button class="chat-file" data-fid="${f.id}" data-fname="${escHtml(f.name)}" onclick="chatDownload(this.dataset.fid,this.dataset.fname)" title="Transferir documento">📄 ${escHtml(f.name)} <span>${_fmtSize(f.size)}</span></button>`).join('');
    return `<div class="chat-row ${mine ? 'mine' : ''}"><div class="chat-bubble">
      ${m.body ? `<div class="chat-text">${escHtml(m.body)}</div>` : ''}
      ${files ? `<div class="chat-file-list">${files}</div>` : ''}
      <div class="chat-meta">${new Date(m.created_at).toLocaleString('pt-PT')}</div>
    </div></div>`;
  }).join('') || '<div class="chat-loading">Sem mensagens ainda</div>';
  box.scrollTop = box.scrollHeight;
}
function _fmtSize(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
function _chatEmpty() {
  _chatEl('chatThreads').innerHTML = '<div class="chat-loading">Sem conversas ainda</div>';
  _chatEl('chatMsgs').innerHTML = '<div class="chat-loading">As mensagens que trocar aparecem aqui.</div>';
}
function _chatError(e) {
  _chatEl('chatMsgs').innerHTML = '<div class="chat-loading" style="color:var(--red)">' + escHtml(e.message || 'Erro') + '</div>';
}

// ── anexos ──
function chatFilesPicked(input) {
  const files = [...(input.files || [])];
  input.value = '';
  for (const f of files) {
    if (_chatFiles.length >= 3) { showToast('Máximo 3 documentos por mensagem'); break; }
    if (f.size > 2 * 1024 * 1024) { showToast(f.name + ': máximo 2 MB'); continue; }
    if (!_CHAT_ACCEPT.includes(f.type)) { showToast(f.name + ': tipo não suportado'); continue; }
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = String(reader.result).split(',')[1] || '';
      _chatFiles.push({ name: f.name, mime: f.type, size: f.size, data: b64 });
      _renderPendingFiles();
    };
    reader.readAsDataURL(f);
  }
}
function _renderPendingFiles() {
  const el = _chatEl('chatFiles');
  if (!el) return;
  el.innerHTML = _chatFiles.map((f, i) =>
    `<span class="chat-file pending">📄 ${escHtml(f.name)} <button onclick="chatRemoveFile(${i})" aria-label="Remover anexo">×</button></span>`).join('');
}
function chatRemoveFile(i) { _chatFiles.splice(i, 1); _renderPendingFiles(); }

async function chatSend(btn) {
  const input = _chatEl('chatComposeInput');
  const text = (input.value || '').trim();
  if (text.length < 2 && !_chatFiles.length) return;
  if (_chatMode === 'owner' && !_chatPeer) { showToast('Escolha uma conversa'); return; }
  if (_chatMode === 'client' && !_chatCompanyId) { showToast('Escolha uma conversa'); return; }
  btn.disabled = true;
  try {
    if (_chatMode === 'owner') {
      await apiFetch('/messages/company/' + _chatCompanyId + '/reply',
        { method: 'POST', body: { clientEmail: _chatPeer, body: text, files: _chatFiles } });
    } else {
      await apiFetch('/messages/company/' + _chatCompanyId + '/client',
        { method: 'POST', body: { body: text, files: _chatFiles } });
    }
    input.value = '';
    _chatFiles = [];
    _renderPendingFiles();
    if (_chatMode === 'owner') {
      const keep = _chatPeer;
      await _loadOwnerThreads();
      if (keep && _chatThreads.some(x => x.key === keep)) _selectOwnerThread(keep);
    } else {
      await _selectClientThread(_chatCompanyId);
    }
  } catch (e) {
    showToast(e.message || 'Erro ao enviar');
  } finally {
    btn.disabled = false;
  }
}

async function chatDownload(fileId, name) {
  try {
    const f = await apiFetch('/messages/file/' + fileId);
    const bin = atob(f.data);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([bytes], { type: f.mime }));
    const a = document.createElement('a');
    a.href = url;
    a.download = f.filename || name || 'documento';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch (e) {
    showToast(e.message || 'Não foi possível transferir o documento');
  }
}

window.openInbox = openInbox;
window.closeInbox = closeInbox;
window.openMyChats = openMyChats;
window.chatSelectThread = chatSelectThread;
window.chatFilesPicked = chatFilesPicked;
window.chatRemoveFile = chatRemoveFile;
window.chatSend = chatSend;
window.chatDownload = chatDownload;

// ── FEATURE REQUEST (destaque) ────────────────────────────────────────────────
async function requestFeature(companyId, btn) {
  if (btn) btn.disabled = true;
  try {
    await api.requestFeature(companyId);
    showToast(t('featureSent'));
  } catch (e) {
    showToast(e.message || 'Erro');
    if (btn) btn.disabled = false;
  }
}
window.requestFeature = requestFeature;

// ── SEO: LocalBusiness JSON-LD + meta por empresa ─────────────────────────────
function _injectCompanySeo(c) {
  const old = document.getElementById('companyJsonLd');
  if (old) old.remove();
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.id = 'companyJsonLd';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: c.name,
    url: 'https://www.hivex.pt/?company=' + c.id,
    address: { '@type': 'PostalAddress', streetAddress: c.address || undefined, addressLocality: c.city || undefined, postalCode: c.postalCode || c.postal_code || undefined, addressCountry: 'PT' },
    geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng },
    telephone: c.phone || undefined,
    ...(c.website ? { sameAs: [c.website] } : {}),
    ...(c.rating > 0 ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: c.rating, reviewCount: c.reviews || 0 } } : {}),
  };
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
  // Page meta (helps share previews; crawlers executing JS pick these up too)
  const desc = (c.description || (c.name + ' — ' + (c.city || 'Portugal'))).slice(0, 155);
  let meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', desc);
}

// ── WHATSAPP CONTACT ──────────────────────────────────────────────────────────
function openWhatsAppContact() {
  const c = companies.find(x => x.id === selectedId);
  if (!c) return;
  const phone = (c.phone || '').replace(/\D/g, '');
  if (phone) {
    const msg = encodeURIComponent(`Olá! Vi o perfil da ${c.name} na plataforma Hivex e gostaria de solicitar mais informações.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank', 'noopener');
    showToast(t('toastWhatsapp'));
  } else if (c.email) {
    openEmail();
  } else {
    showToast(t('toastPhoneUnavailable'));
  }
}

// ── EMAIL ──────────────────────────────────────────────────────────────────────
function openEmail()  { document.getElementById('emailOverlay').classList.add('open'); }
function closeEmail() { document.getElementById('emailOverlay').classList.remove('open'); }
function closeEmailIfBg(e) { if (e.target === document.getElementById('emailOverlay')) closeEmail(); }
function submitEmail() { closeEmail(); showToast(t('toastEmailSent')); }

// ── TOAST ──────────────────────────────────────────────────────────────────────
let _toastTimer = null;
function showToast(msg, type) {
  const el = document.getElementById('toast');
  if (!el) return;
  // Deduplicate: skip if same message is already showing
  if (el.classList.contains('show') && el.textContent === msg) return;
  if (_toastTimer) clearTimeout(_toastTimer);
  el.textContent = msg;
  el.classList.toggle('toast-error', type === 'error');
  el.classList.add('show');
  _toastTimer = setTimeout(() => { el.classList.remove('show'); _toastTimer = null; }, 3000);
}

// ── Modal a11y: focus trap + Escape to close + restore focus ───────────────
// Applied generically to any element marked role="dialog" that opens via the
// existing .open class. Tab cycles within the modal so keyboard users can't
// escape into the page underneath; Escape closes whichever modal is on top.
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
let _modalReturnFocus = null;
function _topmostOpenModal() {
  const modals = document.querySelectorAll('[role="dialog"].open, .reg-success-overlay.open');
  return modals.length ? modals[modals.length - 1] : null;
}
function _focusFirstIn(modal) {
  if (!modal) return;
  const focusable = modal.querySelectorAll(FOCUSABLE);
  for (const el of focusable) {
    if (el.offsetParent !== null) { el.focus(); return; }
  }
  modal.setAttribute('tabindex', '-1');
  modal.focus();
}
// Trap Tab within the modal
document.addEventListener('keydown', function(e) {
  const modal = _topmostOpenModal();
  if (!modal) return;
  if (e.key === 'Tab') {
    const focusable = Array.from(modal.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
    else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
  } else if (e.key === 'Escape') {
    // Close in priority order; each close-fn no-ops if already shut.
    const closers = ['closeReportModal','closeRegSuccess','closePostRegister','closeForgotPassword','closeProfilePanel','closeLegal','closeContactModal','closeAdminPanel','closeStatusModal','closeGeoHelp','closeEmail','closeRegister','closeLogin','closeHelp'];
    for (const fn of closers) {
      if (typeof window[fn] === 'function') { try { window[fn](); } catch(_) {} }
    }
  }
});
// When a modal opens, remember where focus came from and move focus inside
const _modalObserver = new MutationObserver(function(records) {
  records.forEach(r => {
    if (r.type !== 'attributes' || r.attributeName !== 'class') return;
    const t = r.target;
    const wasOpen = (r.oldValue || '').split(' ').includes('open');
    const isOpen  = t.classList.contains('open');
    if (!wasOpen && isOpen && (t.getAttribute('role') === 'dialog' || t.classList.contains('reg-success-overlay'))) {
      _modalReturnFocus = document.activeElement;
      setTimeout(() => _focusFirstIn(t), 50);
    } else if (wasOpen && !isOpen && _modalReturnFocus) {
      try { _modalReturnFocus.focus(); } catch(_) {}
      _modalReturnFocus = null;
    }
  });
});
document.querySelectorAll('[role="dialog"], .reg-success-overlay').forEach(el => {
  _modalObserver.observe(el, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
});

// ── FAQ MODAL ──────────────────────────────────────────────────────────────
const FAQ_DOCS = {
  pt: [
    { q:'A Hivex é gratuita?',
      a:'Sim. Pesquisar empresas, pedir orçamentos e contactar profissionais é totalmente gratuito para particulares e empresas. As empresas podem optar por planos premium para destaque (em breve).' },
    { q:'Quanto tempo demora a aprovação do registo da minha empresa?',
      a:'Em média <strong>até 24h úteis</strong>. Verificamos o código da Certidão Permanente e os dados básicos. Receberá um email assim que estiver aprovada.' },
    { q:'Como funciona a verificação de empresas?',
      a:'Toda empresa registada submete o código de acesso à Certidão Permanente do Registo Comercial. A nossa equipa confirma se o código é válido e se os dados (nome, NIPC, atividade) coincidem. Empresas verificadas exibem um selo verde ✓ Verificado.' },
    { q:'Os meus dados são seguros?',
      a:'Sim. As palavras-passe são guardadas com bcrypt, a sessão usa um cookie HttpOnly assinado, e o código da Certidão Permanente nunca é exibido publicamente — apenas o próprio dono da empresa e administradores Hivex têm acesso. Cumprimos integralmente o RGPD. <a href="#legal/privacy" onclick="closeFaq();openLegal(\'privacy\');return false">Ver Política de Privacidade</a>.' },
    { q:'Posso editar a minha empresa depois de registada?',
      a:'Sim. Inicie sessão, abra o menu do avatar e clique em <strong>"O Meu Perfil"</strong>. Encontrará a sua empresa com um botão ✏️ para editar. Algumas alterações podem requerer nova aprovação.' },
    { q:'Como contacto uma empresa?',
      a:'Abra o perfil da empresa no mapa ou na pesquisa. Os utilizadores autenticados vêem três opções: <strong>Pedir Orçamento por Email</strong>, <strong>WhatsApp</strong> e <strong>Mensagem direta</strong>. A Hivex nunca expõe publicamente o contacto direto da empresa antes de o utilizador iniciar sessão.' },
    { q:'A minha empresa não aparece no mapa, o que faço?',
      a:'<ul><li>Verifique se o registo está aprovado (avatar → "Estado do registo").</li><li>Confirme se o raio de pesquisa cobre a localização da empresa.</li><li>Confirme se o sector escolhido na pesquisa corresponde ao da empresa.</li><li>Se nada disto resolver, contacte <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</li></ul>' },
    { q:'Como deixo uma avaliação?',
      a:'Inicie sessão, abra o perfil da empresa, e clique em <strong>"+ Escrever Avaliação"</strong>. Pode dar de 1 a 5 estrelas e um comentário curto. Cada utilizador pode rever uma empresa uma vez (a avaliação seguinte substitui a anterior).' },
    { q:'O que significa "Top Rated"?',
      a:'Empresas com avaliação média igual ou superior a 4,5 estrelas com pelo menos 5 reviews. É um sinal automático que aparece nos cartões e filtros.' },
    { q:'Posso eliminar a minha conta?',
      a:'Sim. Envie um pedido para <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a> identificando o email da conta. Eliminamos os dados em até 30 dias, conforme o RGPD.' },
  ],
};
FAQ_DOCS.en = [
  { q:`Is Hivex free?`, a:`Yes. Searching companies, requesting quotes and contacting professionals is completely free for individuals and businesses. Companies may opt for premium plans for featured placement (coming soon).` },
  { q:`How long does my company registration take to be approved?`, a:`On average <strong>up to 24 business hours</strong>. We verify the Permanent Certificate code and the basic details. You'll receive an email as soon as it's approved.` },
  { q:`How does company verification work?`, a:`Every registered company submits the access code to its Permanent Commercial Registry Certificate. Our team confirms the code is valid and that the details (name, tax number, activity) match. Verified companies display a green ✓ Verified badge.` },
  { q:`Is my data safe?`, a:`Yes. Passwords are stored with bcrypt, the session uses a signed HttpOnly cookie, and the Permanent Certificate code is never shown publicly — only the company owner and Hivex administrators have access. We fully comply with the GDPR. <a href="#legal/privacy" onclick="closeFaq();openLegal('privacy');return false">View Privacy Policy</a>.` },
  { q:`Can I edit my company after registering?`, a:`Yes. Sign in, open the avatar menu and click <strong>"My Profile"</strong>. You'll find your company with a ✏️ button to edit it. Some changes may require re-approval.` },
  { q:`How do I contact a company?`, a:`Open the company profile on the map or in search. Logged-in users see three options: <strong>Request a Quote by Email</strong>, <strong>WhatsApp</strong> and <strong>Direct message</strong>. Hivex never publicly exposes a company's direct contact before the user signs in.` },
  { q:`My company doesn't appear on the map, what do I do?`, a:`<ul><li>Check that the registration is approved (avatar → "Registration status").</li><li>Make sure the search radius covers the company's location.</li><li>Make sure the sector selected in the search matches the company's.</li><li>If none of this helps, contact <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</li></ul>` },
  { q:`How do I leave a review?`, a:`Sign in, open the company profile, and click <strong>"+ Write Review"</strong>. You can give 1 to 5 stars and a short comment. Each user can review a company once (the next review replaces the previous one).` },
  { q:`What does "Top Rated" mean?`, a:`Companies with an average rating of 4.5 stars or higher and at least 5 reviews. It's an automatic signal that appears on cards and filters.` },
  { q:`Can I delete my account?`, a:`Yes. Send a request to <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a> identifying the account email. We delete the data within 30 days, in accordance with the GDPR.` },
];
FAQ_DOCS.fr = [
  { q:`Hivex est-il gratuit ?`, a:`Oui. Rechercher des entreprises, demander des devis et contacter des professionnels est entièrement gratuit pour les particuliers et les entreprises. Les entreprises peuvent opter pour des forfaits premium pour une mise en avant (bientôt disponible).` },
  { q:`Combien de temps prend l'approbation de l'inscription de mon entreprise ?`, a:`En moyenne <strong>jusqu'à 24 heures ouvrables</strong>. Nous vérifions le code du Certificat Permanent et les informations de base. Vous recevrez un e-mail dès qu'elle sera approuvée.` },
  { q:`Comment fonctionne la vérification des entreprises ?`, a:`Chaque entreprise inscrite soumet le code d'accès à son Certificat Permanent du Registre du Commerce. Notre équipe confirme que le code est valide et que les informations (nom, numéro fiscal, activité) correspondent. Les entreprises vérifiées affichent un badge vert ✓ Vérifié.` },
  { q:`Mes données sont-elles en sécurité ?`, a:`Oui. Les mots de passe sont stockés avec bcrypt, la session utilise un cookie HttpOnly signé, et le code du Certificat Permanent n'est jamais affiché publiquement — seuls le propriétaire de l'entreprise et les administrateurs Hivex y ont accès. Nous respectons pleinement le RGPD. <a href="#legal/privacy" onclick="closeFaq();openLegal('privacy');return false">Voir la Politique de Confidentialité</a>.` },
  { q:`Puis-je modifier mon entreprise après l'inscription ?`, a:`Oui. Connectez-vous, ouvrez le menu de l'avatar et cliquez sur <strong>« Mon profil »</strong>. Vous y trouverez votre entreprise avec un bouton ✏️ pour la modifier. Certaines modifications peuvent nécessiter une nouvelle approbation.` },
  { q:`Comment contacter une entreprise ?`, a:`Ouvrez le profil de l'entreprise sur la carte ou dans la recherche. Les utilisateurs connectés voient trois options : <strong>Demander un devis par e-mail</strong>, <strong>WhatsApp</strong> et <strong>Message direct</strong>. Hivex n'expose jamais publiquement le contact direct d'une entreprise avant que l'utilisateur ne se connecte.` },
  { q:`Mon entreprise n'apparaît pas sur la carte, que faire ?`, a:`<ul><li>Vérifiez que l'inscription est approuvée (avatar → « Statut de l'inscription »).</li><li>Assurez-vous que le rayon de recherche couvre l'emplacement de l'entreprise.</li><li>Assurez-vous que le secteur sélectionné dans la recherche correspond à celui de l'entreprise.</li><li>Si rien de tout cela ne fonctionne, contactez <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</li></ul>` },
  { q:`Comment laisser un avis ?`, a:`Connectez-vous, ouvrez le profil de l'entreprise et cliquez sur <strong>« + Écrire un avis »</strong>. Vous pouvez attribuer de 1 à 5 étoiles et un court commentaire. Chaque utilisateur peut évaluer une entreprise une fois (l'avis suivant remplace le précédent).` },
  { q:`Que signifie « Top Rated » ?`, a:`Les entreprises ayant une note moyenne égale ou supérieure à 4,5 étoiles avec au moins 5 avis. C'est un signal automatique qui apparaît sur les fiches et les filtres.` },
  { q:`Puis-je supprimer mon compte ?`, a:`Oui. Envoyez une demande à <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a> en indiquant l'e-mail du compte. Nous supprimons les données sous 30 jours, conformément au RGPD.` },
];
FAQ_DOCS.es = [
  { q:`¿Hivex es gratis?`, a:`Sí. Buscar empresas, solicitar presupuestos y contactar profesionales es totalmente gratuito para particulares y empresas. Las empresas pueden optar por planes premium para destacar (próximamente).` },
  { q:`¿Cuánto tarda la aprobación del registro de mi empresa?`, a:`De media <strong>hasta 24 horas hábiles</strong>. Verificamos el código del Certificado Permanente y los datos básicos. Recibirás un correo en cuanto esté aprobada.` },
  { q:`¿Cómo funciona la verificación de empresas?`, a:`Cada empresa registrada envía el código de acceso a su Certificado Permanente del Registro Mercantil. Nuestro equipo confirma que el código es válido y que los datos (nombre, NIF, actividad) coinciden. Las empresas verificadas muestran un sello verde ✓ Verificado.` },
  { q:`¿Mis datos están seguros?`, a:`Sí. Las contraseñas se guardan con bcrypt, la sesión usa una cookie HttpOnly firmada, y el código del Certificado Permanente nunca se muestra públicamente — solo el propietario de la empresa y los administradores de Hivex tienen acceso. Cumplimos plenamente el RGPD. <a href="#legal/privacy" onclick="closeFaq();openLegal('privacy');return false">Ver Política de Privacidad</a>.` },
  { q:`¿Puedo editar mi empresa después de registrarla?`, a:`Sí. Inicia sesión, abre el menú del avatar y haz clic en <strong>«Mi perfil»</strong>. Encontrarás tu empresa con un botón ✏️ para editarla. Algunos cambios pueden requerir nueva aprobación.` },
  { q:`¿Cómo contacto con una empresa?`, a:`Abre el perfil de la empresa en el mapa o en la búsqueda. Los usuarios autenticados ven tres opciones: <strong>Solicitar presupuesto por correo</strong>, <strong>WhatsApp</strong> y <strong>Mensaje directo</strong>. Hivex nunca expone públicamente el contacto directo de una empresa antes de que el usuario inicie sesión.` },
  { q:`Mi empresa no aparece en el mapa, ¿qué hago?`, a:`<ul><li>Comprueba que el registro esté aprobado (avatar → «Estado del registro»).</li><li>Asegúrate de que el radio de búsqueda cubra la ubicación de la empresa.</li><li>Asegúrate de que el sector seleccionado en la búsqueda coincida con el de la empresa.</li><li>Si nada de esto lo resuelve, contacta con <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</li></ul>` },
  { q:`¿Cómo dejo una valoración?`, a:`Inicia sesión, abre el perfil de la empresa y haz clic en <strong>«+ Escribir valoración»</strong>. Puedes dar de 1 a 5 estrellas y un comentario breve. Cada usuario puede valorar una empresa una vez (la siguiente valoración sustituye a la anterior).` },
  { q:`¿Qué significa «Top Rated»?`, a:`Empresas con una valoración media igual o superior a 4,5 estrellas y al menos 5 reseñas. Es una señal automática que aparece en las tarjetas y los filtros.` },
  { q:`¿Puedo eliminar mi cuenta?`, a:`Sí. Envía una solicitud a <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a> indicando el correo de la cuenta. Eliminamos los datos en un plazo de 30 días, conforme al RGPD.` },
];
FAQ_DOCS.de = [
  { q:`Ist Hivex kostenlos?`, a:`Ja. Die Suche nach Unternehmen, das Anfordern von Angeboten und die Kontaktaufnahme mit Fachleuten ist für Privatpersonen und Unternehmen völlig kostenlos. Unternehmen können sich für Premium-Pläne für eine hervorgehobene Platzierung entscheiden (in Kürze).` },
  { q:`Wie lange dauert die Genehmigung der Registrierung meines Unternehmens?`, a:`Im Durchschnitt <strong>bis zu 24 Werkstunden</strong>. Wir überprüfen den Code des Permanenten Zertifikats und die Basisdaten. Sie erhalten eine E-Mail, sobald es genehmigt ist.` },
  { q:`Wie funktioniert die Unternehmensverifizierung?`, a:`Jedes registrierte Unternehmen übermittelt den Zugangscode zu seinem Permanenten Handelsregister-Zertifikat. Unser Team bestätigt, dass der Code gültig ist und die Daten (Name, Steuernummer, Tätigkeit) übereinstimmen. Verifizierte Unternehmen zeigen ein grünes ✓ Verifiziert-Abzeichen.` },
  { q:`Sind meine Daten sicher?`, a:`Ja. Passwörter werden mit bcrypt gespeichert, die Sitzung verwendet ein signiertes HttpOnly-Cookie, und der Code des Permanenten Zertifikats wird nie öffentlich angezeigt — nur der Unternehmensinhaber und Hivex-Administratoren haben Zugriff. Wir erfüllen die DSGVO vollständig. <a href="#legal/privacy" onclick="closeFaq();openLegal('privacy');return false">Datenschutzrichtlinie ansehen</a>.` },
  { q:`Kann ich mein Unternehmen nach der Registrierung bearbeiten?`, a:`Ja. Melden Sie sich an, öffnen Sie das Avatar-Menü und klicken Sie auf <strong>„Mein Profil“</strong>. Dort finden Sie Ihr Unternehmen mit einer ✏️-Schaltfläche zum Bearbeiten. Einige Änderungen erfordern möglicherweise eine erneute Genehmigung.` },
  { q:`Wie kontaktiere ich ein Unternehmen?`, a:`Öffnen Sie das Unternehmensprofil auf der Karte oder in der Suche. Angemeldete Nutzer sehen drei Optionen: <strong>Angebot per E-Mail anfordern</strong>, <strong>WhatsApp</strong> und <strong>Direktnachricht</strong>. Hivex gibt den direkten Kontakt eines Unternehmens niemals öffentlich preis, bevor sich der Nutzer anmeldet.` },
  { q:`Mein Unternehmen erscheint nicht auf der Karte, was tun?`, a:`<ul><li>Prüfen Sie, ob die Registrierung genehmigt ist (Avatar → „Registrierungsstatus“).</li><li>Stellen Sie sicher, dass der Suchradius den Standort des Unternehmens abdeckt.</li><li>Stellen Sie sicher, dass der in der Suche gewählte Bereich dem des Unternehmens entspricht.</li><li>Wenn nichts davon hilft, kontaktieren Sie <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</li></ul>` },
  { q:`Wie hinterlasse ich eine Bewertung?`, a:`Melden Sie sich an, öffnen Sie das Unternehmensprofil und klicken Sie auf <strong>„+ Bewertung schreiben“</strong>. Sie können 1 bis 5 Sterne und einen kurzen Kommentar vergeben. Jeder Nutzer kann ein Unternehmen einmal bewerten (die nächste Bewertung ersetzt die vorherige).` },
  { q:`Was bedeutet „Top Rated“?`, a:`Unternehmen mit einer Durchschnittsbewertung von 4,5 Sternen oder höher und mindestens 5 Bewertungen. Es ist ein automatisches Signal, das auf den Karten und in den Filtern erscheint.` },
  { q:`Kann ich mein Konto löschen?`, a:`Ja. Senden Sie eine Anfrage an <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a> mit Angabe der Konto-E-Mail. Wir löschen die Daten innerhalb von 30 Tagen gemäß der DSGVO.` },
];

function openFaq() {
  const lang = (typeof currentLang !== 'undefined' && currentLang) || 'pt';
  const items = FAQ_DOCS[lang] || FAQ_DOCS.pt;
  const body = document.getElementById('faqBody');
  if (body) {
    body.innerHTML = items.map(item => `
      <details class="faq-item">
        <summary>${item.q}</summary>
        <div class="faq-item-body"><p>${item.a}</p></div>
      </details>`).join('');
  }
  const ov = document.getElementById('faqOverlay');
  if (ov) { ov.classList.add('open'); document.body.style.overflow = 'hidden'; }
  if (history.replaceState) history.replaceState(null, '', '#faq');
}
function closeFaq() {
  const ov = document.getElementById('faqOverlay');
  if (ov) ov.classList.remove('open');
  document.body.style.overflow = '';
  if (location.hash === '#faq' && history.replaceState) history.replaceState(null, '', location.pathname);
}
window.openFaq  = openFaq;
window.closeFaq = closeFaq;
// Open via deep link /#faq
(function() { if (location.hash === '#faq') setTimeout(openFaq, 200); })();

// ── LEGAL MODAL (Terms / Privacy / Cookies / RGPD) ─────────────────────────
// Content lives in JS so it's translated alongside everything else and
// doesn't need separate static pages.
const LEGAL_DOCS = {
  pt: {
    terms: {
      title: 'Termos de Serviço',
      meta:  'Última atualização: 28 de Abril de 2026',
      html: `
        <p>Bem-vindo à <strong>Hivex</strong>, marketplace que liga empresas e particulares aos melhores profissionais de construção em Portugal. Ao usar a plataforma, aceita estes Termos de Serviço.</p>
        <h3>1. Quem somos</h3>
        <p>A Hivex é uma plataforma operada em Portugal que disponibiliza um diretório pesquisável de empresas registadas no setor da construção e serviços associados, permitindo aos utilizadores comparar perfis, ler avaliações e contactar diretamente os fornecedores.</p>
        <h3>2. Conta de utilizador</h3>
        <ul>
          <li>O utilizador é responsável pela veracidade dos dados fornecidos no registo.</li>
          <li>Empresas registadas devem fornecer um <strong>código da Certidão Permanente</strong> válido emitido pelo Registo Comercial.</li>
          <li>É proibido criar contas em nome de terceiros sem autorização.</li>
        </ul>
        <h3>3. Conteúdo de empresas e avaliações</h3>
        <ul>
          <li>As empresas são responsáveis pelo conteúdo dos seus perfis. A Hivex reserva-se o direito de remover conteúdo enganoso, ofensivo ou ilegal.</li>
          <li>As avaliações refletem a opinião pessoal de quem as publica e devem basear-se em interações reais.</li>
        </ul>
        <h3>4. Limitação de responsabilidade</h3>
        <p>A Hivex funciona como intermediário tecnológico. Não somos parte em contratos, orçamentos ou disputas comerciais entre clientes e empresas. Recomendamos sempre confirmação independente das credenciais profissionais antes de contratar serviços.</p>
        <h3>5. Lei aplicável</h3>
        <p>Estes termos regem-se pela lei portuguesa. Eventuais litígios serão dirimidos no foro do Tribunal Judicial da Comarca de Lisboa.</p>
        <h3>6. Contacto</h3>
        <p>Dúvidas: <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</p>
      `,
    },
    privacy: {
      title: 'Política de Privacidade',
      meta:  'Última atualização: 28 de Abril de 2026 · Conformidade RGPD',
      html: `
        <p>A Hivex respeita a sua privacidade e cumpre o <strong>Regulamento (UE) 2016/679 (RGPD)</strong> e a Lei n.º 58/2019 de Portugal.</p>
        <h3>1. Responsável pelo tratamento</h3>
        <p>Hivex — <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
        <h3>2. Dados que recolhemos</h3>
        <ul>
          <li><strong>Conta:</strong> nome, e-mail, palavra-passe (cifrada com bcrypt) ou identificador Google. Telefone se for empresa.</li>
          <li><strong>Empresa:</strong> dados públicos comerciais (nome, CAE, morada, contactos) + código da Certidão Permanente (apenas visível ao próprio e à equipa Hivex).</li>
          <li><strong>Utilização:</strong> eventos analíticos básicos (visualizações de perfis, cliques) — apenas se aceitar cookies analíticos.</li>
          <li><strong>Localização:</strong> coordenadas só se autorizar o navegador a partilhá-las; nunca são guardadas no servidor.</li>
        </ul>
        <h3>3. Para que usamos os dados</h3>
        <ul>
          <li>Operar a plataforma e autenticar utilizadores.</li>
          <li>Mostrar empresas relevantes em pesquisas e mapa.</li>
          <li>Enviar emails transacionais (confirmação de registo, aprovação, mensagens entre utilizadores).</li>
          <li>Prevenir fraude e abuso (rate-limiting baseado em IP).</li>
        </ul>
        <h3>4. Base legal</h3>
        <p>Execução do contrato (Art. 6.º, n.º 1, alínea b)) para conta e perfil; consentimento (alínea a)) para cookies analíticos; interesse legítimo (alínea f)) para prevenção de fraude.</p>
        <h3>5. Partilha com terceiros</h3>
        <p>Não vendemos dados. Partilhamos apenas com sub-processadores estritamente necessários: <strong>Vercel</strong> (hospedagem), <strong>Neon/Postgres</strong> (base de dados), <strong>Google</strong> (Sign-in opcional e publicidade — ver ponto 5.1), <strong>OpenStreetMap/Carto</strong> (tiles do mapa). Todos cumprem o RGPD.</p>
        <h3>5.1 Publicidade (Google AdSense)</h3>
        <p>A Hivex pode apresentar anúncios fornecidos pelo <strong>Google AdSense</strong>. Fornecedores terceiros, incluindo a Google, utilizam cookies para apresentar anúncios com base em visitas anteriores do utilizador a este e a outros sites. A Google utiliza cookies de publicidade para apresentar anúncios; pode <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">desativar a publicidade personalizada</a> nas Definições de anúncios da Google ou recusar cookies de fornecedores terceiros em <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener">aboutads.info/choices</a>. Mais informação na <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">política da Google sobre como utiliza dados de sites parceiros</a>. No Espaço Económico Europeu, Reino Unido e Suíça, os anúncios e respetivos cookies só são ativados <strong>após o seu consentimento</strong>, recolhido através do nosso banner de cookies — sem consentimento não são utilizados cookies de publicidade personalizada.</p>
        <h3>6. Período de conservação</h3>
        <p>Mantemos os dados enquanto a conta estiver ativa. Após eliminação, dados de conta são apagados em 30 dias. Logs de segurança: 12 meses. Empresas aprovadas continuam visíveis no diretório até pedido de remoção.</p>
        <h3>7. Os seus direitos</h3>
        <ul>
          <li>Aceder, retificar, eliminar ou portar os seus dados.</li>
          <li>Limitar ou opor-se ao tratamento.</li>
          <li>Retirar consentimento a qualquer momento.</li>
          <li>Apresentar reclamação à <a href="https://www.cnpd.pt/" target="_blank" rel="noopener">CNPD</a>.</li>
        </ul>
        <p>Para exercer qualquer destes direitos: <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</p>
      `,
    },
    cookies: {
      title: 'Política de Cookies',
      meta:  'Última atualização: 28 de Abril de 2026',
      html: `
        <p>Esta página explica que cookies e tecnologias semelhantes a Hivex utiliza, e como pode controlá-los.</p>
        <h3>1. O que são cookies?</h3>
        <p>Cookies são pequenos ficheiros de texto guardados pelo seu navegador quando visita um site. Permitem-nos lembrar preferências e compreender como a plataforma é usada.</p>
        <h3>2. Cookies que usamos</h3>
        <p><strong>Estritamente necessários (sempre ativos):</strong></p>
        <ul>
          <li><code>hive_token</code> — cookie HttpOnly de autenticação. Caduca em 7 dias.</li>
          <li><code>hive_lang</code> — preferência de idioma (PT/EN/FR/ES/DE), guardada em localStorage.</li>
          <li><code>hive_cookie_consent</code> — regista a sua escolha sobre este banner.</li>
        </ul>
        <p><strong>Analíticos (apenas com consentimento):</strong></p>
        <ul>
          <li>Eventos agregados de utilização (cliques em perfis, contactos), sem identificação pessoal.</li>
        </ul>
        <p>Não usamos cookies de publicidade nem partilhamos dados com redes de tracking.</p>
        <h3>3. Como gerir</h3>
        <p>Pode aceitar ou rejeitar cookies analíticos no banner que aparece na primeira visita, e mudar de ideias a qualquer momento limpando os cookies do site no seu navegador. Cookies estritamente necessários não podem ser desativados sem comprometer o funcionamento da plataforma.</p>
        <h3>4. Contacto</h3>
        <p><a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
      `,
    },
    rgpd: {
      title: 'RGPD — Os seus direitos',
      meta:  'Resumo dos direitos do titular dos dados',
      html: `
        <p>Como utilizador da Hivex, ao abrigo do <strong>Regulamento Geral de Proteção de Dados</strong>, tem os seguintes direitos:</p>
        <ul>
          <li><strong>Acesso:</strong> obter cópia dos seus dados pessoais.</li>
          <li><strong>Retificação:</strong> corrigir dados incorretos ou incompletos.</li>
          <li><strong>Apagamento ("ser esquecido"):</strong> pedir a eliminação dos seus dados.</li>
          <li><strong>Limitação:</strong> restringir o tratamento em determinadas circunstâncias.</li>
          <li><strong>Portabilidade:</strong> receber os seus dados num formato estruturado e legível.</li>
          <li><strong>Oposição:</strong> opor-se ao tratamento por motivos legítimos.</li>
          <li><strong>Reclamação:</strong> apresentar queixa à autoridade de controlo (<a href="https://www.cnpd.pt/" target="_blank" rel="noopener">CNPD</a> em Portugal).</li>
        </ul>
        <h3>Como exercer os seus direitos</h3>
        <p>Envie um email para <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a> indicando claramente o pedido. Responderemos no prazo máximo de <strong>30 dias</strong>, podendo prolongar-se até 60 dias em casos complexos (com aviso prévio).</p>
        <h3>Encarregado da Proteção de Dados (DPO)</h3>
        <p>Para questões formais relacionadas com proteção de dados pessoais: <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
      `,
    },
  },
};
// Translations are provided for convenience; each non-PT document opens with a
// notice that the Portuguese original is the legally binding text. Have a lawyer
// review before relying on these for compliance.
const _legalNote = {
  en: `<p style="font-size:12px;color:var(--muted);font-style:italic;margin-bottom:14px">Translation provided for convenience. The Portuguese version is the legally binding text.</p>`,
  fr: `<p style="font-size:12px;color:var(--muted);font-style:italic;margin-bottom:14px">Traduction fournie à titre indicatif. La version portugaise constitue le texte juridiquement contraignant.</p>`,
  es: `<p style="font-size:12px;color:var(--muted);font-style:italic;margin-bottom:14px">Traducción proporcionada por comodidad. La versión portuguesa es el texto jurídicamente vinculante.</p>`,
  de: `<p style="font-size:12px;color:var(--muted);font-style:italic;margin-bottom:14px">Übersetzung zur Vereinfachung bereitgestellt. Die portugiesische Fassung ist der rechtlich verbindliche Text.</p>`,
};
LEGAL_DOCS.en = {
  terms: { title:'Terms of Service', meta:'Last updated: 28 April 2026', html:`${_legalNote.en}
    <p>Welcome to <strong>Hivex</strong>, the marketplace connecting businesses and individuals to the best construction professionals in Portugal. By using the platform, you accept these Terms of Service.</p>
    <h3>1. Who we are</h3>
    <p>Hivex is a platform operated in Portugal that provides a searchable directory of companies registered in the construction sector and associated services, allowing users to compare profiles, read reviews and contact suppliers directly.</p>
    <h3>2. User account</h3>
    <ul>
      <li>The user is responsible for the accuracy of the data provided at registration.</li>
      <li>Registered companies must provide a valid <strong>Permanent Certificate code</strong> issued by the Commercial Registry.</li>
      <li>Creating accounts on behalf of third parties without authorisation is prohibited.</li>
    </ul>
    <h3>3. Company content and reviews</h3>
    <ul>
      <li>Companies are responsible for the content of their profiles. Hivex reserves the right to remove misleading, offensive or illegal content.</li>
      <li>Reviews reflect the personal opinion of whoever posts them and must be based on real interactions.</li>
    </ul>
    <h3>4. Limitation of liability</h3>
    <p>Hivex acts as a technological intermediary. We are not party to contracts, quotes or commercial disputes between clients and companies. We always recommend independently confirming professional credentials before hiring services.</p>
    <h3>5. Governing law</h3>
    <p>These terms are governed by Portuguese law. Any disputes shall be settled before the Judicial Court of the District of Lisbon.</p>
    <h3>6. Contact</h3>
    <p>Questions: <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</p>
  ` },
  privacy: { title:'Privacy Policy', meta:'Last updated: 28 April 2026 · GDPR compliant', html:`${_legalNote.en}
    <p>Hivex respects your privacy and complies with <strong>Regulation (EU) 2016/679 (GDPR)</strong> and Portugal's Law No. 58/2019.</p>
    <h3>1. Data controller</h3>
    <p>Hivex — <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
    <h3>2. Data we collect</h3>
    <ul>
      <li><strong>Account:</strong> name, e-mail, password (encrypted with bcrypt) or Google identifier. Phone if a company.</li>
      <li><strong>Company:</strong> public commercial data (name, business code, address, contacts) + Permanent Certificate code (only visible to the owner and the Hivex team).</li>
      <li><strong>Usage:</strong> basic analytics events (profile views, clicks) — only if you accept analytics cookies.</li>
      <li><strong>Location:</strong> coordinates only if you allow the browser to share them; never stored on the server.</li>
    </ul>
    <h3>3. Why we use the data</h3>
    <ul>
      <li>Operate the platform and authenticate users.</li>
      <li>Show relevant companies in searches and on the map.</li>
      <li>Send transactional emails (registration confirmation, approval, messages between users).</li>
      <li>Prevent fraud and abuse (IP-based rate-limiting).</li>
    </ul>
    <h3>4. Legal basis</h3>
    <p>Performance of the contract (Art. 6(1)(b)) for account and profile; consent ((a)) for analytics cookies; legitimate interest ((f)) for fraud prevention.</p>
    <h3>5. Sharing with third parties</h3>
    <p>We do not sell data. We share only with strictly necessary sub-processors: <strong>Vercel</strong> (hosting), <strong>Neon/Postgres</strong> (database), <strong>Google</strong> (optional Sign-in), <strong>OpenStreetMap/Carto</strong> (map tiles). All are GDPR compliant.</p>
    <h3>6. Retention period</h3>
    <p>We keep the data while the account is active. After deletion, account data is erased within 30 days. Security logs: 12 months. Approved companies remain visible in the directory until a removal request.</p>
    <h3>7. Your rights</h3>
    <ul>
      <li>Access, rectify, erase or port your data.</li>
      <li>Restrict or object to processing.</li>
      <li>Withdraw consent at any time.</li>
      <li>Lodge a complaint with the <a href="https://www.cnpd.pt/" target="_blank" rel="noopener">CNPD</a>.</li>
    </ul>
    <p>To exercise any of these rights: <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</p>
  ` },
  cookies: { title:'Cookie Policy', meta:'Last updated: 28 April 2026', html:`${_legalNote.en}
    <p>This page explains which cookies and similar technologies Hivex uses, and how you can control them.</p>
    <h3>1. What are cookies?</h3>
    <p>Cookies are small text files stored by your browser when you visit a site. They let us remember preferences and understand how the platform is used.</p>
    <h3>2. Cookies we use</h3>
    <p><strong>Strictly necessary (always on):</strong></p>
    <ul>
      <li><code>hive_token</code> — HttpOnly authentication cookie. Expires in 7 days.</li>
      <li><code>hive_lang</code> — language preference (PT/EN/FR/ES/DE), stored in localStorage.</li>
      <li><code>hive_cookie_consent</code> — records your choice about this banner.</li>
    </ul>
    <p><strong>Analytics (only with consent):</strong></p>
    <ul>
      <li>Aggregated usage events (profile clicks, contacts), with no personal identification.</li>
    </ul>
    <p>We do not use advertising cookies or share data with tracking networks.</p>
    <h3>3. How to manage</h3>
    <p>You can accept or reject analytics cookies in the banner shown on your first visit, and change your mind at any time by clearing the site's cookies in your browser. Strictly necessary cookies cannot be disabled without compromising the platform's operation.</p>
    <h3>4. Contact</h3>
    <p><a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
  ` },
  rgpd: { title:'GDPR — Your rights', meta:'Summary of data subject rights', html:`${_legalNote.en}
    <p>As a Hivex user, under the <strong>General Data Protection Regulation</strong>, you have the following rights:</p>
    <ul>
      <li><strong>Access:</strong> obtain a copy of your personal data.</li>
      <li><strong>Rectification:</strong> correct inaccurate or incomplete data.</li>
      <li><strong>Erasure ("right to be forgotten"):</strong> request the deletion of your data.</li>
      <li><strong>Restriction:</strong> restrict processing in certain circumstances.</li>
      <li><strong>Portability:</strong> receive your data in a structured, readable format.</li>
      <li><strong>Objection:</strong> object to processing on legitimate grounds.</li>
      <li><strong>Complaint:</strong> lodge a complaint with the supervisory authority (<a href="https://www.cnpd.pt/" target="_blank" rel="noopener">CNPD</a> in Portugal).</li>
    </ul>
    <h3>How to exercise your rights</h3>
    <p>Send an email to <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a> clearly stating your request. We will respond within a maximum of <strong>30 days</strong>, which may be extended to 60 days in complex cases (with prior notice).</p>
    <h3>Data Protection Officer (DPO)</h3>
    <p>For formal matters relating to personal data protection: <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
  ` },
};
LEGAL_DOCS.fr = {
  terms: { title:'Conditions de service', meta:'Dernière mise à jour : 28 avril 2026', html:`${_legalNote.fr}
    <p>Bienvenue sur <strong>Hivex</strong>, la marketplace qui relie les entreprises et les particuliers aux meilleurs professionnels de la construction au Portugal. En utilisant la plateforme, vous acceptez ces Conditions de service.</p>
    <h3>1. Qui sommes-nous</h3>
    <p>Hivex est une plateforme exploitée au Portugal qui propose un annuaire consultable d'entreprises enregistrées dans le secteur de la construction et des services associés, permettant aux utilisateurs de comparer des profils, de lire des avis et de contacter directement les prestataires.</p>
    <h3>2. Compte utilisateur</h3>
    <ul>
      <li>L'utilisateur est responsable de l'exactitude des données fournies lors de l'inscription.</li>
      <li>Les entreprises inscrites doivent fournir un <strong>code de Certificat Permanent</strong> valide délivré par le Registre du Commerce.</li>
      <li>Il est interdit de créer des comptes au nom de tiers sans autorisation.</li>
    </ul>
    <h3>3. Contenu des entreprises et avis</h3>
    <ul>
      <li>Les entreprises sont responsables du contenu de leurs profils. Hivex se réserve le droit de supprimer tout contenu trompeur, offensant ou illégal.</li>
      <li>Les avis reflètent l'opinion personnelle de leur auteur et doivent se fonder sur des interactions réelles.</li>
    </ul>
    <h3>4. Limitation de responsabilité</h3>
    <p>Hivex agit comme un intermédiaire technologique. Nous ne sommes pas partie aux contrats, devis ou litiges commerciaux entre clients et entreprises. Nous recommandons toujours de vérifier de manière indépendante les qualifications professionnelles avant d'engager des services.</p>
    <h3>5. Droit applicable</h3>
    <p>Ces conditions sont régies par le droit portugais. Tout litige sera tranché devant le Tribunal judiciaire de la Comarca de Lisbonne.</p>
    <h3>6. Contact</h3>
    <p>Questions : <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</p>
  ` },
  privacy: { title:'Politique de confidentialité', meta:'Dernière mise à jour : 28 avril 2026 · Conforme au RGPD', html:`${_legalNote.fr}
    <p>Hivex respecte votre vie privée et se conforme au <strong>Règlement (UE) 2016/679 (RGPD)</strong> et à la loi portugaise n° 58/2019.</p>
    <h3>1. Responsable du traitement</h3>
    <p>Hivex — <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
    <h3>2. Données que nous collectons</h3>
    <ul>
      <li><strong>Compte :</strong> nom, e-mail, mot de passe (chiffré avec bcrypt) ou identifiant Google. Téléphone s'il s'agit d'une entreprise.</li>
      <li><strong>Entreprise :</strong> données commerciales publiques (nom, code d'activité, adresse, contacts) + code de Certificat Permanent (visible uniquement par le propriétaire et l'équipe Hivex).</li>
      <li><strong>Utilisation :</strong> événements analytiques de base (vues de profils, clics) — uniquement si vous acceptez les cookies analytiques.</li>
      <li><strong>Localisation :</strong> coordonnées uniquement si vous autorisez le navigateur à les partager ; jamais enregistrées sur le serveur.</li>
    </ul>
    <h3>3. Pourquoi nous utilisons les données</h3>
    <ul>
      <li>Exploiter la plateforme et authentifier les utilisateurs.</li>
      <li>Afficher les entreprises pertinentes dans les recherches et sur la carte.</li>
      <li>Envoyer des e-mails transactionnels (confirmation d'inscription, approbation, messages entre utilisateurs).</li>
      <li>Prévenir la fraude et les abus (limitation de débit basée sur l'IP).</li>
    </ul>
    <h3>4. Base légale</h3>
    <p>Exécution du contrat (art. 6, §1, b)) pour le compte et le profil ; consentement (a)) pour les cookies analytiques ; intérêt légitime (f)) pour la prévention de la fraude.</p>
    <h3>5. Partage avec des tiers</h3>
    <p>Nous ne vendons pas de données. Nous les partageons uniquement avec les sous-traitants strictement nécessaires : <strong>Vercel</strong> (hébergement), <strong>Neon/Postgres</strong> (base de données), <strong>Google</strong> (connexion facultative), <strong>OpenStreetMap/Carto</strong> (tuiles de la carte). Tous sont conformes au RGPD.</p>
    <h3>6. Durée de conservation</h3>
    <p>Nous conservons les données tant que le compte est actif. Après suppression, les données du compte sont effacées sous 30 jours. Journaux de sécurité : 12 mois. Les entreprises approuvées restent visibles dans l'annuaire jusqu'à une demande de retrait.</p>
    <h3>7. Vos droits</h3>
    <ul>
      <li>Accéder à vos données, les rectifier, les effacer ou les porter.</li>
      <li>Limiter le traitement ou vous y opposer.</li>
      <li>Retirer votre consentement à tout moment.</li>
      <li>Déposer une réclamation auprès de la <a href="https://www.cnpd.pt/" target="_blank" rel="noopener">CNPD</a>.</li>
    </ul>
    <p>Pour exercer l'un de ces droits : <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</p>
  ` },
  cookies: { title:'Politique relative aux cookies', meta:'Dernière mise à jour : 28 avril 2026', html:`${_legalNote.fr}
    <p>Cette page explique quels cookies et technologies similaires Hivex utilise, et comment vous pouvez les contrôler.</p>
    <h3>1. Que sont les cookies ?</h3>
    <p>Les cookies sont de petits fichiers texte enregistrés par votre navigateur lorsque vous visitez un site. Ils nous permettent de mémoriser des préférences et de comprendre comment la plateforme est utilisée.</p>
    <h3>2. Cookies que nous utilisons</h3>
    <p><strong>Strictement nécessaires (toujours actifs) :</strong></p>
    <ul>
      <li><code>hive_token</code> — cookie d'authentification HttpOnly. Expire après 7 jours.</li>
      <li><code>hive_lang</code> — préférence de langue (PT/EN/FR/ES/DE), enregistrée dans localStorage.</li>
      <li><code>hive_cookie_consent</code> — enregistre votre choix concernant cette bannière.</li>
    </ul>
    <p><strong>Analytiques (uniquement avec consentement) :</strong></p>
    <ul>
      <li>Événements d'utilisation agrégés (clics sur les profils, contacts), sans identification personnelle.</li>
    </ul>
    <p>Nous n'utilisons pas de cookies publicitaires et ne partageons pas de données avec des réseaux de suivi.</p>
    <h3>3. Comment les gérer</h3>
    <p>Vous pouvez accepter ou refuser les cookies analytiques dans la bannière affichée lors de votre première visite, et changer d'avis à tout moment en supprimant les cookies du site dans votre navigateur. Les cookies strictement nécessaires ne peuvent pas être désactivés sans compromettre le fonctionnement de la plateforme.</p>
    <h3>4. Contact</h3>
    <p><a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
  ` },
  rgpd: { title:'RGPD — Vos droits', meta:'Résumé des droits de la personne concernée', html:`${_legalNote.fr}
    <p>En tant qu'utilisateur de Hivex, au titre du <strong>Règlement Général sur la Protection des Données</strong>, vous disposez des droits suivants :</p>
    <ul>
      <li><strong>Accès :</strong> obtenir une copie de vos données personnelles.</li>
      <li><strong>Rectification :</strong> corriger des données inexactes ou incomplètes.</li>
      <li><strong>Effacement (« droit à l'oubli ») :</strong> demander la suppression de vos données.</li>
      <li><strong>Limitation :</strong> restreindre le traitement dans certaines circonstances.</li>
      <li><strong>Portabilité :</strong> recevoir vos données dans un format structuré et lisible.</li>
      <li><strong>Opposition :</strong> vous opposer au traitement pour des motifs légitimes.</li>
      <li><strong>Réclamation :</strong> déposer une plainte auprès de l'autorité de contrôle (<a href="https://www.cnpd.pt/" target="_blank" rel="noopener">CNPD</a> au Portugal).</li>
    </ul>
    <h3>Comment exercer vos droits</h3>
    <p>Envoyez un e-mail à <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a> en indiquant clairement votre demande. Nous répondrons dans un délai maximal de <strong>30 jours</strong>, pouvant être prolongé jusqu'à 60 jours dans les cas complexes (avec préavis).</p>
    <h3>Délégué à la protection des données (DPO)</h3>
    <p>Pour les questions formelles relatives à la protection des données personnelles : <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
  ` },
};
LEGAL_DOCS.es = {
  terms: { title:'Términos del servicio', meta:'Última actualización: 28 de abril de 2026', html:`${_legalNote.es}
    <p>Bienvenido a <strong>Hivex</strong>, el marketplace que conecta a empresas y particulares con los mejores profesionales de la construcción en Portugal. Al usar la plataforma, aceptas estos Términos del servicio.</p>
    <h3>1. Quiénes somos</h3>
    <p>Hivex es una plataforma operada en Portugal que ofrece un directorio consultable de empresas registradas en el sector de la construcción y servicios asociados, permitiendo a los usuarios comparar perfiles, leer valoraciones y contactar directamente con los proveedores.</p>
    <h3>2. Cuenta de usuario</h3>
    <ul>
      <li>El usuario es responsable de la veracidad de los datos facilitados en el registro.</li>
      <li>Las empresas registradas deben facilitar un <strong>código de Certificado Permanente</strong> válido emitido por el Registro Mercantil.</li>
      <li>Está prohibido crear cuentas en nombre de terceros sin autorización.</li>
    </ul>
    <h3>3. Contenido de empresas y valoraciones</h3>
    <ul>
      <li>Las empresas son responsables del contenido de sus perfiles. Hivex se reserva el derecho de eliminar contenido engañoso, ofensivo o ilegal.</li>
      <li>Las valoraciones reflejan la opinión personal de quien las publica y deben basarse en interacciones reales.</li>
    </ul>
    <h3>4. Limitación de responsabilidad</h3>
    <p>Hivex actúa como intermediario tecnológico. No somos parte en contratos, presupuestos ni disputas comerciales entre clientes y empresas. Recomendamos siempre confirmar de forma independiente las credenciales profesionales antes de contratar servicios.</p>
    <h3>5. Ley aplicable</h3>
    <p>Estos términos se rigen por la ley portuguesa. Cualquier litigio se resolverá ante el Tribunal Judicial de la Comarca de Lisboa.</p>
    <h3>6. Contacto</h3>
    <p>Dudas: <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</p>
  ` },
  privacy: { title:'Política de Privacidad', meta:'Última actualización: 28 de abril de 2026 · Conforme al RGPD', html:`${_legalNote.es}
    <p>Hivex respeta tu privacidad y cumple el <strong>Reglamento (UE) 2016/679 (RGPD)</strong> y la Ley n.º 58/2019 de Portugal.</p>
    <h3>1. Responsable del tratamiento</h3>
    <p>Hivex — <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
    <h3>2. Datos que recogemos</h3>
    <ul>
      <li><strong>Cuenta:</strong> nombre, correo, contraseña (cifrada con bcrypt) o identificador de Google. Teléfono si es empresa.</li>
      <li><strong>Empresa:</strong> datos comerciales públicos (nombre, código de actividad, dirección, contactos) + código de Certificado Permanente (solo visible para el propietario y el equipo de Hivex).</li>
      <li><strong>Uso:</strong> eventos analíticos básicos (visualizaciones de perfiles, clics) — solo si aceptas cookies analíticas.</li>
      <li><strong>Ubicación:</strong> coordenadas solo si autorizas al navegador a compartirlas; nunca se guardan en el servidor.</li>
    </ul>
    <h3>3. Para qué usamos los datos</h3>
    <ul>
      <li>Operar la plataforma y autenticar a los usuarios.</li>
      <li>Mostrar empresas relevantes en búsquedas y en el mapa.</li>
      <li>Enviar correos transaccionales (confirmación de registro, aprobación, mensajes entre usuarios).</li>
      <li>Prevenir el fraude y el abuso (limitación de tasa basada en IP).</li>
    </ul>
    <h3>4. Base legal</h3>
    <p>Ejecución del contrato (art. 6, ap. 1, letra b)) para la cuenta y el perfil; consentimiento (letra a)) para las cookies analíticas; interés legítimo (letra f)) para la prevención del fraude.</p>
    <h3>5. Compartición con terceros</h3>
    <p>No vendemos datos. Solo los compartimos con los encargados estrictamente necesarios: <strong>Vercel</strong> (alojamiento), <strong>Neon/Postgres</strong> (base de datos), <strong>Google</strong> (inicio de sesión opcional), <strong>OpenStreetMap/Carto</strong> (teselas del mapa). Todos cumplen el RGPD.</p>
    <h3>6. Periodo de conservación</h3>
    <p>Conservamos los datos mientras la cuenta esté activa. Tras la eliminación, los datos de la cuenta se borran en 30 días. Registros de seguridad: 12 meses. Las empresas aprobadas siguen visibles en el directorio hasta que se solicite su retirada.</p>
    <h3>7. Tus derechos</h3>
    <ul>
      <li>Acceder, rectificar, eliminar o portar tus datos.</li>
      <li>Limitar el tratamiento u oponerte a él.</li>
      <li>Retirar el consentimiento en cualquier momento.</li>
      <li>Presentar una reclamación ante la <a href="https://www.cnpd.pt/" target="_blank" rel="noopener">CNPD</a>.</li>
    </ul>
    <p>Para ejercer cualquiera de estos derechos: <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</p>
  ` },
  cookies: { title:'Política de Cookies', meta:'Última actualización: 28 de abril de 2026', html:`${_legalNote.es}
    <p>Esta página explica qué cookies y tecnologías similares utiliza Hivex, y cómo puedes controlarlas.</p>
    <h3>1. ¿Qué son las cookies?</h3>
    <p>Las cookies son pequeños archivos de texto que tu navegador guarda cuando visitas un sitio. Nos permiten recordar preferencias y entender cómo se usa la plataforma.</p>
    <h3>2. Cookies que usamos</h3>
    <p><strong>Estrictamente necesarias (siempre activas):</strong></p>
    <ul>
      <li><code>hive_token</code> — cookie HttpOnly de autenticación. Caduca a los 7 días.</li>
      <li><code>hive_lang</code> — preferencia de idioma (PT/EN/FR/ES/DE), guardada en localStorage.</li>
      <li><code>hive_cookie_consent</code> — registra tu elección sobre este banner.</li>
    </ul>
    <p><strong>Analíticas (solo con consentimiento):</strong></p>
    <ul>
      <li>Eventos de uso agregados (clics en perfiles, contactos), sin identificación personal.</li>
    </ul>
    <p>No usamos cookies publicitarias ni compartimos datos con redes de rastreo.</p>
    <h3>3. Cómo gestionarlas</h3>
    <p>Puedes aceptar o rechazar las cookies analíticas en el banner que aparece en la primera visita, y cambiar de opinión en cualquier momento borrando las cookies del sitio en tu navegador. Las cookies estrictamente necesarias no pueden desactivarse sin comprometer el funcionamiento de la plataforma.</p>
    <h3>4. Contacto</h3>
    <p><a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
  ` },
  rgpd: { title:'RGPD — Tus derechos', meta:'Resumen de los derechos del interesado', html:`${_legalNote.es}
    <p>Como usuario de Hivex, en virtud del <strong>Reglamento General de Protección de Datos</strong>, tienes los siguientes derechos:</p>
    <ul>
      <li><strong>Acceso:</strong> obtener una copia de tus datos personales.</li>
      <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
      <li><strong>Supresión («derecho al olvido»):</strong> solicitar la eliminación de tus datos.</li>
      <li><strong>Limitación:</strong> restringir el tratamiento en determinadas circunstancias.</li>
      <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado y legible.</li>
      <li><strong>Oposición:</strong> oponerte al tratamiento por motivos legítimos.</li>
      <li><strong>Reclamación:</strong> presentar una queja ante la autoridad de control (<a href="https://www.cnpd.pt/" target="_blank" rel="noopener">CNPD</a> en Portugal).</li>
    </ul>
    <h3>Cómo ejercer tus derechos</h3>
    <p>Envía un correo a <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a> indicando claramente tu solicitud. Responderemos en un plazo máximo de <strong>30 días</strong>, ampliable hasta 60 días en casos complejos (con aviso previo).</p>
    <h3>Delegado de Protección de Datos (DPD)</h3>
    <p>Para asuntos formales relacionados con la protección de datos personales: <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
  ` },
};
LEGAL_DOCS.de = {
  terms: { title:'Nutzungsbedingungen', meta:'Zuletzt aktualisiert: 28. April 2026', html:`${_legalNote.de}
    <p>Willkommen bei <strong>Hivex</strong>, dem Marketplace, der Unternehmen und Privatpersonen mit den besten Baufachleuten in Portugal verbindet. Durch die Nutzung der Plattform akzeptieren Sie diese Nutzungsbedingungen.</p>
    <h3>1. Wer wir sind</h3>
    <p>Hivex ist eine in Portugal betriebene Plattform, die ein durchsuchbares Verzeichnis von Unternehmen aus dem Bausektor und zugehörigen Dienstleistungen bereitstellt und es Nutzern ermöglicht, Profile zu vergleichen, Bewertungen zu lesen und Anbieter direkt zu kontaktieren.</p>
    <h3>2. Nutzerkonto</h3>
    <ul>
      <li>Der Nutzer ist für die Richtigkeit der bei der Registrierung angegebenen Daten verantwortlich.</li>
      <li>Registrierte Unternehmen müssen einen gültigen <strong>Code des Permanenten Zertifikats</strong> vorlegen, der vom Handelsregister ausgestellt wurde.</li>
      <li>Das Erstellen von Konten im Namen Dritter ohne Genehmigung ist untersagt.</li>
    </ul>
    <h3>3. Unternehmensinhalte und Bewertungen</h3>
    <ul>
      <li>Unternehmen sind für den Inhalt ihrer Profile verantwortlich. Hivex behält sich das Recht vor, irreführende, beleidigende oder rechtswidrige Inhalte zu entfernen.</li>
      <li>Bewertungen geben die persönliche Meinung des Verfassers wieder und müssen auf realen Interaktionen beruhen.</li>
    </ul>
    <h3>4. Haftungsbeschränkung</h3>
    <p>Hivex fungiert als technologischer Vermittler. Wir sind nicht Partei von Verträgen, Angeboten oder geschäftlichen Streitigkeiten zwischen Kunden und Unternehmen. Wir empfehlen stets, die beruflichen Qualifikationen vor der Beauftragung von Dienstleistungen unabhängig zu prüfen.</p>
    <h3>5. Anwendbares Recht</h3>
    <p>Diese Bedingungen unterliegen portugiesischem Recht. Etwaige Streitigkeiten werden vor dem Bezirksgericht von Lissabon beigelegt.</p>
    <h3>6. Kontakt</h3>
    <p>Fragen: <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</p>
  ` },
  privacy: { title:'Datenschutzrichtlinie', meta:'Zuletzt aktualisiert: 28. April 2026 · DSGVO-konform', html:`${_legalNote.de}
    <p>Hivex respektiert Ihre Privatsphäre und erfüllt die <strong>Verordnung (EU) 2016/679 (DSGVO)</strong> sowie das portugiesische Gesetz Nr. 58/2019.</p>
    <h3>1. Verantwortlicher</h3>
    <p>Hivex — <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
    <h3>2. Daten, die wir erheben</h3>
    <ul>
      <li><strong>Konto:</strong> Name, E-Mail, Passwort (mit bcrypt verschlüsselt) oder Google-Kennung. Telefon, wenn ein Unternehmen.</li>
      <li><strong>Unternehmen:</strong> öffentliche Geschäftsdaten (Name, Tätigkeitscode, Adresse, Kontakte) + Code des Permanenten Zertifikats (nur für den Inhaber und das Hivex-Team sichtbar).</li>
      <li><strong>Nutzung:</strong> grundlegende Analyse-Ereignisse (Profilaufrufe, Klicks) — nur wenn Sie Analyse-Cookies akzeptieren.</li>
      <li><strong>Standort:</strong> Koordinaten nur, wenn Sie dem Browser die Freigabe erlauben; werden nie auf dem Server gespeichert.</li>
    </ul>
    <h3>3. Wofür wir die Daten verwenden</h3>
    <ul>
      <li>Betrieb der Plattform und Authentifizierung der Nutzer.</li>
      <li>Anzeige relevanter Unternehmen in Suchergebnissen und auf der Karte.</li>
      <li>Versand transaktionaler E-Mails (Registrierungsbestätigung, Genehmigung, Nachrichten zwischen Nutzern).</li>
      <li>Verhinderung von Betrug und Missbrauch (IP-basierte Ratenbegrenzung).</li>
    </ul>
    <h3>4. Rechtsgrundlage</h3>
    <p>Vertragserfüllung (Art. 6 Abs. 1 lit. b) für Konto und Profil; Einwilligung (lit. a) für Analyse-Cookies; berechtigtes Interesse (lit. f) für die Betrugsprävention.</p>
    <h3>5. Weitergabe an Dritte</h3>
    <p>Wir verkaufen keine Daten. Wir geben sie nur an die unbedingt notwendigen Auftragsverarbeiter weiter: <strong>Vercel</strong> (Hosting), <strong>Neon/Postgres</strong> (Datenbank), <strong>Google</strong> (optionale Anmeldung), <strong>OpenStreetMap/Carto</strong> (Kartenkacheln). Alle sind DSGVO-konform.</p>
    <h3>6. Aufbewahrungsdauer</h3>
    <p>Wir bewahren die Daten auf, solange das Konto aktiv ist. Nach der Löschung werden Kontodaten innerhalb von 30 Tagen gelöscht. Sicherheitsprotokolle: 12 Monate. Genehmigte Unternehmen bleiben im Verzeichnis sichtbar, bis eine Entfernung beantragt wird.</p>
    <h3>7. Ihre Rechte</h3>
    <ul>
      <li>Auf Ihre Daten zugreifen, sie berichtigen, löschen oder übertragen.</li>
      <li>Die Verarbeitung einschränken oder ihr widersprechen.</li>
      <li>Ihre Einwilligung jederzeit widerrufen.</li>
      <li>Eine Beschwerde bei der <a href="https://www.cnpd.pt/" target="_blank" rel="noopener">CNPD</a> einreichen.</li>
    </ul>
    <p>Zur Ausübung dieser Rechte: <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a>.</p>
  ` },
  cookies: { title:'Cookie-Richtlinie', meta:'Zuletzt aktualisiert: 28. April 2026', html:`${_legalNote.de}
    <p>Diese Seite erklärt, welche Cookies und ähnlichen Technologien Hivex verwendet und wie Sie sie steuern können.</p>
    <h3>1. Was sind Cookies?</h3>
    <p>Cookies sind kleine Textdateien, die Ihr Browser beim Besuch einer Website speichert. Sie ermöglichen es uns, Präferenzen zu speichern und zu verstehen, wie die Plattform genutzt wird.</p>
    <h3>2. Cookies, die wir verwenden</h3>
    <p><strong>Unbedingt erforderlich (immer aktiv):</strong></p>
    <ul>
      <li><code>hive_token</code> — HttpOnly-Authentifizierungs-Cookie. Läuft nach 7 Tagen ab.</li>
      <li><code>hive_lang</code> — Sprachpräferenz (PT/EN/FR/ES/DE), im localStorage gespeichert.</li>
      <li><code>hive_cookie_consent</code> — speichert Ihre Wahl zu diesem Banner.</li>
    </ul>
    <p><strong>Analytik (nur mit Einwilligung):</strong></p>
    <ul>
      <li>Aggregierte Nutzungsereignisse (Profilklicks, Kontakte), ohne persönliche Identifizierung.</li>
    </ul>
    <p>Wir verwenden keine Werbe-Cookies und teilen keine Daten mit Tracking-Netzwerken.</p>
    <h3>3. Verwaltung</h3>
    <p>Sie können Analyse-Cookies in dem beim ersten Besuch angezeigten Banner akzeptieren oder ablehnen und Ihre Meinung jederzeit ändern, indem Sie die Cookies der Website in Ihrem Browser löschen. Unbedingt erforderliche Cookies können nicht deaktiviert werden, ohne den Betrieb der Plattform zu beeinträchtigen.</p>
    <h3>4. Kontakt</h3>
    <p><a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
  ` },
  rgpd: { title:'DSGVO — Ihre Rechte', meta:'Zusammenfassung der Betroffenenrechte', html:`${_legalNote.de}
    <p>Als Hivex-Nutzer haben Sie gemäß der <strong>Datenschutz-Grundverordnung</strong> die folgenden Rechte:</p>
    <ul>
      <li><strong>Auskunft:</strong> eine Kopie Ihrer personenbezogenen Daten erhalten.</li>
      <li><strong>Berichtigung:</strong> unrichtige oder unvollständige Daten korrigieren.</li>
      <li><strong>Löschung („Recht auf Vergessenwerden“):</strong> die Löschung Ihrer Daten verlangen.</li>
      <li><strong>Einschränkung:</strong> die Verarbeitung unter bestimmten Umständen einschränken.</li>
      <li><strong>Übertragbarkeit:</strong> Ihre Daten in einem strukturierten, lesbaren Format erhalten.</li>
      <li><strong>Widerspruch:</strong> der Verarbeitung aus berechtigten Gründen widersprechen.</li>
      <li><strong>Beschwerde:</strong> eine Beschwerde bei der Aufsichtsbehörde einreichen (<a href="https://www.cnpd.pt/" target="_blank" rel="noopener">CNPD</a> in Portugal).</li>
    </ul>
    <h3>Wie Sie Ihre Rechte ausüben</h3>
    <p>Senden Sie eine E-Mail an <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a> und geben Sie Ihr Anliegen klar an. Wir antworten innerhalb von höchstens <strong>30 Tagen</strong>, in komplexen Fällen verlängerbar auf bis zu 60 Tage (mit vorheriger Mitteilung).</p>
    <h3>Datenschutzbeauftragter (DSB)</h3>
    <p>Für formelle Angelegenheiten im Zusammenhang mit dem Schutz personenbezogener Daten: <a href="mailto:geral.hivex@gmail.com">geral.hivex@gmail.com</a></p>
  ` },
};

function openLegal(kind) {
  const lang = (typeof currentLang !== 'undefined' && currentLang) || 'pt';
  const doc  = (LEGAL_DOCS[lang] || LEGAL_DOCS.pt)[kind] || LEGAL_DOCS.pt[kind];
  if (!doc) return;
  document.getElementById('legalTitle').textContent = doc.title;
  document.getElementById('legalMeta').textContent  = doc.meta || '';
  document.getElementById('legalBody').innerHTML    = doc.html;
  const ov = document.getElementById('legalOverlay');
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (history.replaceState) history.replaceState(null, '', '#legal/' + kind);
}
function closeLegal() {
  const ov = document.getElementById('legalOverlay');
  if (ov) ov.classList.remove('open');
  document.body.style.overflow = '';
  if (location.hash.startsWith('#legal/') && history.replaceState) history.replaceState(null, '', location.pathname);
}
window.openLegal  = openLegal;
window.closeLegal = closeLegal;

// Open legal modal if landing on /#legal/<kind>
(function() {
  const m = location.hash.match(/^#legal\/(terms|privacy|cookies|rgpd)$/);
  if (m) setTimeout(() => openLegal(m[1]), 200);
})();

// ── COOKIE CONSENT ─────────────────────────────────────────────────────────
// Records the user's choice in localStorage. Until consent is given, the
// analytics tracker (api.trackEvent) is a no-op. Strictly-necessary cookies
// (auth, language) are always set — that's allowed by ePrivacy without consent.
const COOKIE_CONSENT_KEY = 'hive_cookie_consent';
function getCookieConsent() {
  try { return localStorage.getItem(COOKIE_CONSENT_KEY); } catch (_) { return null; }
}
function setCookieConsent(value) {
  try { localStorage.setItem(COOKIE_CONSENT_KEY, value); } catch (_) {}
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.hidden = true;
  // Re-evaluate the analytics tracker now consent state changed
  if (typeof window.api !== 'undefined' && window.api) {
    window.api._analyticsAllowed = value === 'accepted';
  }
  // Update Google Consent Mode so AdSense (and any Google tag) respects the choice.
  if (typeof window.gtag === 'function') {
    const g = value === 'accepted' ? 'granted' : 'denied';
    window.gtag('consent', 'update', {
      ad_storage: g, ad_user_data: g, ad_personalization: g, analytics_storage: g,
    });
  }
}
function showCookieBannerIfNeeded() {
  if (getCookieConsent()) return; // already decided
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.hidden = false;
}
window.setCookieConsent = setCookieConsent;
// Wire up the analytics gate: api.trackEvent only fires if user accepted.
if (typeof window.api !== 'undefined' && window.api && typeof window.api.trackEvent === 'function') {
  const _origTrack = window.api.trackEvent.bind(window.api);
  window.api._analyticsAllowed = getCookieConsent() === 'accepted';
  window.api.trackEvent = function(companyId, type) {
    if (!window.api._analyticsAllowed) return;
    return _origTrack(companyId, type);
  };
}
// Show the banner once everything is rendered
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(showCookieBannerIfNeeded, 800));
else setTimeout(showCookieBannerIfNeeded, 800);

// ── GEOLOCATION ────────────────────────────────────────────────────────────────
let userLocationMarker = null;
let _locationObtained  = false;
let _geoInProgress     = false;
// Generation counter — incremented on every call. Callbacks compare their
// captured generation to the current one; stale results are discarded.
// This lets a user tap always override a pending auto-detect without blocking.
let _geoGen = 0;

function _geoCleanup(gen) {
  // Only clear flags if this callback belongs to the CURRENT request
  if (gen !== _geoGen) return false; // stale — caller should discard result
  _geoInProgress = false;
  const b  = document.getElementById('btnLocate');
  const b2 = document.getElementById('btnMyLocation');
  if (b)  { b.classList.remove('locating');  b.title = 'Usar localização atual'; }
  if (b2) b2.classList.remove('locating');
  return true; // current — caller should process result
}

function detectUserLocation(auto = false) {
  if (!navigator.geolocation) {
    if (!auto) showToast(t('toastGeoNotSupported'));
    return;
  }
  if (auto && _locationObtained) return;
  // Auto calls don't stack; user taps always proceed (they bump the generation
  // so any pending auto callback is discarded when it eventually fires)
  if (auto && _geoInProgress) return;

  _geoGen++;                 // invalidates any pending callback
  const myGen = _geoGen;
  _geoInProgress = true;

  // Show loading state on both locate buttons
  const btn   = document.getElementById('btnLocate');
  const mapBtn = document.getElementById('btnMyLocation');
  // Drop the "active" flash while a fresh fix is in progress (the spinner /
  // ping state takes over); it's re-applied on success.
  if (btn)   { btn.classList.remove('pulse-hint', 'geo-active'); btn.classList.add('locating'); btn.title = 'A detetar…'; }
  if (mapBtn) { mapBtn.classList.remove('geo-active'); if (!auto) mapBtn.classList.add('locating'); }

  // Auto: allow a cached position (up to 30 s old), short timeout so failure
  // is quick and silent. User tap: fresh position, long timeout (user is waiting).
  const geoOpts = {
    enableHighAccuracy: false, // cell/Wi-Fi — fast on mobile, <2 s typical
    maximumAge: auto ? 30000 : 0,
    timeout:    auto ? 10000 : 30000,
  };

  function onGeoSuccess(pos) {
    if (!_geoCleanup(myGen)) return; // stale result from a superseded request
    const { latitude: lat, longitude: lng, accuracy } = pos.coords;
    _locationObtained = true;

    // Location is now active — flash both locate buttons orange until a new
    // request supersedes this fix.
    const lb = document.getElementById('btnLocate');
    const mb = document.getElementById('btnMyLocation');
    if (lb) lb.classList.add('geo-active');
    if (mb) mb.classList.add('geo-active');

    currentMapCenter = [lat, lng];
    invalidateDistanceCache();
    if (radiusCircle) radiusCircle.setLatLng([lat, lng]);

    // Narrow the radius to 50 km ONLY when the user explicitly tapped the
    // locate button ("near me" intent). The automatic boot-time detection
    // used to do this too, which made most of the country's companies vanish
    // a second after the map appeared — reported as "companies disappeared".
    const slider = document.getElementById('radiusSlider');
    if (!auto && slider && parseInt(slider.value, 10) >= 100) {
      slider.value = 50;
      updateRadius(50);
    }

    // Only zoom into the user's location when THEY ask (locate button). On the
    // automatic detection at startup, keep the map zoomed out — just sync the
    // radius circle to their position (drawn below).
    if (map && !auto) map.flyTo([lat, lng], 13, { duration: 1.8 });
    if (typeof updateRadius === 'function') {
      const _rs = document.getElementById('radiusSlider');
      updateRadius(_rs ? _rs.value : 50);
    }

    // Place/update the "you are here" marker
    if (userLocationMarker) { userLocationMarker.remove(); userLocationMarker = null; }
    if (map && typeof L !== 'undefined') {
      const youIcon = L.divIcon({
        className: '',
        html: `<div style="position:relative;width:28px;height:28px">
          <div style="position:absolute;inset:0;background:rgba(37,99,235,.22);border-radius:50%;animation:pulse 2s infinite"></div>
          <div style="position:absolute;inset:6px;background:#2563eb;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 10px rgba(37,99,235,.7)"></div>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      userLocationMarker = L.marker([lat, lng], { icon: youIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(`<strong>📍 A sua localização</strong><br><small style="color:#6b7280">Precisão: ±${Math.round(accuracy)} m</small>`);
      if (!auto) userLocationMarker.openPopup();
    }

    // Reverse-geocode to fill city inputs — fire-and-forget, never blocks UX
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pt`)
      .then(r => r.json())
      .then(data => {
        const a = data.address || {};
        // Remember the user's current country so the "Todo o país" radius can scope to it.
        if (a.country_code) window._userCountry = String(a.country_code).toLowerCase();
        const city  = a.city || a.town || a.village || a.municipality || '';
        const label = [city, a.country].filter(Boolean).join(', ');
        if (label) {
          const uni = document.getElementById('searchUnified');
          if (uni && !uni.matches(':focus')) uni.value = label;
          const hero = document.getElementById('heroLocation');
          if (hero && !hero.value) hero.value = label;
          const cityEl = document.querySelector('[data-i18n="mapCity"]');
          if (cityEl) cityEl.textContent = label;
        }
      })
      .catch(() => {});

    if (!auto) showToast(t('toastLocationDetected'));
    applyFilters();
  }

  function onGeoError(err) {
    if (!_geoCleanup(myGen)) return; // stale

    // A previous fix is still shown on the map — keep the active flash going
    // even though this refresh attempt failed.
    if (_locationObtained) {
      const lb = document.getElementById('btnLocate');
      const mb = document.getElementById('btnMyLocation');
      if (lb) lb.classList.add('geo-active');
      if (mb) mb.classList.add('geo-active');
    }

    if (err.code === 1) {
      // PERMISSION_DENIED — only nag on manual taps. Auto-prompts that the user
      // intentionally dismissed should fall back silently to the default view.
      if (!auto) openGeoHelp();
      else if (btn) {
        btn.classList.add('pulse-hint');
        setTimeout(() => btn.classList.remove('pulse-hint'), 5000);
      }
      return;
    }

    if (auto) {
      // Timeout / unavailable on auto — silent, just pulse the button
      if (btn) {
        btn.classList.add('pulse-hint');
        setTimeout(() => btn && btn.classList.remove('pulse-hint'), 5000);
      }
    } else {
      const msgs = {
        2: t('toastGeoPositionUnavailable'),
        3: t('toastGeoTimeout'),
      };
      showToast(msgs[err.code] || t('toastGeoError'), 'error');
    }
  }

  try {
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, geoOpts);
  } catch(e) {
    // Synchronous exception (rare) — reset state so button isn't stuck
    _geoInProgress = false;
    _geoCleanup(myGen);
    if (!auto) showToast(t('toastGeoError'), 'error');
  }
}

// ── HELP PANEL ──────────────────────────────────────────────────────────────
function openHelp() {
  document.getElementById('helpPanel').classList.add('open');
  document.getElementById('helpBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
  populateHelpStats();
}
// Fill the "Sobre" stats with REAL counts from the live companies data (no
// inflated figures). Hide the grid entirely while the catalogue is empty.
function populateHelpStats() {
  try {
    var grid = document.getElementById('helpStatsGrid');
    if (!grid) return;
    var list = (typeof companies !== 'undefined' && Array.isArray(companies)) ? companies : [];
    var total = list.length;
    var verified = list.filter(function (c) { return c && c.verified; }).length;
    if (total <= 0) { grid.style.display = 'none'; return; }
    var n1 = document.getElementById('helpStatNum1');
    var n2 = document.getElementById('helpStatNum2');
    if (n1) n1.textContent = String(verified);
    if (n2) n2.textContent = String(total);
    grid.style.display = 'grid';
  } catch (e) {}
}
function closeHelp() {
  document.getElementById('helpPanel').classList.remove('open');
  document.getElementById('helpBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}
function switchHelpTab(tab, el) {
  document.getElementById('helpTabSupporte').style.display = tab === 'suporte' ? 'block' : 'none';
  document.getElementById('helpTabSobre').style.display   = tab === 'sobre'    ? 'block' : 'none';
  document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function goToMyLocation() {
  detectUserLocation(false);
}

// ── LOCATION PERMISSION HELP ──────────────────────────────────────────────────
function openGeoHelp() {
  const ov = document.getElementById('geoHelpOverlay');
  if (!ov) return;
  // Detect platform and show relevant instructions
  const ua = navigator.userAgent || '';
  const isIOS     = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  document.getElementById('geoHelpIOS').style.display     = isIOS     ? 'block' : 'none';
  document.getElementById('geoHelpAndroid').style.display = isAndroid ? 'block' : 'none';
  document.getElementById('geoHelpGeneric').style.display = (!isIOS && !isAndroid) ? 'block' : 'none';
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeGeoHelp() {
  const ov = document.getElementById('geoHelpOverlay');
  if (ov) ov.classList.remove('open');
  document.body.style.overflow = '';
}

// ── AUTH / LOGIN ─────────────────────────────────────────────────────────────
function openLogin() {
  const ov = document.getElementById('loginOverlay');
  if (ov) { ov.classList.add('open'); switchLoginTab('login'); }
  // Re-render the Google button now the slot is visible
  if (typeof _renderGoogleButtons === 'function') _renderGoogleButtons();
  // Focus the email input on a small delay so the modal-open transition
  // doesn't fight the focus on mobile.
  setTimeout(() => {
    const el = document.getElementById('loginEmail');
    if (el) try { el.focus(); } catch (_) {}
  }, 60);
}
function closeLogin() {
  const ov = document.getElementById('loginOverlay');
  if (ov) ov.classList.remove('open');
}
function switchLoginTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.getElementById('authLogin').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('authRegister').style.display = tab === 'register' ? 'block' : 'none';
  if (typeof _clearAuthErrors === 'function') _clearAuthErrors();
  if (typeof _renderGoogleButtons === 'function') _renderGoogleButtons();
  if (tab === 'register' && typeof _renderTurnstile === 'function') _renderTurnstile();
}

// Lightweight password-strength meter. Not a security gate (the backend
// enforces length + the common-password blocklist) — purely UX feedback so
// the user can see when their choice is weak.
function _scorePassword(p) {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8)  s++;
  if (p.length >= 12) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
  if (/\d/.test(p))   s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4); // 0..4
}
function _updateRegPwdStrength() {
  const input = document.getElementById('regAuthPass');
  const wrap  = document.getElementById('regPwdStrength');
  const fill  = document.getElementById('regPwdStrengthFill');
  const label = document.getElementById('regPwdStrengthLabel');
  if (!input || !wrap || !fill || !label) return;
  const v = input.value || '';
  if (!v) { wrap.hidden = true; return; }
  wrap.hidden = false;
  const score = _scorePassword(v);
  const pct = (score / 4) * 100;
  fill.style.width = pct + '%';
  fill.classList.remove('medium', 'strong');
  let text = 'Fraca';
  if (score >= 3) { fill.classList.add('strong'); text = 'Forte'; }
  else if (score >= 2) { fill.classList.add('medium'); text = 'Média'; }
  label.textContent = text;
}
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('regAuthPass');
  if (input) input.addEventListener('input', _updateRegPwdStrength);
  // Clear a field's error as soon as the user starts editing it.
  _AUTH_FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => _setFieldError(id, ''));
  });
});

// ── POST-REGISTER CHOICE ──────────────────────────────────────────────────
// Shown to a brand-new user (after email or Google signup) so they can choose
// to advertise their company or just browse. The "advertise" path opens the
// existing company-registration overlay; "browse" simply dismisses the modal.
function openPostRegisterChoice(name) {
  const ov = document.getElementById('postRegisterOverlay');
  if (!ov) return;
  const welcome = document.getElementById('postRegisterWelcome');
  if (welcome) welcome.textContent = name ? t('postRegWelcomeNamed').replace('{name}', name) : t('postRegWelcome');
  ov.classList.add('open');
}
function closePostRegister() {
  const ov = document.getElementById('postRegisterOverlay');
  if (ov) ov.classList.remove('open');
}
function postRegisterAdvertise() {
  closePostRegister();
  setTimeout(() => openRegister(), 200);
}
function postRegisterBrowse() {
  closePostRegister();
  if (typeof selectedId !== 'undefined' && selectedId) openDetail(selectedId);
}

// ── REPORT LISTING ────────────────────────────────────────────────────────
function openReportModal() {
  const user = JSON.parse(localStorage.getItem('hive_user') || 'null');
  if (!user) { showToast(t('toastReportLoginRequired')); openLogin(); return; }
  if (!selectedId) return;
  document.getElementById('reportReason').value = '';
  document.getElementById('reportDetails').value = '';
  document.getElementById('reportOverlay').classList.add('open');
}
function closeReportModal() {
  document.getElementById('reportOverlay').classList.remove('open');
}
async function submitReport() {
  const reason  = document.getElementById('reportReason').value;
  const details = document.getElementById('reportDetails').value.trim();
  if (!reason) { showToast(t('toastReportSelectReason')); return; }
  if (!selectedId) { closeReportModal(); return; }
  const btn = document.getElementById('reportSubmitBtn');
  setBusy(btn, true);
  try {
    await api.reportCompany(selectedId, reason, details);
    closeReportModal();
    showToast(t('toastReportSent'));
  } catch (e) {
    showToast(e.message || t('toastReportFailed'));
  } finally {
    setBusy(btn, false);
  }
}
// ── Password recovery (forgot + reset) ─────────────────────────────────────
function openForgotPassword() {
  closeLogin();
  const ov = document.getElementById('forgotOverlay');
  if (!ov) return;
  ov.classList.add('open');
  // Pre-fill from login email if user already typed it
  const li = document.getElementById('loginEmail');
  const fi = document.getElementById('forgotEmail');
  if (li && fi && li.value) fi.value = li.value;
}
function closeForgotPassword() {
  const ov = document.getElementById('forgotOverlay');
  if (ov) ov.classList.remove('open');
}
async function submitForgotPassword() {
  const email = (document.getElementById('forgotEmail')?.value || '').trim();
  const btn   = document.getElementById('forgotSubmitBtn');
  if (!email) { showToast(t('toastEnterEmail')); return; }
  setBusy(btn, true);
  try {
    const r = await api.requestPasswordReset(email);
    showToast(r.message || 'Verifique a sua caixa de email.');
    closeForgotPassword();
  } catch (e) {
    showToast(e.message || 'Não foi possível enviar o pedido. Tente novamente.');
  } finally {
    setBusy(btn, false);
  }
}
function openResetPassword(token) {
  const ov = document.getElementById('resetOverlay');
  if (!ov) return;
  document.getElementById('resetToken').value = token || '';
  ov.classList.add('open');
}
function closeResetPassword() {
  const ov = document.getElementById('resetOverlay');
  if (ov) ov.classList.remove('open');
}
async function submitResetPassword() {
  const token = document.getElementById('resetToken').value;
  const pass  = document.getElementById('resetPass').value;
  const btn   = document.getElementById('resetSubmitBtn');
  if (!pass || pass.length < 8) { showToast(t('toastPasswordTooShort')); return; }
  setBusy(btn, true);
  try {
    await api.resetPassword(token, pass);
    showToast(t('toastPwdReset'));
    closeResetPassword();
    // Clear the hash so refreshing the page doesn't try the (now-used) token again
    if (history.replaceState) history.replaceState(null, '', location.pathname);
    setTimeout(() => openLogin(), 400);
  } catch (e) {
    showToast(e.message || 'Não foi possível redefinir a palavra-passe.');
  } finally {
    setBusy(btn, false);
  }
}
window.openForgotPassword  = openForgotPassword;
window.closeForgotPassword = closeForgotPassword;
window.submitForgotPassword= submitForgotPassword;
window.closeResetPassword  = closeResetPassword;
window.submitResetPassword = submitResetPassword;

// Detect /#reset-password/<token> in the URL and open the reset modal
(function() {
  const m = location.hash.match(/^#reset-password\/([A-Za-z0-9]+)/);
  if (m) setTimeout(() => openResetPassword(m[1]), 300);
})();

// ── Generic UX helpers ─────────────────────────────────────────────────────
// Toggle a password input between text and password type, swapping the eye icon
function togglePassword(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const showing = inp.type === 'text';
  inp.type = showing ? 'password' : 'text';
  if (btn) btn.setAttribute('aria-label', showing ? 'Mostrar palavra-passe' : 'Ocultar palavra-passe');
}

// Mark a button as busy so the user can't double-submit. Uses a CSS spinner;
// the original label is preserved in [data-original-label] and restored.
function setBusy(btn, busy) {
  if (!btn) return;
  if (busy) {
    btn.dataset.busy = 'true';
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
  } else {
    delete btn.dataset.busy;
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
  }
}

// Show a Caps Lock warning under password inputs (keydown event has getModifierState)
(function() {
  const map = [
    { inp: 'loginPass',   hint: 'loginCapsHint' },
    { inp: 'regAuthPass', hint: 'regCapsHint'   },
  ];
  function bind() {
    map.forEach(({inp, hint}) => {
      const i = document.getElementById(inp);
      const h = document.getElementById(hint);
      if (!i || !h || i.dataset.capsBound) return;
      i.dataset.capsBound = '1';
      const update = e => { h.hidden = !e.getModifierState || !e.getModifierState('CapsLock'); };
      i.addEventListener('keydown', update);
      i.addEventListener('keyup', update);
      i.addEventListener('blur', () => { h.hidden = true; });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();

// Inline field-error helpers — flag the offending input red and show the
// message under it instead of relying on a transient toast.
const _AUTH_FIELDS = ['loginEmail','loginPass','regAuthName','regAuthEmail','regAuthPass'];
function _setFieldError(inputId, msg) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(inputId + 'Err');
  if (inp) {
    inp.classList.toggle('invalid', !!msg);
    // The global `.field-error{display:none}` rule (inline-error convention) only
    // reveals the message via `.form-row.has-error` — toggle it so auth errors show.
    const row = inp.closest('.form-row');
    if (row) row.classList.toggle('has-error', !!msg);
  }
  if (err) {
    if (msg) { err.textContent = msg; err.hidden = false; }
    else     { err.textContent = '';  err.hidden = true; }
  }
}
function _clearAuthErrors() { _AUTH_FIELDS.forEach(id => _setFieldError(id, '')); }
const _AUTH_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function doLogin() {
  _clearAuthErrors();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  const btn  = document.getElementById('loginSubmitBtn');
  let bad = false;
  if (!email) { _setFieldError('loginEmail', 'Email é obrigatório'); bad = true; }
  else if (!_AUTH_EMAIL_RE.test(email)) { _setFieldError('loginEmail', 'Email inválido'); bad = true; }
  if (!pass)  { _setFieldError('loginPass',  'Palavra-passe é obrigatória'); bad = true; }
  if (bad) return;
  setBusy(btn, true);
  try {
    const { user } = await api.login(email, pass);
    localStorage.setItem('hive_user', JSON.stringify(user));
    isAdminMode = user.is_admin === true;
    closeLogin();
    updateNavAuth();
    syncFavouritesFromServer();
    showToast(t('toastWelcomeUser').replace('{name}', user.name));
    if (selectedId) openDetail(selectedId);
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPass').value = '';
    // Resume company-registration flow if the user arrived at login from
    // the "Registar Empresa" CTA.
    if (window._pendingCompanyRegister) {
      window._pendingCompanyRegister = false;
      setTimeout(() => openRegister(), 150);
    }
  } catch(e) {
    // 429 from the auth rate-limiter has its own message; surface it.
    if (e.status === 429) {
      showToast(e.message || t('toastTooManyAttempts'));
    } else {
      _setFieldError('loginPass', t('toastBadCredentials'));
    }
  } finally {
    setBusy(btn, false);
  }
}
// ── Company logo upload (registration) ────────────────────────────────────────
// Resize + compress the chosen image to a small square data URL so it can be
// stored inline and shown in place of the emoji logo everywhere.
let _regLogoData = '';
function handleRegLogo(input) {
  const file = input && input.files && input.files[0];
  if (!file) return;
  if (!/^image\//.test(file.type)) { showToast(t('regLogoInvalid') || 'Ficheiro inválido'); input.value = ''; return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const S = 200;                                     // output square (px)
      const canvas = document.createElement('canvas');
      canvas.width = S; canvas.height = S;
      const ctx = canvas.getContext('2d');
      const scale = Math.max(S / img.width, S / img.height);   // cover-crop, centred
      const w = img.width * scale, h = img.height * scale;
      ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
      _regLogoData = canvas.toDataURL('image/jpeg', 0.8);
      const prev = document.getElementById('regLogoPreview');
      if (prev) { prev.classList.add('has-img'); prev.style.backgroundImage = 'url("' + _regLogoData + '")'; prev.innerHTML = ''; }
      const clr = document.getElementById('regLogoClear'); if (clr) clr.style.display = '';
    };
    img.onerror = () => showToast(t('regLogoInvalid') || 'Ficheiro inválido');
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}
function clearRegLogo() {
  _regLogoData = '';
  const prev = document.getElementById('regLogoPreview');
  if (prev) { prev.classList.remove('has-img'); prev.style.backgroundImage = ''; prev.innerHTML = '<span>' + (t('regLogoEmpty') || 'Sem imagem') + '</span>'; }
  const inp = document.getElementById('regLogoInput'); if (inp) inp.value = '';
  const clr = document.getElementById('regLogoClear'); if (clr) clr.style.display = 'none';
}
// Preselect an existing logo (used when editing a company).
function setRegLogo(dataUrl) {
  if (dataUrl) { _regLogoData = dataUrl; const inp = document.getElementById('regLogoInput'); if (inp) inp.value = '';
    const prev = document.getElementById('regLogoPreview'); if (prev) { prev.classList.add('has-img'); prev.style.backgroundImage = 'url("' + dataUrl + '")'; prev.innerHTML = ''; }
    const clr = document.getElementById('regLogoClear'); if (clr) clr.style.display = ''; }
  else clearRegLogo();
}
window.handleRegLogo = handleRegLogo;
window.clearRegLogo = clearRegLogo;

// ── EMAIL VERIFICATION MODAL ─────────────────────────────────────────────────
// One modal, two modes: 'user' confirms the ACCOUNT email via /auth/verify-email;
// 'company' collects the code sent to the company's contact address — the code
// itself is validated server-side during company creation (single-use there).
let _verifyMode = 'user';
let _verifyEmail = '';
let _afterVerified = null;

function openVerifyModal(mode, email, desc, after) {
  _verifyMode = mode || 'user';
  _verifyEmail = email || '';
  _afterVerified = after || null;
  const title = document.getElementById('verifyTitle');
  if (title) title.textContent = _verifyMode === 'company' ? 'Confirme o email da empresa' : 'Confirme o seu email';
  const d = document.getElementById('verifyDesc');
  if (d) d.textContent = desc || ('Enviámos um código de 6 dígitos para ' + (email || 'o seu email') + '. Introduza-o abaixo.');
  const inp = document.getElementById('verifyCodeInput');
  if (inp) inp.value = '';
  const err = document.getElementById('verifyError');
  if (err) err.style.display = 'none';
  document.getElementById('verifyOverlay').classList.add('open');
  setTimeout(() => { try { inp && inp.focus(); } catch (_) {} }, 160);
}
function closeVerifyModal() {
  document.getElementById('verifyOverlay').classList.remove('open');
}
function _verifyShowErr(msg) {
  const e = document.getElementById('verifyError');
  if (e) { e.textContent = msg; e.style.display = ''; }
}

async function verifySubmit() {
  const code = (document.getElementById('verifyCodeInput').value || '').trim();
  if (!/^\d{6}$/.test(code)) { _verifyShowErr('Introduza o código de 6 dígitos.'); return; }
  const btn = document.getElementById('verifyConfirmBtn');
  if (btn) btn.disabled = true;
  try {
    if (_verifyMode === 'user') {
      const r = await apiFetch('/auth/verify-email', { method: 'POST', body: { code } });
      if (r && r.user) localStorage.setItem('hive_user', JSON.stringify(r.user));
      closeVerifyModal();
      showToast('Email confirmado');
    } else {
      // company mode — stash the code; the create endpoint validates and burns it
      window._companyEmailCode = code;
      closeVerifyModal();
    }
    if (_afterVerified) { const f = _afterVerified; _afterVerified = null; setTimeout(f, 120); }
  } catch (e) {
    _verifyShowErr(e.message || 'Código errado ou expirado.');
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function verifyResend() {
  const btn = document.getElementById('verifyResendBtn');
  if (btn) btn.disabled = true;
  try {
    if (_verifyMode === 'user') await apiFetch('/auth/send-verify', { method: 'POST', body: {} });
    else await apiFetch('/companies/send-email-code', { method: 'POST', body: { email: _verifyEmail } });
    showToast('Código enviado');
  } catch (e) {
    _verifyShowErr(e.message || 'Não foi possível enviar o código.');
  } finally {
    setTimeout(() => { if (btn) btn.disabled = false; }, 3000);
  }
}
window.openVerifyModal = openVerifyModal;
window.closeVerifyModal = closeVerifyModal;
window.verifySubmit = verifySubmit;
window.verifyResend = verifyResend;

async function doRegister() {
  _clearAuthErrors();
  const name = document.getElementById('regAuthName').value.trim();
  const email = document.getElementById('regAuthEmail').value.trim();
  const pass = document.getElementById('regAuthPass').value;
  const btn = document.getElementById('registerSubmitBtn');
  let bad = false;
  if (!name)  { _setFieldError('regAuthName',  'Nome é obrigatório'); bad = true; }
  if (!email) { _setFieldError('regAuthEmail', 'Email é obrigatório'); bad = true; }
  else if (!_AUTH_EMAIL_RE.test(email)) { _setFieldError('regAuthEmail', 'Email inválido'); bad = true; }
  if (!pass)              { _setFieldError('regAuthPass', 'Palavra-passe é obrigatória'); bad = true; }
  else if (pass.length < 8) { _setFieldError('regAuthPass', t('toastPasswordTooShort')); bad = true; }
  if (bad) return;
  // Pull a Turnstile token if the widget is active; backend treats missing
  // tokens as failures only when TURNSTILE_SECRET_KEY is configured.
  const turnstileToken = (window.turnstile && _turnstileWidgetId != null)
    ? (window.turnstile.getResponse(_turnstileWidgetId) || '')
    : '';
  setBusy(btn, true);
  try {
    const { user } = await api.register({ name, email, password: pass, turnstileToken });
    localStorage.setItem('hive_user', JSON.stringify(user));
    isAdminMode = user.is_admin === true;
    closeLogin();
    updateNavAuth();
    syncFavouritesFromServer();
    document.getElementById('regAuthName').value = '';
    document.getElementById('regAuthEmail').value = '';
    document.getElementById('regAuthPass').value = '';
    // Clear any pending-company-register flag — the post-register choice
    // covers the "advertise" path explicitly.
    window._pendingCompanyRegister = false;
    // New accounts confirm their email right away (the code was auto-sent by
    // the register endpoint); the usual welcome choice follows the confirmation.
    if (user && user.email_verified === false) {
      openVerifyModal('user', email, null, () => openPostRegisterChoice(user.name || name));
    } else {
      openPostRegisterChoice(user.name || name);
    }
  } catch(e) {
    // Map server-side validation errors to the most relevant field. Anything
    // else (CAPTCHA, rate-limit, network) falls through to a toast.
    const msg = e && e.message;
    if (e.status === 409) {
      _setFieldError('regAuthEmail', msg || t('toastRegisterFailed'));
    } else if (/palavra-passe|password/i.test(msg || '')) {
      _setFieldError('regAuthPass', msg);
    } else if (/email/i.test(msg || '')) {
      _setFieldError('regAuthEmail', msg);
    } else {
      showToast(msg || t('toastRegisterFailed'));
    }
  } finally {
    setBusy(btn, false);
    // Turnstile tokens are single-use. Reset the widget after every submit so a
    // retry gets a fresh token instead of reusing a spent one (which Cloudflare
    // rejects with "timeout-or-duplicate").
    if (window.turnstile && _turnstileWidgetId != null) {
      try { window.turnstile.reset(_turnstileWidgetId); } catch (_) {}
    }
  }
}
async function doLogout() {
  await api.logout().catch(() => {});
  localStorage.removeItem('hive_user');
  isAdminMode = false;
  updateNavAuth();
  showToast(t('toastLoggedOut'));
  closeAvatarMenu();
  // Stop Google from auto-signing the user back in next visit
  try { if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect(); } catch(_) {}
}

// ── GOOGLE SIGN-IN + TURNSTILE CAPTCHA ───────────────────────────────────────
// Loads public auth config (Google client ID, Turnstile site key) from
// /api/auth/config, then initializes whichever features are enabled. Each
// integration stays dormant when its key isn't set — buttons/widgets just
// don't render and the rest of the auth UI keeps working.
let _googleConfig = null;
let _googleReady  = false;
let _turnstileWidgetId = null;

(async function _loadAuthConfig() {
  try { _googleConfig = await api.getAuthConfig(); }
  catch (_) { _googleConfig = { googleClientId: '', turnstileSiteKey: '' }; }
  _initGoogleSignIn();
  _initTurnstile();
  if (_googleConfig && _googleConfig.assistantEnabled) document.getElementById('aiAssistantBtn')?.style.setProperty('display', 'flex');
})();

function _initGoogleSignIn() {
  if (_googleReady) return;
  if (!_googleConfig || !_googleConfig.googleClientId) return; // disabled
  if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
    // GSI script hasn't loaded yet — retry shortly
    setTimeout(_initGoogleSignIn, 200);
    return;
  }
  google.accounts.id.initialize({
    client_id: _googleConfig.googleClientId,
    callback:  _onGoogleCredential,
    ux_mode:   'popup',
    auto_select: false,
  });
  _googleReady = true;
  _renderGoogleButtons();
}

// Cloudflare Turnstile — dormant unless turnstileSiteKey is exposed by the
// backend. The widget renders into the register tab the first time the user
// opens it; the token is read off the widget at submit time.
function _initTurnstile() {
  if (!_googleConfig || !_googleConfig.turnstileSiteKey) return;
  if (document.querySelector('script[data-turnstile]')) return;
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  s.async = true; s.defer = true;
  s.dataset.turnstile = '1';
  document.head.appendChild(s);
}
function _renderTurnstile() {
  if (_turnstileWidgetId != null) return;
  if (!_googleConfig || !_googleConfig.turnstileSiteKey) return;
  if (typeof window.turnstile === 'undefined') { setTimeout(_renderTurnstile, 200); return; }
  const slot = document.getElementById('turnstileWidget');
  if (!slot) return;
  _turnstileWidgetId = window.turnstile.render(slot, {
    sitekey: _googleConfig.turnstileSiteKey,
    theme: 'light',
  });
}

function _renderGoogleButtons() {
  if (!_googleReady) return;
  const opts = {
    type: 'standard', theme: 'outline', size: 'large',
    text: 'continue_with', shape: 'rectangular',
    logo_alignment: 'left', width: 320,
  };
  const slots = [
    ['googleLoginSlot',    'googleLoginDivider'],
    ['googleRegisterSlot', 'googleRegisterDivider'],
  ];
  slots.forEach(([slotId, dividerId]) => {
    const slot = document.getElementById(slotId);
    if (!slot) return;
    slot.innerHTML = '';
    google.accounts.id.renderButton(slot, opts);
    const div = document.getElementById(dividerId);
    if (div) div.style.display = 'flex';
  });
}

async function _onGoogleCredential(response) {
  try {
    const idToken = response && response.credential;
    if (!idToken) throw new Error('Sem credencial Google');
    // Detect whether the user clicked Google from the register tab — if so,
    // we offer the post-register choice (advertise vs browse) once auth completes.
    const fromRegisterTab = document.querySelector('.auth-tab.active')?.dataset.tab === 'register';
    const { user } = await api.loginWithGoogle(idToken);
    localStorage.setItem('hive_user', JSON.stringify(user));
    isAdminMode = user.is_admin === true;
    closeLogin();
    updateNavAuth();
    syncFavouritesFromServer();
    if (fromRegisterTab) {
      openPostRegisterChoice(user.name);
    } else {
      showToast(t('toastWelcomeUser').replace('{name}', user.name));
      if (selectedId) openDetail(selectedId);
    }
    // Resume company-registration flow if the user arrived at login from
    // the "Registar Empresa" CTA (works for both register and login tabs).
    if (window._pendingCompanyRegister) {
      window._pendingCompanyRegister = false;
      if (!fromRegisterTab) setTimeout(() => openRegister(), 150);
    }
  } catch (e) {
    showToast(e.message || t('toastGoogleFailed'));
  }
}
// Reconcile the locally-stored session with the server on page load. The JWT
// cookie lives for 7 days, so a return visitor stays logged in even though the
// in-memory marker may be gone — and a stale marker whose cookie has expired
// gets cleared. Runs async after the synchronous updateNavAuth() so there is
// no flash of logged-out UI for valid sessions.
async function rehydrateSession() {
  try {
    const me = await api.getMe();
    if (me && me.user) localStorage.setItem('hive_user', JSON.stringify(me.user));
    else localStorage.removeItem('hive_user');
  } catch (e) {
    // 401 → cookie missing/expired, clear stale state. Network blip → leave as-is.
    if (e && e.status === 401) localStorage.removeItem('hive_user');
    else return;
  }
  try { updateNavAuth(); } catch (_) {}
  try { _refreshDpFavBtn(); } catch (_) {}
}

function updateNavAuth() {
  const area = document.getElementById('authArea');
  const mobileArea = document.getElementById('mobileAuthArea');
  const mobileTopAuth = document.getElementById('mobileTopAuth');
  const heroCta = document.getElementById('lpHeroUserCta');
  const heroCtaGreeting = document.getElementById('lpHeroUserCtaGreeting');
  const user = JSON.parse(localStorage.getItem('hive_user') || 'null');
  if (!user) {
    // Single auth entry point lives in the top-right of the nav (desktop + mobile).
    if (area) area.innerHTML = `<button class="btn-login" onclick="openLogin()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg><span data-i18n="navLogin">${t('navLogin')}</span></button>`;
    // Mobile nav drawer for logged-out users — give them visible entry points
    // for Sign in and Register Company; the top-right icon alone is too easy
    // to miss on a phone.
    if (mobileArea) mobileArea.innerHTML = `
      <button class="mobile-nav-link" onclick="openLogin();closeMobileNavPanel()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        <span data-i18n="navLogin">${t('navLogin')}</span>
      </button>
      <button class="mobile-nav-link" onclick="closeMobileNavPanel();openRegister()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>${t('avatarRegisterCompany') || 'Anunciar Empresa'}</span>
      </button>`;
    if (mobileTopAuth) mobileTopAuth.innerHTML = `<button class="mobile-top-login" onclick="openLogin()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg><span data-i18n="navLogin">${t('navLogin')}</span></button>`;
    if (heroCta) heroCta.hidden = true;
    const anonCta = document.getElementById('lpHeroAnonCta');
    if (anonCta) anonCta.hidden = false;
  } else {
    const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    // Show an "Anunciante" badge only when the user actually owns a listing.
    // The legacy empresa/cliente split lost meaning once registration was
    // unified — every new account starts as 'cliente' and graduates by
    // registering a company.
    const myId = Number(user.id);
    const ownsCompany = Array.isArray(companies) && companies.some(c =>
      c.created_by != null && c.created_by === myId
    );
    const badgeHtml = ownsCompany
      ? `<div class="avatar-menu-type empresa">🏢 ${t('typeAdvertiserLabel')}</div>`
      : '';
    if (area) area.innerHTML = `
      <div class="avatar-wrap" onclick="toggleAvatarMenu(event)">
        <div class="avatar">${initials}</div>
        <div class="avatar-menu" id="avatarMenu">
          <div class="avatar-menu-header">
            <div class="avatar-menu-name">${user.name}</div>
            <div class="avatar-menu-email">${user.email}</div>
            ${badgeHtml}
          </div>
          <div class="avatar-menu-item" onclick="openRegister();closeAvatarMenu()"><i data-lucide="building-2"></i>${t('avatarRegisterCompany')}</div>
          <div class="avatar-menu-item" onclick="openProfilePanel();closeAvatarMenu()"><i data-lucide="user"></i>${t('profileTitle')}</div>
          <div class="avatar-menu-item" onclick="openMyChats();closeAvatarMenu()"><i data-lucide="message-circle"></i>As minhas mensagens</div>
          <div class="avatar-menu-item" onclick="openMyFavourites();closeAvatarMenu()"><i data-lucide="star"></i>${t('navFavourites')} <span class="avatar-menu-badge" id="avMenuFavCount" hidden></span></div>
          <div class="avatar-menu-divider"></div>
          <div class="avatar-menu-item" onclick="closeAvatarMenu();openFaq()"><i data-lucide="help-circle"></i>${t('avatarFaqHelp')}</div>
          <div class="avatar-menu-item" onclick="closeAvatarMenu();openLegal('privacy')"><i data-lucide="shield"></i>${t('navPrivacy')}</div>
          <div class="avatar-menu-divider"></div>
          <div class="avatar-menu-item danger" onclick="doLogout()"><i data-lucide="log-out"></i>${t('avatarLogout')}</div>
        </div>
      </div>`;
    if (mobileArea) mobileArea.innerHTML = `<button class="mobile-nav-link" onclick="openProfilePanel();closeMobileNavPanel()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>${user.name}</span></button><button class="mobile-nav-link" onclick="openMyChats();closeMobileNavPanel()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>As minhas mensagens</span></button><button class="mobile-nav-link" onclick="closeMobileNavPanel();openRegister()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg><span>${t('avatarRegisterCompany') || 'Anunciar Empresa'}</span></button><button class="mobile-nav-link" onclick="openMyFavourites();closeMobileNavPanel()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span data-i18n="navFavourites">Favoritos</span></button><button class="mobile-nav-link" style="color:#ef4444" onclick="doLogout();closeMobileNavPanel()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg><span>${t('avatarLogout')}</span></button>`;
    if (mobileTopAuth) mobileTopAuth.innerHTML = `<button class="mobile-top-avatar" onclick="toggleMobileNav()" title="${user.name}">${initials}</button>`;
    if (heroCta) {
      heroCta.hidden = false;
      const firstName = (user.name || '').split(' ')[0];
      if (heroCtaGreeting) heroCtaGreeting.textContent = firstName ? t('heroUserGreetingNamed').replace('{name}', firstName) : t('heroUserGreeting');
    }
    const anonCta = document.getElementById('lpHeroAnonCta');
    if (anonCta) anonCta.hidden = true;
  }
  refreshLucide();
}

function toggleAvatarMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('avatarMenu');
  if (menu) menu.classList.toggle('show');
}
function closeAvatarMenu() {
  const menu = document.getElementById('avatarMenu');
  if (menu) menu.classList.remove('show');
}
// Close avatar menu when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.avatar-wrap')) closeAvatarMenu();
});
// Close login overlay on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeLogin(); closeAvatarMenu(); }
});

// ── INIT ───────────────────────────────────────────────────────────────────────
// Wrap all init in try/catch so showTab('home') ALWAYS runs
try {
  try { renderRegisterSectorSelect(); } catch(e) { console.warn('Init skip: renderRegisterSectorSelect', e); }
  try { renderRegisterZoneSelect(); } catch(e) { console.warn('Init skip: renderRegisterZoneSelect', e); }
  try { renderEmailTypeSelect(); } catch(e) { console.warn('Init skip: renderEmailTypeSelect', e); }
  try { renderSectorFilters(); } catch(e) { console.warn('Init skip: renderSectorFilters', e); }
  try { renderMobileFilterPanel(); } catch(e) { console.warn('Init skip: renderMobileFilterPanel', e); }
  try { renderMobileSearchPanel(); } catch(e) { console.warn('Init skip: renderMobileSearchPanel', e); }
  try { renderTagCloud(); } catch(e) { console.warn('Init skip: renderTagCloud', e); }
  try { updateNavAuth(); } catch(e) { console.warn('Init skip: updateNavAuth', e); }
  // Reconcile the stored session with the server cookie (fire-and-forget).
  try { rehydrateSession(); } catch(e) { console.warn('Init skip: rehydrateSession', e); }
  // If a session is already active on page load (return visit), pull the
  // user's saved favourites from the server. Fire-and-forget, doesn't block
  // first paint.
  try { setTimeout(syncFavouritesFromServer, 50); } catch(_) {}
  // Apply the saved language on load: setLanguage() syncs the language button
  // (flag/code/active highlight) AND translates the page, so a refresh keeps the
  // chosen language everywhere — not just in the content.
  try { setLanguage(currentLang); } catch(e) { console.warn('Init skip: setLanguage', e); try { applyI18n(); } catch(_) {} }
  try { const _yr = document.getElementById('copyYear'); if (_yr) _yr.textContent = new Date().getFullYear(); } catch(_) {}
  if (typeof lucide !== 'undefined') { try { lucide.createIcons(); } catch(e) { console.warn('Init skip: lucide', e); } }
} catch(e) { console.error('Init error:', e); }

// Show landing page by default — ALWAYS runs regardless of errors above
try { showTab('home'); } catch(e) { console.error('showTab error:', e); document.getElementById('tab-home').style.display = 'flex'; }

// Setup radius slider event listeners
let radiusTimeout;
setTimeout(() => {
  const radiusSlider = document.getElementById('radiusSlider');
  if (radiusSlider) {
    radiusSlider.addEventListener('input', function(e) {
      updateRadius(e.target.value);
      // Debounce applyFilters while dragging
      clearTimeout(radiusTimeout);
      radiusTimeout = setTimeout(() => applyFilters(), 300);
    });
    radiusSlider.addEventListener('change', function() {
      clearTimeout(radiusTimeout);
      applyFilters();
    });
  }

  // Setup unified search input listener
  const uniInput = document.getElementById('searchUnified');
  if (uniInput) {
    uniInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        submitUnifiedSearch(this.value);
      }
    });
  }

  // Setup search button
  const btnSearch = document.getElementById('btnSearch');
  if (btnSearch) {
    btnSearch.addEventListener('click', function() {
      const val = (document.getElementById('searchUnified') || {}).value || '';
      if (val.trim()) submitUnifiedSearch(val);
    });
  }
}, 100);

// Auto-location is fired once from DOMContentLoaded (see top of file).
// The duplicate naked setTimeout that was here has been removed to prevent
// two concurrent getCurrentPosition calls racing before the guard flag is set.

// ── NAV HIDE-ON-SCROLL ────────────────────────────────────────────────────────
// Uses a single rAF-throttled listener on the window touchmove/scroll events.
// No per-element listeners, no inline style mutations (uses CSS class only),
// which eliminates layout reflow on every scroll frame.
const nav = document.querySelector('nav');

function isHomeTabActive() {
  const h = document.getElementById('tab-home');
  return h && h.style.display !== 'none';
}

{
  let lastY = 0;
  let ticking = false;

  function _applyNavScroll(y) {
    if (!nav || isHomeTabActive()) return;
    // Larger thresholds = fewer class toggles = fewer style recalcs on mobile.
    if (y > lastY + 16 && y > 40) {
      nav.classList.add('scrolled');
    } else if (y < lastY - 24) {
      nav.classList.remove('scrolled');
    }
    lastY = y;
    ticking = false;
  }

  function _onScroll() {
    if (ticking) return;
    const y = window.pageYOffset || document.documentElement.scrollTop || 0;
    ticking = true;
    requestAnimationFrame(() => _applyNavScroll(y));
  }

  window.addEventListener('scroll',     _onScroll, { passive: true });
  window.addEventListener('touchmove',  _onScroll, { passive: true });
}

// ── PAUSE HERO LOGO SMIL ANIMATIONS WHEN OFFSCREEN ───────────────────────────
// SVG <animate>/<animateTransform> keep firing repaints even when the logo is
// scrolled off-screen or its tab is hidden. Pause via the SVG DOM API.
(function() {
  const logo = document.getElementById('logoHexSvg');
  if (!logo || typeof logo.pauseAnimations !== 'function') return;
  let paused = false;
  const setPaused = (p) => {
    if (p === paused) return;
    paused = p;
    try { p ? logo.pauseAnimations() : logo.unpauseAnimations(); } catch(_) {}
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      setPaused(!entries[0].isIntersecting);
    }, { rootMargin: '0px' }).observe(logo);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) setPaused(true);
    else if ('IntersectionObserver' in window === false) setPaused(false);
  });
})();

// Sticky home-page CTA: appears when the hero scrolls off-screen on the home tab.
// IntersectionObserver on the hero gives us a single, cheap signal.
(function() {
  const hero = document.querySelector('.home-hero');
  const cta  = document.getElementById('homeStickyCta');
  if (!hero || !cta) return;
  // tab-home is the scroll container; attach the observer to it
  const root = document.getElementById('tab-home') || null;
  const obs = new IntersectionObserver(entries => {
    const e = entries[0];
    // Hero is *not* visible → user has scrolled past → show the CTA
    const heroVisible = e.isIntersecting && e.intersectionRatio > 0.15;
    const onHome = isHomeTabActive();
    if (!heroVisible && onHome) {
      cta.hidden = false;
      // double-RAF so the transition triggers from the hidden->visible class change
      requestAnimationFrame(() => requestAnimationFrame(() => cta.classList.add('visible')));
    } else {
      cta.classList.remove('visible');
      // hide after the transition runs
      setTimeout(() => { if (!cta.classList.contains('visible')) cta.hidden = true; }, 380);
    }
  }, { root, threshold: [0, 0.15, 0.5] });
  obs.observe(hero);
})();

// ── Mobile filter drawer ───────────────────────────────────────────────
function toggleMobileFilter() {
  const sidebar  = document.querySelector('.filter-sidebar');
  const btn      = document.getElementById('mobileFilterBtn');
  const backdrop = document.getElementById('filterBackdrop');
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains('mobile-open');
  if (isOpen) {
    closeMobileFilter();
  } else {
    sidebar.classList.add('mobile-open');
    if (btn)      { btn.classList.add('active'); btn.setAttribute('aria-expanded', 'true'); }
    const ubBtn = document.getElementById('ubFiltrosBtn');
    if (ubBtn)    { ubBtn.classList.add('active'); ubBtn.setAttribute('aria-expanded', 'true'); }
    if (backdrop) backdrop.classList.add('visible');
    // Resize map after drawer animation so tiles fill correctly
    if (typeof map !== 'undefined' && map) {
      setTimeout(() => map.invalidateSize({ animate: false }), 360);
    }
  }
}

function closeMobileFilter() {
  const sidebar  = document.querySelector('.filter-sidebar');
  const btn      = document.getElementById('mobileFilterBtn');
  const backdrop = document.getElementById('filterBackdrop');
  if (sidebar)  sidebar.classList.remove('mobile-open');
  if (btn)      { btn.classList.remove('active'); btn.setAttribute('aria-expanded', 'false'); }
  const ubBtn = document.getElementById('ubFiltrosBtn');
  if (ubBtn)    { ubBtn.classList.remove('active'); ubBtn.setAttribute('aria-expanded', 'false'); }
  if (backdrop) backdrop.classList.remove('visible');
  if (typeof map !== 'undefined' && map) {
    setTimeout(() => map.invalidateSize({ animate: false }), 360);
  }
}

// Diagnostic helper
// ── AD BANNER: Rotating slides + video fallback ──
(function() {
  const slides = document.querySelectorAll('.ad-slide');
  const casaSteps = document.querySelectorAll('[data-casa]');
  let casaTimer = null;

  function stopCasa() {
    if (casaTimer) { clearInterval(casaTimer); casaTimer = null; }
    casaSteps.forEach(s => { s.classList.remove('lit','done'); });
  }

  function startCasa() {
    // Don't waste cycles when nobody can see this animation:
    //  • the document is hidden (background tab) → defer
    //  • the home tab isn't the active tab → defer
    if (document.hidden) return;
    if (typeof isHomeTabActive === 'function' && !isHomeTabActive()) return;
    stopCasa();
    let i = 0;
    casaTimer = setInterval(() => {
      if (i > 0) casaSteps[i-1].classList.replace('lit','done');
      if (i < casaSteps.length) {
        casaSteps[i].classList.add('lit');
        i++;
      } else {
        clearInterval(casaTimer);
        // pause then reset
        casaTimer = setTimeout(() => {
          casaSteps.forEach(s => s.classList.remove('lit','done'));
          casaTimer = setTimeout(startCasa, 600);
        }, 1800);
      }
    }, 380);
  }

  // Re-evaluate visibility when the user switches tabs/windows or app tabs.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopCasa();
    else startCasa();
  });
  // Re-start when the user navigates to the home tab; stop when they leave.
  document.addEventListener('hive:tab-change', e => {
    if (e.detail === 'home') startCasa();
    else stopCasa();
  });

  // Auto-start casa animation if on the home tab
  startCasa();
  if (slides.length > 1) {
    let idx = 0;
    setInterval(() => {
      const prev = slides[idx];
      if (prev.classList.contains('ad-slide-casa')) stopCasa();
      prev.classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
      if (slides[idx].classList.contains('ad-slide-casa')) startCasa();
    }, 15000);
  }
  // Hide fallback gradient if video loads successfully
  const vid = document.getElementById('adVideo');
  const fb = document.getElementById('adFallback');
  if (vid) {
    vid.addEventListener('canplay', () => { if(fb) fb.style.opacity = '0'; });
    vid.addEventListener('error', () => { if(fb) fb.style.opacity = '0.7'; vid.style.display = 'none'; });
  }
})();

// Toggle ad sound
function toggleAdSound() {
  const vid = document.getElementById('adVideo');
  const btn = document.getElementById('adMute');
  if (!vid) return;
  vid.muted = !vid.muted;
  if (btn) btn.textContent = vid.muted ? '🔇' : '🔊';
}
window.toggleAdSound = toggleAdSound;

// ── NAV AD BANNER: rotate Example ↔ Hivex every 15s, with animated story ──
(function() {
  const slides = document.querySelectorAll('.nav-ad-slide');
  const storySteps = document.querySelectorAll('.nav-ad-story .story-step');
  const storyArrows = document.querySelectorAll('.nav-ad-story .story-arrow');
  let storyTimer = null;

  function resetStory() {
    if (storyTimer) { clearInterval(storyTimer); storyTimer = null; }
    storySteps.forEach(s => s.classList.remove('lit', 'done'));
    storyArrows.forEach(a => a.classList.remove('on'));
  }
  function playStory() {
    if (!storySteps.length) return;
    resetStory();
    storySteps[0].classList.add('lit');
    let i = 1;
    storyTimer = setInterval(() => {
      if (i > 0) storySteps[i - 1].classList.replace('lit', 'done');
      if (i < storySteps.length) {
        if (storyArrows[i - 1]) storyArrows[i - 1].classList.add('on');
        storySteps[i].classList.add('lit'); i++;
      }
      else { clearInterval(storyTimer); storyTimer = null; }
    }, 2200);
  }

  if (slides.length < 2) return;
  let idx = 0;
  setInterval(() => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    const cur = slides[idx];
    cur.classList.add('active');
    if (cur.classList.contains('nav-ad-hivex')) playStory();
    else resetStory();
  }, 15000);
})();

// ── NAV AD BANNER ANIMATION ────────────────────────────────────────────────
(function() {
  const navAdSteps = document.querySelectorAll('.nav-ad-step[data-casa]');
  if (!navAdSteps.length) return;
  let navCasaTimer = null;

  function stopNavCasa() {
    if (navCasaTimer) { clearTimeout(navCasaTimer); clearInterval(navCasaTimer); navCasaTimer = null; }
    navAdSteps.forEach(s => s.classList.remove('lit','done'));
  }

  function startNavCasa() {
    stopNavCasa();
    let i = 0;
    navCasaTimer = setInterval(() => {
      if (i > 0) navAdSteps[i-1].classList.replace('lit','done');
      if (i < navAdSteps.length) {
        navAdSteps[i].classList.add('lit');
        i++;
      } else {
        clearInterval(navCasaTimer);
        navCasaTimer = setTimeout(() => {
          navAdSteps.forEach(s => s.classList.remove('lit','done'));
          navCasaTimer = setTimeout(startNavCasa, 600);
        }, 1800);
      }
    }, 380);
  }

  startNavCasa();
})();














window.diagnosticCheck = function() {
  console.clear();
  console.log('%c╔═══════════════════════════════════════════╗', 'color: #2563eb; font-weight: bold;');
  console.log('%c║      B2B MARKETPLACE - DIAGNOSTIC       ║', 'color: #2563eb; font-weight: bold;');
  console.log('%c╚═══════════════════════════════════════════╝', 'color: #2563eb; font-weight: bold;');
  console.log('%c✓ map:', 'color: #22c55e;', typeof window.map !== 'undefined' ? '✅' : '❌');
  console.log('%c✓ Leaflet:', 'color: #22c55e;', typeof L !== 'undefined' ? '✅' : '❌');
  console.log('%c✓ Supabase:', 'color: #22c55e;', sb ? '✅ Configurado' : '⚠️ Não configurado (armazenamento local)');
  console.log('%c✓ Empresas carregadas:', 'color: #22c55e;', companies.length);
};

// ── IMPROVEMENT 2: Mobile nav drawer ────────────────────────────────────────
function toggleMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  const btn = document.getElementById('hamburgerBtn');
  if (!drawer) return;
  const open = drawer.classList.toggle('open');
  if (btn) {
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }
}
function closeMobileNav(e) {
  if (e && e.target !== document.querySelector('.mobile-nav-backdrop') && !e.target.closest('.mobile-nav-backdrop')) return;
  closeMobileNavPanel();
}
function closeMobileNavPanel() {
  const drawer = document.getElementById('mobileNavDrawer');
  const btn = document.getElementById('hamburgerBtn');
  if (drawer) drawer.classList.remove('open');
  if (btn) {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
}
// Sync mobile nav active state with tab switches
const _origShowTab = showTab;
showTab = function(tab) {
  _origShowTab(tab);
  ['home','search','about'].forEach(id => {
    const el = document.getElementById('mn' + id.charAt(0).toUpperCase() + id.slice(1));
    if (el) el.classList.toggle('active', id === tab);
  });
};

// ── IMPROVEMENT 1: Multi-step registration ──────────────────────────────────
let _currentRegStep = 1;

function regGoStep(step) {
  [1,2,3].forEach(n => {
    document.getElementById('regStepPanel' + n)?.classList.toggle('active', n === step);
    const item = document.getElementById('regStepItem' + n);
    if (item) {
      item.classList.toggle('active', n === step);
      item.classList.toggle('done', n < step);
    }
  });
  _currentRegStep = step;
  // Scroll modal back to top on step change
  document.querySelector('#registerOverlay .modal')?.scrollTo(0, 0);
}

// ── Inline field-error helpers ─────────────────────────────────────────────
// Marks an input as invalid with a red border, ARIA flag, and an error
// message rendered inline directly under it. Replaces the previous behaviour
// where validation errors were only visible as a toast — users had to guess
// which field was wrong.
function markFieldError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  const row = el.closest('.form-row');
  if (!row) return;
  el.setAttribute('aria-invalid', 'true');
  row.classList.add('has-error');
  let err = row.querySelector('.field-error');
  if (!err) {
    err = document.createElement('div');
    err.className = 'field-error';
    err.setAttribute('role', 'alert');
    row.appendChild(err);
  }
  err.textContent = message;
  // Clear the error once the user starts editing again
  if (!el.dataset.errBound) {
    el.dataset.errBound = '1';
    const clear = () => clearFieldError(id);
    el.addEventListener('input',  clear);
    el.addEventListener('change', clear);
  }
}
function clearFieldError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const row = el.closest('.form-row');
  if (!row) return;
  el.removeAttribute('aria-invalid');
  row.classList.remove('has-error');
  const err = row.querySelector('.field-error');
  if (err) err.textContent = '';
}
function clearAllFieldErrors(scopeEl) {
  const root = scopeEl || document;
  root.querySelectorAll('.form-row.has-error').forEach(row => {
    row.classList.remove('has-error');
    const inp = row.querySelector('input,select,textarea');
    if (inp) inp.removeAttribute('aria-invalid');
    const err = row.querySelector('.field-error');
    if (err) err.textContent = '';
  });
}
// First failed validation focuses + scrolls to its field
function failField(id, message) {
  markFieldError(id, message);
  const el = document.getElementById(id);
  if (el) {
    el.focus({ preventScroll: false });
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  showToast(message);
}

function regNextStep(fromStep) {
  // Clear stale errors on the panel we're validating
  clearAllFieldErrors(document.getElementById('regStepPanel' + fromStep));
  if (fromStep === 1) {
    const name = document.getElementById('regName')?.value.trim();
    if (!name) { failField('regName', t('valName')); return; }
    if (_regSelectedSectors.length === 0) { showToast(t('valSector')); return; }
    const certidao = (document.getElementById('regCertidao')?.value || '').trim();
    if (!certidao) { failField('regCertidao', t('valCertidao')); return; }
    if (certidao.replace(/[\s-]/g, '').length < 8) { failField('regCertidao', t('valCertidaoFormat')); return; }
  } else if (fromStep === 2) {
    const country = document.getElementById('regCountry')?.value;
    const city = document.getElementById('regCity')?.value;
    const address = document.getElementById('regAddress')?.value.trim();
    const postal = document.getElementById('regPostalCode')?.value.trim();
    if (!country) { failField('regCountry', 'Selecione um país'); return; }
    if (!city) { failField('regCity', 'Selecione uma cidade'); return; }
    if (!postal) { failField('regPostalCode', 'Introduza o código postal'); return; }
    if (!address) { failField('regAddress', t('valAddress')); return; }
  }
  regGoStep(fromStep + 1);
}

// Reset step state and editing flag when opening or closing the register modal
const _origOpenRegister = openRegister;
openRegister = function() {
  // Gate company registration behind login — backend already requires auth
  // (POST /api/companies returns 401), but blocking here avoids the user
  // filling out a multi-step form just to fail on submit. Sets a pending
  // flag so a successful login auto-resumes the flow.
  const _user = JSON.parse(localStorage.getItem('hive_user') || 'null');
  if (!_user) {
    if (typeof showToast === 'function') {
      showToast(t('toastLoginToRegister'));
    }
    window._pendingCompanyRegister = true;
    if (typeof openLogin === 'function') openLogin();
    return;
  }

  window._editingCompanyId = null;
  // Restore submit button label
  setTimeout(() => {
    const submitBtn = document.getElementById('regSubmitBtn');
    if (submitBtn) submitBtn.innerHTML = '<i data-lucide="check-circle"></i> <span data-i18n="regSubmit">Registar Empresa</span>';
    refreshLucide();
  }, 50);
  _origOpenRegister();
  regGoStep(1);
};

const _origCloseRegister = typeof closeRegister === 'function' ? closeRegister : null;
if (_origCloseRegister) {
  closeRegister = function() {
    window._editingCompanyId = null;
    _origCloseRegister();
  };
}

// ── IMPROVEMENT 4: Registration success screen ──────────────────────────────
let _lastRegisteredCompany = null;

function closeRegSuccess() {
  document.getElementById('regSuccessOverlay').classList.remove('open');
  _lastRegisteredCompany = null;
}

// ── IMPROVEMENT 7: Profile panel ────────────────────────────────────────────
function openProfilePanel() {
  const user = JSON.parse(localStorage.getItem('hive_user') || 'null');
  if (!user) { openLogin(); return; }
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  // user.id is a string (BIGINT JSON-roundtrip); c.created_by is a number after
  // dbRowToCompany. Coerce both sides so the filter actually matches.
  const myId = Number(user.id);
  const myCompanies = companies.filter(c => c.created_by != null && c.created_by === myId);

  const companyCards = myCompanies.length > 0
    ? myCompanies.map(c => `
        <div class="profile-company-card">
          <div class="profile-company-emoji logo-mono" style="cursor:pointer" onclick="closeProfilePanel();showTab('search');setTimeout(()=>openDetail(${c.id}),300)">${companyMonogram(c)}</div>
          <div class="profile-company-info" style="cursor:pointer;flex:1" onclick="closeProfilePanel();showTab('search');setTimeout(()=>openDetail(${c.id}),300)">
            <div class="profile-company-name">${c.name}</div>
            <div class="profile-company-city">${c.city||'Portugal'} · <span style="color:${c.status==='approved'?'var(--green)':c.status==='pending'?'#f59e0b':c.status==='removed'?'var(--muted)':'var(--red)'};font-weight:700;font-size:11px">${c.status==='approved'?t('statusApproved'):c.status==='pending'?t('statusPending'):c.status==='removed'?t('statusRemoved'):t('statusRejected')}</span></div>
          </div>
          <button onclick="profileEditCompany(${c.id})" style="background:var(--bg);border:1.5px solid var(--border);border-radius:8px;padding:7px 10px;font-size:12px;font-weight:700;color:var(--text-secondary);cursor:pointer;white-space:nowrap;font-family:inherit;flex-shrink:0" title="${t('profileEditTitle')}">✏️</button>
          <button onclick="openInbox(${c.id})" style="background:var(--bg);border:1.5px solid var(--border);border-radius:8px;padding:7px 10px;font-size:12px;font-weight:700;color:var(--text-secondary);cursor:pointer;white-space:nowrap;font-family:inherit;flex-shrink:0" title="${t('inboxBtn')}">📨</button>
          ${!c.featured ? `<button onclick="requestFeature(${c.id},this)" style="background:var(--bg);border:1.5px solid var(--border);border-radius:8px;padding:7px 10px;font-size:12px;font-weight:700;color:var(--text-secondary);cursor:pointer;white-space:nowrap;font-family:inherit;flex-shrink:0" title="${t('featureBtn')}">⭐</button>` : ''}
        </div>`).join('')
    : '';

  document.getElementById('profilePanelBody').innerHTML = `
    <div class="profile-info-row">
      <div class="profile-avatar-big">${initials}</div>
      <div class="profile-user-info">
        <div class="profile-user-name">${user.name}</div>
        <div class="profile-user-email">${user.email}</div>
      </div>
    </div>


    <div style="margin-top:6px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div class="profile-section-title" style="margin:0">${t('profileMyCompanies')}${myCompanies.length > 0 ? ` (${myCompanies.length})` : ''}</div>
        <button onclick="closeProfilePanel();openRegister()" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> ${t('profileAdd')}
        </button>
      </div>
      ${companyCards || `<div class="profile-empty" style="text-align:center;padding:28px 16px;color:var(--muted)">
        <div style="font-size:32px;margin-bottom:10px">🏢</div>
        <div style="font-weight:700;margin-bottom:6px;color:var(--text)">${t('emptyTitle')}</div>
        <div style="font-size:13px;margin-bottom:18px">${t('profileNoCompanyMsg')}</div>
        <button onclick="closeProfilePanel();openRegister()" style="background:var(--primary);color:#fff;border:none;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;width:100%">${t('emptyBtn')}</button>
      </div>`}
    </div>

    <div class="profile-account-section" style="margin-top:24px;padding-top:18px;border-top:1px solid var(--border)">
      <div class="profile-section-title" style="margin:0 0 12px">${t('profileAccount')}</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button type="button" onclick="openChangePassword()" class="profile-account-btn" style="display:flex;align-items:center;justify-content:space-between;gap:8px;background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:12px 14px;font-size:13px;font-weight:600;color:var(--text);cursor:pointer;font-family:inherit;text-align:left;width:100%">
          <span style="display:flex;align-items:center;gap:8px">🔑 <span>${t('changePwdTitle')}</span></span>
          <span style="color:var(--muted)">›</span>
        </button>
        <button type="button" onclick="openDeleteAccount()" class="profile-account-btn" style="display:flex;align-items:center;justify-content:space-between;gap:8px;background:var(--bg);border:1px solid #fecaca;border-radius:10px;padding:12px 14px;font-size:13px;font-weight:600;color:#b91c1c;cursor:pointer;font-family:inherit;text-align:left;width:100%">
          <span style="display:flex;align-items:center;gap:8px">🗑️ <span>${t('delAccTitle')}</span></span>
          <span style="color:#fca5a5">›</span>
        </button>
      </div>
    </div>
  `;
  document.getElementById('profilePanelOverlay').classList.add('open');
  refreshLucide();
}

function closeProfilePanel(e) {
  if (e && e.target && !e.target.classList.contains('profile-panel-overlay')) return;
  document.getElementById('profilePanelOverlay').classList.remove('open');
}

// ── ACCOUNT SELF-SERVICE ────────────────────────────────────────────────
function openChangePassword() {
  closeProfilePanel();
  const ov = document.getElementById('changePasswordOverlay');
  if (!ov) return;
  document.getElementById('cpCurrent').value = '';
  document.getElementById('cpNew').value = '';
  ov.classList.add('open');
  setTimeout(() => document.getElementById('cpCurrent').focus(), 30);
}
function closeChangePassword() {
  document.getElementById('changePasswordOverlay').classList.remove('open');
}
async function submitChangePassword() {
  const current = document.getElementById('cpCurrent').value;
  const next    = document.getElementById('cpNew').value;
  const btn     = document.getElementById('cpSubmitBtn');
  if (!current || !next) { showToast(t('toastFillRequired')); return; }
  if (next.length < 8)   { showToast(t('toastPasswordTooShort')); return; }
  setBusy(btn, true);
  try {
    await api.changePassword(current, next);
    closeChangePassword();
    showToast(t('toastPwdChanged'));
  } catch (e) {
    showToast(e.message || 'Não foi possível alterar a palavra-passe.');
  } finally {
    setBusy(btn, false);
  }
}

function openDeleteAccount() {
  closeProfilePanel();
  const ov = document.getElementById('deleteAccountOverlay');
  if (!ov) return;
  const me = JSON.parse(localStorage.getItem('hive_user') || 'null');
  // Google-only users (no password) skip the password confirmation.
  const hasPwd = !(me && me.picture && !me.password_hash_known);
  const pwdRow = document.getElementById('delAccPwdRow');
  if (pwdRow) pwdRow.style.display = hasPwd ? '' : 'none';
  document.getElementById('delAccPwd').value = '';
  ov.classList.add('open');
}
function closeDeleteAccount() {
  document.getElementById('deleteAccountOverlay').classList.remove('open');
}
async function submitDeleteAccount() {
  const pwd = document.getElementById('delAccPwd').value;
  const btn = document.getElementById('delAccSubmitBtn');
  if (!confirm('Tem a certeza? Esta ação é permanente e não pode ser desfeita.')) return;
  setBusy(btn, true);
  try {
    await api.deleteAccount(pwd);
    localStorage.removeItem('hive_user');
    closeDeleteAccount();
    updateNavAuth();
    showToast(t('toastAccountDeleted'));
  } catch (e) {
    showToast(e.message || 'Não foi possível eliminar a conta.');
  } finally {
    setBusy(btn, false);
  }
}
window.openChangePassword = openChangePassword;
window.closeChangePassword = closeChangePassword;
window.submitChangePassword = submitChangePassword;
window.openDeleteAccount = openDeleteAccount;
window.closeDeleteAccount = closeDeleteAccount;
window.submitDeleteAccount = submitDeleteAccount;

// Open the register modal pre-filled for editing an existing company.
// We fetch the full record FIRST, prefill the (still hidden) form, and
// only then open the modal — avoids a flash of empty form.
async function profileEditCompany(companyId) {
  // Pending/rejected listings aren't in the local `companies` array (the list
  // endpoint only returns approved) — admins editing from the admin panel
  // fetch them directly; the backend grants owner/admin access to any status.
  let c = companies.find(x => Number(x.id) === Number(companyId));
  if (!c) {
    try { c = await api.getCompany(companyId); } catch (_) {}
    if (!c) { showToast(t('toastGenericError') || 'Não foi possível carregar a empresa'); return; }
  }
  closeProfilePanel();

  // Fetch the full record so private fields (alvará, certidão permanente)
  // — which are intentionally absent from the public list endpoint —
  // are available to pre-fill the form.
  let full = c;
  try {
    const fresh = await api.getCompany(companyId);
    if (fresh) full = { ...c, ...fresh };
  } catch (_) { /* fall back to list snapshot */ }

  // Helpers
  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v == null ? '' : v; };

  // Pre-fill identity fields
  setVal('regName',      full.name);
  setVal('regNif',       full.nif);
  setVal('regCae',       full.cae);
  setVal('regAlvara',    full.alvara);
  setVal('regCertidao',  full.certidao_permanente);

  // Pre-select sectors
  _regSelectedSectors = (full.sectors || (full.sector ? [full.sector] : [])).slice();
  if (typeof renderRegisterSectorSelect === 'function') renderRegisterSectorSelect();

  // Pre-fill location
  const countryEl = document.getElementById('regCountry');
  if (countryEl) { countryEl.value = full.country || 'pt'; countryEl.dispatchEvent(new Event('change')); }
  setVal('regPostalCode', full.postal_code);
  setVal('regAddress',    full.address);

  // Pre-fill contacts + meta
  setVal('regEmail',           full.email);
  setVal('regPhone',           full.phone);
  setVal('regWebsite',         full.website);
  setVal('regFacebook',        full.facebook);
  setVal('regInstagram',       full.instagram);
  setVal('regLinkedin',        full.linkedin);
  setVal('regTags',            (full.tags || []).join(', '));
  setVal('regDesc',            full.description);
  setVal('regFoundedYear',     full.founded_year);
  setVal('regBusinessHours',   full.business_hours);
  setVal('regPortfolioImages', (full.portfolio_images || []).join(', '));

  // Open the modal — already pre-populated, no flicker
  openRegister();

  // openRegister's wrapper synchronously resets _editingCompanyId to null and
  // schedules a label restore (~50 ms). Set the edit state AFTER, and queue
  // the label update so it lands after the wrapper's restore.
  window._editingCompanyId = companyId;
  try { setRegLogo(full.logo || ''); } catch (_) {}   // re-apply the logo after openRegister() reset it
  setTimeout(() => {
    const submitBtn = document.getElementById('regSubmitBtn');
    if (submitBtn) submitBtn.innerHTML = '<i data-lucide="save"></i> <span>Guardar Alterações</span>';
    if (typeof refreshLucide === 'function') refreshLucide();
  }, 80);
}

// ── IMPROVEMENT 9: Keyboard nav for sector multi-select ──────────────────────
function regSectorKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleRegSectorPanel(); }
  if (e.key === 'Escape') {
    document.getElementById('regSectorWrap')?.classList.remove('open');
    document.getElementById('regSectorTrigger')?.focus();
  }
}

// ── IMPROVEMENT 11: Sector pills scroll fade indicator ───────────────────────
function initSectorScrollFade() {
  const wrap = document.getElementById('sectorFilters');
  const fade = document.getElementById('sectorFade');
  if (!wrap || !fade) return;
  function update() {
    const atEnd = wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 4;
    fade.classList.toggle('hidden', atEnd);
  }
  wrap.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(wrap);
  update();
}
document.addEventListener('DOMContentLoaded', initSectorScrollFade);
// Also run after sector filters render
const _origRenderSectorFilters = typeof renderSectorFilters === 'function' ? renderSectorFilters : null;
if (_origRenderSectorFilters) {
  renderSectorFilters = function() {
    _origRenderSectorFilters();
    setTimeout(initSectorScrollFade, 50);
    setTimeout(fitSectorBar, 60);
  };
}

// ── Keep the sector bar at a CONSTANT height across languages ────────────────
// The desktop bar is one row of equal-width tabs. Longer translations (es/de)
// used to wrap to a 2nd row, growing the banner. Instead, auto-shrink the
// cat-labels uniformly so the longest one fits its slot — same space, the text
// size adapts to the language.
function fitSectorBar() {
  try {
    const ub = document.getElementById('sectorFilters');
    if (!ub) return;
    const container = ub.querySelector('.sector-filter-container');
    if (!container) return;
    const labels = [...container.querySelectorAll('.cat-label')];
    if (!labels.length) return;
    // Mobile bar scrolls horizontally — let CSS handle sizing there.
    if (window.innerWidth < 1025) {
      container.style.removeProperty('--cat-fs');
      ub.style.removeProperty('--cat-fs');
      labels.forEach(l => l.style.removeProperty('font-size'));
      return;
    }
    // Don't size against an un-laid-out bar (hidden tab / mid-transition): the
    // buttons report near-zero width and every label would latch onto the
    // minimum. Retry once the bar has a real width.
    if (container.clientWidth < 320) {
      clearTimeout(window.__fitRetry);
      window.__fitRetry = setTimeout(fitSectorBar, 200);
      return;
    }
    // Each label grows to fill its OWN tab, capped 25% above the old baseline
    // (19px -> 24px). Per-label rather than one shared size: the tabs are equal
    // width, so a single size would be dragged down to whatever the longest
    // label ("Chave na Mão") needs (~13px) and everything would look tiny.
    // On wide screens every label reaches the cap and reads uniform; on tighter
    // widths only the longest labels step down. (The label is a shrink-to-content
    // flex item, so clientWidth==scrollWidth until the text exceeds the tab —
    // the +0.5 check grows the font right up to that boundary.)
    const MIN = 13, MAX = 24;
    let maxBest = MIN;
    labels.forEach(l => {
      let lo = MIN, hi = MAX, best = MIN;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        l.style.fontSize = mid + 'px';
        if (l.scrollWidth <= l.clientWidth + 0.5) { best = mid; lo = mid + 1; }
        else { hi = mid - 1; }
      }
      l.style.fontSize = best + 'px';
      if (best > maxBest) maxBest = best;
    });
    // Master "Todas as áreas" label (outside the container) tracks the widest tab.
    ub.style.setProperty('--cat-fs', maxBest + 'px');
  } catch (e) {}
}
window.addEventListener('resize', () => {
  clearTimeout(window.__fitSectorT);
  window.__fitSectorT = setTimeout(fitSectorBar, 120);
});

// ── Add translations for new UI strings ──────────────────────────────────────
(function() {
  const extra = {
    pt: { regStep1Label:'Identidade', regStep2Label:'Localização', regStep3Label:'Contactos',
          regStepNext:'Seguinte', regStepBack:'Anterior',
          regCountry:'País', regPostalCode:'Código Postal', regCity:'Localidade / Cidade',
          sortAll:'Todas',
          successTitle:'Pedido Enviado!', successSub:'O seu pedido foi recebido e está a aguardar validação. Receberá um email de confirmação assim que a empresa for aprovada.',
          successClose:'Continuar a Navegar',
          forgotPwd:'Esqueceu a palavra-passe?',
          verifiedTooltip:'Empresa cuja certidão permanente foi confirmada pela equipa Hivex — uma camada extra de confiança.',
          mapPinHint:'💡 Toque num pin para ver os detalhes da empresa.',
          faqTitle:'Perguntas Frequentes', faqMeta:'Respostas rápidas às dúvidas mais comuns',
          featuredSeeAllBig:'Ver todas as empresas no mapa →',
          regFoundedYear:'Ano de fundação', regBusinessHours:'Horário', regPortfolio:'Galeria de trabalhos',
          regPortfolioHint:'Cole URLs de imagens dos seus trabalhos. Para já apenas links externos (ex: Imgur, Unsplash).',
          detailPortfolio:'Galeria de trabalhos',
          compareTitle:'Comparar empresas', compareClear:'Limpar', compareGo:'Comparar →',
          forgotTitle:'Recuperar palavra-passe',
          forgotBody:'Indique o seu email e enviaremos um link para definir uma nova palavra-passe.',
          forgotSend:'Enviar link',
          resetTitle:'Definir nova palavra-passe',
          resetBody:'Escolha uma nova palavra-passe (mínimo 8 caracteres).',
          resetSubmit:'Definir palavra-passe',
          cookieTitle:'🍪 Privacidade e cookies',
          cookieBody:'Cookies necessários para iniciar sessão e idioma. Analíticos só com a sua autorização.',
          cookieMore:'Saber mais',
          cookieAccept:'Aceitar tudo',
          cookieReject:'Rejeitar' },
    en: { regStep1Label:'Identity', regStep2Label:'Location', regStep3Label:'Contacts',
          regStepNext:'Next', regStepBack:'Back',
          regCountry:'Country', regPostalCode:'Postal Code', regCity:'Locality / City',
          sortAll:'All',
          successTitle:'Request Submitted!', successSub:'Your request has been received and is pending validation. You will receive a confirmation email once the company is approved.',
          successClose:'Keep Browsing',
          forgotPwd:'Forgot your password?',
          verifiedTooltip:'Company whose Portuguese commercial registry certificate has been confirmed by the Hivex team — an extra layer of trust.',
          mapPinHint:'💡 Tap a pin to see company details.',
          faqTitle:'Frequently Asked Questions', faqMeta:'Quick answers to common questions',
          featuredSeeAllBig:'See all companies on the map →',
          regFoundedYear:'Founded year', regBusinessHours:'Business hours', regPortfolio:'Work gallery',
          regPortfolioHint:'Paste image URLs of your work. For now external links only (e.g. Imgur, Unsplash).',
          detailPortfolio:'Work gallery',
          compareTitle:'Compare companies', compareClear:'Clear', compareGo:'Compare →',
          forgotTitle:'Reset your password',
          forgotBody:'Enter your email and we\'ll send you a link to set a new password.',
          forgotSend:'Send link',
          resetTitle:'Set a new password',
          resetBody:'Choose a new password (at least 8 characters).',
          resetSubmit:'Set password',
          cookieTitle:'🍪 Privacy and cookies',
          cookieBody:'Necessary cookies for sign-in and language. Analytics only with your consent.',
          cookieMore:'Learn more',
          cookieAccept:'Accept all',
          cookieReject:'Reject' },
    fr: { regStep1Label:'Identité', regStep2Label:'Localisation', regStep3Label:'Contacts',
          regStepNext:'Suivant', regStepBack:'Précédent',
          regCountry:'Pays', regPostalCode:'Code Postal', regCity:'Localité / Ville',
          sortAll:'Toutes',
          successTitle:'Demande Envoyée !', successSub:"Votre demande a été reçue et est en attente de validation. Vous recevrez un email de confirmation dès que l'entreprise sera approuvée.",
          successClose:'Continuer à Naviguer',
          forgotPwd:'Mot de passe oublié ?',
          verifiedTooltip:"Entreprise dont le certificat permanent du registre du commerce portugais a été confirmé par l'équipe Hivex.",
          mapPinHint:"💡 Touchez un pin pour voir les détails de l'entreprise.",
          faqTitle:'Questions fréquentes', faqMeta:'Réponses rapides aux questions courantes',
          featuredSeeAllBig:'Voir toutes les entreprises sur la carte →',
          regFoundedYear:'Année de création', regBusinessHours:'Horaires', regPortfolio:'Galerie de travaux',
          regPortfolioHint:"Collez les URLs d'images de vos réalisations. Pour l'instant uniquement des liens externes.",
          detailPortfolio:'Galerie de travaux',
          compareTitle:'Comparer les entreprises', compareClear:'Effacer', compareGo:'Comparer →',
          forgotTitle:'Réinitialiser le mot de passe',
          forgotBody:'Indiquez votre email et nous vous enverrons un lien pour définir un nouveau mot de passe.',
          forgotSend:'Envoyer le lien',
          resetTitle:'Définir un nouveau mot de passe',
          resetBody:'Choisissez un nouveau mot de passe (minimum 8 caractères).',
          resetSubmit:'Définir le mot de passe',
          cookieTitle:'🍪 Confidentialité et cookies',
          cookieBody:'Cookies nécessaires à la connexion et à la langue. Analytiques uniquement avec votre accord.',
          cookieMore:'En savoir plus',
          cookieAccept:'Tout accepter',
          cookieReject:'Refuser' },
    es: { regStep1Label:'Identidad', regStep2Label:'Ubicación', regStep3Label:'Contactos',
          regStepNext:'Siguiente', regStepBack:'Anterior',
          regCountry:'País', regPostalCode:'Código Postal', regCity:'Localidad / Ciudad',
          sortAll:'Todos',
          successTitle:'¡Solicitud Enviada!', successSub:'Su solicitud ha sido recibida y está pendiente de validación. Recibirá un email de confirmación una vez aprobada la empresa.',
          successClose:'Seguir Navegando',
          forgotPwd:'¿Olvidó la contraseña?',
          verifiedTooltip:'Empresa cuya certificación permanente del registro mercantil portugués ha sido confirmada por el equipo Hivex.',
          mapPinHint:'💡 Toque un pin para ver los detalles de la empresa.',
          faqTitle:'Preguntas Frecuentes', faqMeta:'Respuestas rápidas a las dudas más comunes',
          featuredSeeAllBig:'Ver todas las empresas en el mapa →',
          regFoundedYear:'Año de fundación', regBusinessHours:'Horario', regPortfolio:'Galería de trabajos',
          regPortfolioHint:'Pegue URLs de imágenes de sus trabajos. Por ahora solo enlaces externos.',
          detailPortfolio:'Galería de trabajos',
          compareTitle:'Comparar empresas', compareClear:'Limpiar', compareGo:'Comparar →',
          forgotTitle:'Recuperar contraseña',
          forgotBody:'Indique su email y le enviaremos un enlace para establecer una nueva contraseña.',
          forgotSend:'Enviar enlace',
          resetTitle:'Establecer nueva contraseña',
          resetBody:'Elija una nueva contraseña (mínimo 8 caracteres).',
          resetSubmit:'Establecer contraseña',
          cookieTitle:'🍪 Privacidad y cookies',
          cookieBody:'Cookies necesarias para iniciar sesión e idioma. Analíticas solo con su consentimiento.',
          cookieMore:'Más información',
          cookieAccept:'Aceptar todo',
          cookieReject:'Rechazar' },
    de: { regStep1Label:'Identität', regStep2Label:'Standort', regStep3Label:'Kontakte',
          regStepNext:'Weiter', regStepBack:'Zurück',
          regCountry:'Land', regPostalCode:'Postleitzahl', regCity:'Ort / Stadt',
          sortAll:'Alle',
          successTitle:'Anfrage gesendet!', successSub:'Ihre Anfrage wurde empfangen und wird geprüft. Sie erhalten eine Bestätigungs-E-Mail, sobald das Unternehmen freigegeben wurde.',
          successClose:'Weiter browsen',
          forgotPwd:'Passwort vergessen?',
          verifiedTooltip:'Unternehmen, dessen portugiesischer Handelsregisterauszug vom Hivex-Team verifiziert wurde — zusätzliche Vertrauensebene.',
          mapPinHint:'💡 Tippen Sie auf einen Pin, um Firmendetails zu sehen.',
          faqTitle:'Häufige Fragen', faqMeta:'Schnelle Antworten auf gängige Fragen',
          featuredSeeAllBig:'Alle Unternehmen auf der Karte ansehen →',
          regFoundedYear:'Gründungsjahr', regBusinessHours:'Öffnungszeiten', regPortfolio:'Arbeitsgalerie',
          regPortfolioHint:'Fügen Sie Bild-URLs Ihrer Arbeiten ein. Aktuell nur externe Links.',
          detailPortfolio:'Arbeitsgalerie',
          compareTitle:'Unternehmen vergleichen', compareClear:'Löschen', compareGo:'Vergleichen →',
          forgotTitle:'Passwort zurücksetzen',
          forgotBody:'Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link, um ein neues Passwort festzulegen.',
          forgotSend:'Link senden',
          resetTitle:'Neues Passwort festlegen',
          resetBody:'Wählen Sie ein neues Passwort (mindestens 8 Zeichen).',
          resetSubmit:'Passwort festlegen',
          cookieTitle:'🍪 Datenschutz und Cookies',
          cookieBody:'Notwendige Cookies für Anmeldung und Sprache. Analyse-Cookies nur mit Ihrer Zustimmung.',
          cookieMore:'Mehr erfahren',
          cookieAccept:'Alle akzeptieren',
          cookieReject:'Ablehnen' }
  };
  if (typeof translations !== 'undefined') {
    Object.keys(extra).forEach(lang => {
      if (translations[lang]) Object.assign(translations[lang], extra[lang]);
    });
  }
})();

// ── Swipe-down to close detail panel on mobile ────────────────────────────────
(function() {
  const panel = document.getElementById('detailPanel');
  if (!panel) return;
  let startY = 0, currentY = 0, dragging = false;
  const THRESHOLD = 80; // px swipe needed to close

  panel.addEventListener('touchstart', e => {
    // Only start drag if touch begins on the drag handle or near the top of the panel
    const handle = panel.querySelector('.dp-drag-handle');
    const rect   = panel.getBoundingClientRect();
    const touchY = e.touches[0].clientY;
    if (handle && handle.contains(e.target)) {
      dragging = true;
    } else if (touchY - rect.top < 60) {
      dragging = true;
    }
    if (dragging) startY = touchY;
  }, { passive: true });

  panel.addEventListener('touchmove', e => {
    if (!dragging) return;
    currentY = e.touches[0].clientY;
    const delta = Math.max(0, currentY - startY);
    panel.style.transform = `translateY(${delta}px)`;
    panel.style.transition = 'none';
  }, { passive: true });

  panel.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    panel.style.transition = '';
    if (currentY - startY > THRESHOLD) {
      panel.style.transform = '';
      closeDetail();
    } else {
      panel.style.transform = '';
    }
  });
})();

// ── Dark mode toggle (opt-in; default light). Theme is applied pre-paint by
// the inline <head> script; this just flips + persists + syncs the button. ──
function toggleTheme() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (dark) { document.documentElement.removeAttribute('data-theme'); try { localStorage.setItem('hivex_theme', 'light'); } catch (e) {} }
  else { document.documentElement.setAttribute('data-theme', 'dark'); try { localStorage.setItem('hivex_theme', 'dark'); } catch (e) {} }
  _syncThemeToggle();
}
function _syncThemeToggle() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const ico = document.getElementById('themeToggleIco');
  const txt = document.getElementById('themeToggleTxt');
  if (ico) ico.textContent = dark ? '☀️' : '🌙';
  if (txt) txt.textContent = dark ? t('themeToLight') : t('themeToDark');
  // Mobile drawer toggle (full-width label)
  const mIco = document.getElementById('mobileThemeIco');
  const mTxt = document.getElementById('mobileThemeTxt');
  if (mIco) mIco.textContent = dark ? '☀️' : '🌙';
  if (mTxt) mTxt.textContent = dark ? t('themeModeLight') : t('themeModeDark');
}
window.toggleTheme = toggleTheme;
document.addEventListener('DOMContentLoaded', _syncThemeToggle);

// Register Service Worker for PWA.
// Self-heal stale clients: when a newly-deployed SW takes control, reload the
// page ONCE so open tabs pick up the fresh HTML/JS instead of serving an old
// cached build indefinitely. The `refreshing` guard prevents reload loops, and
// the initial-controller check avoids an extra reload on the first-ever visit.
if ('serviceWorker' in navigator) {
  let _swRefreshing = false;
  const _hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (_swRefreshing || !_hadController) return;
    _swRefreshing = true;
    window.location.reload();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      try { reg.update(); } catch (_) {}
    }).catch(() => {});
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE: URL Hash Routing — company deep links + sector landing pages
// ═══════════════════════════════════════════════════════════════════════════════
function _parseHash() {
  const h = location.hash.replace('#', '');
  if (!h) return null;
  const [type, value] = h.split('/');
  return { type, value: decodeURIComponent(value || '') };
}

function _handleHashRoute() {
  const route = _parseHash();
  if (!route) return;
  if (route.type === 'empresa' && route.value) {
    // Refresh must land on the plain map — only fresh navigations (shared
    // links) auto-open a company. _hashRouteConsumed keeps later re-runs of
    // this handler (init fires it twice) from re-opening after a reload strip.
    if (typeof _isReloadNavigation === 'function' && _isReloadNavigation() && !window._hashRouteConsumed) {
      window._hashRouteConsumed = true;
      try { history.replaceState(null, '', window.location.pathname + window.location.search); } catch (_) {}
      return;
    }
    const id = parseInt(route.value, 10);
    const c  = companies.find(x => x.id === id || x.slug === route.value);
    if (c) { showTab('search'); setTimeout(() => openDetail(c.id), 400); }
  } else if (route.type === 'setor' && route.value) {
    openSectorLanding(route.value);
  }
}

window.addEventListener('hashchange', _handleHashRoute);

// Hook 2: update document.title when opening/closing a company. The URL
// itself is owned by the base open/closeDetail (see ?company=<id> deep-link
// routing) — we deliberately do NOT push a competing hash here.
_addOpenDetailHook((id) => {
  const c = companies.find(x => x.id === id);
  if (c) document.title = c.name + ' — Hivex B2B Marketplace';
});
_addCloseDetailHook(() => { document.title = 'Hivex – B2B Marketplace'; });

// Sector landing page
function openSectorLanding(sector) {
  const sectorCompanies = companies.filter(c =>
    c.status === 'approved' &&
    ((c.sectors || []).includes(sector) || c.sector === sector)
  );

  showTab('search');
  // Activate the sector filter instead of building a separate page
  activeSectors.clear();
  activeSectors.add(sector);
  applyFilters.now();
  history.replaceState(null, '', '#setor/' + encodeURIComponent(sector));
  document.title = sector + ' — Hivex B2B Marketplace';
  showToast(t('showingPrefix') + ' ' + sectorCompanies.length + ' ' + t('showingMid') + ' ' + sector);
}

// Run hash routing after companies load
const _origLoadCompanies = typeof loadCompaniesFromDB === 'function' ? loadCompaniesFromDB : null;
if (_origLoadCompanies) {
  loadCompaniesFromDB = async function(opts) {
    await _origLoadCompanies(opts); // forward opts — {full:true} drives the two-phase load
    // Now that the companies list is available, re-render the avatar menu so
    // the "Anunciante" badge picks up any listings owned by the current user.
    if (typeof updateNavAuth === 'function') updateNavAuth();
    setTimeout(_handleHashRoute, 600);
    // Deep-link: open the company referenced by ?company=<id>
    setTimeout(_openCompanyFromUrl, 650);
  };
}
// Also try on DOMContentLoaded in case companies are already loaded
document.addEventListener('DOMContentLoaded', () => setTimeout(_handleHashRoute, 1200));

// ── DEEP-LINK ROUTING FOR COMPANY DETAIL ─────────────────────────────────────
// Reads ?company=<id> on initial load and on browser back/forward, opening
// or closing the detail panel without pushing redundant history entries.
// True when this page load is a refresh (F5 / pull-to-refresh) rather than a
// first navigation. Shared deep links must still open the company, but a
// refresh must land on the plain map (no auto-selected company).
function _isReloadNavigation() {
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    return !!nav && nav.type === 'reload';
  } catch (_) { return false; }
}
function _openCompanyFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('company');
    if (!raw) return;
    if (_isReloadNavigation()) {
      // Refresh: drop the param so the map comes up clean (and stays clean on
      // further refreshes) instead of re-selecting the company.
      const url = new URL(window.location.href);
      url.searchParams.delete('company');
      history.replaceState({ company: null }, '', url.toString());
      return;
    }
    const id = Number(raw);
    if (!Number.isFinite(id)) return;
    if (typeof companies === 'undefined' || !companies.find(c => c.id === id)) return;
    // Replace state so the user's first back press leaves the panel rather than
    // landing on an identical URL.
    history.replaceState({ company: id }, '', window.location.href);
    window._suppressCompanyHistory = true;
    try { openDetail(id); } finally { window._suppressCompanyHistory = false; }
  } catch (_) {}
}
window.addEventListener('popstate', () => {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('company');
  const id  = raw ? Number(raw) : null;
  window._suppressCompanyHistory = true;
  try {
    if (id && Number.isFinite(id) && id !== selectedId) {
      openDetail(id);
    } else if (!id && selectedId != null) {
      closeDetail();
    }
  } finally {
    window._suppressCompanyHistory = false;
  }
});

// FEATURE: Featured pins — styling is baked into createMarkerIcon() above,
// which applies a gold ring and ⭐ badge when c.featured === true.
// No DOM patching needed here.

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE: Analytics event tracking
// ═══════════════════════════════════════════════════════════════════════════════
// Hook 3: fire-and-forget view event whenever a detail panel opens
_addOpenDetailHook((id) => {
  if (typeof api !== 'undefined') api.trackEvent(id, 'view');
});

// Track website click
const _origOpenWebsite = typeof openWebsite === 'function' ? openWebsite : null;
document.addEventListener('click', function(e) {
  const a = e.target.closest('a[href^="http"]');
  if (a && selectedId) {
    const c = companies.find(x => x.id === selectedId);
    if (c && c.website && a.href.includes(c.website.replace(/https?:\/\//, ''))) {
      api.trackEvent(selectedId, 'website_click');
    }
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE: Reviews — load + submit
// ═══════════════════════════════════════════════════════════════════════════════
let _reviewScores = { quality: 0, speed: 0, communication: 0, value: 0 };

// Multi-criteria star picker. Each criterion (quality/speed/communication/value)
// is rated 1-5 independently.
function setReviewStar(crit, n) {
  _reviewScores[crit] = n;
  const row = document.querySelector(`#reviewCriteria .rc-stars[data-crit="${crit}"]`);
  if (row) row.querySelectorAll('span').forEach((el, i) => el.classList.toggle('active', i < n));
}

function _resetReviewScores() {
  _reviewScores = { quality: 0, speed: 0, communication: 0, value: 0 };
  document.querySelectorAll('#reviewCriteria .rc-stars span').forEach(el => el.classList.remove('active'));
}

function toggleReviewForm() {
  const form   = document.getElementById('dpReviewForm');
  const toggle = document.getElementById('dpReviewFormToggle');
  if (!form) return;
  const isHidden = form.style.display === 'none';
  form.style.display    = isHidden ? 'block' : 'none';
  toggle.style.display  = isHidden ? 'none'  : 'block';
  if (isHidden) { _resetReviewScores(); document.getElementById('reviewComment').value = ''; }
}

async function loadReviews(companyId) {
  const list = document.getElementById('dpReviewsList');
  const toggle = document.getElementById('dpReviewFormToggle');
  if (!list) return;
  list.innerHTML = '<div style="color:var(--muted);font-size:13px;text-align:center;padding:12px">A carregar avaliações...</div>';
  try {
    const reviews = await api.getReviews(companyId);
    if (reviews.length === 0) {
      list.innerHTML = '<div style="color:var(--muted);font-size:13px;text-align:center;padding:12px">Nenhuma avaliação ainda. Seja o primeiro!</div>';
    } else {
      // Build a star-distribution histogram. Same average can come from very
      // different shapes (4.5 ⭢ all 4-5 vs. half 5★ and half 3★) so this
      // gives users a much truer picture of the company's reviews.
      const dist = [0, 0, 0, 0, 0]; // index 0 = 5★, ... index 4 = 1★
      reviews.forEach(r => {
        const s = Math.max(1, Math.min(5, Math.round(r.score)));
        dist[5 - s]++;
      });
      const total = reviews.length;
      const histHtml = `
        <div class="review-dist">
          ${dist.map((count, i) => {
            const stars = 5 - i;
            const pct = total ? Math.round((count / total) * 100) : 0;
            return `<div class="review-dist-row">
              <span class="review-dist-label">${stars}★</span>
              <div class="review-dist-bar"><div class="review-dist-fill" style="width:${pct}%"></div></div>
              <span class="review-dist-count">${count}</span>
            </div>`;
          }).join('')}
        </div>`;

      // Is the logged-in user the owner of this company? If so, expose a
      // "Responder" link on reviews that don't yet have a reply.
      const company = companies.find(x => x.id === companyId);
      const me = JSON.parse(localStorage.getItem('hive_user') || 'null');
      const isOwner = !!(me && company && (me.is_admin || (company.created_by && company.created_by === me.id)));

      const cardsHtml = reviews.map(r => {
        const stars = '★'.repeat(r.score) + '☆'.repeat(5 - r.score);
        const date  = new Date(r.created_at).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
        const replyDate = r.reply_at ? new Date(r.reply_at).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }) : '';
        return `<div class="review-card" id="rc-${r.id}">
          <div class="review-card-top">
            <span class="review-card-author">${escHtml(r.author_name)}</span>
            <span class="review-card-date">${date}</span>
          </div>
          <div class="review-card-stars">${stars}</div>
          ${r.comment ? `<div class="review-card-comment">${escHtml(r.comment)}</div>` : ''}
          ${r.reply ? `
            <div class="review-reply">
              <div class="review-reply-head">↳ Resposta da empresa · <span class="review-reply-date">${replyDate}</span></div>
              <div class="review-reply-body">${escHtml(r.reply)}</div>
            </div>` : ''}
          ${isOwner && !r.reply ? `
            <div class="review-reply-form" id="rrf-${r.id}" style="display:none">
              <textarea id="rrt-${r.id}" placeholder="Escreva uma resposta pública…" rows="3" maxlength="1000"></textarea>
              <div style="display:flex;gap:8px;margin-top:8px;justify-content:flex-end">
                <button class="btn-cancel" onclick="document.getElementById('rrf-${r.id}').style.display='none'">Cancelar</button>
                <button class="btn-submit" onclick="submitReviewReply(${companyId}, ${r.id})">Publicar resposta</button>
              </div>
            </div>
            <div style="margin-top:8px"><button class="review-reply-btn" onclick="document.getElementById('rrf-${r.id}').style.display='block';this.style.display='none'">↳ Responder</button></div>
          ` : ''}
        </div>`;
      }).join('');

      // Per-criterion average breakdown (only criteria that have data show up)
      const _critDefs = [['quality', 'Qualidade'], ['speed', 'Prazos'], ['communication', 'Comunicação'], ['value', 'Qualidade/Preço']];
      const _critRows = _critDefs.map(([k, label]) => {
        const vs = reviews.map(r => r['score_' + k]).filter(v => v != null).map(Number);
        if (!vs.length) return '';
        const avg = vs.reduce((a, b) => a + b, 0) / vs.length;
        return `<div class="rcs-row"><span class="rcs-label">${label}</span><div class="rcs-bar"><div class="rcs-fill" style="width:${(avg / 5 * 100).toFixed(0)}%"></div></div><span class="rcs-val">${avg.toFixed(1)}</span></div>`;
      }).filter(Boolean).join('');
      const critAvgHtml = _critRows ? `<div class="review-crit-summary">${_critRows}</div>` : '';
      list.innerHTML = critAvgHtml + histHtml + cardsHtml;
    }
    // Show review form for logged-in users
    const user = JSON.parse(localStorage.getItem('hive_user') || 'null');
    if (user && toggle) toggle.style.display = 'block';
  } catch(e) {
    list.innerHTML = '<div style="color:var(--muted);font-size:13px;text-align:center;padding:12px">Não foi possível carregar as avaliações.</div>';
  }
}

async function submitReview() {
  const s = _reviewScores;
  const vals = [s.quality, s.speed, s.communication, s.value].filter(n => n >= 1);
  if (vals.length === 0) { showToast(t('toastSelectRating')); return; }
  const overall = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  const comment = (document.getElementById('reviewComment')?.value || '').trim();
  const btn = document.querySelector('.review-submit-btn');
  if (btn) btn.disabled = true;
  try {
    // api.js is immutable-cached, so call the endpoint directly with the new criteria fields.
    await apiFetch('/companies/' + selectedId + '/reviews', { method: 'POST', body: {
      score: overall,
      score_quality:       s.quality || null,
      score_speed:         s.speed || null,
      score_communication: s.communication || null,
      score_value:         s.value || null,
      comment,
    }});
    showToast(t('toastReviewPublished'));
    toggleReviewForm();
    loadReviews(selectedId);
    // Refresh company rating in local data
    try {
      const updated = await api.getCompany(selectedId);
      const c = companies.find(x => x.id === selectedId);
      if (c && updated) { c.rating = updated.rating; c.reviews = updated.reviews; }
    } catch(e) {}
  } catch(e) {
    showToast(e.message || 'Erro ao publicar avaliação');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Submit a public reply to a review — only the company owner can call this
// (backend enforces the same; the UI just hides the form for non-owners).
async function submitReviewReply(companyId, reviewId) {
  const ta = document.getElementById('rrt-' + reviewId);
  const reply = (ta?.value || '').trim();
  if (!reply) { showToast(t('toastWriteReply')); return; }
  try {
    await api.replyToReview(companyId, reviewId, reply);
    showToast(t('toastReplyPublished'));
    loadReviews(companyId);
  } catch (e) {
    showToast(e.message || 'Não foi possível publicar a resposta');
  }
}
window.submitReviewReply = submitReviewReply;

// Hook 4: reset the reviews section and (for logged-in users) load real
// reviews when the detail panel opens.
_addOpenDetailHook((id) => {
  const list   = document.getElementById('dpReviewsList');
  const form   = document.getElementById('dpReviewForm');
  const toggle = document.getElementById('dpReviewFormToggle');
  if (list)   list.innerHTML = '';
  if (form)   form.style.display = 'none';
  if (toggle) toggle.style.display = 'none';
  const user = JSON.parse(localStorage.getItem('hive_user') || 'null');
  if (user) loadReviews(id);
});

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE: Contact Form Modal
// ═══════════════════════════════════════════════════════════════════════════════
function openContactModal() {
  // Guests can send messages too — the backend accepts unauthenticated contact
  // with a name + email (rate-limited + honeypot). No more login wall here.
  const user = JSON.parse(localStorage.getItem('hive_user') || 'null');
  const c = companies.find(x => x.id === selectedId);
  if (!c) return;
  const guest = document.getElementById('contactGuestFields');
  if (guest) guest.style.display = user ? 'none' : '';
  const sub = document.getElementById('contactModalSub');
  if (sub) sub.textContent = t('contactSendTo') + ' ' + c.name;
  const msg = document.getElementById('contactMessage');
  if (msg) msg.value = '';
  document.getElementById('contactModal').classList.add('open');
  setTimeout(() => (user ? msg : document.getElementById('contactGuestName'))?.focus(), 200);
}

function closeContactModal() {
  document.getElementById('contactModal').classList.remove('open');
}

async function submitContactForm() {
  const msg = (document.getElementById('contactMessage')?.value || '').trim();
  if (msg.length < 10) { showToast(t('toastMsgTooShort')); return; }
  const user = JSON.parse(localStorage.getItem('hive_user') || 'null');
  const body = { message: msg };
  if (!user) {
    const gName = (document.getElementById('contactGuestName')?.value || '').trim();
    const gEmail = (document.getElementById('contactGuestEmail')?.value || '').trim();
    if (!gName) { showToast(t('contactNameReq')); document.getElementById('contactGuestName')?.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(gEmail)) { showToast(t('contactEmailReq')); document.getElementById('contactGuestEmail')?.focus(); return; }
    body.name = gName;
    body.email = gEmail;
    body.website = document.getElementById('contactWebsite')?.value || ''; // honeypot
  }
  const btn = document.querySelector('#contactModal button[onclick="submitContactForm()"]');
  if (btn) { btn.disabled = true; btn.textContent = t('sendingBtn'); }
  try {
    await api.contactCompany(selectedId, body);
    closeContactModal();
    showToast(t('toastMsgSent'));
  } catch(e) {
    showToast(e.message || 'Erro ao enviar mensagem');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Enviar Mensagem'; }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE: Admin Dashboard Panel
// ═══════════════════════════════════════════════════════════════════════════════
let _adminCurrentTab = 'stats';

// Refreshes the red "pending companies" badge on the admin menu entry (and the
// mobile drawer link). Fed by /admin/stats.pending. Inline-styled (no CSS bump).
async function refreshAdminPendingBadge() {
  try {
    const s = await apiFetch('/admin/stats');
    const n = (s && s.pending) ? s.pending : 0;
    document.querySelectorAll('.admin-menu-item, .admin-mobile-link').forEach(el => {
      let b = el.querySelector('.admin-pending-badge');
      if (n > 0) {
        if (!b) {
          b = document.createElement('span');
          b.className = 'admin-pending-badge';
          b.style.cssText = 'margin-left:auto;background:#ef4444;color:#fff;font-size:10px;font-weight:800;min-width:18px;height:18px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px';
          el.appendChild(b);
        }
        b.textContent = n;
      } else if (b) { b.remove(); }
    });
  } catch (_) { /* not admin / offline — ignore */ }
}
window.refreshAdminPendingBadge = refreshAdminPendingBadge;

function openAdminPanel() {
  document.getElementById('adminPanel').classList.add('open');
  adminSwitchTab('stats');
}

function closeAdminPanel() {
  document.getElementById('adminPanel').classList.remove('open');
}

function adminSwitchTab(tab) {
  _adminCurrentTab = tab;
  document.querySelectorAll('.admin-tab').forEach((el, i) => {
    el.classList.toggle('active', ['stats','pending','all','reports'][i] === tab);
  });
  if (tab === 'stats') adminLoadStats();
  else if (tab === 'pending') adminLoadCompanies('pending');
  else if (tab === 'reports') adminLoadReports('pending');
  else adminLoadCompanies();
}

// ── ADMIN REPORTS QUEUE ───────────────────────────────────────────────────
async function adminLoadReports(status) {
  const body = document.getElementById('adminBody');
  body.innerHTML = `
    <div class="admin-search-bar">
      <select id="reportStatusFilter" onchange="adminLoadReports(this.value)">
        <option value="pending" ${status==='pending'?'selected':''}>${t('admPendingPlain')}</option>
        <option value="reviewed" ${status==='reviewed'?'selected':''}>${t('admReviewed')}</option>
        <option value="dismissed" ${status==='dismissed'?'selected':''}>${t('admDismissed')}</option>
        <option value="" ${!status?'selected':''}>${t('admAll')}</option>
      </select>
    </div>
    <div id="adminReportsList"><div style="text-align:center;padding:32px;color:var(--muted)">${t('loadingGeneric')}</div></div>`;
  try {
    const rows = await api.adminReports(status ? { status } : {});
    const list = document.getElementById('adminReportsList');
    if (!rows.length) { list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--muted)">' + t('admNoReports') + '</div>'; return; }
    const reasonLabel = {
      fake: t('admReasonFake'), inappropriate: t('admReasonInappropriate'),
      duplicate: t('admReasonDuplicate'), wrong_info: t('admReasonWrongInfo'),
      spam: t('admReasonSpam'), other: t('admReasonOther'),
    };
    list.innerHTML = rows.map(r => `
      <div class="admin-company-row" id="reportRow${r.id}" style="flex-direction:column;align-items:stretch;gap:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
          <div style="font-weight:800;font-size:14px">${escHtml(r.company_name)} <span style="font-size:11px;color:var(--muted);font-weight:400">#${r.company_id}</span></div>
          <span class="admin-status-badge ${r.status==='pending'?'pending':r.status==='reviewed'?'approved':'rejected'}">${r.status}</span>
        </div>
        <div style="font-size:13px"><strong>${escHtml(reasonLabel[r.reason]||r.reason)}</strong>${r.details?` — ${escHtml(r.details)}`:''}</div>
        <div style="font-size:11px;color:var(--muted)">
          ${t('admReportedBy')} ${escHtml(r.reporter_name||t('admAnonymous'))} (${escHtml(r.reporter_email||'')}) · ${new Date(r.created_at).toLocaleString('pt-PT')}
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="admin-action-btn" onclick="adminViewReportedCompany(${r.company_id})">${t('admViewCompany')}</button>
          ${r.status==='pending' ? `<button class="admin-action-btn" onclick="adminSetReportStatus(${r.id},'reviewed')">${t('admMarkReviewed')}</button>` : ''}
          ${r.status==='pending' ? `<button class="admin-action-btn danger" onclick="adminSetReportStatus(${r.id},'dismissed')">${t('admDismiss')}</button>` : ''}
        </div>
      </div>`).join('');
  } catch(e) {
    document.getElementById('adminReportsList').innerHTML = '<div style="color:var(--red);padding:20px">' + (e.message||t('admError')) + '</div>';
  }
}
async function adminSetReportStatus(id, status) {
  try {
    await api.adminSetReportStatus(id, status);
    showToast(t('toastReportUpdated'));
    adminLoadReports(document.getElementById('reportStatusFilter')?.value || 'pending');
  } catch(e) { showToast(e.message||t('admError')); }
}
function adminViewReportedCompany(id) {
  closeAdminPanel();
  openDetail(id);
}

async function adminLoadStats() {
  const body = document.getElementById('adminBody');
  body.innerHTML = '<div style="text-align:center;padding:32px;color:var(--muted)">' + t('loadingGeneric') + '</div>';
  try {
    const [s, v] = await Promise.all([
      api.adminStats(),
      apiFetch('/admin/visits').catch(() => null),
    ]);
    // Show the pending count on the "Pendentes" tab so it's visible at a glance.
    const pendTab = document.querySelector('.admin-tab[onclick*="pending"]');
    if (pendTab) pendTab.innerHTML = t('adminTabPending') + (s.pending > 0 ? ` <span style="background:#ef4444;color:#fff;font-size:10px;font-weight:800;border-radius:9px;padding:1px 6px;margin-left:4px">${s.pending}</span>` : '');
    const visitsHtml = v ? `
      <div style="font-size:13px;font-weight:800;color:var(--text);margin:0 0 10px">Visitas ao site</div>
      <div class="admin-stat-grid avg-5">
        <div class="admin-stat-card"><div class="admin-stat-value" style="color:var(--text)">${v.today}</div><div class="admin-stat-label">Hoje</div></div>
        <div class="admin-stat-card"><div class="admin-stat-value" style="color:var(--primary)">${v.uniqueToday != null ? v.uniqueToday : '—'}</div><div class="admin-stat-label">Únicos hoje</div></div>
        <div class="admin-stat-card"><div class="admin-stat-value">${v.last7}</div><div class="admin-stat-label">Últimos 7 dias</div></div>
        <div class="admin-stat-card"><div class="admin-stat-value">${v.last30}</div><div class="admin-stat-label">Últimos 30 dias</div></div>
        <div class="admin-stat-card"><div class="admin-stat-value">${v.unique30}</div><div class="admin-stat-label">Únicos (30 dias)</div></div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;margin:10px 0 6px">
        <span style="font-size:11px;font-weight:700;color:var(--muted);margin-right:auto">Visitas ao longo do tempo</span>
        <button id="admvbday" onclick="adminLoadVisitsChart('day')">Dia</button>
        <button id="admvbweek" onclick="adminLoadVisitsChart('week')">Semana</button>
        <button id="admvbmonth" onclick="adminLoadVisitsChart('month')">Mês</button>
      </div>
      <div id="adminVisitsChartBox">${adminVisitsLineChart(v.series, v.period || 'day')}</div>
      <div style="font-size:13px;font-weight:800;color:var(--text);margin:20px 0 10px">Empresas &amp; utilizadores</div>` : '';
    body.innerHTML = `
      ${visitsHtml}
      <div class="admin-stat-grid">
        <div class="admin-stat-card"><div class="admin-stat-value" style="color:var(--green)">${s.approved}</div><div class="admin-stat-label">${t('admStatApproved')}</div></div>
        <div class="admin-stat-card"><div class="admin-stat-value" style="color:#f59e0b">${s.pending}</div><div class="admin-stat-label">${t('admPendingPlain')}</div></div>
        <div class="admin-stat-card"><div class="admin-stat-value" style="color:var(--red)">${s.rejected}</div><div class="admin-stat-label">${t('admStatRejected')}</div></div>
        <div class="admin-stat-card"><div class="admin-stat-value">${s.total_users}</div><div class="admin-stat-label">${t('admStatUsers')}</div></div>
        <div class="admin-stat-card"><div class="admin-stat-value">${s.total_reviews}</div><div class="admin-stat-label">${t('admStatReviews')}</div></div>
        <div class="admin-stat-card"><div class="admin-stat-value" style="color:var(--text)">${s.events_7d}</div><div class="admin-stat-label">${t('admStatEvents7d')}</div></div>
        <div class="admin-stat-card"><div class="admin-stat-value">${s.new_7d}</div><div class="admin-stat-label">${t('admStatNew7d')}</div></div>
        <div class="admin-stat-card"><div class="admin-stat-value">${s.total_companies}</div><div class="admin-stat-label">${t('admStatTotal')}</div></div>
      </div>
      <div style="text-align:center;margin-top:8px">
        <button onclick="adminSwitchTab('pending')" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:10px 24px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">
          ${t('admViewPendingA')} ${s.pending} ${t('admViewPendingB')}
        </button>
      </div>`;
    if (v) _setVisitsPeriodBtns('day');
  } catch(e) {
    body.innerHTML = '<div style="color:var(--red);text-align:center;padding:32px">' + (e.message||t('admErrorLoading')) + '</div>';
  }
}

// Active-state styling for the Dia/Semana/Mês period buttons (inline → no CSS bump).
function _setVisitsPeriodBtns(period) {
  ['day', 'week', 'month'].forEach(p => {
    const b = document.getElementById('admvb' + p);
    if (!b) return;
    const on = p === period;
    b.style.cssText = 'padding:4px 12px;font-size:12px;font-weight:700;border-radius:8px;cursor:pointer;font-family:inherit;border:1px solid ' +
      (on ? 'var(--primary)' : 'var(--border)') + ';background:' + (on ? 'var(--primary)' : 'var(--bg)') + ';color:' + (on ? '#fff' : 'var(--text)');
  });
}

// Fetches a visits series for the chosen period and redraws the line chart.
async function adminLoadVisitsChart(period) {
  _setVisitsPeriodBtns(period);
  const box = document.getElementById('adminVisitsChartBox');
  if (box) box.innerHTML = '<div style="text-align:center;padding:24px;color:var(--muted);font-size:12px">A carregar…</div>';
  try {
    const v = await apiFetch('/admin/visits?period=' + period);
    if (box) box.innerHTML = adminVisitsLineChart(v.series, period);
  } catch (e) {
    if (box) box.innerHTML = '<div style="color:var(--red);padding:16px;font-size:12px">Erro ao carregar o gráfico.</div>';
  }
}
window.adminLoadVisitsChart = adminLoadVisitsChart;

// Axis label: day/week (YYYY-MM-DD → DD/MM), month (YYYY-MM → MM/YY).
function _visitLabelFmt(lbl, period) {
  if (!lbl) return '';
  if (period === 'month') { const p = lbl.split('-'); return p.length >= 2 ? p[1] + '/' + p[0].slice(2) : lbl; }
  const p = lbl.split('-'); return p.length >= 3 ? p[2] + '/' + p[1] : lbl;
}

// SVG line chart of site visits over time for the admin Stats tab.
function adminVisitsLineChart(series, period) {
  if (!series || !series.length) return '<div style="font-size:11px;color:var(--muted);padding:14px 0">Ainda sem dados de visitas — vão aparecer assim que houver tráfego.</div>';
  const W = 620, H = 150, P = { l: 30, r: 14, t: 14, b: 26 };
  const n = series.length;
  const maxV = Math.max(1, ...series.map(d => d.visits));
  const iW = W - P.l - P.r, iH = H - P.t - P.b;
  const X = i => P.l + (n <= 1 ? iW / 2 : (i / (n - 1)) * iW);
  const Y = vv => P.t + iH - (vv / maxV) * iH;
  const linePts = series.map((d, i) => `${X(i).toFixed(1)},${Y(d.visits).toFixed(1)}`).join(' ');
  const areaPts = `${X(0).toFixed(1)},${(P.t + iH).toFixed(1)} ${linePts} ${X(n - 1).toFixed(1)},${(P.t + iH).toFixed(1)}`;
  const step = Math.max(1, Math.ceil(n / 6));
  let xl = '';
  for (let i = 0; i < n; i += step) xl += `<text x="${X(i).toFixed(1)}" y="${H - 8}" font-size="9" fill="#94a3b8" text-anchor="middle">${_visitLabelFmt(series[i].label, period)}</text>`;
  const dots = series.map((d, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(d.visits).toFixed(1)}" r="2.6" fill="#1d4ed8"><title>${d.label}: ${d.visits} visita(s)</title></circle>`).join('');
  return `<div style="background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:6px">
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block">
      <line x1="${P.l}" y1="${P.t}" x2="${P.l}" y2="${(P.t + iH).toFixed(1)}" stroke="#e2e8f0"/>
      <line x1="${P.l}" y1="${(P.t + iH).toFixed(1)}" x2="${W - P.r}" y2="${(P.t + iH).toFixed(1)}" stroke="#e2e8f0"/>
      <text x="4" y="${(P.t + 4).toFixed(1)}" font-size="9" fill="#94a3b8">${maxV}</text>
      <polygon points="${areaPts}" fill="rgba(37,99,235,.12)"/>
      <polyline points="${linePts}" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      ${dots}
      ${xl}
    </svg>
  </div>`;
}

async function adminLoadCompanies(status) {
  const body = document.getElementById('adminBody');
  body.innerHTML = `
    <div class="admin-search-bar">
      <input type="text" id="adminSearchQ" placeholder="${t('admSearchPh')}" oninput="adminFilterRows(this.value)"/>
      <select id="adminStatusFilter" onchange="adminReloadWithStatus(this.value)">
        <option value="">${t('admAll')}</option>
        <option value="pending" ${status==='pending'?'selected':''}>${t('admPendingPlain')}</option>
        <option value="approved" ${status==='approved'?'selected':''}>${t('admStatApproved')}</option>
        <option value="rejected" ${status==='rejected'?'selected':''}>${t('admStatRejected')}</option>
        <option value="removed"  ${status==='removed' ?'selected':''}>${t('admStatusRemoved')}</option>
      </select>
    </div>
    <div id="adminCompaniesList"><div style="text-align:center;padding:32px;color:var(--muted)">${t('loadingGeneric')}</div></div>`;

  try {
    const rows = await api.adminCompanies(status ? { status } : {});
    _adminRows = rows;
    renderAdminRows(rows);
  } catch(e) {
    document.getElementById('adminCompaniesList').innerHTML = '<div style="color:var(--red);padding:20px">' + (e.message||t('admError')) + '</div>';
  }
}

let _adminRows = [];

function adminFilterRows(q) {
  if (!q) { renderAdminRows(_adminRows); return; }
  const lq = q.toLowerCase();
  renderAdminRows(_adminRows.filter(r =>
    r.name.toLowerCase().includes(lq) || (r.email||'').toLowerCase().includes(lq)
  ));
}

function adminReloadWithStatus(status) {
  adminLoadCompanies(status || undefined);
}

function renderAdminRows(rows) {
  const list = document.getElementById('adminCompaniesList');
  if (!list) return;
  if (rows.length === 0) { list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--muted)">' + t('admNoCompanies') + '</div>'; return; }
  list.innerHTML = rows.map(r => `
    <div class="admin-company-row" id="adminRow${r.id}">
      <div style="flex:1;min-width:0">
        <div class="admin-company-name">${escHtml(r.name)} ${r.featured?'⭐':''}${r.verified?'✅':''}</div>
        <div class="admin-company-sub">${escHtml(r.email||'')} · ${escHtml(r.city||'')} · ${escHtml(r.sector||'')}</div>
        <div style="font-size:10px;color:var(--muted);margin-top:1px">
          ${r.created_at ? new Date(r.created_at).toLocaleDateString('pt-PT') : ''} · ${escHtml(r.owner_name||t('admNoAccount'))}
        </div>
      </div>
      <span class="admin-status-badge ${r.status}">${
        r.status==='approved' ? t('statusApproved') :
        r.status==='pending'  ? t('statusPending') :
        r.status==='rejected' ? t('statusRejected') :
        r.status==='removed'  ? t('statusRemoved')  : r.status
      }</span>
      ${r.status !== 'approved' ? `<button class="admin-action-btn" onclick="adminApprove(${r.id})">${r.status === 'removed' ? t('admRestore') : t('admApprove')}</button>` : ''}
      ${r.status !== 'rejected' && r.status !== 'removed' ? `<button class="admin-action-btn danger" onclick="adminRemove(${r.id})">${t('admRemove')}</button>` : ''}
      <button class="admin-action-btn" onclick="adminEditCompany(${r.id})" title="Editar os dados da empresa">✎ Editar</button>
      <button class="admin-action-btn" onclick="window.open('https://www.impic.pt/impic/pt-pt/consultar/consulta-de-titulos','_blank','noopener')" title="Validar o alvará no registo público do IMPIC">IMPIC ↗</button>
      <button class="admin-action-btn" onclick="adminToggleFeatured(${r.id},${!r.featured})" title="${r.featured?t('admUnfeatureTitle'):t('admFeatureTitle')}">
        ${r.featured ? t('admUnfeatureBtn') : t('admFeatureBtn')}
      </button>
    </div>`).join('');
}

// Admin: open the full edit form for any company (works for pending/rejected
// listings too — profileEditCompany fetches the record when it isn't in the
// local approved-only array).
function adminEditCompany(id) {
  closeAdminPanel();
  profileEditCompany(Number(id));
}
window.adminEditCompany = adminEditCompany;

async function adminApprove(id) {
  try {
    await api.adminSetStatus(id, 'approved');
    const row = _adminRows.find(r => r.id === id);
    if (row) row.status = 'approved';
    renderAdminRows(_adminRows);
    // Also update local companies array
    const c = companies.find(x => x.id === id);
    if (c) c.status = 'approved';
    showToast(t('toastCompanyApproved'));
  } catch(e) { showToast(e.message||t('admError')); }
}

async function adminReject(id) {
  try {
    await api.adminSetStatus(id, 'rejected');
    const row = _adminRows.find(r => r.id === id);
    if (row) row.status = 'rejected';
    renderAdminRows(_adminRows);
    showToast(t('toastCompanyRejected'));
  } catch(e) { showToast(e.message||t('admError')); }
}

// Soft-delete a listing that was already published. Backend uses status
// 'removed' (distinct from 'rejected') and stamps removed_at.
async function adminRemove(id) {
  try {
    await api.adminSetStatus(id, 'removed');
    const row = _adminRows.find(r => r.id === id);
    if (row) row.status = 'removed';
    renderAdminRows(_adminRows);
    // Drop from the visible companies list and the map
    const idx = companies.findIndex(x => x.id === id);
    if (idx >= 0) {
      companies.splice(idx, 1);
      if (typeof applyFilters === 'function') applyFilters();
    }
    showToast(t('toastCompanyRemoved'));
  } catch(e) { showToast(e.message||t('admError')); }
}

async function adminToggleFeatured(id, featured) {
  try {
    await api.adminSetFeatured(id, featured);
    const row = _adminRows.find(r => r.id === id);
    if (row) row.featured = featured;
    renderAdminRows(_adminRows);
    // Update local companies
    const c = companies.find(x => x.id === id);
    if (c) { c.featured = featured; applyFilters.now(); }
    showToast(featured ? t('admFeatured') : t('admUnfeatured'));
  } catch(e) { showToast(e.message||t('admError')); }
}

// Add Admin button to the avatar menu for admin users
const _origUpdateNavAuth = updateNavAuth;
updateNavAuth = function() {
  _origUpdateNavAuth();
  const user = JSON.parse(localStorage.getItem('hive_user') || 'null');
  if (user && user.is_admin) {
    const menu = document.getElementById('avatarMenu');
    if (menu && !menu.querySelector('.admin-menu-item')) {
      const divider = menu.querySelector('.avatar-menu-divider');
      if (divider) {
        const adminBtn = document.createElement('div');
        adminBtn.className = 'avatar-menu-item admin-menu-item';
        adminBtn.style.color = '#f59e0b';
        adminBtn.onclick = () => { closeAvatarMenu(); openAdminPanel(); };
        adminBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>' + t('adminPanelTitle');
        divider.before(adminBtn);
      }
    }
    // Mirror to mobile drawer
    const mobileArea = document.getElementById('mobileAuthArea');
    if (mobileArea && !mobileArea.querySelector('.admin-mobile-link')) {
      const mAdminBtn = document.createElement('button');
      mAdminBtn.className = 'mobile-nav-link admin-mobile-link';
      mAdminBtn.style.color = '#f59e0b';
      mAdminBtn.onclick = () => { openAdminPanel(); closeMobileNavPanel(); };
      mAdminBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg><span>' + t('adminPanelTitle') + '</span>';
      mobileArea.appendChild(mAdminBtn);
    }
    refreshAdminPendingBadge();
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE: Registration Status Check
// ═══════════════════════════════════════════════════════════════════════════════
function openStatusModal() {
  document.getElementById('statusModal').classList.add('open');
  document.getElementById('statusResult').style.display = 'none';
  const emailEl = document.getElementById('statusEmail');
  if (emailEl) emailEl.value = '';
  setTimeout(() => emailEl?.focus(), 200);
}

function closeStatusModal() {
  document.getElementById('statusModal').classList.remove('open');
}

async function checkRegistrationStatus() {
  const email = (document.getElementById('statusEmail')?.value || '').trim();
  if (!email) { showToast(t('toastEnterEmail2')); return; }
  const result = document.getElementById('statusResult');
  result.style.display = 'flex';
  result.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:8px">A verificar...</div>';
  try {
    const rows = await api.getCompanyStatus(email);
    if (rows.length === 0) {
      result.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:8px">Nenhum registo encontrado para este email.</div>';
      return;
    }
    result.innerHTML = rows.map(r => {
      const statusMap = { approved: { label: '✅ Aprovada', cls: 'approved' }, pending: { label: '⏳ A aguardar aprovação', cls: 'pending' }, rejected: { label: '❌ Rejeitada', cls: 'rejected' } };
      const s = statusMap[r.status] || { label: r.status, cls: 'pending' };
      const date = new Date(r.created_at).toLocaleDateString('pt-PT');
      return `<div class="status-card ${s.cls}">
        <div style="font-weight:800;font-size:14px;margin-bottom:4px">${escHtml(r.name)}</div>
        <div style="font-size:13px;font-weight:700">${s.label}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:4px">Submetido em ${date}</div>
      </div>`;
    }).join('');
  } catch(e) {
    result.innerHTML = '<div style="color:var(--red);font-size:13px;padding:8px">' + (e.message||'Erro ao verificar') + '</div>';
  }
}

// "Verificar Estado" button is already in the HTML inside .reg-success-card

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE: Analytics view in profile panel
// ═══════════════════════════════════════════════════════════════════════════════
async function openCompanyAnalytics(companyId) {
  const c = companies.find(x => x.id === companyId);
  if (!c) return;

  // Show in a toast-style overlay or inject into profile panel
  showToast(t('toastLoadingStats'));
  try {
    const stats = await api.getAnalytics(companyId);
    const total = (k) => (stats[k]?.total || 0);
    const d7    = (k) => (stats[k]?.last_7d || 0);

    const panel = document.getElementById('profilePanelBody');
    const analyticsHtml = `
      <div style="margin-top:16px;border-top:1px solid var(--border);padding-top:16px">
        <div class="profile-section-title" style="display:flex;align-items:center;justify-content:space-between">
          <span>📊 Estatísticas — ${escHtml(c.name)}</span>
          <button onclick="openProfilePanel()" style="background:none;border:none;font-size:12px;color:var(--muted);cursor:pointer;font-family:inherit">← Voltar</button>
        </div>
        <div class="analytics-grid">
          <div class="analytics-stat"><div class="analytics-stat-val">${total('view')}</div><div class="analytics-stat-label">Visualizações</div></div>
          <div class="analytics-stat"><div class="analytics-stat-val">${d7('view')}</div><div class="analytics-stat-label">Vis. (7 dias)</div></div>
          <div class="analytics-stat"><div class="analytics-stat-val">${total('contact')}</div><div class="analytics-stat-label">Contactos</div></div>
          <div class="analytics-stat"><div class="analytics-stat-val">${total('whatsapp')}</div><div class="analytics-stat-label">WhatsApp</div></div>
          <div class="analytics-stat"><div class="analytics-stat-val">${total('website_click')}</div><div class="analytics-stat-label">Cliques Site</div></div>
          <div class="analytics-stat"><div class="analytics-stat-val" style="color:var(--gold)">${c.rating||0}</div><div class="analytics-stat-label">Classificação</div></div>
        </div>
      </div>`;
    panel.insertAdjacentHTML('beforeend', analyticsHtml);
    // Scroll to analytics
    panel.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' });
  } catch(e) {
    showToast(t('toastStatsError'));
  }
}

// Add analytics button to each company card in profile panel
const _origOpenProfilePanel = openProfilePanel;
openProfilePanel = function() {
  _origOpenProfilePanel();
  // Inject analytics button after profile renders
  setTimeout(() => {
    document.querySelectorAll('.profile-company-card').forEach(card => {
      const editBtn = card.querySelector('button[onclick*="profileEditCompany"]');
      if (editBtn && !card.querySelector('.analytics-btn')) {
        const match = editBtn.getAttribute('onclick').match(/\d+/);
        if (match) {
          const companyId = parseInt(match[0]);
          const analyticsBtn = document.createElement('button');
          analyticsBtn.className = 'analytics-btn';
          analyticsBtn.title = 'Estatísticas';
          analyticsBtn.style.cssText = 'background:var(--bg);border:1.5px solid var(--border);border-radius:8px;padding:7px 10px;font-size:12px;font-weight:700;color:var(--text-secondary);cursor:pointer;white-space:nowrap;font-family:inherit;flex-shrink:0;margin-left:4px';
          analyticsBtn.textContent = '📊';
          analyticsBtn.onclick = () => openCompanyAnalytics(companyId);
          editBtn.after(analyticsBtn);
        }
      }
    });
  }, 100);
};

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE: Sector landing pages — add to footer + home hero categories
// ═══════════════════════════════════════════════════════════════════════════════
// Wire hero category buttons to URL hash routing
document.querySelectorAll('[data-sector-link]').forEach(el => {
  el.addEventListener('click', () => openSectorLanding(el.dataset.sectorLink));
});


// ── PWA INSTALL PROMPT ──────────────────────────────────────────────────────
// Captures the beforeinstallprompt event (Chrome/Edge/Android) and shows a
// small toast-style banner so users can pin Hivex to their home screen. iOS
// Safari doesn't fire this event but supports add-to-home-screen via the
// share sheet; we surface a one-time hint there too.
(function() {
  return; // "Adicionar ao ecrã inicial" / install prompt disabled per user request
  const DISMISSED_KEY = 'hive_install_dismissed';
  let deferredPrompt = null;

  function alreadyInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }
  function dismissed() {
    try { return localStorage.getItem(DISMISSED_KEY) === '1'; } catch (_) { return false; }
  }
  function rememberDismiss() {
    try { localStorage.setItem(DISMISSED_KEY, '1'); } catch (_) {}
  }

  function buildBanner(html, onAction) {
    const el = document.createElement('div');
    el.id = 'pwaInstallBanner';
    el.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(72px + env(safe-area-inset-bottom));z-index:1400;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);border:1.5px solid rgba(37,99,235,.5);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 12px 32px rgba(0,0,0,.4);font-family:inherit;animation:pwaSlideUp .35s cubic-bezier(.4,0,.2,1) both';
    el.innerHTML = html;
    document.body.appendChild(el);
    const action = el.querySelector('[data-action]');
    const close  = el.querySelector('[data-close]');
    if (action) action.onclick = onAction;
    if (close)  close.onclick  = () => { rememberDismiss(); el.remove(); };
    if (!document.getElementById('pwaInstallStyles')) {
      const s = document.createElement('style');
      s.id = 'pwaInstallStyles';
      s.textContent = '@keyframes pwaSlideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}#pwaInstallBanner button{font-family:inherit}';
      document.head.appendChild(s);
    }
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (alreadyInstalled() || dismissed()) return;
    // Wait until the user has had a moment with the page
    setTimeout(() => {
      if (alreadyInstalled() || dismissed() || !deferredPrompt) return;
      buildBanner(
        '<div style="font-size:24px;flex-shrink:0">📲</div>' +
        '<div style="flex:1;min-width:0"><div style="color:#fff;font-size:13px;font-weight:800;line-height:1.3">Instalar Hivex no telemóvel</div><div style="color:#94a3b8;font-size:11px;line-height:1.4;margin-top:2px">Acesso rápido como uma app nativa</div></div>' +
        '<button data-action style="background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;border:0;border-radius:8px;padding:13px 22px;font-size:16px;font-weight:800;cursor:pointer;flex-shrink:0">Instalar</button>' +
        '<button data-close aria-label="Fechar" style="background:none;border:0;color:#94a3b8;font-size:22px;cursor:pointer;padding:0 4px;line-height:1;flex-shrink:0">×</button>',
        async () => {
          const banner = document.getElementById('pwaInstallBanner');
          if (banner) banner.remove();
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          try { await deferredPrompt.userChoice; } catch (_) {}
          deferredPrompt = null;
          rememberDismiss();
        }
      );
    }, 4000);
  });

  // iOS Safari path — no beforeinstallprompt, but the user can use Share → Add to Home Screen.
  // Show a one-time hint after they've spent ~6 seconds on the site.
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS && !alreadyInstalled() && !dismissed()) {
    setTimeout(() => {
      if (alreadyInstalled() || dismissed()) return;
      buildBanner(
        '<div style="font-size:24px;flex-shrink:0">📲</div>' +
        '<div style="flex:1;min-width:0"><div style="color:#fff;font-size:13px;font-weight:800;line-height:1.3">Adicionar Hivex ao ecrã inicial</div><div style="color:#94a3b8;font-size:11px;line-height:1.4;margin-top:2px">Toque em <span style="display:inline-flex;width:14px;height:14px;background:#0f172a;border:1px solid #94a3b8;border-radius:3px;vertical-align:middle;justify-content:center;align-items:center;font-size:10px;color:#94a3b8">↑</span> e depois "Adicionar ao ecrã inicial"</div></div>' +
        '<button data-close aria-label="Fechar" style="background:none;border:0;color:#94a3b8;font-size:22px;cursor:pointer;padding:0 4px;line-height:1;flex-shrink:0">×</button>',
        () => {}
      );
    }, 6000);
  }
})();

/* ══════════════════════════════════════════════════════════════════════════
   EMPRESAS DESTACADAS — dropdown pago à direita da barra "Áreas de Atividade"
   Empresas com featured=true (aprovado pelo admin) aparecem primeiro aos
   clientes. Posicionamento fixed dividido pelo zoom do body (mesmo padrão
   dos dropdowns das áreas).
   ══════════════════════════════════════════════════════════════════════════ */
function renderFeaturedMenu() {
  const menu = document.getElementById('featuredMenu');
  if (!menu) return;
  const feat = (companies || []).filter(c => c.featured)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 12);
  let html = '<div class="featured-menu-head">★ ' + escHtml(t('ubFeaturedBtn')) + '</div>';
  if (!feat.length) {
    html += '<div class="featured-empty">' + escHtml(t('featEmpty')) + '</div>';
  } else {
    html += feat.map(c => {
      const tile = c.logo
        ? '<img class="featured-logo" src="' + escHtml(c.logo) + '" alt="" loading="lazy" onerror="this.outerHTML=\'<span class=&quot;featured-mono&quot; style=&quot;background:' + getSectorColor(c) + '&quot;>' + companyMonogram(c) + '</span>\'"/>'
        : '<span class="featured-mono" style="background:' + getSectorColor(c) + '">' + companyMonogram(c) + '</span>';
      const sub = [c.sector, c.city].filter(Boolean).join(' · ');
      const star = c.rating ? '★ ' + Number(c.rating).toFixed(1) : '';
      return '<div class="featured-item" onclick="closeFeaturedMenu();openDetail(' + c.id + ')">'
        + tile
        + '<div style="min-width:0;flex:1"><div class="featured-item-name">' + escHtml(c.name) + '</div>'
        + (sub ? '<div class="featured-item-sub">' + escHtml(sub) + '</div>' : '')
        + '</div>'
        + (star ? '<span class="featured-item-star">' + star + '</span>' : '')
        + '</div>';
    }).join('');
  }
  html += '<button type="button" class="featured-cta" onclick="closeFeaturedMenu();openRegister()">' + escHtml(t('featCta')) + '</button>';
  menu.innerHTML = html;
}

function toggleFeaturedMenu(e) {
  if (e) e.stopPropagation();
  const btn = document.getElementById('ubFeaturedBtn');
  const menu = document.getElementById('featuredMenu');
  if (!btn || !menu) return;
  const wasOpen = menu.classList.contains('show');
  // fecha dropdowns de áreas abertos para não sobrepor
  document.querySelectorAll('.cat-dropdown.show').forEach(d => d.classList.remove('show'));
  document.querySelectorAll('.cat-item.open').forEach(d => d.classList.remove('open'));
  if (wasOpen) { closeFeaturedMenu(); return; }
  renderFeaturedMenu();
  // position:fixed dentro de body com zoom: dividir coordenadas visuais pelo zoom
  const z = parseFloat(getComputedStyle(document.body).zoom) || 1;
  const rect = btn.getBoundingClientRect();
  const vpW = window.innerWidth / z;
  menu.style.top = ((rect.bottom + 6) / z) + 'px';
  menu.style.maxHeight = Math.min(520, (window.innerHeight - rect.bottom - 16) / z) + 'px';
  menu.classList.add('show');
  const dw = menu.offsetWidth || 350;
  // alinhar a borda direita do menu com a do botão, sem sair do ecrã
  menu.style.left = Math.min(Math.max(4, rect.right / z - dw), Math.max(4, vpW - dw - 6)) + 'px';
  btn.setAttribute('aria-expanded', 'true');
}

function closeFeaturedMenu() {
  const menu = document.getElementById('featuredMenu');
  if (menu) menu.classList.remove('show');
  const btn = document.getElementById('ubFeaturedBtn');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('featuredMenu');
  if (menu && menu.classList.contains('show') && !menu.contains(e.target)) closeFeaturedMenu();
});

window.renderFeaturedMenu = renderFeaturedMenu;
window.toggleFeaturedMenu = toggleFeaturedMenu;
window.closeFeaturedMenu = closeFeaturedMenu;

/* ── PAINEL EMPRESAS DESTACADAS no Início (25% à direita das categorias) ──
   Lista todas as empresas featured; quando não cabem no painel, o conteúdo
   é duplicado e roda em loop contínuo lento (~6s por empresa; pausa no
   hover). Chamado por updateLandingStats() sempre que o Início é mostrado. */
function renderLpFeatured() {
  const panel = document.getElementById('lpFeatPanel');
  const track = document.getElementById('lpFeatTrack');
  const scroll = document.getElementById('lpFeatScroll');
  if (!panel || !track || !scroll) return;
  if (window.innerWidth <= 1024) { panel.classList.remove('on'); return; }
  let feat = (companies || []).filter(c => c.featured);
  // arranque: enquanto a API não responde, usa a cache da última visita
  // (substituída pelos dados frescos quando loadCompaniesFromDB terminar)
  if (!feat.length && !companies.length) {
    try { feat = JSON.parse(localStorage.getItem('hivex_featured_cache') || '[]'); } catch (_) { feat = []; }
  }
  feat = feat.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (!feat.length) { panel.classList.remove('on'); track.innerHTML = ''; return; }
  // cartões idênticos aos do painel "Empresas Próximas" do mapa (nearby-card):
  // logo, nome + verificada, setor com ponto colorido, Aberto/Fechado,
  // estrelas + n.º de avaliações e morada
  const tr = translations[currentLang] || translations.pt;
  const sc = tr.sectors || {};
  const item = c => {
    const rv = Number(c.rating) || 0;
    const sectorLabel = sc[c.sector] || c.sector || '';
    const rating = rv > 0
      ? '<span class="nc-stars">' + '★'.repeat(Math.round(rv)) + '</span> <strong>' + rv.toFixed(1) + '</strong> <span class="nc-reviews">(' + (c.reviews || 0) + ')</span>'
      : '<span class="badge-new">' + escHtml(t('newOnHivex')) + '</span>';
    const logo = c.logo
      ? '<div class="nc-logo" style="background:url(\'' + escHtml(c.logo) + '\') center/cover no-repeat"></div>'
      : '<div class="nc-logo logo-mono">' + companyMonogram(c) + '</div>';
    let openBadge = '';
    try { openBadge = _openBadgeHtml(c); } catch (_) {}
    return '<div class="nearby-card" onclick="openDetail(' + c.id + ')">'
      + '<div class="nc-top">' + logo
      + '<div class="nc-main"><div class="nc-name">' + escHtml(c.name) + (c.verified ? ' <span class="badge-verified" title="Empresa verificada">✓ Verificada</span>' : '') + '</div>'
      + '<div class="nc-sector"><span class="nc-dot" style="background:' + (c.color || getSectorColor(c)) + '"></span>' + escHtml(sectorLabel) + '</div></div>'
      + '<div class="nc-side"><span class="nc-feat-badge">★ ' + escHtml(t('featuredBadge')) + '</span>' + openBadge + '</div></div>'
      + '<div class="nc-rating">' + rating + '</div>'
      + (c.address || c.city ? '<div class="nc-address">' + escHtml(c.address || c.city) + '</div>' : '')
      + '</div>';
  };
  const listHtml = feat.map(item).join('');
  track.classList.remove('roll');
  track.innerHTML = listHtml;
  panel.classList.add('on');
  // rotação só quando a lista não cabe: duplicar para o loop -50% ser
  // contínuo (leitura de scrollHeight força layout síncrono — sem rAF)
  if (track.scrollHeight > scroll.clientHeight + 4) {
    track.innerHTML = listHtml + listHtml;
    track.style.setProperty('--roll-dur', Math.max(18, feat.length * 6) + 's');
    track.classList.add('roll');
  }
}
window.renderLpFeatured = renderLpFeatured;
// Primeiro paint: preenche já o painel a partir da cache, sem esperar pela API
try { renderLpFeatured(); } catch (_) {}
