const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const reviewsRouter = require('./reviews');
const { sendRegistrationNotification, sendCompanyApprovalEmail, sendCompanyRejectionEmail, sendContactEmail } = require('../email');

// GET /api/companies — public, returns all approved companies
// Supports: ?country=pt  ?q=search_text  ?sector=Construção
const LIST_COLS = `
  id, name, sectors, sector, cae, address, postal_code, city, country, zone,
  email, phone, website, tags, description,
  lat, lng, rating, reviews, top_rated, verified, is_new, featured,
  emoji, color, pin_type, status, created_at
`.trim();

router.get('/', async (req, res, next) => {
  try {
    const { country, q, sector } = req.query;
    const params = [];
    const conditions = [`status = 'approved'`];

    if (country) {
      params.push(country);
      conditions.push(`country = $${params.length}`);
    }
    if (sector) {
      params.push(sector);
      conditions.push(`($${params.length} = ANY(sectors) OR sector = $${params.length})`);
    }
    if (q && q.trim()) {
      params.push(q.trim());
      conditions.push(
        `to_tsvector('portuguese', name || ' ' || COALESCE(description,'') || ' ' || array_to_string(tags,' ') || ' ' || COALESCE(cae,'') || ' ' || COALESCE(city,''))
         @@ plainto_tsquery('portuguese', $${params.length})`
      );
    }

    const where = 'WHERE ' + conditions.join(' AND ');
    const { rows } = await pool.query(
      `SELECT ${LIST_COLS} FROM companies ${where}
       ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// GET /api/companies/status?email= — check registration status (public)
router.get('/status', async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'email é obrigatório' });

    const { rows } = await pool.query(
      `SELECT id, name, status, created_at FROM companies WHERE email = $1 ORDER BY created_at DESC LIMIT 5`,
      [email.toLowerCase().trim()]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// GET /api/companies/:id/approve?token=ADMIN_TOKEN — one-click approval from email
router.get('/:id/approve', async (req, res, next) => {
  try {
    const adminToken = process.env.ADMIN_TOKEN;
    if (!adminToken || req.query.token !== adminToken) {
      return res.status(403).send(htmlPage('❌ Acesso negado', 'Token de administrador inválido.', '#dc2626'));
    }

    const { rows } = await pool.query(
      `UPDATE companies SET status = 'approved', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).send(htmlPage('❌ Não encontrada', 'Empresa não encontrada na base de dados.', '#dc2626'));
    }

    // Send confirmation email to the company (fire-and-forget)
    sendCompanyApprovalEmail(rows[0]).catch(err =>
      console.error('[email] Failed to send approval email to company:', err.message)
    );

    res.send(htmlPage(
      '✅ Empresa aprovada!',
      `<strong>${rows[0].name}</strong> foi aprovada e já está visível na plataforma Hive.<br><br>Foi enviado um email de confirmação para <strong>${rows[0].email || '(sem email)'}</strong>.`,
      '#16a34a'
    ));
  } catch (e) {
    next(e);
  }
});

