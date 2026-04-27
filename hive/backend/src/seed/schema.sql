-- Hive B2B Marketplace — PostgreSQL Schema
-- Run via: psql $DATABASE_URL -f schema.sql
-- Or via seed.js which executes this file automatically

CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  google_id     TEXT UNIQUE,
  picture       TEXT,
  type          TEXT NOT NULL CHECK (type IN ('empresa', 'cliente')),
  company       TEXT DEFAULT '',
  phone         TEXT DEFAULT '',
  is_admin      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Migrations for existing deployments (idempotent — safe to re-run)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS picture TEXT;

CREATE TABLE IF NOT EXISTS companies (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  sectors     TEXT[] NOT NULL DEFAULT '{}',
  sector      TEXT,
  cae                  TEXT,
  alvara               TEXT,
  certidao_permanente  TEXT,
  address     TEXT,
  postal_code TEXT,
  city        TEXT,
  country     TEXT DEFAULT 'pt',
  zone        TEXT,
  email       TEXT NOT NULL DEFAULT '',
  phone       TEXT NOT NULL DEFAULT '',
  website     TEXT,
  tags        TEXT[] DEFAULT '{}',
  description TEXT,
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  rating      DECIMAL(3,1) DEFAULT 0,
  reviews     INTEGER DEFAULT 0,
  top_rated   BOOLEAN DEFAULT FALSE,
  verified    BOOLEAN DEFAULT FALSE,
  is_new      BOOLEAN DEFAULT TRUE,
  emoji       TEXT DEFAULT '🏢',
  color       TEXT DEFAULT '#f97316',
  pin_type    TEXT DEFAULT 'std',
  status      TEXT DEFAULT 'approved' CHECK (status IN ('approved','pending','rejected')),
  created_by  BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_companies_sector     ON companies(sector);
CREATE INDEX IF NOT EXISTS idx_companies_sectors    ON companies USING GIN(sectors);
CREATE INDEX IF NOT EXISTS idx_companies_tags       ON companies USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_companies_status     ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_lat_lng    ON companies(lat, lng);
CREATE INDEX IF NOT EXISTS idx_companies_rating     ON companies(rating DESC);
CREATE INDEX IF NOT EXISTS idx_companies_country    ON companies(country);
-- Composite index for the primary list query: WHERE status='approved' [AND country=X] ORDER BY created_at DESC
CREATE INDEX IF NOT EXISTS idx_companies_status_country_created
  ON companies(status, country, created_at DESC);
-- Allows fast lookup of companies submitted by a given user
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by);

-- ── Reviews ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          BIGSERIAL PRIMARY KEY,
  company_id  BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score       SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, user_id)  -- one review per user per company
);
CREATE INDEX IF NOT EXISTS idx_reviews_company ON reviews(company_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user    ON reviews(user_id);

-- ── Analytics events ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id          BIGSERIAL PRIMARY KEY,
  company_id  BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL CHECK (event_type IN ('view','contact','website_click','whatsapp')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_events_company ON events(company_id);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at DESC);

-- ── Migrations for existing databases (safe to re-run) ────────────────────────
ALTER TABLE companies ADD COLUMN IF NOT EXISTS alvara              TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS certidao_permanente TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS featured            BOOLEAN DEFAULT FALSE;
