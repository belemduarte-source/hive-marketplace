const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams gives access to :id from parent
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

// GET /api/companies/:id/reviews — public
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.score, r.score_quality, r.score_speed, r.score_communication, r.score_value,
              r.comment, r.reply, r.reply_at, r.created_at,
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
    const { score, comment, score_quality, score_speed, score_communication, score_value } = req.body;

    // Normalise the per-criterion scores (each optional, but each must be 1-5 if sent).
    const norm = (v) => { const n = Number(v); return (Number.isFinite(n) && n >= 1 && n <= 5) ? Math.round(n) : null; };
    const sq = norm(score_quality), sp = norm(score_speed), scm = norm(score_communication), sv = norm(score_value);
    const crit = [sq, sp, scm, sv].filter(n => n != null);

    // Overall = average of the criteria provided; fall back to a plain `score`
    // for backward compatibility with older clients.
    let overall;
    if (crit.length) overall = Math.round(crit.reduce((a, b) => a + b, 0) / crit.length);
    else overall = norm(score);
    if (overall == null) {
      return res.status(400).json({ error: 'Indique pelo menos uma classificação (1 a 5).' });
    }

    // The upsert and the rating recompute must be atomic: otherwise a crash
    // between them, or two users reviewing the same company at once, can leave a
    // saved review with a stale star average. We run both in one transaction and
    // lock the company row (FOR UPDATE) so concurrent reviews recompute serially.
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Verify the company exists and is approved — and lock the row so any other
      // review landing on the same company waits here instead of racing the AVG.
      const { rows: co } = await client.query(
        `SELECT id FROM companies WHERE id = $1 AND status = 'approved' FOR UPDATE`,
        [req.params.id]
      );
      if (!co[0]) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      // Upsert: update if user already reviewed this company
      const { rows } = await client.query(
        `INSERT INTO reviews (company_id, user_id, score, score_quality, score_speed, score_communication, score_value, comment)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (company_id, user_id)
         DO UPDATE SET score = EXCLUDED.score,
                       score_quality = EXCLUDED.score_quality,
                       score_speed = EXCLUDED.score_speed,
                       score_communication = EXCLUDED.score_communication,
                       score_value = EXCLUDED.score_value,
                       comment = EXCLUDED.comment, created_at = NOW()
         RETURNING *`,
        [req.params.id, req.user.id, overall, sq, sp, scm, sv, comment || null]
      );

      // Recalculate the company's aggregate rating in the same transaction.
      await client.query(
        `UPDATE companies SET
           rating  = (SELECT ROUND(AVG(score)::numeric, 1) FROM reviews WHERE company_id = $1),
           reviews = (SELECT COUNT(*) FROM reviews WHERE company_id = $1),
           updated_at = NOW()
         WHERE id = $1`,
        [req.params.id]
      );

      await client.query('COMMIT');
      res.status(201).json(rows[0]);
    } catch (e) {
      await client.query('ROLLBACK').catch(() => {});
      throw e;
    } finally {
      client.release();
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