// GET /api/companies/:id/reject?token=ADMIN_TOKEN — one-click rejection from email
router.get('/:id/reject', async (req, res, next) => {
  try {
    const adminToken = process.env.ADMIN_TOKEN;
    if (!adminToken || req.query.token !== adminToken) {
      return res.status(403).send(htmlPage('❌ Acesso negado', 'Token de administrador inválido.', '#dc2626'));
    }

    const { rows } = await pool.query(
      `UPDATE companies SET status = 'rejected', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).send(htmlPage('❌ Não encontrada', 'Empresa não encontrada na base de dados.', '#dc2626'));
    }

    // Optionally notify the company (fire-and-forget)
    sendCompanyRejectionEmail(rows[0]).catch(err =>
      console.error('[email] Failed to send rejection email to company:', err.message)
    );

    res.send(htmlPage(
      '🚫 Empresa rejeitada',
      `O registo de <strong>${rows[0].name}</strong> foi rejeitado e não será publicado na plataforma.`,
      '#f97316'
    ));
  } catch (e) {
    next(e);
  }
});

// GET /api/companies/:id — public, only approved
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

// POST /api/companies — public; anyone can submit a company (starts as pending, requires admin approval)
router.post('/', async (req, res, next) => {
  try {
    const {
      name, sectors, sector, cae, alvara, certidao_permanente,
      address, postal_code, city, country,
      zone, email, phone, website, tags, description, lat, lng,
      emoji, color, pin_type
    } = req.body;

    if (!name || !lat || !lng) {
      return res.status(400).json({ error: 'name, lat e lng são obrigatórios' });
    }

    const { rows } = await pool.query(
      `INSERT INTO companies
        (name, sectors, sector, cae, alvara, certidao_permanente,
         address, postal_code, city, country, zone,
         email, phone, website, tags, description, lat, lng, emoji, color, pin_type,
         status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,'pending',$22)
       RETURNING *`,
      [
        name,
        sectors || (sector ? [sector] : []),
        sector || (sectors && sectors[0]) || null,
        cae || null,
        alvara || null,
        certidao_permanente || null,
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
        req.user?.id || null,   // null when submitted by a non-authenticated visitor
      ]
    );

    // Fire-and-forget admin notification with approve/reject links
    sendRegistrationNotification(rows[0]).catch(err =>
      console.error('[email] Failed to send registration notification:', err.message)
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
      name, sectors, sector, cae, alvara, certidao_permanente,
      address, postal_code, city, country,
      zone, email, phone, website, tags, description, lat, lng,
      emoji, color, pin_type, status
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE companies SET
        name = COALESCE($1, name),
        sectors = COALESCE($2, sectors),
        sector = COALESCE($3, sector),
        cae = COALESCE($4, cae),
        alvara = COALESCE($5, alvara),
        certidao_permanente = COALESCE($6, certidao_permanente),
        address = COALESCE($7, address),
        postal_code = COALESCE($8, postal_code),
        city = COALESCE($9, city),
        country = COALESCE($10, country),
        zone = COALESCE($11, zone),
        email = COALESCE($12, email),
        phone = COALESCE($13, phone),
        website = COALESCE($14, website),
        tags = COALESCE($15, tags),
        description = COALESCE($16, description),
        lat = COALESCE($17, lat),
        lng = COALESCE($18, lng),
        emoji = COALESCE($19, emoji),
        color = COALESCE($20, color),
        pin_type = COALESCE($21, pin_type),
        status = COALESCE($22, status),
        updated_at = NOW()
       WHERE id = $23
       RETURNING *`,
      [name, sectors, sector, cae, alvara, certidao_permanente,
       address, postal_code, city, country,
       zone, email, phone, website, tags, description, lat, lng,
       emoji, color, pin_type, status, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// POST /api/companies/:id/contact — relay a message to the company (auth required)
router.post('/:id/contact', requireAuth, async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length < 10) {
      return res.status(400).json({ error: 'Mensagem demasiado curta (mínimo 10 caracteres)' });
    }

    const { rows } = await pool.query(
      `SELECT id, name, email FROM companies WHERE id = $1 AND status = 'approved'`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    if (!rows[0].email) return res.status(422).json({ error: 'Esta empresa não tem email configurado' });

    const sender = { name: req.user.name, email: req.user.email };
    sendContactEmail(rows[0], sender, message.trim()).catch(err =>
      console.error('[email] Contact relay failed:', err.message)
    );

    // Track as contact event
    pool.query(
      `INSERT INTO events (company_id, event_type) VALUES ($1, 'contact')`,
      [req.params.id]
    ).catch(() => {});

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// POST /api/companies/:id/event — track analytics event (fire-and-forget, no auth required)
router.post('/:id/event', async (req, res, next) => {
  try {
    const { type } = req.body;
    const allowed = ['view', 'contact', 'website_click', 'whatsapp'];
    if (!allowed.includes(type)) return res.status(400).json({ error: 'type inválido' });

    await pool.query(
      `INSERT INTO events (company_id, event_type) VALUES ($1, $2)`,
      [req.params.id, type]
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// GET /api/companies/:id/analytics — owner or admin only
router.get('/:id/analytics', requireAuth, async (req, res, next) => {
  try {
    const { rows: co } = await pool.query('SELECT * FROM companies WHERE id = $1', [req.params.id]);
    if (!co[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    if (!req.user.is_admin && co[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    const { rows } = await pool.query(
      `SELECT
         event_type,
         COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int  AS last_7d,
         COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days')::int AS last_30d,
         COUNT(*)::int AS total
       FROM events
       WHERE company_id = $1
       GROUP BY event_type`,
      [req.params.id]
    );

    // Pivot into a friendly object
    const stats = { view: {}, contact: {}, website_click: {}, whatsapp: {} };
    rows.forEach(r => { stats[r.event_type] = { last_7d: r.last_7d, last_30d: r.last_30d, total: r.total }; });
    res.json(stats);
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

// Mount reviews sub-router
router.use('/:id/reviews', reviewsRouter);

// ── Helpers ───────────────────────────────────────────────────────────────────
function htmlPage(title, body, color = '#f97316') {
  return `<!DOCTYPE html><html lang="pt"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Hive</title>
<style>
  body{font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb}
  .card{background:#fff;border-radius:12px;padding:48px 40px;max-width:520px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.1)}
  h1{color:${color};font-size:28px;margin:0 0 16px}
  p{color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px}
  a{display:inline-block;background:${color};color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700}
</style></head>
<body><div class="card">
  <h1>${title}</h1>
  <p>${body}</p>
  <a href="/">Voltar ao Hive</a>
</div></body></html>`;
}

module.exports = router;
