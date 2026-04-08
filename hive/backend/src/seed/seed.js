require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const DEMO_COMPANIES = require('./demo-companies');
const { seedFromCsv } = require('./csv-import');

async function runSchema() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('✅ Schema created/verified');
}

async function seedDemoCompanies() {
  const { rows } = await pool.query('SELECT COUNT(*) FROM companies');
  if (parseInt(rows[0].count) > 0) {
    console.log(`ℹ️  companies table already has ${rows[0].count} rows — skipping demo seed`);
    return;
  }

  for (const c of DEMO_COMPANIES) {
    await pool.query(
      `INSERT INTO companies
        (name, sectors, sector, email, phone, website, description, tags,
         lat, lng, address, city, country, rating, reviews, top_rated, verified, is_new, emoji, color, pin_type, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pt',$13,$14,$15,$16,$17,$18,$19,$20,'approved')
       ON CONFLICT DO NOTHING`,
      [
        c.name,
        c.sectors || [c.sector],
        c.sector,
        c.email || '',
        c.phone || '',
        c.website || '',
        c.description || '',
        c.tags || [],
        c.lat,
        c.lng,
        c.address || '',
        c.city || '',
        c.rating || 0,
        c.reviews || 0,
        c.topRated || false,
        c.verified || false,
        c.isNew !== undefined ? c.isNew : true,
        c.emoji || '🏢',
        c.color || '#f97316',
        c.pinType || 'std',
      ]
    );
  }
  console.log(`✅ Demo companies seeded: ${DEMO_COMPANIES.length}`);
}

async function seedAdminUser() {
  const { rows } = await pool.query('SELECT COUNT(*) FROM users');
  if (parseInt(rows[0].count) > 0) {
    console.log('ℹ️  users table already has rows — skipping admin seed');
    return;
  }

  const passwordHash = await bcrypt.hash('admin123', 10);
  await pool.query(
    `INSERT INTO users (name, email, password_hash, type, is_admin)
     VALUES ('Admin', 'admin@hive.pt', $1, 'empresa', true)
     ON CONFLICT DO NOTHING`,
    [passwordHash]
  );
  console.log('✅ Default admin user created: admin@hive.pt / admin123');
}

async function main() {
  try {
    await runSchema();
    await seedDemoCompanies();
    await seedFromCsv();
    await seedAdminUser();
    console.log('✅ Seed complete');
  } catch (e) {
    console.error('❌ Seed error:', e);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
