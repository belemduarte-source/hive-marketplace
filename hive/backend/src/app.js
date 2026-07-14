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
console.log('Hivex backend boot — integrations:', JSON.stringify(INTEGRATION_STATUS));

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
const marketplaceRouter = require('./routes/marketplace');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Trust the first proxy hop ────────────────────────────────────────────────
// Vercel terminates TLS and forwards to the function via its edge. Without
// this, req.ip resolves to the edge proxy and express-rate-limit keys every
// request as if it came from the same IP — one bot exhausts the budget for
// everyone, and v8 logs a noisy validation warning. Trusting exactly one hop
// is the safe default behind Vercel.
app.set('trust proxy', 1);

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
  // Custom production domain (Hivex) — not a *.vercel.app URL, so add explicitly.
  'https://hivex.pt',
  'https://www.hivex.pt',
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

// ── Body parsing ──────────────────────────────────────────────────────────────
// Chat messages may carry up to 3 base64 documents of 2 MB each (~8.2 MB of
// JSON) — give those routes their own parser; everything else keeps the tight
// 600 kb cap (headroom for an inline company logo data URL).
// Stripe webhook: corpo RAW obrigatório para verificar a assinatura — tem de
// ficar ANTES de qualquer express.json()
app.post('/api/billing/webhook', express.raw({ type: 'application/json' }), require('./routes/billing').webhookHandler);

app.use('/api/messages', express.json({ limit: '9mb' }));
app.use('/api/companies', express.json({ limit: '4mb' }));  // logo + até 6 fotos de portfólio inline
app.use(express.json({ limit: '600kb' }));
app.use(cookieParser());

// ── Rate limiters ─────────────────────────────────────────────────────────────
// Only relax limits for genuine local dev. On Vercel (VERCEL is always set) or
// any production build, limits stay ON even if NODE_ENV is somehow unset — we
// must never ship the API with rate limiting silently disabled.
const _skipRateLimit = () => !process.env.VERCEL && process.env.NODE_ENV !== 'production';

// Auth routes: 20 attempts per 15-minute window per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas tentativas. Tente novamente em 15 minutos.' },
  skip: _skipRateLimit,
});

// Company registration: 10 submissions per hour per IP (prevents spam)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados registos. Tente novamente mais tarde.' },
  skip: _skipRateLimit,
});

// General API: 300 requests per minute per IP
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados pedidos. Abrandar.' },
  skip: _skipRateLimit,
});

// Analytics events: unauthenticated by design (fire-and-forget pings from the
// map) — cap the write volume per IP so it can't be used to flood the table.
const eventLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados pedidos.' },
  skip: _skipRateLimit,
});

// Contact relay: guests may send messages (no login), so keep a tight per-IP
// budget — 8/hour is plenty for a human asking for quotes, useless for spam.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas mensagens enviadas. Tente novamente mais tarde.' },
  skip: _skipRateLimit,
});

// Claim codes + quote requests: both fan out email, so keep tight budgets.
const claimLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados pedidos de código. Tente novamente mais tarde.' },
  skip: _skipRateLimit,
});
const rfqLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados pedidos de orçamento. Tente novamente mais tarde.' },
  skip: _skipRateLimit,
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
// (kicks off at module load) and is then no-op'd by the _migrated flag.
// Cold starts check a schema_version row first (one SELECT) and skip the
// full statement list when it matches SCHEMA_VERSION below — saves
// ~50-200 ms per cold-start serverless instance.
let _migrated = false;
let _migrationPromise = null;

