require('dotenv').config();

// ── Startup validation — fail loudly rather than silently misbehave ──────────
const _required = ['JWT_SECRET', 'DATABASE_URL'];
const _missing  = _required.filter(k => !process.env[k]);
if (_missing.length) {
  console.error(`❌ Missing required environment variables: ${_missing.join(', ')}`);
  process.exit(1);
}

// ── Optional-integration banner ──────────────────────────────────────────────
// Logs at cold start so Vercel function logs make the deployment posture
// obvious — which integrations are wired up, which fall back to no-ops.
function _hasEnv(...keys) { return keys.every(k => !!process.env[k]); }
const INTEGRATION_STATUS = {
  google_signin:  _hasEnv('GOOGLE_CLIENT_ID'),
  email_smtp:     _hasEnv('SMTP_USER', 'SMTP_PASS'),
  admin_token:    _hasEnv('ADMIN_TOKEN'),
  admin_email:    _hasEnv('ADMIN_EMAIL'),
  app_url:        _hasEnv('APP_URL'),
};
console.log('Hive backend boot — integrations:', JSON.stringify(INTEGRATION_STATUS));

// ── Global error safety net ───────────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const companiesRouter = require('./routes/companies');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const favouritesRouter = require('./routes/favourites');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Frontend is a separate static site
}));

// ── Gzip responses ────────────────────────────────────────────────────────────
app.use(compression());

// ── CORS ──────────────────────────────────────────────────────────────────────
// Vercel automatically sets VERCEL_URL (current deployment) and
// VERCEL_PROJECT_PRODUCTION_URL (stable production domain) — include both
// so the deployed frontend can always reach the API without manual config.
const _vercelOrigins = [
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
  process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
].filter(Boolean);

const allowedOrigins = [
  ...(process.env.CORS_ORIGIN || 'http://localhost:9091').split(',').map(s => s.trim()),
  ..._vercelOrigins,
];

const corsOptions = {
  origin: (origin, cb) => {
    // Allow same-origin requests (no Origin header) and whitelisted origins
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// Handle OPTIONS preflight requests for all API routes
app.options('/api/*', cors(corsOptions));
app.use(cors(corsOptions));

// ── Body parsing (50 kb cap to prevent payload abuse) ─────────────────────────
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());

// ── Rate limiters ─────────────────────────────────────────────────────────────
// Auth routes: 20 attempts per 15-minute window per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas tentativas. Tente novamente em 15 minutos.' },
  skip: () => process.env.NODE_ENV !== 'production',
});

// Company registration: 10 submissions per hour per IP (prevents spam)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados registos. Tente novamente mais tarde.' },
  skip: () => process.env.NODE_ENV !== 'production',
});

// General API: 300 requests per minute per IP
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados pedidos. Abrandar.' },
  skip: () => process.env.NODE_ENV !== 'production',
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// ── Observability: log slow / failing requests ───────────────────────────────
// Cheap structured log line on >= 1.5 s requests or any 5xx response. Keeps
// Vercel function logs useful for debugging without spamming on every hit.
// Also tracks a small in-memory ring of recent 5xx errors for the
// /api/admin/diagnostics endpoint.
const RECENT_ERRORS_MAX = 25;
const recentErrors = [];
app.use((req, res, next) => {
  const t0 = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - t0;
    const slow = ms >= 1500;
    const failed = res.statusCode >= 500;
    if (slow || failed) {
      const line = JSON.stringify({
        ts: new Date().toISOString(),
        method: req.method, path: req.path, status: res.statusCode, ms,
      });
      (failed ? console.error : console.warn)(line);
    }
    if (failed) {
      recentErrors.push({ ts: Date.now(), method: req.method, path: req.path, status: res.statusCode, ms });
      if (recentErrors.length > RECENT_ERRORS_MAX) recentErrors.shift();
    }
  });
  next();
});

// ── Schema auto-migration ────────────────────────────────────────────────────
// Runs at most once per Lambda instance, *before* any request is served
// (kicks off at module load) and is then no-op'd by the _migrated flag. Older
// versions ran ALTER TABLE on every cold start; this version checks for a
// recent sentinel column and skips the migration when the schema is already
// up to date — saves ~50-200 ms per cold-start serverless instance.
let _migrated = false;
let _migrationPromise = null;

