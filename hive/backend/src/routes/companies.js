const express = require('express');
const router = express.Router();
const pool = require('../db');
const { requireAuth, requireAdmin, optionalAuth, ensureAdminFlag } = require('../middleware/auth');
const reviewsRouter = require('./reviews');
const { sendRegistrationNotification, sendCompanyApprovalEmail, sendCompanyRejectionEmail, sendContactEmail, sendBrandedEmail, esc } = require('../email');
const { pushToUser } = require('../push');

// ── Defer slow email sends off the response path ──────────────────────────────
// SMTP round-trips (often 1-3 s on Gmail) used to block the user's "submit" /
// "contact" response. Here we send the email AFTER the response is flushed:
//   • On Vercel, register the promise with the platform's request context so the
//     function instance stays alive to finish the send (this is exactly what
//     @vercel/functions' waitUntil does under the hood — we read the injected
//     symbol directly to avoid adding a dependency that could break the build).
//   • Locally (or on any runtime without that context) we just fire-and-forget.
// Either way the user no longer waits on SMTP, and a failed send only logs.
function deferEmail(makePromise, label) {
  const task = Promise.resolve()
    .then(makePromise)
    .then(() => console.log(`[email] ${label} sent`))
    .catch(err => console.error(`[email] ${label} failed:`, err && (err.stack || err.message || err)));

  try {
    const ctxStore = globalThis[Symbol.for('@vercel/request-context')];
    const ctx = ctxStore && typeof ctxStore.get === 'function' ? ctxStore.get() : null;
    if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(task);
  } catch (_) { /* no platform context — fire-and-forget is fine */ }

  return task;
}

// Portuguese NIF (Número de Identificação Fiscal): 9 digits with a checksum.
// First digit identifies the entity type — only valid prefixes are accepted.
// The checksum follows the modulo-11 algorithm published by the AT.
function isValidPortugueseNIF(input) {
  if (input == null) return false;
  const nif = String(input).replace(/\s+/g, '');
  if (!/^\d{9}$/.test(nif)) return false;
  // Valid leading digits per AT (1,2,3 = singular; 5 = collective; 6 = public;
  // 8 = empresário em nome individual; 9 = condomínios/heranças/IRC)
  if (!'123568945'.includes(nif[0])) return false;
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += parseInt(nif[i], 10) * (9 - i);
  const remainder = sum % 11;
  const check = remainder < 2 ? 0 : 11 - remainder;
  return check === parseInt(nif[8], 10);
}

