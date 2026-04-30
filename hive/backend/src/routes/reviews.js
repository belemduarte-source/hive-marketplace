const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams gives access to :id from parent
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/companies/:id/reviews — public
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.score, r.comment, r.reply, r.reply_at, r.created_at,
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

// POST /api/companies/:id/reviews/:reviewId/reply — only the company owner
// (or an admin) may reply to a review on their company.
router.post('/:reviewId/reply', requireAuth, async (req, res, next) => {
  try {
    const reply = (req.body?.reply || '').trim();
    if (!reply) return res.status(400).json({ error: 'A resposta não pode estar vazia' });
    if (reply.length > 1000) return res.status(400).json({ error: 'Resposta demasiado longa (máximo 1000 caracteres)' });

    // Confirm the review belongs to a company owned by the caller
    const { rows: r } = await pool.query(
      `SELECT r.id, c.created_by
         FROM reviews r
         JOIN companies c ON c.id = r.company_id
        WHERE r.id = $1 AND r.company_id = $2`,
      [req.params.reviewId, req.params.id]
    );
    if (!r[0]) return res.status(404).json({ error: 'Avaliação não encontrada' });
    if (!req.user.is_admin && r[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Apenas o dono da empresa pode responder' });
    }

    const { rows } = await pool.query(
      `UPDATE reviews SET reply = $1, reply_at = NOW() WHERE id = $2 RETURNING *`,
      [reply, req.params.reviewId]
    );
    res.json(rows[0]);
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
