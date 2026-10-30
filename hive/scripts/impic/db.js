// Ligação Neon via HTTP (a porta 5432 está bloqueada nesta rede). DATABASE_URL do ambiente ou do .env.diag.
const fs = require('fs');
const path = require('path');
let neon;
try { ({ neon } = require('@neondatabase/serverless')); }
catch (_) { ({ neon } = require(path.resolve(__dirname, '..', '..', 'backend', 'node_modules', '@neondatabase', 'serverless'))); }
function dbUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const m = fs.readFileSync(path.resolve(__dirname, '..', '..', '..', '.env.diag'), 'utf8').match(/DATABASE_URL=(.+)/);
  return m[1].trim().replace(/^"|"$/g, '');
}
const sql = neon(dbUrl());
module.exports = { sql, q: (t, p = []) => sql.query(t, p) };
