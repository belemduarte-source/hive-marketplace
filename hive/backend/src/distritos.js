// Concelho → distrito (os 308 municípios; fonte GeoAPI.pt, a mesma tabela de
// hive/scripts/impic/concelhos-por-distrito.json, com a grafia dos nomes
// corrigida para mostrar). Os arquipélagos contam como "Madeira" e "Açores".
// Serve a Saúde do marketplace (painel de administração) para agrupar fichas e
// pedidos por concelho/distrito em SQL: MAPA vai como parâmetros
// (unnest($n::text[], …)) e SQL_NORM(expr) tem de dar, em Postgres, as MESMAS
// chaves que normalizar() dá aqui.
const DISTRITOS = {
  'Aveiro': ['Águeda', 'Albergaria-a-Velha', 'Anadia', 'Arouca', 'Aveiro', 'Castelo de Paiva', 'Espinho', 'Estarreja',
    'Ílhavo', 'Mealhada', 'Murtosa', 'Oliveira de Azeméis', 'Oliveira do Bairro', 'Ovar', 'Santa Maria da Feira',
    'São João da Madeira', 'Sever do Vouga', 'Vagos', 'Vale de Cambra'],
  'Beja': ['Aljustrel', 'Almodôvar', 'Alvito', 'Barrancos', 'Beja', 'Castro Verde', 'Cuba', 'Ferreira do Alentejo',
    'Mértola', 'Moura', 'Odemira', 'Ourique', 'Serpa', 'Vidigueira'],
  'Braga': ['Amares', 'Barcelos', 'Braga', 'Cabeceiras de Basto', 'Celorico de Basto', 'Esposende', 'Fafe', 'Guimarães',
    'Póvoa de Lanhoso', 'Terras de Bouro', 'Vieira do Minho', 'Vila Nova de Famalicão', 'Vila Verde', 'Vizela'],
  'Bragança': ['Alfândega da Fé', 'Bragança', 'Carrazeda de Ansiães', 'Freixo de Espada à Cinta', 'Macedo de Cavaleiros',
    'Miranda do Douro', 'Mirandela', 'Mogadouro', 'Torre de Moncorvo', 'Vila Flor', 'Vimioso', 'Vinhais'],
  'Castelo Branco': ['Belmonte', 'Castelo Branco', 'Covilhã', 'Fundão', 'Idanha-a-Nova', 'Oleiros', 'Penamacor',
    'Proença-a-Nova', 'Sertã', 'Vila de Rei', 'Vila Velha de Ródão'],
  'Coimbra': ['Arganil', 'Cantanhede', 'Coimbra', 'Condeixa-a-Nova', 'Figueira da Foz', 'Góis', 'Lousã', 'Mira',
    'Miranda do Corvo', 'Montemor-o-Velho', 'Oliveira do Hospital', 'Pampilhosa da Serra', 'Penacova', 'Penela', 'Soure',
    'Tábua', 'Vila Nova de Poiares'],
  'Évora': ['Alandroal', 'Arraiolos', 'Borba', 'Estremoz', 'Évora', 'Montemor-o-Novo', 'Mora', 'Mourão', 'Portel',
    'Redondo', 'Reguengos de Monsaraz', 'Vendas Novas', 'Viana do Alentejo', 'Vila Viçosa'],
  'Faro': ['Albufeira', 'Alcoutim', 'Aljezur', 'Castro Marim', 'Faro', 'Lagoa', 'Lagos', 'Loulé', 'Monchique', 'Olhão',
    'Portimão', 'São Brás de Alportel', 'Silves', 'Tavira', 'Vila do Bispo', 'Vila Real de Santo António'],
  'Guarda': ['Aguiar da Beira', 'Almeida', 'Celorico da Beira', 'Figueira de Castelo Rodrigo', 'Fornos de Algodres',
    'Gouveia', 'Guarda', 'Manteigas', 'Mêda', 'Pinhel', 'Sabugal', 'Seia', 'Trancoso', 'Vila Nova de Foz Côa'],
  'Leiria': ['Alcobaça', 'Alvaiázere', 'Ansião', 'Batalha', 'Bombarral', 'Caldas da Rainha', 'Castanheira de Pêra',
    'Figueiró dos Vinhos', 'Leiria', 'Marinha Grande', 'Nazaré', 'Óbidos', 'Pedrógão Grande', 'Peniche', 'Pombal',
    'Porto de Mós'],
  'Lisboa': ['Alenquer', 'Amadora', 'Arruda dos Vinhos', 'Azambuja', 'Cadaval', 'Cascais', 'Lisboa', 'Loures', 'Lourinhã',
    'Mafra', 'Odivelas', 'Oeiras', 'Sintra', 'Sobral de Monte Agraço', 'Torres Vedras', 'Vila Franca de Xira'],
  'Portalegre': ['Alter do Chão', 'Arronches', 'Avis', 'Campo Maior', 'Castelo de Vide', 'Crato', 'Elvas', 'Fronteira',
    'Gavião', 'Marvão', 'Monforte', 'Nisa', 'Ponte de Sor', 'Portalegre', 'Sousel'],
  'Porto': ['Amarante', 'Baião', 'Felgueiras', 'Gondomar', 'Lousada', 'Maia', 'Marco de Canaveses', 'Matosinhos',
    'Paços de Ferreira', 'Paredes', 'Penafiel', 'Porto', 'Póvoa de Varzim', 'Santo Tirso', 'Trofa', 'Valongo',
    'Vila do Conde', 'Vila Nova de Gaia'],
  'Santarém': ['Abrantes', 'Alcanena', 'Almeirim', 'Alpiarça', 'Benavente', 'Cartaxo', 'Chamusca', 'Constância', 'Coruche',
    'Entroncamento', 'Ferreira do Zêzere', 'Golegã', 'Mação', 'Ourém', 'Rio Maior', 'Salvaterra de Magos', 'Santarém',
    'Sardoal', 'Tomar', 'Torres Novas', 'Vila Nova da Barquinha'],
  'Setúbal': ['Alcácer do Sal', 'Alcochete', 'Almada', 'Barreiro', 'Grândola', 'Moita', 'Montijo', 'Palmela',
    'Santiago do Cacém', 'Seixal', 'Sesimbra', 'Setúbal', 'Sines'],
  'Viana do Castelo': ['Arcos de Valdevez', 'Caminha', 'Melgaço', 'Monção', 'Paredes de Coura', 'Ponte da Barca',
    'Ponte de Lima', 'Valença', 'Viana do Castelo', 'Vila Nova de Cerveira'],
  'Vila Real': ['Alijó', 'Boticas', 'Chaves', 'Mesão Frio', 'Mondim de Basto', 'Montalegre', 'Murça', 'Peso da Régua',
    'Ribeira de Pena', 'Sabrosa', 'Santa Marta de Penaguião', 'Valpaços', 'Vila Pouca de Aguiar', 'Vila Real'],
  'Viseu': ['Armamar', 'Carregal do Sal', 'Castro Daire', 'Cinfães', 'Lamego', 'Mangualde', 'Moimenta da Beira',
    'Mortágua', 'Nelas', 'Oliveira de Frades', 'Penalva do Castelo', 'Penedono', 'Resende', 'Santa Comba Dão',
    'São João da Pesqueira', 'São Pedro do Sul', 'Sátão', 'Sernancelhe', 'Tabuaço', 'Tarouca', 'Tondela',
    'Vila Nova de Paiva', 'Viseu', 'Vouzela'],
  'Madeira': ['Calheta', 'Câmara de Lobos', 'Funchal', 'Machico', 'Ponta do Sol', 'Porto Moniz', 'Porto Santo',
    'Ribeira Brava', 'Santa Cruz', 'Santana', 'São Vicente'],
  'Açores': ['Angra do Heroísmo', 'Calheta de São Jorge', 'Corvo', 'Horta', 'Lagoa (Açores)', 'Lajes das Flores',
    'Lajes do Pico', 'Madalena', 'Nordeste', 'Ponta Delgada', 'Povoação', 'Praia da Vitória', 'Ribeira Grande',
    'Santa Cruz da Graciosa', 'Santa Cruz das Flores', 'São Roque do Pico', 'Velas', 'Vila do Porto',
    'Vila Franca do Campo'],
};

