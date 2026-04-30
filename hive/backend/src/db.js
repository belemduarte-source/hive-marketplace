require('dotenv').config();
const { Pool } = require('pg');

// Vercel runs each API route as a short-lived serverless function.
// Each function instance gets its own pool, so keep max small to avoid
// exhausting the database's total connection limit across many instances.
// Rule of thumb: max_connections on the DB ÷ expected concurrent instances.
// For thousands of concurrent users on a managed DB (Neon / Supabase PgBouncer)
// this pool talks to the connection pooler, not directly to Postgres.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,

  // Serverless: each Lambda instance gets its own pool; we point at a
  // pgbouncer-style external pooler (Neon / Supabase) so a higher per-instance
  // max is fine and cuts contention when one instance handles bursts.
  // 3 was too tight — list/detail/reviews on a single page view often run in
  // parallel and queued up on the connection wait.
  max: process.env.NODE_ENV === 'production' ? 8 : 10,
  idleTimeoutMillis: 5000,         // release idle connections after 5 s
  connectionTimeoutMillis: 5000,   // fail fast if pool is saturated
  allowExitOnIdle: true,           // let the process exit when all queries finish
  // Skip Postgres-side prepared-statement caching — the pgbouncer pooler in
  // transaction mode (Neon, Supabase) doesn't support them and they'd error.
  statement_timeout: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle DB client:', err.message);
});

module.exports = pool;
