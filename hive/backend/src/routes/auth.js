const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { sendPasswordResetEmail, sendEmailVerification } = require('../email');

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Lazy-init Google client so missing GOOGLE_CLIENT_ID only breaks /auth/google,
// not the whole server.
let _googleClient = null;
function googleClient() {
  if (!process.env.GOOGLE_CLIENT_ID) return null;
  if (!_googleClient) _googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  return _googleClient;
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, type: user.type, is_admin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function safeUser(user) {
  return {
    id: user.id, name: user.name, email: user.email, type: user.type,
    company: user.company, phone: user.phone, is_admin: user.is_admin,
    picture: user.picture || null,
  };
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, type, company, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email e password são obrigatórios' });
    if (password.length < 6) return res.status(400).json({ error: 'A palavra-passe deve ter pelo menos 6 caracteres' });
    if (!['empresa', 'cliente'].includes(type)) return res.status(400).json({ error: 'type deve ser empresa ou cliente' });

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'Este email já está registado' });

    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, type, company, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email.toLowerCase(), passwordHash, type, company || '', phone || '']
    );
    const user = rows[0];
    const token = signToken(user);
    res.cookie('hive_token', token, COOKIE_OPTS);
    res.status(201).json({ user: safeUser(user) });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' });

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (!rows[0]) return res.status(401).json({ error: 'Email ou palavra-passe incorretos' });

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Email ou palavra-passe incorretos' });

    const token = signToken(rows[0]);
    res.cookie('hive_token', token, COOKIE_OPTS);
    res.json({ user: safeUser(rows[0]) });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('hive_token');
  res.json({ ok: true });
});

// GET /api/auth/me — returns current user from JWT
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (!rows[0]) return res.status(401).json({ error: 'Utilizador não encontrado' });
    res.json({ user: safeUser(rows[0]) });
  } catch (e) {
    next(e);
  }
});

// GET /api/auth/config — public; returns the Google OAuth client ID for the
// frontend to initialize Google Identity Services. Empty string means Google
// sign-in is disabled (button hidden).
router.get('/config', (req, res) => {
  res.json({ googleClientId: process.env.GOOGLE_CLIENT_ID || '' });
});

// POST /api/auth/google — exchange a Google ID token for a Hive session cookie
// Body: { idToken: string, type?: 'empresa' | 'cliente' }
//
// Behaviour:
//   - Verifies the ID token against GOOGLE_CLIENT_ID
//   - If a user exists with that google_id → log them in
//   - Else if a user exists with that email → link google_id to it, log them in
//   - Else → create a new user (default type = 'cliente') and log them in
router.post('/google', async (req, res, next) => {
  try {
    const client = googleClient();
    if (!client) {
      return res.status(503).json({ error: 'Google sign-in não está configurado' });
    }

    const { idToken } = req.body;
    let { type } = req.body;
    if (!idToken) return res.status(400).json({ error: 'idToken é obrigatório' });
    if (type && !['empresa', 'cliente'].includes(type)) type = undefined;

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (e) {
      return res.status(401).json({ error: 'Token Google inválido' });
    }

    if (!payload || !payload.email_verified) {
      return res.status(401).json({ error: 'Email Google não verificado' });
    }

    const googleId = payload.sub;
    const email    = String(payload.email).toLowerCase();
    const name     = payload.name || payload.given_name || email.split('@')[0];
    const picture  = payload.picture || null;

    // 1. Try google_id
    let { rows } = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    let user = rows[0];

    // 2. Else try email — link this Google account to it
    if (!user) {
      ({ rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]));
      if (rows[0]) {
        const { rows: updated } = await pool.query(
          `UPDATE users SET google_id = $1, picture = COALESCE(picture, $2) WHERE id = $3 RETURNING *`,
          [googleId, picture, rows[0].id]
        );
        user = updated[0];
      }
    }

    // 3. Else create a new user (default type = cliente)
    if (!user) {
      const { rows: created } = await pool.query(
        `INSERT INTO users (name, email, google_id, picture, type, company, phone)
         VALUES ($1, $2, $3, $4, $5, '', '')
         RETURNING *`,
        [name, email, googleId, picture, type || 'cliente']
      );
      user = created[0];
    }

    const token = signToken(user);
    res.cookie('hive_token', token, COOKIE_OPTS);
    res.json({ user: safeUser(user) });
  } catch (e) {
    next(e);
  }
});