// Migrations are inlined here (not read from seed/schema.sql) because Vercel
// only bundles files reachable via require/import — fs.readFileSync would
// throw ENOENT in production and the catch below would swallow it silently,
// leaving the database without recently-added columns.
//
// Each statement uses `IF NOT EXISTS` and runs in its own try/catch so one
// failure (e.g. an unrelated unique-constraint conflict) doesn't abort the
// rest. The sentinel column at the end gates the fast path on cold start.
const MIGRATIONS = [
  // Initial schema for fresh deployments (idempotent — IF NOT EXISTS)
  `CREATE TABLE IF NOT EXISTS users (
     id BIGSERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE,
     password_hash TEXT,
     google_id TEXT UNIQUE,
     picture TEXT,
     type TEXT NOT NULL CHECK (type IN ('empresa','cliente')),
     company TEXT DEFAULT '',
     phone   TEXT DEFAULT '',
     is_admin BOOLEAN DEFAULT FALSE,
     email_verified BOOLEAN DEFAULT FALSE,
     email_verification_token TEXT,
     email_verification_expires_at TIMESTAMPTZ,
     password_reset_token TEXT,
     password_reset_expires_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
  `CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)`,
  `ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS picture TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_expires_at TIMESTAMPTZ`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMPTZ`,
  `CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token)`,
  `CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token)`,

  `CREATE TABLE IF NOT EXISTS companies (
     id BIGSERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     sectors TEXT[] NOT NULL DEFAULT '{}',
     sector TEXT,
     nif TEXT,
     cae TEXT,
     alvara TEXT,
     certidao_permanente TEXT,
     address TEXT,
     postal_code TEXT,
     city TEXT,
     country TEXT DEFAULT 'pt',
     zone TEXT,
     email TEXT NOT NULL DEFAULT '',
     phone TEXT NOT NULL DEFAULT '',
     website TEXT,
     tags TEXT[] DEFAULT '{}',
     description TEXT,
     founded_year INTEGER,
     business_hours TEXT,
     portfolio_images TEXT[] DEFAULT '{}',
     lat DOUBLE PRECISION NOT NULL,
     lng DOUBLE PRECISION NOT NULL,
     rating DECIMAL(3,1) DEFAULT 0,
     reviews INTEGER DEFAULT 0,
     top_rated BOOLEAN DEFAULT FALSE,
     verified BOOLEAN DEFAULT FALSE,
     is_new BOOLEAN DEFAULT TRUE,
     emoji TEXT DEFAULT '🏢',
     color TEXT DEFAULT '#f97316',
     pin_type TEXT DEFAULT 'std',
     status TEXT DEFAULT 'approved' CHECK (status IN ('approved','pending','rejected','removed')),
     removed_at TIMESTAMPTZ,
     created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_companies_sector  ON companies(sector)`,
  `CREATE INDEX IF NOT EXISTS idx_companies_sectors ON companies USING GIN(sectors)`,
  `CREATE INDEX IF NOT EXISTS idx_companies_tags    ON companies USING GIN(tags)`,
  `CREATE INDEX IF NOT EXISTS idx_companies_status  ON companies(status)`,
  `CREATE INDEX IF NOT EXISTS idx_companies_lat_lng ON companies(lat, lng)`,
  `CREATE INDEX IF NOT EXISTS idx_companies_rating  ON companies(rating DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country)`,
  `CREATE INDEX IF NOT EXISTS idx_companies_status_country_created ON companies(status, country, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by)`,
  // Migrations for existing deployments
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS founded_year     INTEGER`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS business_hours   TEXT`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS portfolio_images TEXT[] DEFAULT '{}'`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS alvara              TEXT`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS certidao_permanente TEXT`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS featured            BOOLEAN DEFAULT FALSE`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS nif                 TEXT`,
  `CREATE INDEX IF NOT EXISTS idx_companies_nif ON companies(nif)`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS removed_at TIMESTAMPTZ`,
  // Status CHECK constraint — drop the old (more restrictive) one and re-add
  // with 'removed' allowed. ALTER TABLE ADD CONSTRAINT IF NOT EXISTS isn't a
  // thing in PG, hence the explicit DROP+ADD. PG names inline column CHECKs
  // as <table>_<col>_check by default.
  `ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_status_check`,
  `ALTER TABLE companies ADD CONSTRAINT companies_status_check CHECK (status IN ('approved','pending','rejected','removed'))`,

  `CREATE TABLE IF NOT EXISTS reviews (
     id BIGSERIAL PRIMARY KEY,
     company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
     user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     score   SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
     comment TEXT,
     reply   TEXT,
     reply_at   TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(company_id, user_id)
   )`,
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply    TEXT`,
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_at TIMESTAMPTZ`,
  `CREATE INDEX IF NOT EXISTS idx_reviews_company ON reviews(company_id)`,
  `CREATE INDEX IF NOT EXISTS idx_reviews_user    ON reviews(user_id)`,

  `CREATE TABLE IF NOT EXISTS events (
     id BIGSERIAL PRIMARY KEY,
     company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
     event_type TEXT NOT NULL CHECK (event_type IN ('view','contact','website_click','whatsapp')),
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_events_company ON events(company_id)`,
  `CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at DESC)`,

  `CREATE TABLE IF NOT EXISTS user_favourites (
     user_id    BIGINT NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
     company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     PRIMARY KEY (user_id, company_id)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_user_favourites_user ON user_favourites(user_id)`,

  `CREATE TABLE IF NOT EXISTS reports (
     id BIGSERIAL PRIMARY KEY,
     company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
     user_id    BIGINT REFERENCES users(id) ON DELETE SET NULL,
     reason  TEXT NOT NULL,
     details TEXT,
     status  TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','dismissed')),
     created_at  TIMESTAMPTZ DEFAULT NOW(),
     reviewed_at TIMESTAMPTZ,
     reviewed_by BIGINT REFERENCES users(id) ON DELETE SET NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_reports_company ON reports(company_id)`,
  `CREATE INDEX IF NOT EXISTS idx_reports_status  ON reports(status)`,
  `CREATE INDEX IF NOT EXISTS idx_reports_created ON reports(created_at DESC)`,
];

