// Fase A — lista completa do IMPIC por distrito (PUB=17, PAR=18). Só leitura, sem BD.
// Resumível: cada página fica em cache/lista/<obj>/<distrito>/<pag>.json.
// 1 só processo node (nada de loops bash — ver project-bg-tasks-windows).
const dados = require('./dados');   // ficheiros de dados fora do repositório (IMPIC_DADOS)
const fs = require('fs');
const path = require('path');
const { post, parseLista } = require('./impic-lib');
const ORDEM = (process.env.DISTRITOS || [
  'Lisboa', 'Setúbal', 'Faro', 'Leiria', 'Santarém', 'Coimbra', 'Viseu', 'Aveiro', 'Évora', 'Beja', 'Portalegre',
  'Castelo Branco', 'Guarda', 'Vila Real', 'Bragança', 'Ilha da Madeira', 'Ilha de Porto Santo', 'Ilha de São Miguel',
  'Ilha Terceira', 'Ilha de Santa Maria', 'Ilha de São Jorge', 'Ilha do Pico', 'Ilha do Faial', 'Ilha das Flores',
  'Ilha Graciosa', 'Ilha do Corvo', 'Porto', 'Braga', 'Viana do Castelo'].join('|')).split('|');
const sig = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]+/g, '_');
async function listar(ORDEM) {
  const t0 = Date.now(); let pedidos = 0;
  for (const d of ORDEM) {
    for (const obj of [17, 18]) {
      const dir = dados('cache', 'lista', String(obj), sig(d));
      fs.mkdirSync(dir, { recursive: true });
      let pag = 1, total = null, linhas = 0;
      for (;;) {
        const f = path.join(dir, pag + '.json');
        let p;
        if (fs.existsSync(f)) p = JSON.parse(fs.readFileSync(f, 'utf8'));
        else {
          // falhas do IMPIC são transitórias (~1 min): espera 60 s e repete; se persistir,
          // salta SÓ esta página (fica para a próxima corrida, que lê o resto da cache)
          let h = null;
          for (let tent = 1; tent <= 3 && h == null; tent++) {
            try { h = await post({ id_type: 8, id_object: obj, pesquisar: 'true', loadTable: 1, pageSearch: pag, distrito: d }); }
            catch (e) { console.log(`[listar] ${d} ${obj} p${pag} falhou (${tent}/3) — espero 60 s`); await new Promise(r => setTimeout(r, 60000)); }
          }
          if (h == null) {
            console.log(`[listar] ${d} ${obj} p${pag} SALTADA`);
            if (total != null && pag * 20 < total) { pag++; continue; }
            break;
          }
          pedidos++;
          p = parseLista(h);
          if (p.rows.length) fs.writeFileSync(f, JSON.stringify(p));
        }
        if (total == null) total = p.total;
        linhas += p.rows.length;
        if (p.rows.length < 20 || linhas >= p.total) break;
        pag++;
      }
      console.log(`[listar] ${d.padEnd(20)} ${obj === 17 ? 'PUB' : 'PAR'} total ${total} lidas ${linhas} | pedidos ${pedidos} | ${((Date.now() - t0) / 60000).toFixed(1)} min`);
    }
  }
  console.log('[listar] FIM');
}
module.exports = { listar, ORDEM };
if (require.main === module) listar(ORDEM).catch(e => { console.error('[listar] ERRO FATAL', e); process.exit(1); });
