const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET /api/companies — public, returns all approved companies
router.get('/', async (req, res, next) => {
  try {
    const { country } = req.query;
    let query = `SELECT * FROM companies WHERE status = 'approved'`;
    const params = [];
    if (country) {
      params.push(country);
      query += ` AND country = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// GET /api/companies/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM companies WHERE id = $1 AND status = 'approved'`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// POST /api/companies — authenticated users can create companies
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const {
      name, sectors, sector, cae, address, postal_code, city, country,
      zone, email, phone, website, tags, description, lat, lng,
      emoji, color, pin_type
    } = req.body;

    if (!name || !lat || !lng) {
      return res.status(400).json({ error: 'name, lat e lng são obrigatórios' });
    }

    const { rows } = await pool.query(
      `INSERT INTO companies
        (name, sectors, sector, cae, address, postal_code, city, country, zone,
         email, phone, website, tags, description, lat, lng, emoji, color, pin_type,
         status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,'approved',$20)
       RETURNING *`,
      [
        name,
        sectors || (sector ? [sector] : []),
        sector || (sectors && sectors[0]) || null,
        cae || null,
        address || null,
        postal_code || null,
        city || null,
        country || 'pt',
        zone || null,
        email || '',
        phone || '',
        website || null,
        tags || [],
        description || null,
        lat,
        lng,
        emoji || '🏢',
        color || '#f97316',
        pin_type || 'std',
        req.user.id,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// PUT /api/companies/:id — admin or company owner
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { rows: existing } = await pool.query('SELECT * FROM companies WHERE id = $1', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ error: 'Empresa não encontrada' });

    if (!req.user.is_admin && existing[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão para editar esta empresa' });
    }

    const {
      name, sectors, sector, cae, address, postal_code, city, country,
      zone, email, phone, website, tags, description, lat, lng,
      emoji, color, pin_type, status
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE companies SET
        name = COALESCE($1, name),
        sectors = COALESCE($2, sectors),
        sector = COALESCE($3, sector),
        cae = COALESCE($4, cae),
        address = COALESCE($5, address),
        postal_code = COALESCE($6, postal_code),
        city = COALESCE($7, city),
        country = COALESCE($8, country),
        zone = COALESCE($9, zone),
        email = COALESCE($10, email),
        phone = COALESCE($11, phone),
        website = COALESCE($12, website),
        tags = COALESCE($13, tags),
        description = COALESCE($14, description),
        lat = COALESCE($15, lat),
        lng = COALESCE($16, lng),
        emoji = COALESCE($17, emoji),
        color = COALESCE($18, color),
        pin_type = COALESCE($19, pin_type),
        status = COALESCE($20, status),
        updated_at = NOW()
       WHERE id = $21
       RETURNING *`,
      [name, sectors, sector, cae, address, postal_code, city, country,
       zone, email, phone, website, tags, description, lat, lng,
       emoji, color, pin_type, status, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/companies/:id — admin only (soft delete)
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await pool.query(
      `UPDATE companies SET status = 'rejected', updated_at = NOW() WHERE id = $1`,
      [req.params.id]
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