// GET /api/companies — public, returns all approved companies
// Supports: ?country=pt  ?q=search_text  ?sector=Construção
//   ?lat=&lng=&radius=km  → only companies within ~radius km (map viewport)
//   ?limit=&offset=        → pagination (limit capped at 500). All optional;
//   omitting them preserves the original "return everything" behaviour.
// Columns needed to draw pins, popups, run search/filters and dedup. Heavy
// detail-only fields (description, portfolio_images, business_hours,
// founded_year) are intentionally excluded — the detail panel fetches the
// full record via GET /api/companies/:id on demand.
const LIST_COLS = `
  id, name, sectors, sector, nif, cae, alvara, certidao_permanente,
  address, postal_code, city, country, zone,
  email, phone, website, facebook, instagram, linkedin, tags,
  lat, lng, rating, reviews, top_rated, verified, is_new, featured,
  emoji, color, pin_type, logo, status, created_by, created_at
`.trim();

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { country, q, sector, lat, lng, radius, limit, offset } = req.query;
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

    // Search term (kept out of `conditions` so we can swap the clause/order for
    // a legacy fallback if the search_doc column or similarity() aren't available
    // yet — see runList below). Both modes reference the same param, so `params`
    // is identical either way.
    let qIdx = null;
    if (q && q.trim()) {
      params.push(q.trim().slice(0, 80));
      qIdx = params.length;
    }

    // Optional geo filter: a bounding box around (lat,lng) sized to `radius` km.
    // Uses idx_companies_lat_lng. Lets the map fetch only what's near the user as
    // the catalogue grows, instead of the whole country on every load. Omitted →
    // unchanged behaviour (returns all matching companies).
    const la = parseFloat(lat), lo = parseFloat(lng), r = parseFloat(radius);
    if (Number.isFinite(la) && Number.isFinite(lo) && Number.isFinite(r) && r > 0) {
      const dLat = r / 111.0;
      const dLng = r / (111.0 * Math.max(0.1, Math.cos(la * Math.PI / 180)));
      params.push(la - dLat, la + dLat, lo - dLng, lo + dLng);
      const [a, b, c, d] = [params.length - 3, params.length - 2, params.length - 1, params.length];
      conditions.push(`lat BETWEEN $${a} AND $${b} AND lng BETWEEN $${c} AND $${d}`);
    }

    const baseWhere = 'WHERE ' + conditions.join(' AND ');

    // Optional pagination (capped at 500/page). Absent → no LIMIT, as before.
    let pageClause = '';
    const lim = parseInt(limit, 10);
    if (Number.isFinite(lim) && lim > 0) {
      params.push(Math.min(lim, 500));
      pageClause += ` LIMIT $${params.length}`;
      const off = parseInt(offset, 10);
      if (Number.isFinite(off) && off > 0) {
        params.push(off);
        pageClause += ` OFFSET $${params.length}`;
      }
    }

    // Build the search clause + ordering per mode:
    //   modern → indexed search_doc + pg_trgm fuzzy match, ranked by relevance
    //   legacy → original inline to_tsvector + ILIKE, newest first
    const p = qIdx ? `$${qIdx}` : null;
    const searchClause = (mode) => {
      if (!qIdx) return '';
      if (mode === 'legacy') {
        return ` AND (to_tsvector('portuguese', name || ' ' || COALESCE(description,'') || ' ' || array_to_string(tags,' ') || ' ' || COALESCE(cae,'') || ' ' || COALESCE(city,''))
                 @@ plainto_tsquery('portuguese', ${p}) OR name ILIKE '%' || ${p} || '%')`;
      }
      return ` AND (search_doc @@ plainto_tsquery('portuguese', ${p})
               OR name ILIKE '%' || ${p} || '%'
               OR similarity(name, ${p}) > 0.3)`;
    };
    const orderClause = (mode) =>
      (qIdx && mode === 'modern')
        ? `ORDER BY ts_rank(search_doc, plainto_tsquery('portuguese', ${p})) DESC, rating DESC, created_at DESC`
        : `ORDER BY created_at DESC`;
    const buildSql = (mode) =>
      `SELECT ${LIST_COLS} FROM companies ${baseWhere}${searchClause(mode)} ${orderClause(mode)}${pageClause}`;

    let rows;
    try {
      ({ rows } = await pool.query(buildSql('modern'), params));
    } catch (err) {
      // search_doc column / similarity() not present yet (e.g. a brand-new DB
      // whose migration is still settling). Fall back to the legacy full-text
      // query so search never hard-fails for the user.
      if (qIdx && (err.code === '42703' || err.code === '42883')) {
        console.warn('[companies] search using legacy fallback:', err.code);
        ({ rows } = await pool.query(buildSql('legacy'), params));
      } else {
        throw err;
      }
    }

    // Alvará and certidão permanente are private credentials — visible only to
    // authenticated users. Anonymous traffic gets them redacted, and only that
    // redacted response is ever edge-cached.
    if (req.user) {
      // Logged-in users (especially owners who just edited their listing) bypass
      // the edge cache entirely and always see fresh, credential-bearing data.
      res.set('Cache-Control', 'private, max-age=0, no-store');
    } else {
      for (const row of rows) {
        delete row.alvara;
        delete row.certidao_permanente;
      }
      res.set('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    }
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
// ── Moderation links (approve / reject) ───────────────────────────────────────
// The links in the admin notification email are GETs, and email clients /
// security scanners prefetch GET links — which used to approve or reject a
// company without anyone clicking. The GET now only renders a confirmation
// page; the actual state change happens on the POST behind the button, which
// a prefetch can never trigger.
function _checkAdminToken(req, res) {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken || req.query.token !== adminToken) {
    res.status(403).send(htmlPage('❌ Acesso negado', 'Token de administrador inválido.', '#dc2626'));
    return false;
  }
  return true;
}

function moderationConfirmPage(req, company, kind) {
  const isApprove = kind === 'approve';
  const color = isApprove ? '#16a34a' : '#dc2626';
  const action = `${req.baseUrl}/${company.id}/${kind}?token=${encodeURIComponent(req.query.token)}`;
  return htmlPage(
    isApprove ? 'Aprovar empresa?' : 'Rejeitar empresa?',
    `Confirma que pretende <strong>${isApprove ? 'aprovar' : 'rejeitar'}</strong> a empresa <strong>${escHtml(company.name)}</strong>?
     <form method="post" action="${action}" style="margin:22px 0 0">
       <button type="submit" style="background:${color};color:#fff;border:none;border-radius:8px;padding:14px 34px;font-size:16px;font-weight:700;cursor:pointer;font-family:inherit">
         ${isApprove ? '✅ Sim, aprovar' : '🚫 Sim, rejeitar'}
       </button>
     </form>`,
    color
  );
}

router.get('/:id/approve', async (req, res, next) => {
  try {
    if (!_checkAdminToken(req, res)) return;
    const { rows } = await pool.query(`SELECT id, name, status FROM companies WHERE id = $1`, [req.params.id]);
    if (!rows[0]) {
      return res.status(404).send(htmlPage('❌ Não encontrada', 'Empresa não encontrada na base de dados.', '#dc2626'));
    }
    if (rows[0].status === 'approved') {
      return res.send(htmlPage('✅ Já aprovada', `<strong>${escHtml(rows[0].name)}</strong> já está aprovada e visível na plataforma.`, '#16a34a'));
    }
    res.send(moderationConfirmPage(req, rows[0], 'approve'));
  } catch (e) {
    next(e);
  }
});

router.post('/:id/approve', async (req, res, next) => {
  try {
    if (!_checkAdminToken(req, res)) return;

    const { rows } = await pool.query(
      `UPDATE companies SET status = 'approved', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).send(htmlPage('❌ Não encontrada', 'Empresa não encontrada na base de dados.', '#dc2626'));
    }

    // Notify the company AFTER rendering the admin's confirmation page.
    deferEmail(() => sendCompanyApprovalEmail(rows[0]), `approval email (company ${rows[0].id})`);
    // Native push to the owner (best-effort, dormant unless FCM is set up).
    pushToUser(
      rows[0].created_by,
      'Empresa aprovada na Hivex',
      `${rows[0].name} já está visível na plataforma.`,
      { companyId: rows[0].id }
    ).catch(() => {});

    res.send(htmlPage(
      '✅ Empresa aprovada!',
      `<strong>${escHtml(rows[0].name)}</strong> foi aprovada e já está visível na plataforma Hivex.<br><br>Foi enviado um email de confirmação para <strong>${escHtml(rows[0].email || '(sem email)')}</strong>.`,
      '#16a34a'
    ));
  } catch (e) {
    next(e);
  }
});

// GET renders the confirmation page; POST performs the rejection.
router.get('/:id/reject', async (req, res, next) => {
  try {
    if (!_checkAdminToken(req, res)) return;
    const { rows } = await pool.query(`SELECT id, name, status FROM companies WHERE id = $1`, [req.params.id]);
    if (!rows[0]) {
      return res.status(404).send(htmlPage('❌ Não encontrada', 'Empresa não encontrada na base de dados.', '#dc2626'));
    }
    if (rows[0].status === 'rejected') {
      return res.send(htmlPage('🚫 Já rejeitada', `O registo de <strong>${escHtml(rows[0].name)}</strong> já tinha sido rejeitado.`, '#f97316'));
    }
    res.send(moderationConfirmPage(req, rows[0], 'reject'));
  } catch (e) {
    next(e);
  }
});

router.post('/:id/reject', async (req, res, next) => {
  try {
    if (!_checkAdminToken(req, res)) return;

    const { rows } = await pool.query(
      `UPDATE companies SET status = 'rejected', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).send(htmlPage('❌ Não encontrada', 'Empresa não encontrada na base de dados.', '#dc2626'));
    }

    // Notify the company AFTER rendering the admin's confirmation page.
    deferEmail(() => sendCompanyRejectionEmail(rows[0]), `rejection email (company ${rows[0].id})`);

    res.send(htmlPage(
      '🚫 Empresa rejeitada',
      `O registo de <strong>${escHtml(rows[0].name)}</strong> foi rejeitado e não será publicado na plataforma.`,
      '#f97316'
    ));
  } catch (e) {
    next(e);
  }
});

