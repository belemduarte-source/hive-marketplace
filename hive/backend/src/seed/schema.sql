-- Hive B2B Marketplace — PostgreSQL Schema
-- Run via: psql $DATABASE_URL -f schema.sql
-- Or via seed.js which executes this file automatically

CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('empresa', 'cliente')),
  company       TEXT DEFAULT '',
  phone         TEXT DEFAULT '',
  is_admin      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS companies (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  sectors     TEXT[] NOT NULL DEFAULT '{}',
  sector      TEXT,
  cae         TEXT,
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
CREATE INDEX IF NOT EXISTS idx_companies_sector  ON companies(sector);
CREATE INDEX IF NOT EXISTS idx_companies_sectors ON companies USING GIN(sectors);
CREATE INDEX IF NOT EXISTS idx_companies_tags    ON companies USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_companies_status  ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_lat_lng ON companies(lat, lng);
CREATE INDEX IF NOT EXISTS idx_companies_rating  ON companies(rating DESC);
CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country);
