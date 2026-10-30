// HTML sintético com a estrutura do detalhe do IMPIC (dados fictícios).
const campo = (l, v) => `<div class="information-field">\n\t<label>${l}</label>\n\t<span>${v}</span>\n</div>`;
const FIX_PUB = '<div class="info"><div class="information">' + [
  campo('Alvará', '623 - PUB'), campo('Data de inscrição', '10/05/1974'), campo('Classe Máxima', '5'), campo('NIF/NIPC', '500157235'),
  campo('Denominação', 'EXEMPLO & FILHOS, LDA'), campo('Morada', 'AV GAGO COUTINHO 15<br />\nMONTEMOR NOVO<br />\n7050-097 MONTEMOR-O-NOVO'),
  campo('Concelho', 'Montemor-o-Novo'), campo('Distrito', 'Évora'), campo('País', 'PORTUGAL'), campo('Telefone', '266000000'), campo('Fax', '-'), campo('E-mail', 'geral@exemplo.pt'),
].join('') + '</div><div class="title">Habilitações</div><table><thead><tr><th>Descrição</th><th>Classe</th></tr></thead><tbody>'
  + "<tr><td colspan='2'>1ª Categoria - Edifícios e património construído</td></tr><tr><td>1.ª - Estruturas e elementos de betão</td><td class='text-center'>3</td></tr>"
  + "<tr><td>2.ª - Estruturas metálicas</td><td class='text-center'>3</td></tr><tr><td>4.ª - Alvenarias, rebocos e assentamento de cantarias</td><td class='text-center'>2</td></tr>"
  + "<tr><td colspan='2'>2ª Categoria - Vias de comunicação, obras de urbanização e outras infraestruturas</td></tr><tr><td>1.ª - Vias de circulação rodoviária e aeródromos</td><td class='text-center'>5</td></tr>"
  + '</tbody></table></div>';
const FIX_PAR = '<div class="info"><div class="information">' + [
  campo('Alvará', '80999 - PAR'), campo('Data de inscrição', '08/06/2022'), campo('Classe', '2'), campo('NIF/NIPC', '510315917'),
  campo('Denominação', 'EXEMPLO & RAMOS - CONSTRUCOES LDA'), campo('Morada', 'R CANEJA 6<br />\nLOURES<br />\n2670-502 LOURES'),
  campo('Concelho', 'Loures'), campo('Distrito', 'Lisboa'), campo('País', 'PORTUGAL'), campo('Telefone', '210000000'), campo('Fax', '-'), campo('E-mail', 'geral@exemplo.pt'),
].join('') + '</div></div>';
module.exports = { FIX_PUB, FIX_PAR };
