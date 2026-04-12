require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const companiesRouter = require('./routes/companies');
const authRouter = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// In production (Vercel) frontend and API share the same origin, so we reflect
// the incoming origin to support both the Vercel domain and local dev.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:9091')
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin: (origin, cb) => {
    // Allow same-origin (no Origin header) and any whitelisted origin
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      cb(null, true);
    } else {
      cb(null, true); // Permissive for now — tighten by removing this line post-launch
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ── Schema auto-migration on first cold start ─────────────────────────────────
let _migrated = false;
async function ensureSchema() {
  if (_migrated) return;
  try {
    const pool = require('./db');
    const sql = fs.readFileSync(path.join(__dirname, 'seed/schema.sql'), 'utf8');
    await pool.query(sql);
    _migrated = true;
    console.log('✅ Schema applied');
  } catch (e) {
    console.error('Schema migration error:', e.message);
  }
}

app.use(async (req, res, next) => {
  await ensureSchema();
  next();
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/companies', companiesRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.use(errorHandler);

module.exports = app;