// Sentinel detects the latest schema. Bumped when adding companies.removed_at.
const SENTINEL_COLUMN = 'removed_at';
const SENTINEL_TABLE  = 'companies';

async function ensureSchema() {
  if (_migrated) return;
  if (_migrationPromise) return _migrationPromise; // in-flight on this instance
  _migrationPromise = (async () => {
    try {
      const pool = require('./db');
      // Fast path: sentinel column already exists → schema is current
      const { rows: sentinel } = await pool.query(
        `SELECT 1 FROM information_schema.columns
         WHERE table_schema='public' AND table_name=$1 AND column_name=$2 LIMIT 1`,
        [SENTINEL_TABLE, SENTINEL_COLUMN]
      );
      if (sentinel.length > 0) { _migrated = true; return; }

      // Slow path: run every migration. Each in its own try/catch so a single
      // failure (e.g. constraint name mismatch on an old deployment) doesn't
      // block the rest from applying.
      let okCount = 0, failCount = 0;
      for (const stmt of MIGRATIONS) {
        try {
          await pool.query(stmt);
          okCount++;
        } catch (err) {
          failCount++;
          console.error('Migration step failed:', err.message, '\n  →', stmt.slice(0, 120));
        }
      }
      console.log(`Schema migrations: ${okCount} OK, ${failCount} failed`);

      // Verify the sentinel column actually got added before flipping the
      // fast-path flag. If it's still missing, leave _migrated=false so the
      // next request retries.
      const { rows: check } = await pool.query(
        `SELECT 1 FROM information_schema.columns
         WHERE table_schema='public' AND table_name=$1 AND column_name=$2 LIMIT 1`,
        [SENTINEL_TABLE, SENTINEL_COLUMN]
      );
      if (check.length > 0) {
        _migrated = true;
      } else {
        console.error('Sentinel column still missing after migration run — will retry on next request');
      }
    } catch (e) {
      console.error('Schema migration error:', e.message);
    } finally {
      _migrationPromise = null;
    }
  })();
  return _migrationPromise;
}

// Kick off migration check immediately at module load (don't block requests
// behind it — they'll await it via the middleware on first hit, but most
// requests within the same Lambda instance just fall through.)
ensureSchema().catch(() => {});

app.use(async (req, res, next) => {
  if (!_migrated) await ensureSchema();
  next();
});

// ── API routes ────────────────────────────────────────────────────────────────
app.post('/api/companies', registerLimiter);  // registration spam guard (POST only)
app.use('/api/companies', companiesRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/favourites', favouritesRouter);

// ── Health check ─────────────────────────────────────────────────────────────
// Returns 200 only if the DB is actually reachable; uptime monitors should
// hit this URL. Keeps response payload small so it's cheap to poll.
app.get('/api/health', async (req, res) => {
  try {
    const pool = require('./db');
    const t0 = Date.now();
    await pool.query('SELECT 1');
    res.json({ ok: true, db_ms: Date.now() - t0, migrated: _migrated, ts: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ ok: false, error: 'database_unreachable', ts: new Date().toISOString() });
  }
});

// ── Admin diagnostics ────────────────────────────────────────────────────────
// Deep status snapshot for an authenticated admin: integration env-var
// presence, DB row counts, migration sentinel, and the recent 5xx ring.
// Returns booleans for env vars rather than the values themselves so the
// endpoint never leaks secrets.
const { requireAdmin } = require('./middleware/auth');
app.get('/api/admin/diagnostics', requireAdmin, async (req, res, next) => {
  try {
    const pool = require('./db');
    const [users, companies, reports, events] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS c FROM users'),
      pool.query("SELECT COUNT(*) FILTER (WHERE status='approved')::int AS approved, COUNT(*) FILTER (WHERE status='pending')::int AS pending, COUNT(*) FILTER (WHERE status='rejected')::int AS rejected, COUNT(*) FILTER (WHERE status='removed')::int AS removed FROM companies"),
      pool.query("SELECT COUNT(*) FILTER (WHERE status='pending')::int AS pending FROM reports"),
      pool.query("SELECT COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours')::int AS day, COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS week FROM events"),
    ]);
    res.json({
      ts: new Date().toISOString(),
      uptime_s: Math.round(process.uptime()),
      node_env: process.env.NODE_ENV || 'unset',
      vercel_region: process.env.VERCEL_REGION || null,
      integrations: INTEGRATION_STATUS,
      schema: { migrated: _migrated, sentinel_col: SENTINEL_COLUMN, sentinel_table: SENTINEL_TABLE },
      counts: {
        users: users.rows[0].c,
        companies: companies.rows[0],
        pending_reports: reports.rows[0].pending,
        events: events.rows[0],
      },
      recent_5xx: recentErrors.slice(-10).reverse(),
    });
  } catch (e) {
    next(e);
  }
});

app.use(errorHandler);

module.exports = app;