// Migrations are inlined here (not read from seed/schema.sql) because Vercel
// only bundles files reachable via require/import — fs.readFileSync would
// throw ENOENT in production and the catch below would swallow it silently,
// leaving the database without recently-added columns.
//
// Each statement uses `IF NOT EXISTS` and runs in its own try/catch so one
// failure (e.g. an unrelated unique-constraint conflict) doesn't abort the
// rest. IMPORTANT: bump SCHEMA_VERSION (below) whenever this list changes,
// or warm databases will skip the new statement.
const MIGRATIONS = [
  // Initial schema for fresh deployments (idempotent — IF NOT EXISTS)
  `CREATE TABLE IF NOT EXISTS users (
     id BIGSERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE,
     password_hash TEXT,
     google_id TEXT UNIQUE,
     picture TEXT,
     company TEXT DEFAULT '',
     phone   TEXT DEFAULT '',
     is_admin BOOLEAN DEFAULT FALSE,
     password_reset_token TEXT,
     password_reset_expires_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
  `CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)`,
  `ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS picture TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMPTZ`,
  `CREATE INDEX IF NOT EXISTS idx_users_password_reset_token ON users(password_reset_token)`,
  // The empresa/cliente distinction was vestigial — anyone can advertise a
  // company independent of user type — so the column is dropped.
  `ALTER TABLE users DROP COLUMN IF EXISTS type`,
  // Email verification was removed — drop the now-unused columns/index if present.
  `DROP INDEX IF EXISTS idx_users_email_verification_token`,
  `ALTER TABLE users DROP COLUMN IF EXISTS email_verified`,
  `ALTER TABLE users DROP COLUMN IF EXISTS email_verification_token`,
  `ALTER TABLE users DROP COLUMN IF EXISTS email_verification_expires_at`,

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
  // One company per NIF — blocks duplicate registrations of the same entity.
  // Partial: rows without a NIF (foreign companies, legacy imports) are exempt.
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_companies_nif_unique ON companies(nif) WHERE nif IS NOT NULL AND nif <> ''`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS removed_at TIMESTAMPTZ`,
  // Optional social network links shown on the company profile.
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS facebook  TEXT`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS instagram TEXT`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS linkedin  TEXT`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo      TEXT`,
  // Status CHECK constraint — drop the old (more restrictive) one and re-add
  // with 'removed' allowed. ALTER TABLE ADD CONSTRAINT IF NOT EXISTS isn't a
  // thing in PG, hence the explicit DROP+ADD. PG names inline column CHECKs
  // as <table>_<col>_check by default.
  `ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_status_check`,
  `ALTER TABLE companies ADD CONSTRAINT companies_status_check CHECK (status IN ('approved','pending','rejected','removed'))`,

  // ── Indexed full-text + fuzzy search ─────────────────────────────────────────
  // The list endpoint used to build to_tsvector() per row on every ?q= search,
  // which can't use an index (sequential scan). A STORED generated tsvector +
  // GIN index makes search fast and scalable. pg_trgm adds typo tolerance so
  // "eletrecista" still finds "eletricista" and partial words match.
  // to_tsvector(<const regconfig>, text) is IMMUTABLE, so it's valid in a
  // generated column; the table rewrite is trivial at current scale.
  `CREATE EXTENSION IF NOT EXISTS pg_trgm`,
  // array_to_string() is only STABLE, and generated columns require IMMUTABLE
  // expressions — the ALTER below failed on every cold start until this
  // wrapper existed (which also blocked schema_version from ever being
  // written). For text[] with a constant separator the function IS
  // deterministic, so the IMMUTABLE marking is safe.
  `CREATE OR REPLACE FUNCTION hivex_arr2txt(text[]) RETURNS text
     LANGUAGE sql IMMUTABLE PARALLEL SAFE
     AS 'SELECT coalesce(array_to_string($1, '' ''), '''')'`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS search_doc tsvector
     GENERATED ALWAYS AS (
       to_tsvector('portuguese',
         coalesce(name,'') || ' ' || coalesce(description,'') || ' ' ||
         hivex_arr2txt(tags) || ' ' || coalesce(cae,'') || ' ' ||
         coalesce(city,'') || ' ' || coalesce(zone,'') || ' ' ||
         hivex_arr2txt(sectors) || ' ' || coalesce(sector,'')
       )
     ) STORED`,
  `CREATE INDEX IF NOT EXISTS idx_companies_search_doc ON companies USING GIN(search_doc)`,
  `CREATE INDEX IF NOT EXISTS idx_companies_name_trgm  ON companies USING GIN(name gin_trgm_ops)`,

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
  // Multi-criteria ratings (each 1-5). The overall `score` column holds the
  // rounded average of whatever criteria the reviewer set.
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS score_quality       SMALLINT CHECK (score_quality       BETWEEN 1 AND 5)`,
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS score_speed         SMALLINT CHECK (score_speed         BETWEEN 1 AND 5)`,
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS score_communication SMALLINT CHECK (score_communication BETWEEN 1 AND 5)`,
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS score_value         SMALLINT CHECK (score_value         BETWEEN 1 AND 5)`,
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

  // Site-wide visit tracking (page-level analytics for the admin dashboard).
  `CREATE TABLE IF NOT EXISTS site_visits (
     id BIGSERIAL PRIMARY KEY,
     visitor TEXT,
     path TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_site_visits_created ON site_visits(created_at DESC)`,

  // Push notification device tokens (registered by the native iOS/Android app).
  // user_id is nullable so anonymous installs can still register; it's filled in
  // once the user logs in and re-registers.
  `CREATE TABLE IF NOT EXISTS device_tokens (
     token      TEXT PRIMARY KEY,
     user_id    BIGINT REFERENCES users(id) ON DELETE CASCADE,
     platform   TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_device_tokens_user ON device_tokens(user_id)`,
  // Owner account: grant admin if it already exists (idempotent). New or
  // not-yet-registered accounts are promoted at login via BUILTIN_ADMINS in
  // routes/auth.js — this covers the "already registered" case immediately.
  `UPDATE users SET is_admin = TRUE WHERE LOWER(email) = 'geral.hivex@gmail.com' AND is_admin IS DISTINCT FROM TRUE`,

  // ── Marketplace v2: claims, quote requests, inbox, feature requests ─────────
  // Claim a listing: 6-digit code sent to the company's public email; a
  // verified claim transfers created_by to the claiming user.
  `CREATE TABLE IF NOT EXISTS claims (
     id BIGSERIAL PRIMARY KEY,
     company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,
     user_id    BIGINT REFERENCES users(id) ON DELETE CASCADE,
     code       TEXT NOT NULL,
     expires_at TIMESTAMPTZ NOT NULL,
     verified_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_claims_company ON claims(company_id)`,
  `CREATE INDEX IF NOT EXISTS idx_claims_user    ON claims(user_id)`,
  // Structured quote requests (RFQ) broadcast to matching companies.
  `CREATE TABLE IF NOT EXISTS quote_requests (
     id BIGSERIAL PRIMARY KEY,
     client_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
     client_name  TEXT NOT NULL,
     client_email TEXT NOT NULL,
     client_phone TEXT,
     sector       TEXT NOT NULL,
     description  TEXT NOT NULL,
     city         TEXT,
     lat DOUBLE PRECISION, lng DOUBLE PRECISION,
     timeline     TEXT,
     budget_range TEXT,
     notified_count INT DEFAULT 0,
     status       TEXT DEFAULT 'open',
     created_at   TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_qr_sector ON quote_requests(sector)`,
  `CREATE INDEX IF NOT EXISTS idx_qr_client ON quote_requests(client_email)`,
  // Company responses to a quote request.
  `CREATE TABLE IF NOT EXISTS quotes (
     id BIGSERIAL PRIMARY KEY,
     request_id BIGINT REFERENCES quote_requests(id) ON DELETE CASCADE,
     company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,
     message    TEXT NOT NULL,
     price_estimate TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_quotes_request ON quotes(request_id)`,
  `CREATE INDEX IF NOT EXISTS idx_quotes_company ON quotes(company_id)`,
  // In-app inbox: contact messages become threads (company ↔ client email).
  `CREATE TABLE IF NOT EXISTS messages (
     id BIGSERIAL PRIMARY KEY,
     company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,
     sender     TEXT NOT NULL,
     client_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
     client_name  TEXT,
     client_email TEXT NOT NULL,
     body       TEXT NOT NULL,
     read_at    TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_messages_company ON messages(company_id)`,
  `CREATE INDEX IF NOT EXISTS idx_messages_client  ON messages(client_email)`,
  // Owner requests to feature a listing (admin approves via the existing toggle).
  `CREATE TABLE IF NOT EXISTS feature_requests (
     id BIGSERIAL PRIMARY KEY,
     company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,
     user_id    BIGINT REFERENCES users(id) ON DELETE SET NULL,
     status     TEXT DEFAULT 'pending',
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  // ── v5: email verification ────────────────────────────────────────────────
  // User accounts must confirm their email before registering a company, and
  // the company's own contact email is confirmed with a one-time code too.
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_code TEXT`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS verify_expires TIMESTAMPTZ`,
  // Grandfather accounts created before the feature shipped so existing owners
  // aren't suddenly locked out of managing their companies.
  `UPDATE users SET email_verified = TRUE WHERE email_verified = FALSE AND created_at < TIMESTAMPTZ '2026-07-08'`,
  // One-time codes sent to arbitrary addresses (company contact emails).
  `CREATE TABLE IF NOT EXISTS email_codes (
     id BIGSERIAL PRIMARY KEY,
     email TEXT NOT NULL,
     code  TEXT NOT NULL,
     purpose TEXT NOT NULL DEFAULT 'company_email',
     expires_at TIMESTAMPTZ NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_email_codes_email ON email_codes(lower(email))`,
  // ── v6: chat empresa↔cliente com documentos ───────────────────────────────
  // Anexos guardados inline (base64, ≤2 MB cada) numa tabela própria para as
  // listagens de conversas não arrastarem os bytes. ON DELETE CASCADE garante
  // que a purga de retenção (90 dias) limpa também os ficheiros.
  `CREATE TABLE IF NOT EXISTS message_files (
     id BIGSERIAL PRIMARY KEY,
     message_id BIGINT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
     filename   TEXT NOT NULL,
     mime       TEXT NOT NULL,
     size_bytes INTEGER NOT NULL,
     data       TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_message_files_msg ON message_files(message_id)`,
  `CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at)`,

  // v7: telemetria de erros, push, alertas guardados, definições, encomendas
  // de destaque (Stripe), reviews verificadas, pesquisa trigram
  `CREATE TABLE IF NOT EXISTS client_errors (
     id BIGSERIAL PRIMARY KEY,
     source TEXT NOT NULL DEFAULT 'web',
     hash TEXT UNIQUE,
     message TEXT,
     stack TEXT,
     url TEXT,
     ua TEXT,
     count INT NOT NULL DEFAULT 1,
     first_at TIMESTAMPTZ DEFAULT NOW(),
     last_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE INDEX IF NOT EXISTS idx_client_errors_last ON client_errors(last_at DESC)`,
  `CREATE TABLE IF NOT EXISTS push_subscriptions (
     id BIGSERIAL PRIMARY KEY,
     user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
     endpoint TEXT UNIQUE NOT NULL,
     keys JSONB NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS saved_searches (
     id BIGSERIAL PRIMARY KEY,
     user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
     email TEXT NOT NULL,
     sector TEXT,
     city TEXT,
     country TEXT,
     lat DOUBLE PRECISION,
     lng DOUBLE PRECISION,
     radius_km INT DEFAULT 50,
     last_sent TIMESTAMPTZ DEFAULT NOW(),
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS app_settings (
     key TEXT PRIMARY KEY,
     value JSONB NOT NULL,
     updated_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `CREATE TABLE IF NOT EXISTS feature_orders (
     id BIGSERIAL PRIMARY KEY,
     company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
     user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
     stripe_session TEXT UNIQUE,
     status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','expired','canceled')),
     months INT NOT NULL DEFAULT 1,
     amount_cents INT,
     paid_at TIMESTAMPTZ,
     expires_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW()
   )`,
  `ALTER TABLE reviews ADD COLUMN IF NOT EXISTS verified_contact BOOLEAN NOT NULL DEFAULT FALSE`,
  `ALTER TABLE companies ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ`,
  `CREATE EXTENSION IF NOT EXISTS pg_trgm`,
  `CREATE INDEX IF NOT EXISTS idx_companies_name_trgm ON companies USING GIN (name gin_trgm_ops)`,
  `CREATE INDEX IF NOT EXISTS idx_messages_co_email ON messages(company_id, client_email)`,
];

// Version sentinel: bump this integer WHENEVER a statement is added to
// MIGRATIONS. Cold starts compare it against a single row in schema_version —
// on match they skip the ~50 statements entirely (one fast SELECT instead),
// on mismatch (or missing table) they run everything and store the new
// version. Unlike the old column-existence sentinel this can never skip DROP
// migrations, because the version is written only after a full run.
const SCHEMA_VERSION = 7; // v7: telemetria, push, alertas, settings, feature_orders, trgm

async function ensureSchema() {
  if (_migrated) return;
  if (_migrationPromise) return _migrationPromise; // in-flight on this instance
  _migrationPromise = (async () => {
    try {
      const pool = require('./db');

      // Fast path: schema already at the current version → skip the full run.
      try {
        const { rows } = await pool.query('SELECT version FROM schema_version LIMIT 1');
        if (rows[0] && Number(rows[0].version) === SCHEMA_VERSION) {
          _migrated = true;
          return;
        }
      } catch (_) { /* table missing (fresh DB) → full run below creates it */ }

      // Every migration is idempotent (IF NOT EXISTS / IF EXISTS) so we just
      // run them all. Each statement is wrapped so one failure doesn't block
      // the rest.
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
      // Record the version only after a clean run — a partial run keeps the
      // old version so the next cold start retries everything.
      if (failCount === 0) {
        try {
          await pool.query(`CREATE TABLE IF NOT EXISTS schema_version (version INT NOT NULL)`);
          await pool.query(
            `INSERT INTO schema_version (version)
             SELECT $1 WHERE NOT EXISTS (SELECT 1 FROM schema_version)`, [SCHEMA_VERSION]);
          await pool.query(`UPDATE schema_version SET version = $1`, [SCHEMA_VERSION]);
        } catch (e) {
          console.error('schema_version write failed:', e.message);
        }
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
app.post('/api/companies', registerLimiter);            // registration spam guard (POST only)
app.post('/api/companies/:id/event', eventLimiter);     // analytics ping flood guard
app.post('/api/companies/:id/contact', contactLimiter); // guest-contact spam guard
app.post('/api/claims/:companyId', claimLimiter);       // claim-code email guard
app.post('/api/quote-requests', rfqLimiter);            // RFQ email fan-out guard
app.use('/api', marketplaceRouter);
app.use('/api', require('./routes/billing').router);
app.use('/api/companies', companiesRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/favourites', favouritesRouter);

// ── Sitemap ──────────────────────────────────────────────────────────────────
// Dynamic sitemap for crawlers: home + every approved company deep link +
// sector landing hashes are client-routed, so we expose the ?company= URLs
// (server rewrites serve index.html for them). Cached at the CDN for 1h.
app.get('/sitemap.xml', async (req, res, next) => {
  try {
    const BASE = 'https://www.hivex.pt';
    const { rows } = await require('./db').query(
      `SELECT id, updated_at FROM companies WHERE status = 'approved' ORDER BY id`
    );
    // Páginas de setor+cidade (≥3 empresas) — aterragens orgânicas reais
    const { rows: combos } = await require('./db').query(
      `SELECT sector, city, COUNT(*) AS n FROM companies
        WHERE status = 'approved' AND city IS NOT NULL AND city <> '' AND sector IS NOT NULL
        GROUP BY sector, city HAVING COUNT(*) >= 3
        ORDER BY COUNT(*) DESC LIMIT 2000`);
    const slug = s => encodeURIComponent(String(s).toLowerCase().trim().replace(/\s+/g, '-'));
    const urls = [
      `<url><loc>${BASE}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
      ...combos.map(c =>
        `<url><loc>${BASE}/s/${c.sector}/${slug(c.city)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`),
      ...rows.map(r =>
        `<url><loc>${BASE}/?company=${r.id}</loc><lastmod>${new Date(r.updated_at || Date.now()).toISOString().slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`),
    ];
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`);
  } catch (e) { next(e); }
});

// ── Partilha rica: /e/:id ────────────────────────────────────────────────────
// Os crawlers do WhatsApp/Facebook/etc. não executam JS, por isso o link SPA
// (/?company=id) mostra sempre o cartão genérico do site. Esta rota serve os
// og:tags DA EMPRESA e redireciona humanos de imediato para a SPA.
app.get('/e/:id(\\d+)', async (req, res, next) => {
  try {
    const esc = s => String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const BASE = 'https://www.hivex.pt';
    const { rows } = await require('./db').query(
      `SELECT id, name, city, sector, rating, reviews, description,
              (logo IS NOT NULL AND logo LIKE 'data:image%') AS has_logo,
              CASE WHEN logo IS NOT NULL THEN left(md5(logo), 10) END AS logo_v
         FROM companies WHERE id = $1 AND status = 'approved'`, [req.params.id]);
    const c = rows[0];
    const dest = `/?company=${encodeURIComponent(req.params.id)}`;
    if (!c) return res.redirect(302, '/');
    const title = `${c.name}${c.city ? ' — ' + c.city : ''} | Hivex`;
    const bits = [];
    if (Number(c.rating) > 0) bits.push(`⭐ ${Number(c.rating).toFixed(1)}/5 (${c.reviews || 0})`);
    if (c.description) bits.push(String(c.description).slice(0, 140));
    const desc = bits.join(' · ') || 'Encontre empresas de construção e serviços na Hivex.';
    const img = c.has_logo ? `${BASE}/api/companies/${c.id}/logo?v=${c.logo_v}` : `${BASE}/og-cover.png?v=1`;
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    res.send(`<!doctype html><html lang="pt"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="business.business">
<meta property="og:site_name" content="Hivex">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(img)}">
<meta property="og:url" content="${BASE}/e/${c.id}">
<meta name="twitter:card" content="summary">
<link rel="canonical" href="${BASE}${esc(dest)}">
<meta http-equiv="refresh" content="0;url=${esc(dest)}">
</head><body>
<script>location.replace(${JSON.stringify(dest)});</script>
<p><a href="${esc(dest)}">${esc(c.name)}</a></p>
</body></html>`);
  } catch (e) { next(e); }
});

// ── Landing SEO: /s/:sector/:city ────────────────────────────────────────────
// Página HTML real por setor+cidade para os motores de busca ("eletricista
// braga") — a SPA não dá nada aos crawlers para estas pesquisas. Lista as
// empresas com links /e/:id (crawláveis) e JSON-LD ItemList; humanos têm um
// CTA para a app com os filtros aplicados.
const SECTOR_LABELS_PT = {
  construcao_geral: 'Construção Geral', pedreiros_trolhas: 'Pedreiros / Trolhas',
  eletricistas: 'Eletricistas', picheleiros: 'Picheleiros / Canalizadores',
  canalizacao_saneamento: 'Canalização & Saneamento', climatizacao_avac: 'Climatização / AVAC',
  pintores: 'Pintores', carpinteiros: 'Carpinteiros', serralharia: 'Serralharia',
  telhados_coberturas: 'Telhados & Coberturas', isolamento_termico_acustico: 'Isolamento Térmico & Acústico',
  pavimentos_revestimentos: 'Pavimentos & Revestimentos', azulejos_ceramica: 'Azulejos & Cerâmica',
  jardineiros: 'Jardineiros', paisagismo_jardins: 'Paisagismo & Jardins',
  materiais_construcao: 'Materiais de Construção', arquitetura_projetos: 'Arquitetura & Projetos',
  energias_renovaveis_solar: 'Energias Renováveis / Solar', demolicao: 'Demolição',
  alvenaria: 'Alvenaria', estucadores: 'Estucadores', vidraceiros: 'Vidraceiros',
  moveis_medida: 'Móveis por Medida', piscinas: 'Piscinas',
};
app.get('/s/:sector/:city', async (req, res, next) => {
  try {
    const esc = s => String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const sector = String(req.params.sector || '').toLowerCase().replace(/[^a-z_]/g, '').slice(0, 50);
    const cidade = String(req.params.city || '').replace(/-/g, ' ').replace(/[<>"]/g, '').slice(0, 60);
    if (!sector || !cidade) return res.redirect(302, '/');
    const { rows } = await require('./db').query(
      `SELECT id, name, city, rating, reviews, phone, website
         FROM companies
        WHERE status = 'approved' AND sector = $1 AND lower(city) = lower($2)
        ORDER BY featured DESC NULLS LAST, rating DESC NULLS LAST, reviews DESC NULLS LAST
        LIMIT 50`, [sector, cidade]);
    if (!rows.length) return res.redirect(302, '/');
    const BASE = 'https://www.hivex.pt';
    const label = SECTOR_LABELS_PT[sector] || (sector.charAt(0).toUpperCase() + sector.slice(1).replace(/_/g, ' '));
    const cityTitle = rows[0].city || cidade;
    const title = `${label} em ${cityTitle} — ${rows.length} ${rows.length === 1 ? 'empresa' : 'empresas'} | Hivex`;
    const desc = `${rows.length} empresas de ${label.toLowerCase()} em ${cityTitle}, com contactos, avaliações e pedido de orçamento grátis na Hivex.`;
    const spaUrl = `/?sector=${encodeURIComponent(sector)}&city=${encodeURIComponent(cityTitle)}`;
    const itemList = {
      '@context': 'https://schema.org', '@type': 'ItemList', name: title,
      itemListElement: rows.slice(0, 25).map((r, i) => ({
        '@type': 'ListItem', position: i + 1, url: `${BASE}/e/${r.id}`, name: r.name,
      })),
    };
    const linhas = rows.map(r =>
      `<li><a href="/e/${r.id}"><strong>${esc(r.name)}</strong></a>` +
      (Number(r.rating) > 0 ? ` · ⭐ ${Number(r.rating).toFixed(1)} (${r.reviews || 0})` : '') +
      `</li>`).join('\n');
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
    res.send(`<!doctype html><html lang="pt"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${BASE}/s/${esc(sector)}/${esc(req.params.city)}">
<meta property="og:image" content="${BASE}/og-cover.png?v=1">
<link rel="canonical" href="${BASE}/s/${esc(sector)}/${esc(req.params.city)}">
<script type="application/ld+json">${JSON.stringify(itemList)}</script>
<style>body{font-family:system-ui;max-width:720px;margin:0 auto;padding:28px 18px;background:#0f172a;color:#e2e8f0}a{color:#93c5fd}li{margin:9px 0}h1{font-size:26px}.cta{display:inline-block;margin:18px 0;background:#f97316;color:#fff;padding:12px 22px;border-radius:10px;font-weight:700;text-decoration:none}</style>
</head><body>
<h1>${esc(label)} em ${esc(cityTitle)}</h1>
<p>${esc(desc)}</p>
<a class="cta" href="${esc(spaUrl)}">Ver no mapa e pedir orçamentos →</a>
<ol>
${linhas}
</ol>
<p><a href="/">Hivex — encontre empresas de construção e serviços</a></p>
</body></html>`);
  } catch (e) { next(e); }
});

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
      schema: { migrated: _migrated },
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

// ── Site visit tracking (public, fire-and-forget) ────────────────────────────
// Records one row per page-visit; the frontend de-dupes to one call per browser
// session. Never errors the client — analytics must not break the page.
app.post('/api/visits', async (req, res) => {
  try {
    const pool = require('./db');
    const clip = v => (typeof v === 'string' && v ? v.slice(0, 200) : null);
    await pool.query(
      'INSERT INTO site_visits (visitor, path) VALUES ($1, $2)',
      [clip(req.body && req.body.visitor), clip(req.body && req.body.path)]
    );
  } catch (_) { /* swallow — tracking is best-effort */ }
  res.json({ ok: true });
});

// ── Push device registration (from the native app) ───────────────────────────
// The iOS/Android wrapper posts its FCM/APNs token here; we upsert it and tie it
// to the logged-in user (if any) so the backend can notify them later. Storing
// tokens is always safe even if FCM sending isn't configured yet.
const { optionalAuth: _optionalAuth } = require('./middleware/auth');
app.post('/api/devices', _optionalAuth, async (req, res) => {
  try {
    const token = (req.body && typeof req.body.token === 'string') ? req.body.token.slice(0, 500) : null;
    const platform = (req.body && typeof req.body.platform === 'string') ? req.body.platform.slice(0, 20) : null;
    if (!token) return res.status(400).json({ error: 'token em falta' });
    const pool = require('./db');
    await pool.query(
      `INSERT INTO device_tokens (token, user_id, platform, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (token) DO UPDATE SET user_id = EXCLUDED.user_id, platform = EXCLUDED.platform, updated_at = NOW()`,
      [token, req.user ? req.user.id : null, platform]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Não foi possível registar o dispositivo' });
  }
});

// ── AI assistant — helps customers find companies for their job ───────────────
// Tool-calling agent via the Vercel AI Gateway (OpenAI-compatible HTTP API, so no
// SDK dependency). Dormant unless AI_GATEWAY_API_KEY is set. Public but rate-limited.
const assistantLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados pedidos ao assistente. Aguarde um momento.' },
  skip: _skipRateLimit,
});

app.post('/api/assistant', assistantLimiter, async (req, res) => {
  // Auth: explicit gateway key if set, otherwise the Vercel OIDC token that the
  // platform auto-injects into functions (uses the team's free Gateway credits,
  // no manual key needed).
  const key = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (!key) return res.status(503).json({ error: 'O assistente não está configurado.' });
  try {
    const pool = require('./db');
    const incoming = Array.isArray(req.body && req.body.messages) ? req.body.messages.slice(-12) : [];
    const msgs = incoming
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map(m => ({ role: m.role, content: String(m.content).slice(0, 2000) }));
    if (!msgs.length) return res.status(400).json({ error: 'Sem mensagem.' });

    const system = {
      role: 'system',
      content:
        'És o assistente da Hivex, um marketplace de profissionais de construção em Portugal. ' +
        'Ajudas o cliente a encontrar empresas para o trabalho que precisa de fazer. ' +
        'Faz perguntas curtas para perceber o tipo de trabalho e a localização (cidade/zona). ' +
        'Usa a ferramenta search_companies para procurar empresas aprovadas e apresenta as melhores opções (nome, cidade, avaliação). ' +
        'Sê breve, simpático e responde sempre no idioma do utilizador. Se não houver resultados, sugere alargar a zona ou outra área. ' +
        'Exemplos de áreas: pedreiros, eletricistas, canalização/picheleiros, pintura, carpintaria, escavação, AVAC/climatização, telhados, pavimentos, isolamento, serralharia.',
    };

    const tools = [{
      type: 'function',
      function: {
        name: 'search_companies',
        description: 'Procura empresas de construção aprovadas no marketplace Hivex por palavra-chave (tipo de serviço) e, opcionalmente, cidade/zona.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Tipo de serviço ou área (ex.: "pedreiro", "eletricista", "pintura")' },
            city: { type: 'string', description: 'Cidade ou zona (opcional)' },
          },
          required: ['query'],
        },
      },
    }];

    async function searchCompanies({ query, city }) {
      const params = [];
      const conds = [`status = 'approved'`];
      if (query) {
        params.push('%' + String(query).slice(0, 60) + '%');
        const p = '$' + params.length;
        conds.push(`(name ILIKE ${p} OR sector ILIKE ${p} OR description ILIKE ${p} OR array_to_string(sectors,' ') ILIKE ${p} OR array_to_string(tags,' ') ILIKE ${p})`);
      }
      if (city) {
        params.push('%' + String(city).slice(0, 40) + '%');
        const p = '$' + params.length;
        conds.push(`(city ILIKE ${p} OR zone ILIKE ${p})`);
      }
      const { rows } = await pool.query(
        `SELECT id, name, sector, sectors, city, zone, rating, reviews, website, phone
           FROM companies WHERE ${conds.join(' AND ')}
           ORDER BY verified DESC, rating DESC, reviews DESC LIMIT 8`,
        params
      );
      return rows;
    }

    const GW = (process.env.AI_GATEWAY_URL || 'https://ai-gateway.vercel.sh/v1') + '/chat/completions';
    const model = process.env.AI_MODEL || 'anthropic/claude-haiku-4.5';
    const convo = [system, ...msgs];
    let foundCompanies = [];

    for (let i = 0; i < 3; i++) {
      const r = await fetch(GW, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
        body: JSON.stringify({ model, messages: convo, tools, temperature: 0.3, max_tokens: 700 }),
      });
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        console.error('[assistant] gateway error', r.status, txt.slice(0, 300));
        return res.status(502).json({ error: 'O assistente está indisponível de momento.' });
      }
      const data = await r.json();
      const m = data.choices && data.choices[0] && data.choices[0].message;
      if (!m) return res.status(502).json({ error: 'Resposta inválida do assistente.' });
      convo.push(m);
      const toolCalls = m.tool_calls || [];
      if (toolCalls.length) {
        for (const tc of toolCalls) {
          let args = {};
          try { args = JSON.parse((tc.function && tc.function.arguments) || '{}'); } catch (_) {}
          let result = [];
          if (tc.function && tc.function.name === 'search_companies') {
            result = await searchCompanies(args);
            foundCompanies = result;
          }
          convo.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(result) });
        }
        continue;
      }
      return res.json({ reply: m.content || '', companies: foundCompanies });
    }
    return res.json({ reply: 'Não consegui concluir o pedido. Pode reformular?', companies: foundCompanies });
  } catch (e) {
    console.error('[assistant] error', e && (e.stack || e.message || e));
    res.status(500).json({ error: 'Erro no assistente.' });
  }
});

// ── Telemetria de erros do frontend ──────────────────────────────────────────
// Público (erros acontecem a visitantes anónimos), deduplicado por hash com
// contador — a tabela não cresce com repetições. Payload minúsculo.
app.post('/api/client-errors', async (req, res) => {
  try {
    const b = req.body || {};
    const msg = String(b.message || '').slice(0, 500);
    if (!msg) return res.json({ ok: true });
    const stack = String(b.stack || '').slice(0, 1500);
    const url = String(b.url || '').slice(0, 300);
    const ua = String(req.headers['user-agent'] || '').slice(0, 200);
    const hash = require('crypto').createHash('sha1')
      .update('web|' + msg + '|' + stack.slice(0, 300)).digest('hex');
    await require('./db').query(
      `INSERT INTO client_errors (source, hash, message, stack, url, ua)
       VALUES ('web', $1, $2, $3, $4, $5)
       ON CONFLICT (hash) DO UPDATE
         SET count = client_errors.count + 1, last_at = NOW(), url = EXCLUDED.url`,
      [hash, msg, stack, url, ua]);
    res.json({ ok: true });
  } catch (_) { res.json({ ok: true }); }
});

app.use(errorHandler);

module.exports = app;
