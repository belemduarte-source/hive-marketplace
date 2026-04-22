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

  // Serverless: keep connections very short-lived so they are released
  // before Vercel freezes the function (typically within ~100ms of response)
  max: process.env.NODE_ENV === 'production' ? 3 : 10,
  idleTimeoutMillis: 10000,        // release idle connections after 10 s
  connectionTimeoutMillis: 5000,   // fail fast if pool is saturated
  allowExitOnIdle: true,           // let the process exit when all queries finish
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle DB client:', err.message);
});

module.exports = pool;
