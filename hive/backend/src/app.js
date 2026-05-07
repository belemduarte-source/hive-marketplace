require('dotenv').config();

// ── Startup validation — fail loudly rather than silently misbehave ──────────
const _required = ['JWT_SECRET', 'DATABASE_URL'];
const _missing  = _required.filter(k => !process.env[k]);
if (_missing.length) {
  console.error(`❌ Missing required environment variables: ${_missing.join(', ')}`);
  process.exit(1);
}

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
const fs = require('fs');
const path = require('path');

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

// ── Schema auto-migration ────────────────────────────────────────────────────
// Runs at most once per Lambda instance, *before* any request is served
// (kicks off at module load) and is then no-op'd by the _migrated flag. Older
// versions ran ALTER TABLE on every cold start; this version checks for a
// recent sentinel column and skips the migration when the schema is already
// up to date — saves ~50-200 ms per cold-start serverless instance.
let _migrated = false;
let _migrationPromise = null;
// Use a marker that's unique to the latest schema. Existing instances whose
// schema is older than this row will fall through to the slow migration path
// once per Lambda cold start, then fast-path forever.
// Sentinel detects the latest schema. Bumped when adding the
// `companies.removed_at` column + expanded status CHECK constraint —
// older instances fall through to the slow migration path once per
// Lambda cold start, then fast-path forever.
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

      // Slow path: tables missing or behind. Only runs once per cold start.
      const { rows: hasCompanies } = await pool.query(
        `SELECT 1 FROM information_schema.tables
         WHERE table_schema='public' AND table_name='companies' LIMIT 1`
      );
      const sql = fs.readFileSync(path.join(__dirname, 'seed/schema.sql'), 'utf8');
      if (hasCompanies.length === 0) {
        await pool.query(sql);
        console.log('✅ Schema created');
      } else {
        const statements = sql.split(/;\s*\n/).map(s => s.trim()).filter(s =>
          /^CREATE TABLE IF NOT EXISTS/i.test(s) ||
          /^CREATE INDEX IF NOT EXISTS/i.test(s) ||
          /^ALTER TABLE/i.test(s)
        ).map(s => s + ';');
        for (const stmt of statements) await pool.query(stmt);
        console.log('✅ Schema migrations applied');
      }
      _migrated = true;
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

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use(errorHandler);

module.exports = app;