// ── Password reset ────────────────────────────────────────────────────────
// POST /api/auth/forgot-password — body: { email }
// Always returns 200 to prevent account enumeration. If the email matches a
// real user, a reset token is generated and emailed.
router.post('/forgot-password', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ error: 'email é obrigatório' });

    // Don't leak whether the address is registered
    const generic = { ok: true, message: 'Se o email estiver registado, receberá em breve um link de recuperação.' };

    const { rows } = await pool.query('SELECT id, name, email FROM users WHERE email = $1', [email]);
    const user = rows[0];
    if (!user) return res.json(generic);

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes
    await pool.query(
      'UPDATE users SET password_reset_token = $1, password_reset_expires_at = $2 WHERE id = $3',
      [token, expires, user.id]
    );

    const appUrl = (process.env.APP_URL || '').replace(/\/$/, '');
    const resetUrl = `${appUrl}/#reset-password/${token}`;
    sendPasswordResetEmail(user, resetUrl).catch(err =>
      console.error('[email] password reset failed:', err.message)
    );

    res.json(generic);
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/reset-password — body: { token, password }
router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) return res.status(400).json({ error: 'token e password são obrigatórios' });
    if (password.length < 6) return res.status(400).json({ error: 'A palavra-passe deve ter pelo menos 6 caracteres' });

    const { rows } = await pool.query(
      'SELECT id FROM users WHERE password_reset_token = $1 AND password_reset_expires_at > NOW()',
      [token]
    );
    if (!rows[0]) return res.status(400).json({ error: 'Hiperligação inválida ou expirada. Peça uma nova.' });

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires_at = NULL WHERE id = $2',
      [passwordHash, rows[0].id]
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// ── Email verification ────────────────────────────────────────────────────
// GET /api/auth/verify-email?token=...  (one-shot, idempotent)
router.get('/verify-email', async (req, res, next) => {
  try {
    const token = String(req.query?.token || '');
    if (!token) return res.status(400).send(verifyHtml('❌ Token em falta', 'A hiperligação de verificação está incompleta.', '#dc2626'));

    const { rows } = await pool.query(
      `UPDATE users SET email_verified = TRUE,
                       email_verification_token = NULL,
                       email_verification_expires_at = NULL
        WHERE email_verification_token = $1
          AND email_verification_expires_at > NOW()
        RETURNING id, name, email`,
      [token]
    );
    if (!rows[0]) return res.status(400).send(verifyHtml('⚠️ Hiperligação inválida', 'O link expirou ou já foi usado. Inicie sessão e peça um novo email de verificação.', '#dc2626'));

    res.send(verifyHtml('✅ Email confirmado!', `O email <strong>${rows[0].email.replace(/[<>]/g, '')}</strong> foi confirmado com sucesso. Já pode fechar esta página.`, '#16a34a'));
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/resend-verification — for the logged-in user
router.post('/resend-verification', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, email_verified FROM users WHERE id = $1', [req.user.id]);
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });
    if (user.email_verified) return res.json({ ok: true, alreadyVerified: true });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await pool.query(
      'UPDATE users SET email_verification_token = $1, email_verification_expires_at = $2 WHERE id = $3',
      [token, expires, user.id]
    );

    const appUrl = (process.env.APP_URL || '').replace(/\/$/, '');
    const verifyUrl = `${appUrl}/api/auth/verify-email?token=${token}`;
    sendEmailVerification(user, verifyUrl).catch(err =>
      console.error('[email] verification resend failed:', err.message)
    );
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// Tiny standalone HTML page for the verify-email landing
function verifyHtml(title, body, color) {
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