// Outras formas de escrever um concelho (chave já normalizada → nome oficial):
// as de geo-pt.js, abreviaturas correntes e o nome das duas cidades noutras
// línguas do site.
const ALIASES = {
  'gaia': 'Vila Nova de Gaia', 'v n gaia': 'Vila Nova de Gaia', 'vn gaia': 'Vila Nova de Gaia',
  'famalicao': 'Vila Nova de Famalicão', 'v n famalicao': 'Vila Nova de Famalicão',
  'feira': 'Santa Maria da Feira', 'santa maria feira': 'Santa Maria da Feira',
  'condeixa': 'Condeixa-a-Nova', 'povoa varzim': 'Póvoa de Varzim', 'foz coa': 'Vila Nova de Foz Côa',
  'vila real santo antonio': 'Vila Real de Santo António', 'sobral monte agraco': 'Sobral de Monte Agraço',
  'calheta sao jorge': 'Calheta de São Jorge', 'calheta acores': 'Calheta de São Jorge', 'calheta madeira': 'Calheta',
  'lagoa algarve': 'Lagoa', 'lagoa faro': 'Lagoa', 'lagoa sao miguel': 'Lagoa (Açores)',
  'lisbon': 'Lisboa', 'lisbonne': 'Lisboa', 'lissabon': 'Lisboa', 'lisboa portugal': 'Lisboa',
  'oporto': 'Porto', 'porto portugal': 'Porto',
};

const normalizar = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// Em SQL: translate ANTES de lower (com LC_CTYPE=C o lower só muda o ASCII)
const _DE = 'ÁÀÂÃÄÅáàâãäåÉÈÊËéèêëÍÌÎÏíìîïÓÒÔÕÖØóòôõöøÚÙÛÜúùûüÇçÑñÝýÿ';
const _PARA = 'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOOooooooUUUUuuuuCcNnYyy';
const SQL_NORM = (expr) =>
  `btrim(regexp_replace(lower(translate(${expr}, '${_DE}', '${_PARA}')), '[^a-z0-9]+', ' ', 'g'))`;

// [chaves, concelhos, distritos], alinhados
const MAPA = (() => {
  const k = [], c = [], d = [];
  const porNome = new Map();
  for (const [distrito, concelhos] of Object.entries(DISTRITOS)) {
    for (const concelho of concelhos) {
      k.push(normalizar(concelho)); c.push(concelho); d.push(distrito);
      porNome.set(concelho, distrito);
    }
  }
  for (const [chave, concelho] of Object.entries(ALIASES)) {
    k.push(chave); c.push(concelho); d.push(porNome.get(concelho));
  }
  return [k, c, d];
})();

module.exports = { DISTRITOS, ALIASES, normalizar, SQL_NORM, MAPA };
