// Pasta dos dados do pipeline (caches, registos, contactos): FORA do repositório.
const fs = require('fs');
const os = require('os');
const path = require('path');
const DADOS = process.env.IMPIC_DADOS || path.join(os.tmpdir(), 'hivex-impic');
fs.mkdirSync(DADOS, { recursive: true });
module.exports = (...p) => path.join(DADOS, ...p);
