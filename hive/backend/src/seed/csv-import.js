const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const pool = require('../db');

async function seedFromCsv() {
  const csvPath = path.join(__dirname, '../../../../empresas-portugal.csv');
  if (!fs.existsSync(csvPath)) {
    console.warn('⚠️  empresas-portugal.csv not found, skipping CSV import');
    return 0;
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  let records;
  try {
    records = parse(content, {
      delimiter: ';',
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch (e) {
    console.warn('⚠️  CSV parse error:', e.message);
    return 0;
  }

  let inserted = 0;
  for (const row of records) {
    const lat = parseFloat(row['Latitude'] || row['latitude'] || '');
    const lng = parseFloat(row['Longitude'] || row['longitude'] || '');
    if (isNaN(lat) || isNaN(lng)) continue;

    const name = (row['Nome'] || row['nome'] || '').trim();
    if (!name) continue;

    const sector = (row['Sector'] || row['sector'] || '').toLowerCase().replace(/\s+/g, '_');
    const email = (row['Email'] || row['email'] || '').trim();
    const phone = (row['Telefone'] || row['telefone'] || '').trim();
    const website = (row['Website'] || row['website'] || '').trim();
    const address = (row['Morada'] || row['morada'] || '').trim();
    const postalCode = (row['Código Postal'] || row['Codigo Postal'] || row['codigo_postal'] || '').trim();
    const city = (row['Localidade'] || row['localidade'] || '').trim();
    const cae = (row['CAE'] || row['cae'] || '').trim();

    try {
      const result = await pool.query(
        `INSERT INTO companies
          (name, sectors, sector, cae, address, postal_code, city, country, email, phone, website, lat, lng, status, is_new, verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pt', $8, $9, $10, $11, $12, 'approved', false, false)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [name, sector ? [sector] : [], sector, cae, address, postalCode, city, email, phone, website, lat, lng]
      );
      if (result.rowCount > 0) inserted++;
    } catch (e) {
      // Skip individual row errors silently
    }
  }

  console.log(`✅ CSV import: ${inserted} companies inserted`);
  return inserted;
}

module.exports = { seedFromCsv };
