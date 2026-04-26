const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAdmin } = require('../middleware/auth');

// All admin routes require admin auth
router.use(requireAdmin);

// GET /api/admin/stats — platform overview
router.get('/stats', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM companies WHERE status = 'approved')::int  AS approved,
        (SELECT COUNT(*) FROM companies WHERE status = 'pending')::int   AS pending,
        (SELECT COUNT(*) FROM companies WHERE status = 'rejected')::int  AS rejected,
        (SELECT COUNT(*) FROM companies)::int                            AS total_companies,
        (SELECT COUNT(*) FROM users)::int                                AS total_users,
        (SELECT COUNT(*) FROM reviews)::int                              AS total_reviews,
        (SELECT COUNT(*) FROM events WHERE created_at > NOW() - INTERVAL '7 days')::int AS events_7d,
        (SELECT COUNT(*) FROM companies WHERE created_at > NOW() - INTERVAL '7 days')::int AS new_7d
    `);
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// GET /api/admin/companies?status=pending&q=name — list all companies
router.get('/companies', async (req, res, next) => {
  try {
    const { status, q } = req.query;
    const params = [];
    const conditions = [];

    if (status) {
      params.push(status);
      conditions.push(`c.status = $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      conditions.push(`(c.name ILIKE $${params.length} OR c.email ILIKE $${params.length})`);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const { rows } = await pool.query(
      `SELECT c.id, c.name, c.sector, c.sectors, c.email, c.city, c.country,
              c.status, c.featured, c.verified, c.rating, c.reviews,
              c.created_at, c.updated_at,
              u.name AS owner_name, u.email AS owner_email
         FROM companies c
         LEFT JOIN users u ON u.id = c.created_by
         ${where}
         ORDER BY c.created_at DESC
         LIMIT 200`,
      params
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// PUT /api/admin/companies/:id/status — approve/reject/pending
router.put('/companies/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'status inválido' });
    }
    const { rows } = await pool.query(
      `UPDATE companies SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// PUT /api/admin/companies/:id/featured — toggle featured
router.put('/companies/:id/featured', async (req, res, next) => {
  try {
    const { featured } = req.body;
    const { rows } = await pool.query(
      `UPDATE companies SET featured = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, featured`,
      [!!featured, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// PUT /api/admin/companies/:id/verified — toggle verified badge
router.put('/companies/:id/verified', async (req, res, next) => {
  try {
    const { verified } = req.body;
    const { rows } = await pool.query(
      `UPDATE companies SET verified = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, verified`,
      [!!verified, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/admin/reviews/:id — remove abusive review
router.delete('/reviews/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM reviews WHERE id = $1 RETURNING company_id`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Avaliação não encontrada' });

    // Recalculate company rating
    await pool.query(
      `UPDATE companies SET
         rating  = COALESCE((SELECT ROUND(AVG(score)::numeric,1) FROM reviews WHERE company_id=$1), 0),
         reviews = (SELECT COUNT(*) FROM reviews WHERE company_id=$1),
         updated_at = NOW()
       WHERE id = $1`,
      [rows[0].company_id]
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
