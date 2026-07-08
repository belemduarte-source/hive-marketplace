// Marketplace v2 routes: claim a listing, structured quote requests (RFQ),
// in-app inbox threads, and feature-me requests. Mounted at /api.
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../db');
const { requireAuth, optionalAuth, ensureAdminFlag } = require('../middleware/auth');
const { sendBrandedEmail, esc } = require('../email');

// Same "respond first, email after" pattern used by the contact relay.
function deferEmail(makePromise, label) {
  const task = Promise.resolve()
    .then(makePromise)
    .then(() => console.log(`[email] ${label} sent`))
    .catch(err => console.error(`[email] ${label} failed:`, err && (err.message || err)));
  try {
    const ctxStore = globalThis[Symbol.for('@vercel/request-context')];
    const ctx = ctxStore && typeof ctxStore.get === 'function' ? ctxStore.get() : null;
    if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(task);
  } catch (_) {}
  return task;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ── CHAT: anexos + retenção ───────────────────────────────────────────────────
// Documentos aceites no chat (máx. 3 por mensagem, 2 MB cada, base64 inline).
const CHAT_FILE_MIMES = new Set([
  'application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);
const CHAT_MAX_FILES = 3;
const CHAT_MAX_BYTES = 2 * 1024 * 1024;               // 2 MB por ficheiro
const CHAT_MAX_B64 = Math.ceil(CHAT_MAX_BYTES * 4 / 3) + 8;

// Valida e normaliza os anexos do corpo do pedido; devolve [] ou lança 400.
function validateChatFiles(files) {
  if (!files) return [];
  if (!Array.isArray(files) || files.length > CHAT_MAX_FILES) {
    const err = new Error(`Máximo ${CHAT_MAX_FILES} documentos por mensagem.`);
    err.status = 400; throw err;
  }
  return files.map(f => {
    const name = String(f && f.name || '').replace(/[\\/<>:"|?*\x00-\x1f]/g, '').trim().slice(0, 120);
    const mime = String(f && f.mime || '').toLowerCase();
    const data = String(f && f.data || '');
    if (!name || !CHAT_FILE_MIMES.has(mime) || !data || data.length > CHAT_MAX_B64 ||
        !/^[A-Za-z0-9+/=]+$/.test(data)) {
      const err = new Error('Documento inválido (tipos aceites: PDF, imagem, Word, Excel, TXT · máx. 2 MB).');
      err.status = 400; throw err;
    }
    return { name, mime, size: Math.floor(data.length * 3 / 4), data };
  });
}

async function saveChatFiles(messageId, files) {
  for (const f of files) {
    await pool.query(
      `INSERT INTO message_files (message_id, filename, mime, size_bytes, data)
       VALUES ($1, $2, $3, $4, $5)`,
      [messageId, f.name, f.mime, f.size, f.data]
    );
  }
}

// Retenção: conversas e documentos são guardados 90 dias. Corre de forma
// oportunista nas leituras (fire-and-forget) e via cron diário — assim a
// promessa mantém-se mesmo que o cron não esteja configurado.
function purgeExpiredMessages() {
  return pool.query(`DELETE FROM messages WHERE created_at < NOW() - interval '90 days'`)
    .then(r => { if (r.rowCount) console.log(`[chat] retenção: ${r.rowCount} mensagens purgadas (90 dias)`); })
    .catch(err => console.error('[chat] purga falhou:', err.message));
}

// Junta a metainformação dos anexos (sem os bytes) a uma lista de mensagens.
async function attachFileMeta(rows) {
  if (!rows.length) return rows;
  const ids = rows.map(r => r.id);
  const { rows: files } = await pool.query(
    `SELECT id, message_id, filename, mime, size_bytes
       FROM message_files WHERE message_id = ANY($1)`, [ids]);
  const byMsg = new Map();
  files.forEach(f => {
    if (!byMsg.has(f.message_id)) byMsg.set(f.message_id, []);
    byMsg.get(f.message_id).push({ id: f.id, name: f.filename, mime: f.mime, size: f.size_bytes });
  });
  rows.forEach(r => { r.files = byMsg.get(r.id) || []; });
  return rows;
}

// Haversine (km) — for picking the nearest matching companies for an RFQ.
function distKm(lat1, lng1, lat2, lng2) {
  const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// ── CLAIM A LISTING ───────────────────────────────────────────────────────────
// POST /api/claims/:companyId — logged-in user asks for a 6-digit code, sent
// to the company's PUBLIC email (proof of control). 30-minute validity.
router.post('/claims/:companyId', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, email, created_by FROM companies WHERE id = $1 AND status = 'approved'`,
      [req.params.companyId]
    );
    const co = rows[0];
    if (!co) return res.status(404).json({ error: 'Empresa não encontrada' });
    if (!co.email) return res.status(422).json({ error: 'Esta ficha não tem email público — contacte o suporte.' });
    // Listings already claimed by a real (non-platform) owner can't be re-claimed.
    await ensureAdminFlag(req);
    const platformOwned = co.created_by == null || String(co.created_by) === '7';
    if (!platformOwned && String(co.created_by) !== String(req.user.id) && !req.user.is_admin) {
      return res.status(409).json({ error: 'Esta ficha já foi reclamada pelo proprietário. Se é um erro, contacte o suporte.' });
    }

    const code = String(crypto.randomInt(100000, 1000000));
    await pool.query(`DELETE FROM claims WHERE company_id = $1 AND user_id = $2 AND verified_at IS NULL`, [co.id, req.user.id]);
    await pool.query(
      `INSERT INTO claims (company_id, user_id, code, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '30 minutes')`,
      [co.id, req.user.id, code]
    );

    deferEmail(() => sendBrandedEmail({
      to: co.email,
      subject: `[Hivex] Código para reclamar a ficha de ${co.name}`,
      title: 'Hivex — Reclamar ficha de empresa',
      bodyHtml: `
        <p>Alguém (<strong>${esc(req.user.name || '')}</strong>, ${esc(req.user.email || '')}) pediu para reclamar a gestão da ficha de <strong>${esc(co.name)}</strong> no Hivex Marketplace.</p>
        <p>Se foi você, introduza este código na página da empresa (válido 30 minutos):</p>
        <div style="text-align:center;margin:26px 0"><span style="display:inline-block;background:#fff7ed;border:2px dashed #f97316;border-radius:10px;padding:14px 34px;font-size:30px;font-weight:800;letter-spacing:6px;color:#9a3412">${code}</span></div>
        <p style="color:#6b7280;font-size:13px">Se não reconhece este pedido, ignore este email — nada será alterado. Reclamar a ficha dá acesso a: editar os dados, responder a avaliações e ver estatísticas de visitas e contactos.</p>`,
    }), `claim code (company ${co.id})`);

    const masked = co.email.replace(/^(.).*(@.*)$/, '$1***$2');
    res.json({ ok: true, sentTo: masked });
  } catch (e) { next(e); }
});

// POST /api/claims/verify — { companyId, code } → transfers ownership.
router.post('/claims/verify', requireAuth, async (req, res, next) => {
  try {
    const { companyId, code } = req.body || {};
    const { rows } = await pool.query(
      `SELECT id FROM claims
        WHERE company_id = $1 AND user_id = $2 AND code = $3
          AND verified_at IS NULL AND expires_at > NOW()
        ORDER BY created_at DESC LIMIT 1`,
      [companyId, req.user.id, String(code || '').trim()]
    );
    if (!rows[0]) return res.status(400).json({ error: 'Código inválido ou expirado. Peça um novo código.' });
    await pool.query(`UPDATE claims SET verified_at = NOW() WHERE id = $1`, [rows[0].id]);
    await pool.query(`UPDATE companies SET created_by = $1, updated_at = NOW() WHERE id = $2`, [req.user.id, companyId]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ── QUOTE REQUESTS (RFQ) ──────────────────────────────────────────────────────
// POST /api/quote-requests — guest-friendly (name+email) or logged in.
// Broadcasts to the nearest matching companies (same sector, ≤10 companies).
router.post('/quote-requests', optionalAuth, async (req, res, next) => {
  try {
    const b = req.body || {};
    if (b.website) return res.json({ ok: true, notified: 0 }); // honeypot
    const name  = (req.user ? req.user.name  : (b.name  || '')).trim().slice(0, 120);
    const email = (req.user ? req.user.email : (b.email || '')).trim().slice(0, 254);
    const phone = (b.phone || '').trim().slice(0, 40) || null;
    const sector = String(b.sector || '').slice(0, 60);
    const description = (b.description || '').trim().slice(0, 2000);
    const city = (b.city || '').trim().slice(0, 120) || null;
    const lat = Number(b.lat), lng = Number(b.lng);
    const timeline = (b.timeline || '').slice(0, 40) || null;
    const budget = (b.budget_range || '').slice(0, 40) || null;

    if (!name) return res.status(400).json({ error: 'Indique o seu nome' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Indique um email válido' });
    if (!sector) return res.status(400).json({ error: 'Escolha a área de atividade' });
    if (description.length < 20) return res.status(400).json({ error: 'Descreva o trabalho com mais detalhe (mínimo 20 caracteres)' });

    const { rows: reqRows } = await pool.query(
      `INSERT INTO quote_requests (client_user_id, client_name, client_email, client_phone, sector, description, city, lat, lng, timeline, budget_range)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [req.user ? req.user.id : null, name, email, phone, sector, description, city,
       Number.isFinite(lat) ? lat : null, Number.isFinite(lng) ? lng : null, timeline, budget]
    );
    const requestId = reqRows[0].id;

    // Matching companies: sector (primary or in sectors[]), approved, with email.
    const { rows: matches } = await pool.query(
      `SELECT id, name, email, lat, lng FROM companies
        WHERE status = 'approved' AND email IS NOT NULL AND email <> ''
          AND ($1 = sector OR $1 = ANY(sectors))`,
      [sector]
    );
    // Nearest first when we have coordinates; cap the blast radius at 10.
    let picked = matches;
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      picked = matches
        .map(c => ({ ...c, d: distKm(lat, lng, Number(c.lat), Number(c.lng)) }))
        .sort((a, b) => a.d - b.d);
    }
    picked = picked.slice(0, 10);

    const budgetLabel = budget || 'a definir';
    const timelineLabel = timeline || 'a definir';
    for (const co of picked) {
      deferEmail(() => sendBrandedEmail({
        to: co.email,
        replyTo: email,
        subject: `[Hivex] Novo pedido de orçamento${city ? ' em ' + city : ''} — ${name}`,
        title: 'Hivex — Novo pedido de orçamento',
        bodyHtml: `
          <p>A empresa <strong>${esc(co.name)}</strong> recebeu um novo pedido de orçamento através do Hivex Marketplace:</p>
          <table style="width:100%;border-collapse:collapse;margin:14px 0">
            <tr style="background:#f9fafb"><td style="padding:9px 13px;font-weight:700;border:1px solid #e5e7eb;width:32%">Cliente</td><td style="padding:9px 13px;border:1px solid #e5e7eb">${esc(name)}${phone ? ' · ' + esc(phone) : ''}</td></tr>
            <tr><td style="padding:9px 13px;font-weight:700;border:1px solid #e5e7eb">Local</td><td style="padding:9px 13px;border:1px solid #e5e7eb">${esc(city || '—')}</td></tr>
            <tr style="background:#f9fafb"><td style="padding:9px 13px;font-weight:700;border:1px solid #e5e7eb">Prazo desejado</td><td style="padding:9px 13px;border:1px solid #e5e7eb">${esc(timelineLabel)}</td></tr>
            <tr><td style="padding:9px 13px;font-weight:700;border:1px solid #e5e7eb">Orçamento indicativo</td><td style="padding:9px 13px;border:1px solid #e5e7eb">${esc(budgetLabel)}</td></tr>
          </table>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;margin-bottom:18px"><p style="margin:0;white-space:pre-wrap">${esc(description)}</p></div>
          <p><strong>Responda diretamente a este email</strong> para enviar a sua proposta ao cliente (${esc(email)}).</p>`,
      }), `RFQ ${requestId} → company ${co.id}`);
    }

    await pool.query(`UPDATE quote_requests SET notified_count = $1 WHERE id = $2`, [picked.length, requestId]);

    // Confirmation to the client.
    deferEmail(() => sendBrandedEmail({
      to: email,
      subject: '[Hivex] O seu pedido de orçamento foi enviado',
      title: 'Hivex — Pedido de orçamento enviado',
      bodyHtml: `
        <p>Olá ${esc(name)},</p>
        <p>O seu pedido de orçamento foi enviado a <strong>${picked.length} empresa${picked.length === 1 ? '' : 's'}</strong> da área ${city ? 'de ' + esc(city) : 'indicada'}. As propostas chegarão diretamente ao seu email.</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px"><p style="margin:0;white-space:pre-wrap">${esc(description)}</p></div>`,
    }), `RFQ ${requestId} confirmation`);

    res.status(201).json({ ok: true, notified: picked.length });
  } catch (e) { next(e); }
});

// ── CHAT (empresa ↔ cliente, com documentos; retenção 90 dias) ────────────────
// GET /api/messages/company/:companyId — owner/admin reads the company inbox.
router.get('/messages/company/:companyId', requireAuth, async (req, res, next) => {
  try {
    purgeExpiredMessages();
    const { rows: co } = await pool.query(`SELECT id, created_by FROM companies WHERE id = $1`, [req.params.companyId]);
    if (!co[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    if (co[0].created_by !== req.user.id) await ensureAdminFlag(req);
    if (!req.user.is_admin && co[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão' });
    }
    const { rows } = await pool.query(
      `SELECT id, sender, client_name, client_email, body, read_at, created_at
         FROM messages WHERE company_id = $1 ORDER BY created_at DESC LIMIT 200`,
      [req.params.companyId]
    );
    await attachFileMeta(rows);
    // Mark client messages as read once the owner opens the inbox.
    pool.query(`UPDATE messages SET read_at = NOW() WHERE company_id = $1 AND sender = 'client' AND read_at IS NULL`, [req.params.companyId]).catch(() => {});
    res.json(rows);
  } catch (e) { next(e); }
});

// POST /api/messages/company/:companyId/reply — owner replies to a client
// (stored in the thread + optional documents + relayed by email).
router.post('/messages/company/:companyId/reply', requireAuth, async (req, res, next) => {
  try {
    const { clientEmail, body } = req.body || {};
    const files = validateChatFiles(req.body && req.body.files);
    const text = (body || '').trim();
    if (!EMAIL_RE.test(clientEmail || '')) return res.status(400).json({ error: 'Cliente inválido' });
    if (text.length < 2 && !files.length) return res.status(400).json({ error: 'Mensagem vazia' });
    const { rows: co } = await pool.query(`SELECT id, name, email, created_by FROM companies WHERE id = $1`, [req.params.companyId]);
    if (!co[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    if (co[0].created_by !== req.user.id) await ensureAdminFlag(req);
    if (!req.user.is_admin && co[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão' });
    }
    const { rows: ins } = await pool.query(
      `INSERT INTO messages (company_id, sender, client_email, client_name, body) VALUES ($1, 'company', $2, NULL, $3) RETURNING id`,
      [co[0].id, clientEmail, text.slice(0, 4000)]
    );
    await saveChatFiles(ins[0].id, files);
    deferEmail(() => sendBrandedEmail({
      to: clientEmail,
      replyTo: co[0].email || undefined,
      subject: `[Hivex] Resposta de ${co[0].name}`,
      title: `Hivex — ${co[0].name} respondeu`,
      bodyHtml: `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px"><p style="margin:0;white-space:pre-wrap">${esc(text)}</p></div>
        ${files.length ? `<p style="margin-top:12px;color:#374151">📎 ${files.length} documento(s) anexado(s) — abra a conversa em hivex.pt para transferir.</p>` : ''}
        <p style="margin-top:16px">Pode responder diretamente a este email ou na sua área de mensagens em hivex.pt.</p>`,
    }), `inbox reply (company ${co[0].id})`);
    res.status(201).json({ ok: true, id: ins[0].id });
  } catch (e) { next(e); }
});

// POST /api/messages/company/:companyId/client — logged-in CLIENT writes to a
// company thread (identity = the session's email; documents optional).
router.post('/messages/company/:companyId/client', requireAuth, async (req, res, next) => {
  try {
    const files = validateChatFiles(req.body && req.body.files);
    const text = String(req.body && req.body.body || '').trim();
    if (text.length < 2 && !files.length) return res.status(400).json({ error: 'Mensagem vazia' });
    const { rows: me } = await pool.query(`SELECT id, name, email FROM users WHERE id = $1`, [req.user.id]);
    if (!me[0]) return res.status(401).json({ error: 'Sessão inválida' });
    const { rows: co } = await pool.query(
      `SELECT id, name, email FROM companies WHERE id = $1 AND status = 'approved'`, [req.params.companyId]);
    if (!co[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    // Throttle leve, resistente a serverless: máx. 60 mensagens/dia por conta.
    const { rows: cnt } = await pool.query(
      `SELECT COUNT(*)::int AS n FROM messages
        WHERE sender = 'client' AND lower(client_email) = lower($1)
          AND created_at > NOW() - interval '24 hours'`, [me[0].email]);
    if (cnt[0].n >= 60) return res.status(429).json({ error: 'Limite diário de mensagens atingido.' });
    const { rows: ins } = await pool.query(
      `INSERT INTO messages (company_id, sender, client_user_id, client_name, client_email, body)
       VALUES ($1, 'client', $2, $3, $4, $5) RETURNING id`,
      [co[0].id, me[0].id, me[0].name || null, me[0].email, text.slice(0, 4000)]
    );
    await saveChatFiles(ins[0].id, files);
    if (co[0].email) {
      deferEmail(() => sendBrandedEmail({
        to: co[0].email,
        replyTo: me[0].email,
        subject: `[Hivex] Nova mensagem de ${me[0].name || me[0].email}`,
        title: `Hivex — nova mensagem para ${co[0].name}`,
        bodyHtml: `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px"><p style="margin:0;white-space:pre-wrap">${esc(text)}</p></div>
          ${files.length ? `<p style="margin-top:12px;color:#374151">📎 ${files.length} documento(s) anexado(s) — abra a conversa em hivex.pt para transferir.</p>` : ''}
          <p style="margin-top:16px">Responda na sua área de mensagens em hivex.pt (ou diretamente a este email).</p>`,
      }), `chat client msg (company ${co[0].id})`);
    }
    res.status(201).json({ ok: true, id: ins[0].id });
  } catch (e) { next(e); }
});

// GET /api/messages/mine — conversas do CLIENTE com sessão iniciada.
router.get('/messages/mine', requireAuth, async (req, res, next) => {
  try {
    purgeExpiredMessages();
    const { rows: me } = await pool.query(`SELECT email FROM users WHERE id = $1`, [req.user.id]);
    if (!me[0]) return res.status(401).json({ error: 'Sessão inválida' });
    const { rows } = await pool.query(
      `SELECT m.company_id,
              MAX(c.name)  AS company_name,
              MAX(c.emoji) AS company_emoji,
              MAX(m.created_at) AS last_at,
              (ARRAY_AGG(m.body ORDER BY m.created_at DESC))[1] AS last_body,
              COUNT(*) FILTER (WHERE m.sender = 'company' AND m.read_at IS NULL)::int AS unread
         FROM messages m JOIN companies c ON c.id = m.company_id
        WHERE lower(m.client_email) = lower($1)
        GROUP BY m.company_id
        ORDER BY MAX(m.created_at) DESC
        LIMIT 100`, [me[0].email]);
    res.json(rows);
  } catch (e) { next(e); }
});

// GET /api/messages/thread/:companyId — a conversa do cliente com uma empresa.
router.get('/messages/thread/:companyId', requireAuth, async (req, res, next) => {
  try {
    purgeExpiredMessages();
    const { rows: me } = await pool.query(`SELECT email FROM users WHERE id = $1`, [req.user.id]);
    if (!me[0]) return res.status(401).json({ error: 'Sessão inválida' });
    const { rows } = await pool.query(
      `SELECT id, sender, client_name, body, read_at, created_at
         FROM messages
        WHERE company_id = $1 AND lower(client_email) = lower($2)
        ORDER BY created_at ASC LIMIT 200`,
      [req.params.companyId, me[0].email]);
    await attachFileMeta(rows);
    pool.query(
      `UPDATE messages SET read_at = NOW()
        WHERE company_id = $1 AND lower(client_email) = lower($2)
          AND sender = 'company' AND read_at IS NULL`,
      [req.params.companyId, me[0].email]).catch(() => {});
    res.json(rows);
  } catch (e) { next(e); }
});

// GET /api/messages/file/:fileId — download de um documento (só participantes).
router.get('/messages/file/:fileId', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT mf.filename, mf.mime, mf.data, m.client_email, c.created_by
         FROM message_files mf
         JOIN messages m ON m.id = mf.message_id
         JOIN companies c ON c.id = m.company_id
        WHERE mf.id = $1`, [req.params.fileId]);
    const f = rows[0];
    if (!f) return res.status(404).json({ error: 'Documento não encontrado (a retenção é de 90 dias).' });
    const { rows: me } = await pool.query(`SELECT email, is_admin FROM users WHERE id = $1`, [req.user.id]);
    const isClient = me[0] && me[0].email && f.client_email &&
      me[0].email.toLowerCase() === f.client_email.toLowerCase();
    const isOwner = String(f.created_by) === String(req.user.id);
    if (!isClient && !isOwner && !(me[0] && me[0].is_admin)) {
      return res.status(403).json({ error: 'Sem permissão' });
    }
    res.json({ filename: f.filename, mime: f.mime, data: f.data });
  } catch (e) { next(e); }
});

// GET /api/messages/purge — alvo do cron diário do Vercel (retenção 90 dias).
// Aceita apenas invocações do próprio cron (header) ou com o CRON_SECRET.
router.get('/messages/purge', async (req, res) => {
  const secret = process.env.CRON_SECRET;
  const fromCron = !!req.headers['x-vercel-cron'];
  const authed = secret && req.headers.authorization === `Bearer ${secret}`;
  if (!fromCron && !authed) return res.status(401).json({ error: 'unauthorized' });
  await purgeExpiredMessages();
  res.json({ ok: true });
});

// GET /api/messages/unread-count?companyId= — badge for the owner UI.
router.get('/messages/unread-count', requireAuth, async (req, res, next) => {
  try {
    const { rows: co } = await pool.query(`SELECT id, created_by FROM companies WHERE id = $1`, [req.query.companyId]);
    if (!co[0]) return res.json({ count: 0 });
    if (co[0].created_by !== req.user.id) await ensureAdminFlag(req);
    if (!req.user.is_admin && co[0].created_by !== req.user.id) return res.json({ count: 0 });
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS n FROM messages WHERE company_id = $1 AND sender = 'client' AND read_at IS NULL`,
      [req.query.companyId]
    );
    res.json({ count: rows[0].n });
  } catch (e) { next(e); }
});

// ── FEATURE REQUESTS ──────────────────────────────────────────────────────────
// POST /api/feature-requests — owner asks the admin to feature their listing.
router.post('/feature-requests', requireAuth, async (req, res, next) => {
  try {
    const { companyId } = req.body || {};
    const { rows: co } = await pool.query(`SELECT id, name, featured, created_by FROM companies WHERE id = $1`, [companyId]);
    if (!co[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    if (co[0].created_by !== req.user.id) await ensureAdminFlag(req);
    if (!req.user.is_admin && co[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Apenas o dono da ficha pode pedir destaque' });
    }
    if (co[0].featured) return res.status(409).json({ error: 'Esta empresa já está em destaque' });
    const dup = await pool.query(`SELECT 1 FROM feature_requests WHERE company_id = $1 AND status = 'pending'`, [companyId]);
    if (dup.rows[0]) return res.status(409).json({ error: 'Já existe um pedido de destaque pendente' });
    await pool.query(`INSERT INTO feature_requests (company_id, user_id) VALUES ($1, $2)`, [companyId, req.user.id]);
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminEmail) {
      deferEmail(() => sendBrandedEmail({
        to: adminEmail,
        subject: `[Hivex] Pedido de destaque: ${co[0].name}`,
        title: 'Hivex — Pedido de destaque',
        bodyHtml: `<p><strong>${esc(co[0].name)}</strong> (pedido por ${esc(req.user.name || '')}, ${esc(req.user.email || '')}) pediu para ficar em destaque.</p>
          <p>Aprove no Painel de Administração → Todas → "Destacar".</p>`,
      }), `feature request (company ${companyId})`);
    }
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

module.exports = router;