// GET /api/companies/check-nif?nif=XXXXXXXXX — real-time duplicate check used by
// the registration form so the user is warned before filling the whole form.
// Must be declared BEFORE '/:id' or Express would treat "check-nif" as an id.
router.get('/check-nif', requireAuth, async (req, res, next) => {
  try {
    const nif = String(req.query.nif || '').replace(/\s+/g, '');
    if (!/^\d{9}$/.test(nif)) return res.json({ exists: false });
    const { rows } = await pool.query('SELECT 1 FROM companies WHERE nif = $1 LIMIT 1', [nif]);
    res.json({ exists: rows.length > 0 });
  } catch (e) {
    next(e);
  }
});

// GET /api/companies/:id — public, only approved.
// Private credentials (certidão permanente, alvará) are redacted for anonymous
// visitors — any authenticated user can see them.
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM companies WHERE id = $1`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    const company = rows[0];
    // Non-public listings (pending/rejected/removed) are visible only to the
    // owner and admins — everyone else gets the same 404 as a missing id, so
    // the response doesn't leak that the listing exists.
    if (company.status !== 'approved') {
      if (!req.user) return res.status(404).json({ error: 'Empresa não encontrada' });
      if (company.created_by !== req.user.id) await ensureAdminFlag(req);
      if (!req.user.is_admin && company.created_by !== req.user.id) {
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }
    }
    if (!req.user) {
      delete company.certidao_permanente;
      delete company.alvara;
    }
    res.json(company);
  } catch (e) {
    next(e);
  }
});

// POST /api/companies — authenticated users submit a company; status starts as
// 'pending' so an admin must approve it (via the email Approve link or the
// Pending tab) before it goes live. The auth gate keeps anonymous bots out
// (we still also rate-limit at the app level).
// POST /api/companies/send-email-code — sends a 6-digit confirmation code to
// the COMPANY's contact email before registration (it can differ from the
// account email, so it's proven separately — user feedback). DB-backed
// throttle: max 5 codes per address per hour (serverless-safe).
router.post('/send-email-code', requireAuth, async (req, res, next) => {
  try {
    const email = String(req.body && req.body.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email inválido.' });
    }
    const recent = await pool.query(
      `SELECT COUNT(*)::int AS n FROM email_codes
        WHERE lower(email) = $1 AND created_at > NOW() - interval '1 hour'`, [email]);
    if (recent.rows[0].n >= 5) {
      return res.status(429).json({ error: 'Demasiados códigos pedidos para este email. Tente mais tarde.' });
    }
    const code = String(require('crypto').randomInt(100000, 1000000));
    await pool.query(
      `INSERT INTO email_codes (email, code, purpose, expires_at)
       VALUES ($1, $2, 'company_email', NOW() + interval '30 minutes')`, [email, code]);
    await sendBrandedEmail({
      to: email,
      subject: `${code} é o seu código Hivex`,
      title: 'Confirme o email da empresa',
      bodyHtml: `
        <p>Este endereço foi indicado como contacto de uma empresa em registo na Hivex.</p>
        <p>Código de confirmação:</p>
        <p style="font-size:32px;font-weight:800;letter-spacing:8px;text-align:center;margin:18px 0">${code}</p>
        <p style="color:#6b7280;font-size:13px">O código expira em 30 minutos. Se não estiver a registar uma empresa na Hivex, ignore este email.</p>`,
    });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const {
      name, sectors, sector, nif, cae, alvara, certidao_permanente,
      address, postal_code, city, country,
      zone, email, phone, website, facebook, instagram, linkedin, tags, description, lat, lng,
      emoji, color, pin_type, logo,
      founded_year, business_hours, portfolio_images,
      email_code,
    } = req.body;

    if (!name || lat == null || lng == null || isNaN(Number(lat)) || isNaN(Number(lng))) {
      return res.status(400).json({ error: 'name, lat e lng são obrigatórios' });
    }

    // The account email must be confirmed before registering a company, and the
    // company's own contact email needs a one-time code when it differs from
    // the (already confirmed) account email. Admins skip both.
    const { rows: meRows } = await pool.query(
      'SELECT email, email_verified, is_admin FROM users WHERE id = $1', [req.user.id]);
    const me = meRows[0] || {};
    if (!me.is_admin) {
      if (!me.email_verified) {
        return res.status(403).json({
          error: 'Confirme o email da sua conta antes de registar uma empresa.',
          code: 'EMAIL_NOT_VERIFIED',
        });
      }
      const companyEmail = String(email || '').trim().toLowerCase();
      if (companyEmail && companyEmail !== String(me.email || '').toLowerCase()) {
        const codeStr = String(email_code || '').trim();
        const okCode = /^\d{6}$/.test(codeStr) && (await pool.query(
          `SELECT id FROM email_codes
            WHERE lower(email) = $1 AND code = $2 AND purpose = 'company_email'
              AND expires_at > NOW()`, [companyEmail, codeStr])).rows.length > 0;
        if (!okCode) {
          return res.status(403).json({
            error: 'Confirme o email de contacto da empresa com o código enviado.',
            code: 'COMPANY_EMAIL_NOT_VERIFIED',
          });
        }
        // Single-use: burn every outstanding code for this address.
        await pool.query(`DELETE FROM email_codes WHERE lower(email) = $1`, [companyEmail]);
      }
    }
    // NIF (Portuguese tax ID) is mandatory for PT companies and is checksum-
    // validated. Foreign companies (country != 'pt') skip this check.
    const cc = (country || 'pt').toLowerCase();
    const nifClean = nif != null ? String(nif).replace(/\s+/g, '') : '';
    if (cc === 'pt') {
      if (!nifClean) return res.status(400).json({ error: 'NIF é obrigatório.' });
      if (!isValidPortugueseNIF(nifClean)) {
        return res.status(400).json({ error: 'NIF inválido. Verifique os 9 dígitos.' });
      }
    }
    // One company per NIF — give a clean 409 instead of letting the unique
    // index throw a raw constraint error (also catches double-submits).
    if (nifClean) {
      const dupe = await pool.query('SELECT id FROM companies WHERE nif = $1', [nifClean]);
      if (dupe.rows.length > 0) {
        return res.status(409).json({ error: 'Esta empresa já está registada (NIF duplicado).' });
      }
    }
    // Certidão Permanente is mandatory at registration to prove the company is
    // a real, registered Portuguese commercial entity.
    const certidao = certidao_permanente && String(certidao_permanente).trim();
    if (!certidao || certidao.replace(/[\s-]/g, '').length < 8) {
      return res.status(400).json({ error: 'Código da certidão permanente é obrigatório (mínimo 8 caracteres).' });
    }

    // Sanitise founded_year — keep only sensible 4-digit values
    const yr = founded_year != null ? parseInt(founded_year, 10) : null;
    const foundedSafe = (yr && yr >= 1800 && yr <= new Date().getFullYear()) ? yr : null;
    // Company logo — accept only a reasonably-sized inline image data URL.
    const logoSafe = (typeof logo === 'string' && /^data:image\//i.test(logo) && logo.length < 400000) ? logo : null;

    const { rows } = await pool.query(
      `INSERT INTO companies
        (name, sectors, sector, nif, cae, alvara, certidao_permanente,
         address, postal_code, city, country, zone,
         email, phone, website, facebook, instagram, linkedin, tags, description,
         founded_year, business_hours, portfolio_images,
         lat, lng, emoji, color, pin_type, logo,
         status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,'pending',$30)
       RETURNING *`,
      [
        name,
        sectors || (sector ? [sector] : []),
        sector || (sectors && sectors[0]) || null,
        nifClean || null,
        cae || null,
        alvara || null,
        certidao,
        address || null,
        postal_code || null,
        city || null,
        country || 'pt',
        zone || null,
        email || '',
        phone || '',
        website || null,
        facebook || null,
        instagram || null,
        linkedin || null,
        tags || [],
        description || null,
        foundedSafe,
        business_hours || null,
        Array.isArray(portfolio_images) ? portfolio_images.slice(0, 12) : [],
        lat,
        lng,
        emoji || '🏢',
        color || '#f97316',
        pin_type || 'std',
        logoSafe,
        req.user.id,   // requireAuth guarantees req.user
      ]
    );

    // Send the admin notification AFTER responding (see deferEmail) so the
    // applicant gets an instant confirmation instead of waiting on SMTP.
    deferEmail(() => sendRegistrationNotification(rows[0]), `registration notification (company ${rows[0].id})`);

    res.status(201).json(rows[0]);
  } catch (e) {
    // Unique-violation (concurrent double-submit of the same NIF that slipped past
    // the pre-check SELECT) → clean 409 instead of a generic 500.
    if (e && e.code === '23505') {
      return res.status(409).json({ error: 'Esta empresa já está registada (NIF duplicado).' });
    }
    next(e);
  }
});

// PUT /api/companies/:id — admin or company owner
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { rows: existing } = await pool.query('SELECT * FROM companies WHERE id = $1', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ error: 'Empresa não encontrada' });

    // Non-owner: the JWT's admin flag may predate a promotion — confirm in the DB
    if (existing[0].created_by !== req.user.id) await ensureAdminFlag(req);
    if (!req.user.is_admin && existing[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão para editar esta empresa' });
    }

    const {
      name, sectors, sector, cae, alvara, certidao_permanente,
      address, postal_code, city, country,
      zone, email, phone, website, facebook, instagram, linkedin, tags, description, lat, lng,
      emoji, color, pin_type, status, logo,
      founded_year, business_hours, portfolio_images,
    } = req.body;

    const yr = founded_year != null ? parseInt(founded_year, 10) : null;
    const foundedSafe = (yr && yr >= 1800 && yr <= new Date().getFullYear()) ? yr
                      : (founded_year === null ? null : undefined);
    const photosSafe = Array.isArray(portfolio_images) ? portfolio_images.slice(0, 12) : undefined;
    // Logo semantics: valid data URL → replace; '' → remove; null/absent/invalid → keep.
    // (This was missing entirely — editing a company silently dropped the
    // uploaded logo, so pre-existing companies could never gain one.)
    const logoSafe = (typeof logo === 'string' && (logo === '' || (/^data:image\//i.test(logo) && logo.length < 400000)))
      ? logo : null;

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
        founded_year = COALESCE($23, founded_year),
        business_hours = COALESCE($24, business_hours),
        portfolio_images = COALESCE($25, portfolio_images),
        facebook = COALESCE($26, facebook),
        instagram = COALESCE($27, instagram),
        linkedin = COALESCE($28, linkedin),
        logo = CASE WHEN $29::text IS NULL THEN logo WHEN $29 = '' THEN NULL ELSE $29 END,
        updated_at = NOW()
       WHERE id = $30
       RETURNING *`,
      [name, sectors, sector, cae, alvara, certidao_permanente,
       address, postal_code, city, country,
       zone, email, phone, website, tags, description, lat, lng,
       emoji, color, pin_type, status,
       foundedSafe, business_hours, photosSafe,
       facebook, instagram, linkedin,
       logoSafe,
       req.params.id]
    );
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// POST /api/companies/:id/contact — relay a message to the company (auth required)
// Guests may contact companies too (login was the biggest drop-off point in
// the contact funnel). Logged-in users keep the old flow; guests must supply
// a name + valid email. A honeypot field ("website") and a tight per-IP rate
// limit (see app.js) keep the spam surface small.
router.post('/:id/contact', optionalAuth, async (req, res, next) => {
  try {
    const { message, name, email, website } = req.body;
    // Honeypot: humans never see this field; bots autofill it. Pretend success.
    if (website && String(website).trim() !== '') return res.json({ ok: true });
    if (!message || message.trim().length < 10) {
      return res.status(400).json({ error: 'Mensagem demasiado curta (mínimo 10 caracteres)' });
    }

    let sender;
    if (req.user) {
      sender = { name: req.user.name, email: req.user.email };
    } else {
      const gName = (name || '').trim().slice(0, 120);
      const gEmail = (email || '').trim().slice(0, 254);
      if (!gName) return res.status(400).json({ error: 'Indique o seu nome' });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(gEmail)) {
        return res.status(400).json({ error: 'Indique um email válido para a empresa lhe responder' });
      }
      sender = { name: gName, email: gEmail };
    }

    const { rows } = await pool.query(
      `SELECT id, name, email, created_by FROM companies WHERE id = $1 AND status = 'approved'`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    if (!rows[0].email) return res.status(422).json({ error: 'Esta empresa não tem email configurado' });

    // Relay the message AFTER responding so the sender isn't blocked on SMTP.
    deferEmail(() => sendContactEmail(rows[0], sender, message.trim()), `contact relay (company ${rows[0].id})`);

    // Also persist to the in-app inbox so the owner sees the thread on-site.
    pool.query(
      `INSERT INTO messages (company_id, sender, client_user_id, client_name, client_email, body)
       VALUES ($1, 'client', $2, $3, $4, $5)`,
      [rows[0].id, req.user ? req.user.id : null, sender.name, sender.email, message.trim().slice(0, 4000)]
    ).catch(() => {});

    // Native push to the company owner (best-effort, dormant unless FCM is set up).
    pushToUser(
      rows[0].created_by,
      'Nova mensagem na Hivex',
      `${sender.name} contactou ${rows[0].name}`,
      { companyId: rows[0].id }
    ).catch(() => {});

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

// POST /api/companies/:id/report — flag a listing for review. Auth required so
// admins can follow up with the reporter, and to make spam-flagging traceable.
router.post('/:id/report', requireAuth, async (req, res, next) => {
  try {
    const { reason, details } = req.body;
    const allowed = ['inappropriate', 'fake', 'duplicate', 'wrong_info', 'spam', 'other'];
    if (!reason || !allowed.includes(String(reason))) {
      return res.status(400).json({ error: 'Motivo inválido.' });
    }
    const detailsTrim = (details || '').trim().slice(0, 500);
    const { rows: co } = await pool.query('SELECT id FROM companies WHERE id = $1', [req.params.id]);
    if (!co[0]) return res.status(404).json({ error: 'Empresa não encontrada' });

    await pool.query(
      `INSERT INTO reports (company_id, user_id, reason, details) VALUES ($1, $2, $3, $4)`,
      [req.params.id, req.user.id, reason, detailsTrim || null]
    );
    res.status(201).json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// POST /api/companies/:id/event — track analytics event (fire-and-forget, no auth required)
router.post('/:id/event', async (req, res, next) => {
  try {
    const { type } = req.body;
    const allowed = ['view', 'contact', 'website_click', 'whatsapp', 'streetview'];
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
    if (co[0].created_by !== req.user.id) await ensureAdminFlag(req);
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

// DELETE /api/companies/:id — admin only (soft delete after publication).
// Distinct from 'rejected' which means "we declined to publish at submit time".
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await pool.query(
      `UPDATE companies SET status = 'removed', removed_at = NOW(), updated_at = NOW() WHERE id = $1`,
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
function escHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function htmlPage(title, body, color = '#f97316') {
  return `<!DOCTYPE html><html lang="pt"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Hivex</title>
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
  <a href="/">Voltar ao Hivex</a>
</div></body></html>`;
}

module.exports = router;
