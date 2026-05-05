const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

// All favourites endpoints require authentication.
router.use(requireAuth);

// GET /api/favourites — list the current user's saved company ids
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT company_id FROM user_favourites WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows.map(r => Number(r.company_id)));
  } catch (e) { next(e); }
});

// POST /api/favourites/:companyId — add a favourite (idempotent)
router.post('/:companyId', async (req, res, next) => {
  const cid = parseInt(req.params.companyId, 10);
  if (!Number.isFinite(cid)) return res.status(400).json({ error: 'companyId inválido' });
  try {
    await pool.query(
      `INSERT INTO user_favourites (user_id, company_id)
         VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [req.user.id, cid]
    );
    res.json({ ok: true });
  } catch (e) {
    // foreign-key violation = company doesn't exist
    if (e.code === '23503') return res.status(404).json({ error: 'Empresa não encontrada' });
    next(e);
  }
});

// DELETE /api/favourites/:companyId — remove a favourite
router.delete('/:companyId', async (req, res, next) => {
  const cid = parseInt(req.params.companyId, 10);
  if (!Number.isFinite(cid)) return res.status(400).json({ error: 'companyId inválido' });
  try {
    await pool.query(
      'DELETE FROM user_favourites WHERE user_id = $1 AND company_id = $2',
      [req.user.id, cid]
    );
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// POST /api/favourites/bulk — merge a batch of company ids (used on first
// login, to lift any localStorage favourites the user accumulated while
// browsing logged-out).
router.post('/bulk', async (req, res, next) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : null;
  if (!ids || ids.length === 0) return res.json({ ok: true, merged: 0 });
  const cleaned = ids.map(n => parseInt(n, 10)).filter(Number.isFinite).slice(0, 200);
  if (cleaned.length === 0) return res.json({ ok: true, merged: 0 });
  try {
    // Build a single VALUES list for one round-trip. Ignores rows whose
    // company_id no longer exists thanks to the FK + ON CONFLICT clause.
    const placeholders = cleaned.map((_, i) => `($1, $${i + 2})`).join(',');
    await pool.query(
      `INSERT INTO user_favourites (user_id, company_id)
         VALUES ${placeholders}
       ON CONFLICT DO NOTHING`,
      [req.user.id, ...cleaned]
    );
    res.json({ ok: true, merged: cleaned.length });
  } catch (e) {
    // 23503 = FK violation when one of the ids doesn't exist. Try one-by-one
    // so the valid rows still land.
    if (e.code === '23503') {
      let merged = 0;
      for (const cid of cleaned) {
        try {
          await pool.query(
            `INSERT INTO user_favourites (user_id, company_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [req.user.id, cid]
          );
          merged++;
        } catch (_) {}
      }
      return res.json({ ok: true, merged });
    }
    next(e);
  }
});

module.exports = router;
