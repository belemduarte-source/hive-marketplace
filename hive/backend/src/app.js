require('dotenv').config();
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

// ── Schema auto-migration on cold start ───────────────────────────────────────
// Checks once per process lifetime — idempotent (all statements use IF NOT EXISTS)
let _migrated = false;
async function ensureSchema() {
  if (_migrated) return;
  try {
    const pool = require('./db');
    // Quick existence check before reading the file
    const { rows } = await pool.query(
      `SELECT 1 FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = 'companies'`
    );
    if (rows.length === 0) {
      const sql = fs.readFileSync(path.join(__dirname, 'seed/schema.sql'), 'utf8');
      await pool.query(sql);
      console.log('✅ Schema created');
    } else {
      // Tables exist — still apply safe ALTER TABLE migrations
      const sql = fs.readFileSync(path.join(__dirname, 'seed/schema.sql'), 'utf8');
      // Extract only the ALTER TABLE lines (safe to re-run)
      const alterStatements = sql
        .split('\n')
        .filter(l => /^ALTER TABLE/i.test(l.trim()))
        .join('\n');
      if (alterStatements) await pool.query(alterStatements);
    }
    _migrated = true;
  } catch (e) {
    console.error('Schema migration error:', e.message);
  }
}

app.use(async (req, res, next) => {
  await ensureSchema();
  next();
});

// ── API routes ────────────────────────────────────────────────────────────────
app.post('/api/companies', registerLimiter);  // registration spam guard (POST only)
app.use('/api/companies', companiesRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use(errorHandler);

module.exports = app;
