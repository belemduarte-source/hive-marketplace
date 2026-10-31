// Marketplace v2 routes: claim a listing, structured quote requests (RFQ),
// in-app inbox threads, and feature-me requests. Mounted at /api.
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const pool = require('../db');
const { requireAuth, optionalAuth, ensureAdminFlag } = require('../middleware/auth');
const { sendBrandedEmail, esc, companyReplyCtaHtml } = require('../email');
const { pushToUser, getVapid } = require('../push');

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

// ── CLAIM A LISTING ───────────────────────────────────────────────────────────
// POST /api/claims/:companyId — logged-in user asks for a 6-digit code, sent
// to the company's PUBLIC email (proof of control). 30-minute validity.
router.post('/claims/:companyId', requireAuth, async (req, res, next) => {
  // '/claims/verify' (declarada mais abaixo) também casa com este padrão — sem
  // isto o "verify" chegava aqui como id e a consulta rebentava (500): o claim
  // com sessão nunca chegava a confirmar.
  if (!/^\d+$/.test(String(req.params.companyId))) return next('route');
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

// ── RECLAMAR SEM CONTA ────────────────────────────────────────────────────────
// O código enviado ao email PÚBLICO da empresa é a prova de controlo — a mesma
// do fluxo com sessão. Para quem ainda não tem conta, essa prova serve também
// de entrada: ao confirmar, entra na conta desse email (criada se não existir)
// e a ficha fica sua — sem registo nem palavra-passe. Só para fichas ainda
// sem dono (importadas pela plataforma).
const _ownerPlataforma = (co) => co.created_by == null || String(co.created_by) === '7';

router.post('/claims/:companyId/guest', async (req, res, next) => {
  try {
    if (!/^\d+$/.test(String(req.params.companyId))) return res.status(404).json({ error: 'Empresa não encontrada' });
    const { rows } = await pool.query(
      `SELECT id, name, email, created_by FROM companies WHERE id = $1 AND status = 'approved'`,
      [req.params.companyId]);
    const co = rows[0];
    if (!co) return res.status(404).json({ error: 'Empresa não encontrada' });
    if (!co.email) return res.status(422).json({ error: 'Esta ficha não tem email público — contacte o suporte.' });
    if (!_ownerPlataforma(co)) {
      return res.status(409).json({ error: 'Esta ficha já tem gestor. Se é o proprietário, entre na sua conta.', code: 'ALREADY_CLAIMED' });
    }
    // 1 código por minuto por empresa (protege a caixa da empresa de rajadas)
    const { rows: rec } = await pool.query(
      `SELECT 1 FROM claims WHERE company_id = $1 AND user_id IS NULL
          AND created_at > NOW() - INTERVAL '60 seconds' LIMIT 1`, [co.id]);
    if (rec[0]) return res.status(429).json({ error: 'Acabámos de enviar um código — aguarde um minuto.' });

    const code = String(crypto.randomInt(100000, 1000000));
    await pool.query(`DELETE FROM claims WHERE company_id = $1 AND user_id IS NULL AND verified_at IS NULL`, [co.id]);
    await pool.query(
      `INSERT INTO claims (company_id, user_id, code, expires_at) VALUES ($1, NULL, $2, NOW() + INTERVAL '30 minutes')`,
      [co.id, code]);
    deferEmail(() => sendBrandedEmail({
      to: co.email,
      subject: `[Hivex] Código para gerir a ficha de ${co.name}`,
      title: 'Hivex — Gerir a ficha da sua empresa',
      bodyHtml: `
        <p>Pediram para gerir a ficha de <strong>${esc(co.name)}</strong> na Hivex.</p>
        <p>Se foi você, introduza este código na página da empresa (válido 30 minutos). Ao confirmar, entra automaticamente na Hivex com este email — não precisa de criar conta nem palavra-passe.</p>
        <div style="text-align:center;margin:26px 0"><span style="display:inline-block;background:#fff7ed;border:2px dashed #f97316;border-radius:10px;padding:14px 34px;font-size:30px;font-weight:800;letter-spacing:6px;color:#9a3412">${code}</span></div>
        <p style="color:#6b7280;font-size:13px">Se não reconhece este pedido, ignore este email — nada será alterado. Gerir a ficha permite editar os dados, responder a avaliações e ver estatísticas.</p>`,
    }), `guest claim code (company ${co.id})`);
    const masked = co.email.replace(/^(.).*(@.*)$/, '$1***$2');
    res.json({ ok: true, sentTo: masked });
  } catch (e) { next(e); }
});

router.post('/claims/:companyId/guest/verify', async (req, res, next) => {
  try {
    const companyId = Number(req.params.companyId);
    const code = String((req.body && req.body.code) || '').replace(/\D/g, '');
    if (!Number.isFinite(companyId) || code.length !== 6) {
      return res.status(400).json({ error: 'Introduza o código de 6 dígitos.' });
    }
    const { rows } = await pool.query(
      `SELECT id, code, attempts FROM claims
        WHERE company_id = $1 AND user_id IS NULL AND verified_at IS NULL AND expires_at > NOW()
        ORDER BY created_at DESC LIMIT 1`, [companyId]);
    const cl = rows[0];
    if (!cl) return res.status(400).json({ error: 'O código expirou. Peça um novo.' });
    if (cl.attempts >= 5) {
      await pool.query(`DELETE FROM claims WHERE id = $1`, [cl.id]);
      return res.status(429).json({ error: 'Demasiadas tentativas. Peça um novo código.' });
    }
    const certo = String(cl.code).length === code.length &&
      crypto.timingSafeEqual(Buffer.from(String(cl.code)), Buffer.from(code));
    if (!certo) {
      await pool.query(`UPDATE claims SET attempts = attempts + 1 WHERE id = $1`, [cl.id]);
      return res.status(400).json({ error: 'Código errado. Confirme o código no email da empresa.' });
    }
    const { rows: cos } = await pool.query(
      `SELECT id, name, email, created_by FROM companies WHERE id = $1 AND status = 'approved'`, [companyId]);
    const co = cos[0];
    if (!co || !co.email) return res.status(404).json({ error: 'Empresa não encontrada' });
    if (!_ownerPlataforma(co)) {
      return res.status(409).json({ error: 'Esta ficha já tem gestor.', code: 'ALREADY_CLAIMED' });
    }
    const email = String(co.email).trim().toLowerCase();
    const { rows: us } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = us[0];
    if (!user) {
      const { rows: created } = await pool.query(
        `INSERT INTO users (name, email, email_verified) VALUES ($1, $2, TRUE)
         ON CONFLICT (email) DO UPDATE SET email_verified = TRUE RETURNING *`,
        [String(co.name || 'Empresa').slice(0, 80), email]);
      user = created[0];
    } else if (!user.email_verified) {
      const { rows: v } = await pool.query(
        `UPDATE users SET email_verified = TRUE WHERE id = $1 RETURNING *`, [user.id]);
      user = v[0] || user;
    }
    await pool.query(`UPDATE claims SET verified_at = NOW(), user_id = $2 WHERE id = $1`, [cl.id, user.id]);
    await pool.query(`UPDATE companies SET created_by = $1, updated_at = NOW() WHERE id = $2`, [user.id, companyId]);
    const { issueSession } = require('./auth');
    res.json({ ok: true, ...(await issueSession(req, res, user)) });
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

    // Destinatários: a mesma regra dos convites dos concursos (decisão do dono,
    // 2026-10-30) — fichas geridas pela própria empresa ou empresas PT com NIF
    // de pessoa coletiva, nunca quem recusou emails (email_optouts). As 10 mais
    // próximas quando há coordenadas; um só email por endereço.
    const { SQL_CONVIDAVEL } = require('./tenders');
    const temPonto = Number.isFinite(lat) && Number.isFinite(lng);
    const { rows: matches } = await pool.query(
      `SELECT c.id, c.name, lower(trim(c.email)) AS email, c.created_by
         FROM companies c
        WHERE c.status = 'approved' AND coalesce(trim(c.email), '') <> ''
          AND ($1 = c.sector OR $1 = ANY(c.sectors))
          AND NOT EXISTS (SELECT 1 FROM email_optouts o WHERE o.email = lower(trim(c.email)))
          AND ${SQL_CONVIDAVEL}
        ORDER BY (c.lat IS NULL OR c.lng IS NULL),
                 power(c.lat - $2::float8, 2) + power((c.lng - $3::float8) * cos(radians($2::float8)), 2),
                 c.id
        LIMIT 40`,
      [sector, temPonto ? lat : null, temPonto ? lng : null]
    );
    const vistos = new Set();
    const picked = [];
    for (const c of matches) {
      if (!EMAIL_RE.test(c.email) || vistos.has(c.email)) continue;
      vistos.add(c.email);
      picked.push(c);
      if (picked.length >= 10) break;
    }
    if (picked.length) {
      await pool.query(
        `INSERT INTO quote_request_recipients (request_id, company_id, email)
         SELECT $1, unnest($2::bigint[]), unnest($3::text[]) ON CONFLICT DO NOTHING`,
        [requestId, picked.map(c => c.id), picked.map(c => c.email)]);
    }

    const budgetLabel = budget || 'a definir';
    const timelineLabel = timeline || 'a definir';
    for (const co of picked) {
      const reclamada = co.created_by != null && Number(co.created_by) !== 7;
      const optout = `https://www.hivex.pt/api/quote-requests/optout?e=${encodeURIComponent(co.email)}&t=${_optoutToken(co.email)}`;
      deferEmail(async () => {
        try {
          await sendBrandedEmail({
            to: co.email,
            replyTo: email,
            subject: `[Hivex] Novo pedido de orçamento${city ? ' em ' + city : ''} — ${name}`,
            title: 'Hivex — Novo pedido de orçamento',
            headers: {
              'List-Unsubscribe': `<${optout}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
            bodyHtml: `
              <p>A empresa <strong>${esc(co.name)}</strong> recebeu um novo pedido de orçamento através do Hivex Marketplace:</p>
              <table style="width:100%;border-collapse:collapse;margin:14px 0">
                <tr style="background:#f9fafb"><td style="padding:9px 13px;font-weight:700;border:1px solid #e5e7eb;width:32%">Cliente</td><td style="padding:9px 13px;border:1px solid #e5e7eb">${esc(name)}${phone ? ' · ' + esc(phone) : ''}</td></tr>
                <tr><td style="padding:9px 13px;font-weight:700;border:1px solid #e5e7eb">Local</td><td style="padding:9px 13px;border:1px solid #e5e7eb">${esc(city || '—')}</td></tr>
                <tr style="background:#f9fafb"><td style="padding:9px 13px;font-weight:700;border:1px solid #e5e7eb">Prazo desejado</td><td style="padding:9px 13px;border:1px solid #e5e7eb">${esc(timelineLabel)}</td></tr>
                <tr><td style="padding:9px 13px;font-weight:700;border:1px solid #e5e7eb">Orçamento indicativo</td><td style="padding:9px 13px;border:1px solid #e5e7eb">${esc(budgetLabel)}</td></tr>
              </table>
              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;margin-bottom:18px"><p style="margin:0;white-space:pre-wrap">${esc(description)}</p></div>
              ${reclamada ? `
              <p style="text-align:center;margin:24px 0"><a href="https://www.hivex.pt/?pedidos=recebidos" style="display:inline-block;background:#2563eb;color:#fff;padding:13px 30px;border-radius:8px;text-decoration:none;font-weight:700">Ver e responder na Hivex</a></p>
              <p>Também pode <strong>responder diretamente a este email</strong>: a resposta vai para o cliente (${esc(email)}).</p>` : `
              <p><strong>Responda diretamente a este email</strong> para enviar a sua proposta ao cliente (${esc(email)}).</p>
              ${companyReplyCtaHtml(co)}`}
              <p style="color:#9ca3af;font-size:12px;margin-bottom:0">Recebeu este pedido porque a ${esc(co.name)} está na Hivex na área pedida por este cliente. É um pedido do cliente, não publicidade. <a href="${optout}" style="color:#9ca3af">Não quero receber pedidos de orçamento por email</a>.</p>`,
          });
          await pool.query(
            `UPDATE quote_request_recipients SET status = 'sent', sent_at = NOW() WHERE request_id = $1 AND company_id = $2`,
            [requestId, co.id]);
        } catch (e) {
          await pool.query(
            `UPDATE quote_request_recipients SET status = 'failed' WHERE request_id = $1 AND company_id = $2`,
            [requestId, co.id]).catch(() => {});
          throw e;
        }
      }, `RFQ ${requestId} → company ${co.id}`);
    }

    await pool.query(`UPDATE quote_requests SET notified_count = $1 WHERE id = $2`, [picked.length, requestId]);

    // Confirmation to the client (sem empresas para avisar, o ecrã já o diz).
    if (picked.length) {
      deferEmail(() => sendBrandedEmail({
        to: email,
        subject: '[Hivex] O seu pedido de orçamento foi enviado',
        title: 'Hivex — Pedido de orçamento enviado',
        bodyHtml: `
          <p>Olá ${esc(name)},</p>
          <p>O seu pedido de orçamento foi enviado a <strong>${picked.length} empresa${picked.length === 1 ? '' : 's'}</strong> da área ${city ? 'de ' + esc(city) : 'indicada'}. As empresas respondem para o seu email ou por mensagem na Hivex (em «As minhas mensagens», se tiver conta com este email).</p>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px"><p style="margin:0;white-space:pre-wrap">${esc(description)}</p></div>`,
      }), `RFQ ${requestId} confirmation`);
    }

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
    // Mark client messages as read once the owner opens the inbox. Com
    // ?marcar=0 o frontend marca só a conversa que abre (POST .../read): os
    // "Pedidos de clientes" contam as novas por cliente.
    if (req.query.marcar !== '0') {
      pool.query(`UPDATE messages SET read_at = NOW() WHERE company_id = $1 AND sender = 'client' AND read_at IS NULL`, [req.params.companyId]).catch(() => {});
    }
    res.json(rows);
  } catch (e) { next(e); }
});

// POST /api/messages/company/:companyId/read — o dono abriu a conversa com UM
// cliente: só as mensagens desse cliente ficam lidas.
router.post('/messages/company/:companyId(\\d+)/read', requireAuth, async (req, res, next) => {
  try {
    const email = String((req.body && req.body.clientEmail) || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Cliente inválido' });
    const { rows: co } = await pool.query(`SELECT id, created_by FROM companies WHERE id = $1`, [req.params.companyId]);
    if (!co[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    if (co[0].created_by !== req.user.id) await ensureAdminFlag(req);
    if (!req.user.is_admin && co[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão' });
    }
    const { rowCount } = await pool.query(
      `UPDATE messages SET read_at = NOW()
        WHERE company_id = $1 AND sender = 'client' AND read_at IS NULL AND lower(client_email) = $2`,
      [co[0].id, email]);
    res.json({ ok: true, lidas: rowCount });
  } catch (e) { next(e); }
});

// POST /api/messages/company/:companyId/reply — owner replies to a client
// (stored in the thread + optional documents + relayed by email).
router.post('/messages/company/:companyId/reply', requireAuth, async (req, res, next) => {
  try {
    const { clientEmail, body, clientName } = req.body || {};
    const files = validateChatFiles(req.body && req.body.files);
    const text = (body || '').trim();
    // Nome do cliente na conversa (resposta a um pedido de orçamento: ainda
    // não há mensagens dele de onde o tirar)
    const nome = String(clientName || '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 120) || null;
    if (!EMAIL_RE.test(clientEmail || '')) return res.status(400).json({ error: 'Cliente inválido' });
    if (text.length < 2 && !files.length) return res.status(400).json({ error: 'Mensagem vazia' });
    const { rows: co } = await pool.query(`SELECT id, name, email, created_by FROM companies WHERE id = $1`, [req.params.companyId]);
    if (!co[0]) return res.status(404).json({ error: 'Empresa não encontrada' });
    if (co[0].created_by !== req.user.id) await ensureAdminFlag(req);
    if (!req.user.is_admin && co[0].created_by !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão' });
    }
    const { rows: ins } = await pool.query(
      `INSERT INTO messages (company_id, sender, client_email, client_name, body) VALUES ($1, 'company', $2, $3, $4) RETURNING id`,
      [co[0].id, clientEmail, nome, text.slice(0, 4000)]
    );
    await saveChatFiles(ins[0].id, files);
    // push web/nativo para o cliente (se tiver conta e subscrições)
    pool.query(`SELECT id FROM users WHERE lower(email) = lower($1)`, [clientEmail])
      .then(r => { if (r.rows[0]) pushToUser(r.rows[0].id, co[0].name, text.slice(0, 120) || '📎 Documento', { url: '/' }); })
      .catch(() => {});
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
      `SELECT id, name, email, created_by FROM companies WHERE id = $1 AND status = 'approved'`, [req.params.companyId]);
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
    if (co[0].created_by) {
      pushToUser(co[0].created_by, (me[0].name || 'Cliente') + ' → ' + co[0].name,
        text.slice(0, 120) || '📎 Documento', { url: '/' });
    }
    if (co[0].email) {
      deferEmail(() => sendBrandedEmail({
        to: co[0].email,
        replyTo: me[0].email,
        subject: `[Hivex] Nova mensagem de ${me[0].name || me[0].email}`,
        title: `Hivex — nova mensagem para ${co[0].name}`,
        bodyHtml: `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px"><p style="margin:0;white-space:pre-wrap">${esc(text)}</p></div>
          ${files.length ? `<p style="margin-top:12px;color:#374151">📎 ${files.length} documento(s) anexado(s) — abra a conversa em hivex.pt para transferir.</p>` : ''}
          ${companyReplyCtaHtml(co[0])}
          <p style="margin-top:8px;color:#6b7280;font-size:13px">Também pode responder diretamente a este email.</p>`,
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
  // O mesmo cron diário envia os pedidos de avaliação (sem um cron novo no
  // vercel.json — não mexe no limite de crons do plano).
  let pedidos = null;
  try { pedidos = await sendReviewRequests(); } catch (e) { console.error('[review-requests]', e.message); }
  // Concursos: resumos de prazo, convites por enviar e retenção dos anexos.
  let concursos = null;
  try { concursos = await require('./tenders').manutencaoConcursos(); } catch (e) { console.error('[concursos] manutenção:', e.message); }
  res.json({ ok: true, pedidosAvaliacao: pedidos, concursos });
});

// ── PEDIDOS DE AVALIAÇÃO ──────────────────────────────────────────────────────
// Depois de uma interação real pela Hivex, o cliente recebe UM email a
// convidá-lo a avaliar a empresa. Três origens, por esta ordem de prioridade
// (com o teto, as interações mais fortes passam à frente):
//  - concurso: quem lançou o concurso aceitou a proposta da empresa
//    (tender_proposals.status = 'accepted') — ~3 semanas depois da decisão,
//    para tenders.owner_email; concursos de teste nunca;
//  - orçamento: a empresa respondeu pela Hivex (mensagem da empresa para o
//    email do cliente) a um pedido de orçamento que lhe chegou
//    (quote_request_recipients) — ~10 dias depois da resposta;
//  - contacto: o cliente escreveu à empresa pela Hivex — ~7 dias depois.
// Regras: um só pedido por (empresa, email), seja qual for a origem; cada
// origem tem uma janela de 7 dias (nunca "acorda" interações antigas de uma
// vez; o que o teto deixar para trás segue no dia seguinte); enquanto uma
// proposta aceite não fizer 3 semanas, as mensagens com essa empresa não
// antecipam o pedido (a obra mal começou); nada se já avaliou essa empresa,
// se recusou estes emails (opt-out) ou se o email é da própria empresa; teto
// por corrida porque o SMTP (Gmail, ~500 destinatários/dia) é partilhado com
// os emails essenciais (recuperação de palavra-passe, mensagens).
const REVIEW_REQ_CAP = 60;
function _optoutToken(email) {
  return crypto.createHmac('sha256', String(process.env.JWT_SECRET || 'hivex-optout'))
    .update('optout:' + String(email).toLowerCase()).digest('hex').slice(0, 32);
}
// Texto de cada origem (co já escapado): português + uma linha em inglês.
function _textoPedidoAvaliacao(r, co, link) {
  if (r.origem === 'concurso') {
    return {
      assunto: `Como está a correr com ${r.company_name}?`,
      titulo: 'Como está a correr?',
      abertura: `Há cerca de três semanas aceitou, num concurso na Hivex, a proposta da <strong>${co}</strong>${r.referencia ? ` para «${esc(r.referencia)}»` : ''}. Como está a correr?`,
      porque: 'Como aceitou a proposta da empresa num concurso na Hivex',
      nota: '<p>Se o trabalho ainda não terminou, pode avaliar mais tarde com este mesmo botão.</p>',
      ingles: `About three weeks ago you accepted ${co}’s proposal in a Hivex tender — <a href="${link}" style="color:#f97316">tell us how it’s going</a>.`,
    };
  }
  if (r.origem === 'orcamento') {
    return {
      assunto: `Como correu com ${r.company_name}?`,
      titulo: 'Como correu?',
      abertura: `Há cerca de 10 dias, a <strong>${co}</strong> respondeu pela Hivex ao seu pedido de orçamento. Como correu?`,
      porque: 'Como a empresa lhe respondeu pela Hivex',
      nota: '',
      ingles: `About 10 days ago ${co} answered your quote request on Hivex — <a href="${link}" style="color:#f97316">tell us how it went</a>.`,
    };
  }
  return {
    assunto: `Como correu com ${r.company_name}?`,
    titulo: 'Como correu?',
    abertura: `Há cerca de uma semana contactou a <strong>${co}</strong> através da Hivex. Como correu?`,
    porque: 'Como contactou a empresa pela Hivex',
    nota: '',
    ingles: `About a week ago you contacted ${co} through Hivex — <a href="${link}" style="color:#f97316">tell us how it went</a>.`,
  };
}
async function sendReviewRequests() {
  const { rows } = await pool.query(`
    WITH cand AS (
      SELECT 1 AS prio, 'concurso' AS origem, i.company_id, lower(trim(t.owner_email)) AS email,
             t.owner_name AS client_name, t.title AS referencia, p.decided_at AS quando
        FROM tender_proposals p
        JOIN tenders t ON t.id = p.tender_id AND NOT t.is_test
        JOIN tender_invites i ON i.id = p.invite_id
       WHERE p.status = 'accepted'
         AND p.decided_at BETWEEN NOW() - INTERVAL '28 days' AND NOW() - INTERVAL '21 days'
      UNION ALL
      -- respondido = a empresa escreveu a este cliente pela Hivex depois do
      -- pedido (o mesmo critério da lista "Pedidos de clientes")
      SELECT 2, 'orcamento', r.company_id, lower(trim(q.client_email)), q.client_name, NULL, m.created_at
        FROM quote_request_recipients r
        JOIN quote_requests q ON q.id = r.request_id
        JOIN messages m ON m.company_id = r.company_id AND m.sender = 'company'
                       AND lower(m.client_email) = lower(q.client_email)
                       AND m.created_at >= r.created_at
       WHERE m.created_at BETWEEN NOW() - INTERVAL '17 days' AND NOW() - INTERVAL '10 days'
      UNION ALL
      SELECT 3, 'contacto', m.company_id, lower(trim(m.client_email)), m.client_name, NULL, m.created_at
        FROM messages m
       WHERE m.sender = 'client'
         AND m.created_at BETWEEN NOW() - INTERVAL '14 days' AND NOW() - INTERVAL '7 days'
    )
    SELECT * FROM (
      SELECT DISTINCT ON (k.company_id, k.email) k.*, c.name AS company_name
        FROM cand k
        JOIN companies c ON c.id = k.company_id AND c.status = 'approved'
       WHERE k.email <> '' AND k.email IS DISTINCT FROM lower(trim(c.email))
         AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = c.created_by AND lower(u.email) = k.email)
         AND NOT EXISTS (SELECT 1 FROM review_requests rr WHERE rr.company_id = k.company_id AND rr.email = k.email)
         AND NOT EXISTS (SELECT 1 FROM email_optouts o WHERE o.email = k.email)
         AND NOT EXISTS (SELECT 1 FROM reviews rv JOIN users u ON u.id = rv.user_id
                          WHERE rv.company_id = k.company_id AND lower(u.email) = k.email)
         AND (k.origem = 'concurso' OR NOT EXISTS (
               SELECT 1 FROM tender_proposals p
                 JOIN tenders t ON t.id = p.tender_id AND NOT t.is_test
                 JOIN tender_invites i ON i.id = p.invite_id
                WHERE i.company_id = k.company_id AND lower(trim(t.owner_email)) = k.email
                  AND p.status = 'accepted' AND p.decided_at > NOW() - INTERVAL '21 days'))
       ORDER BY k.company_id, k.email, k.prio, k.quando
    ) x
    ORDER BY prio, quando
    LIMIT $1`, [REVIEW_REQ_CAP]);
  let enviados = 0;
  const porOrigem = { concurso: 0, orcamento: 0, contacto: 0 };
  for (const r of rows) {
    // Reserva antes de enviar: se o envio falhar não se repete amanhã
    // (um pedido a menos é melhor do que dois iguais).
    const ins = await pool.query(
      `INSERT INTO review_requests (company_id, email) VALUES ($1, $2)
       ON CONFLICT DO NOTHING RETURNING 1`, [r.company_id, r.email]);
    if (!ins.rows[0]) continue;
    const link = `https://www.hivex.pt/?company=${r.company_id}&review=1`;
    const optout = `https://www.hivex.pt/api/reviews/optout?e=${encodeURIComponent(r.email)}&t=${_optoutToken(r.email)}`;
    const co = esc(r.company_name || '');
    const txt = _textoPedidoAvaliacao(r, co, link);
    try {
      await sendBrandedEmail({
        to: r.email,
        subject: txt.assunto,
        title: txt.titulo,
        headers: {
          'List-Unsubscribe': `<${optout}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
        bodyHtml: `
    <p style="margin-top:0">Olá${r.client_name ? ' ' + esc(r.client_name) : ''},</p>
    <p>${txt.abertura}</p>
    <p>A sua avaliação ajuda outras pessoas a escolher bem. ${txt.porque}, a avaliação que fizer com este email fica marcada como <strong>contacto verificado</strong>.</p>
    ${txt.nota}
    <p style="text-align:center;margin:26px 0">
      <a href="${link}" style="display:inline-block;background:#f97316;color:#fff;padding:14px 34px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">Avaliar ${co} →</a>
    </p>
    <p style="color:#6b7280;font-size:13px">${txt.ingles}</p>
    <p style="color:#9ca3af;font-size:12px;margin-bottom:0">Este é o único pedido de avaliação que enviamos sobre esta empresa. <a href="${optout}" style="color:#9ca3af">Não quero receber pedidos de avaliação</a>.</p>`,
      });
      enviados++;
      porOrigem[r.origem]++;
    } catch (e) {
      console.error('[review-requests] envio falhou (empresa ' + r.company_id + '):', e.message);
    }
  }
  if (rows.length) console.log('[review-requests]', JSON.stringify({ candidatos: rows.length, enviados, porOrigem }));
  return { candidatos: rows.length, enviados, porOrigem };
}

// GET /api/reviews/request-digest — corrida manual (mesma proteção do cron).
router.get('/reviews/request-digest', async (req, res) => {
  const secret = process.env.CRON_SECRET;
  const fromCron = !!req.headers['x-vercel-cron'];
  const authed = secret && req.headers.authorization === `Bearer ${secret}`;
  if (!fromCron && !authed) return res.status(401).json({ error: 'unauthorized' });
  try { res.json({ ok: true, ...(await sendReviewRequests()) }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Página dos links "não quero receber" (o mesmo aspeto em todas). O helmet põe
// Referrer-Policy no-referrer e, com ela, o browser envia o POST do botão com
// "Origin: null", que o CORS recusa (500, nada registado); strict-origin faz o
// POST levar a origem www.hivex.pt e nunca põe o email/token no Referer.
function _paginaOptout(res, status, corpo) {
  res.status(status).set({ 'Content-Type': 'text/html; charset=utf-8', 'Referrer-Policy': 'strict-origin' }).send(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<div style="font-family:Arial,sans-serif;max-width:520px;margin:60px auto;padding:0 20px;color:#374151;line-height:1.6">${corpo}` +
    `<p><a href="https://www.hivex.pt" style="color:#f97316">Voltar à Hivex</a></p></div>`);
}
const _BOTAO_CONFIRMAR = `<form method="post"><button type="submit" style="background:#2563eb;color:#fff;border:0;border-radius:8px;padding:12px 22px;font-size:15px;font-weight:700;cursor:pointer">Confirmar</button></form>`;

// /api/reviews/optout — link "não quero receber" dos emails.
//   ?e=&t=  pedidos de avaliação (HMAC do email com JWT_SECRET)
//   ?i=     convites da campanha "reclame a sua ficha" (token aleatório
//           guardado em claim_invites — o script corre fora do Vercel e não
//           partilha o JWT_SECRET de produção)
// Os dois alimentam a mesma email_optouts: quem recusa um tipo de email não
// essencial deixa de receber todos. GET (e HEAD, que o Express entrega ao
// mesmo handler) só mostra a confirmação: os filtros de email abrem os links
// sozinhos e não podem recusar por engano. POST regista: botão da página e
// cancelamento num clique (RFC 8058, cabeçalho List-Unsubscribe-Post), que o
// Gmail/Yahoo fazem no mesmo URL.
async function optout(req, res) {
  const invite = String(req.query.i || '');
  let email = '', ok = false;
  try {
    if (invite) {
      if (/^[a-f0-9]{32}$/.test(invite)) {
        const { rows } = await pool.query(`SELECT email FROM claim_invites WHERE token = $1`, [invite]);
        email = rows[0] ? String(rows[0].email).toLowerCase().trim() : '';
        ok = !!email;
      }
    } else {
      email = String(req.query.e || '').toLowerCase().trim();
      const tok = String(req.query.t || '');
      const esperado = _optoutToken(email);
      ok = !!email && tok.length === esperado.length &&
        crypto.timingSafeEqual(Buffer.from(tok), Buffer.from(esperado));
    }
  } catch (_) { ok = false; }
  const registar = req.method === 'POST';
  if (!ok) {
    return _paginaOptout(res, registar ? 400 : 200,
      `<h2>Link inválido</h2><p>Este link não é válido ou expirou. Responda a qualquer email da Hivex e tratamos do pedido manualmente.</p>`);
  }
  // As fichas da campanha também recebem pedidos de orçamento de clientes (que
  // respeitam a email_optouts): a página di-lo antes de a empresa confirmar.
  const que = invite ? 'convites, pedidos de orçamento de clientes' : 'pedidos de avaliação';
  if (!registar) {
    return _paginaOptout(res, 200,
      `<h2>${invite ? 'Deixar de receber emails da Hivex' : 'Deixar de receber pedidos de avaliação'}</h2>` +
      `<p>Confirme que o endereço <strong>${esc(email)}</strong> não quer receber ${que} nem outros emails não essenciais da Hivex.` +
      (invite ? ' As mensagens que um cliente escrever diretamente à sua empresa continuam a chegar.' : '') + `</p>` +
      _BOTAO_CONFIRMAR);
  }
  try {
    await pool.query(`INSERT INTO email_optouts (email) VALUES ($1) ON CONFLICT DO NOTHING`, [email]);
  } catch (e) {
    console.error('[optout] falhou:', e.message);
    return _paginaOptout(res, 500, '<h2>Erro</h2><p>Não foi possível registar o pedido. Tente de novo.</p>');
  }
  return _paginaOptout(res, 200,
    `<h2>Pedido registado</h2><p>Não voltará a receber ${que} nem outros emails não essenciais da Hivex em ${esc(email)}.</p>` +
    (invite ? `<p>Se também quiser que a ficha da sua empresa seja corrigida ou removida, escreva para <a href="mailto:geral.hivex@gmail.com" style="color:#f97316">geral.hivex@gmail.com</a>.</p>` : ''));
}
router.get('/reviews/optout', optout);
router.post('/reviews/optout', optout);

// "Não quero receber pedidos de orçamento por email" (?e=&t=, HMAC como acima).
// Como no /reviews/optout: GET (e HEAD) só mostra a confirmação, POST regista
// (botão da página e cancelamento num clique, RFC 8058). Alimenta a mesma
// email_optouts.
async function optoutPedidos(req, res) {
  const email = String(req.query.e || '').toLowerCase().trim();
  const tok = String(req.query.t || '');
  let ok = false;
  try {
    const esperado = _optoutToken(email);
    ok = !!email && tok.length === esperado.length && crypto.timingSafeEqual(Buffer.from(tok), Buffer.from(esperado));
  } catch (_) { ok = false; }
  if (!ok) return _paginaOptout(res, 400, `<h2>Link inválido</h2><p>Este link não é válido. Responda a qualquer email da Hivex e tratamos do pedido.</p>`);
  if (req.method !== 'POST') {
    return _paginaOptout(res, 200,
      `<h2>Deixar de receber pedidos de orçamento</h2><p>Confirme que o endereço <strong>${esc(email)}</strong> não quer receber pedidos de orçamento de clientes nem outros emails não essenciais da Hivex. As mensagens que um cliente escrever diretamente à sua empresa continuam a chegar.</p>` +
      _BOTAO_CONFIRMAR);
  }
  try {
    await pool.query(`INSERT INTO email_optouts (email) VALUES ($1) ON CONFLICT DO NOTHING`, [email]);
  } catch (e) {
    console.error('[rfq] opt-out falhou:', e.message);
    return _paginaOptout(res, 500, '<h2>Erro</h2><p>Não foi possível registar o pedido. Tente de novo.</p>');
  }
  return _paginaOptout(res, 200, `<h2>Pedido registado</h2><p>Não voltará a receber pedidos de orçamento nem outros emails não essenciais da Hivex em ${esc(email)}.</p>`);
}
router.get('/quote-requests/optout', optoutPedidos);
router.post('/quote-requests/optout', optoutPedidos);

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

// GET /api/messages/unread-total — badge global do nav: soma as conversas do
// utilizador como CLIENTE + o inbox de todas as empresas de que é DONO.
router.get('/messages/unread-total', requireAuth, async (req, res, next) => {
  try {
    const { rows: me } = await pool.query(`SELECT email FROM users WHERE id = $1`, [req.user.id]);
    const email = me[0] ? me[0].email : '';
    const { rows } = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM messages m
           WHERE lower(m.client_email) = lower($1) AND m.sender = 'company' AND m.read_at IS NULL)::int
       + (SELECT COUNT(*) FROM messages m JOIN companies c ON c.id = m.company_id
           WHERE c.created_by = $2 AND m.sender = 'client' AND m.read_at IS NULL)::int AS n`,
      [email, req.user.id]);
    res.json({ n: rows[0].n });
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

// ── WEB PUSH: subscrição do browser ───────────────────────────────────────────
router.get('/push/pubkey', async (req, res, next) => {
  try { const v = await getVapid(); res.json({ key: v.publicKey }); } catch (e) { next(e); }
});
router.post('/push/subscribe', requireAuth, async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!b.endpoint || !b.keys) return res.status(400).json({ error: 'Subscrição inválida' });
    await pool.query(
      `INSERT INTO push_subscriptions (user_id, endpoint, keys) VALUES ($1, $2, $3)
       ON CONFLICT (endpoint) DO UPDATE SET user_id = EXCLUDED.user_id, keys = EXCLUDED.keys`,
      [req.user.id, String(b.endpoint).slice(0, 600), JSON.stringify(b.keys)]);
    res.status(201).json({ ok: true });
  } catch (e) { next(e); }
});

// ── ALERTAS DE PESQUISA (digest semanal por email) ───────────────────────────
router.get('/saved-searches', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, sector, city, country, created_at FROM saved_searches WHERE user_id = $1 ORDER BY id DESC`,
      [req.user.id]);
    res.json(rows);
  } catch (e) { next(e); }
});
router.post('/saved-searches', requireAuth, async (req, res, next) => {
  try {
    const b = req.body || {};
    const sector = String(b.sector || '').toLowerCase().replace(/[^a-z_]/g, '').slice(0, 50);
    if (!sector) return res.status(400).json({ error: 'Escolha uma área de atividade' });
    const { rows: me } = await pool.query(`SELECT email FROM users WHERE id = $1`, [req.user.id]);
    if (!me[0]) return res.status(401).json({ error: 'Sessão inválida' });
    const { rows: cnt } = await pool.query(
      `SELECT COUNT(*)::int AS n FROM saved_searches WHERE user_id = $1`, [req.user.id]);
    if (cnt[0].n >= 5) return res.status(409).json({ error: 'Máximo de 5 alertas guardados' });
    const { rows } = await pool.query(
      `INSERT INTO saved_searches (user_id, email, sector, city, country)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [req.user.id, me[0].email, sector,
       b.city ? String(b.city).slice(0, 60) : null,
       b.country ? String(b.country).toLowerCase().slice(0, 2) : null]);
    res.status(201).json({ ok: true, id: rows[0].id });
  } catch (e) { next(e); }
});
router.delete('/saved-searches/:id(\\d+)', requireAuth, async (req, res, next) => {
  try {
    await pool.query(`DELETE FROM saved_searches WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});
// Cron semanal (segunda 08:00 UTC) — envia só quando há empresas novas.
router.get('/saved-searches/digest', async (req, res) => {
  const secret = process.env.CRON_SECRET;
  const fromCron = !!req.headers['x-vercel-cron'];
  const authed = secret && req.headers.authorization === `Bearer ${secret}`;
  if (!fromCron && !authed) return res.status(401).json({ error: 'unauthorized' });
  const { rows: searches } = await pool.query(`SELECT * FROM saved_searches ORDER BY id LIMIT 500`);
  let sent = 0;
  for (const s of searches) {
    try {
      const { rows: novas } = await pool.query(
        `SELECT id, name, city FROM companies
          WHERE status = 'approved' AND sector = $1
            AND ($2::text IS NULL OR country = $2)
            AND ($3::text IS NULL OR city ILIKE '%' || $3 || '%')
            AND created_at > $4
          ORDER BY created_at DESC LIMIT 6`,
        [s.sector, s.country || null, s.city || null, s.last_sent]);
      if (!novas.length) continue;
      const lista = novas.map(n =>
        `<li><a href="https://www.hivex.pt/e/${n.id}"><strong>${esc(n.name)}</strong></a>${n.city ? ' — ' + esc(n.city) : ''}</li>`).join('');
      await sendBrandedEmail({
        to: s.email,
        subject: `[Hivex] ${novas.length} nova(s) empresa(s) de ${s.sector.replace(/_/g, ' ')}${s.city ? ' em ' + s.city : ''}`,
        title: 'Hivex — novas empresas no seu alerta',
        bodyHtml: `<p>Há novidades na área que está a acompanhar:</p><ul>${lista}</ul>
          <p><a href="https://www.hivex.pt/?sector=${encodeURIComponent(s.sector)}${s.city ? '&city=' + encodeURIComponent(s.city) : ''}">Ver no mapa →</a></p>
          <p style="color:#6b7280;font-size:12px">Recebe este email porque criou um alerta na Hivex. Pode removê-lo no seu perfil.</p>`,
      });
      await pool.query(`UPDATE saved_searches SET last_sent = NOW() WHERE id = $1`, [s.id]);
      sent++;
    } catch (e) { console.error('[digest]', s.id, e.message); }
  }
  res.json({ ok: true, sent });
});

module.exports = router;
