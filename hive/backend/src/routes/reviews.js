const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams gives access to :id from parent
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/companies/:id/reviews — public
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.score, r.comment, r.created_at,
              u.name AS author_name
         FROM reviews r
         JOIN users u ON u.id = r.user_id
        WHERE r.company_id = $1
        ORDER BY r.created_at DESC
        LIMIT 50`,
      [req.params.id]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// POST /api/companies/:id/reviews — authenticated
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { score, comment } = req.body;
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ error: 'score deve ser entre 1 e 5' });
    }

    // Verify company exists and is approved
    const { rows: co } = await pool.query(
      `SELECT id FROM companies WHERE id = $1 AND status = 'approved'`,
      [req.params.id]
    );
    if (!co[0]) return res.status(404).json({ error: 'Empresa não encontrada' });

    // Upsert: update if user already reviewed this company
    const { rows } = await pool.query(
      `INSERT INTO reviews (company_id, user_id, score, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (company_id, user_id)
       DO UPDATE SET score = EXCLUDED.score, comment = EXCLUDED.comment, created_at = NOW()
       RETURNING *`,
      [req.params.id, req.user.id, score, comment || null]
    );

    // Recalculate company rating
    await pool.query(
      `UPDATE companies SET
         rating  = (SELECT ROUND(AVG(score)::numeric, 1) FROM reviews WHERE company_id = $1),
         reviews = (SELECT COUNT(*) FROM reviews WHERE company_id = $1),
         updated_at = NOW()
       WHERE id = $1`,
      [req.params.id]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
