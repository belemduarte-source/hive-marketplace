const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../email');

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
// clearCookie only removes the cookie when the attributes match the ones it was
// set with (path/sameSite/secure) — otherwise some browsers keep it. Reuse the
// same flags minus maxAge.
const CLEAR_COOKIE_OPTS = { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' };

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
    { id: user.id, email: user.email, name: user.name, is_admin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// The native app sends `X-Hivex-Native: 1` (and runs from a capacitor:// origin).
// It can't use the httpOnly cookie cross-origin, so for those clients we ALSO
// return the JWT in the body to store as a bearer token. The web app never sets
// this header, so its token stays cookie-only (not exposed to page JS).
function isNativeReq(req) {
  const h = req.headers || {};
  return h['x-hivex-native'] === '1' ||
    /^(capacitor|ionic):/i.test(h['origin'] || '') ||
    /\b(capacitor|ionic)\b/i.test(h['user-agent'] || '');
}
function authBody(req, user, token) {
  const body = { user: safeUser(user) };
  if (isNativeReq(req)) body.token = token;
  return body;
}

// First-admin bootstrap: any user whose email is listed in the ADMIN_USERS
// env var (comma-separated) — or in the built-in owner list below — is
// promoted to is_admin=true on next login. Lets you grant admin without
// manual SQL. Returns the user (possibly with the flag flipped) so the
// caller can sign a token reflecting the new state.
const BUILTIN_ADMINS = ['geral.hivex@gmail.com'];
async function maybeBootstrapAdmin(user) {
  if (!user || user.is_admin) return user;
  const list = (process.env.ADMIN_USERS || '')
    .split(',')
    .concat(BUILTIN_ADMINS)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  if (!list.includes(String(user.email || '').toLowerCase())) return user;
  try {
    const { rows } = await pool.query(
      'UPDATE users SET is_admin = TRUE WHERE id = $1 RETURNING *',
      [user.id]
    );
    console.log('[auth] promoted to admin via ADMIN_USERS:', user.email);
    return rows[0] || user;
  } catch (e) {
    console.error('[auth] admin bootstrap failed for', user.email, e.message);
    return user;
  }
}

function safeUser(user) {
  return {
    id: user.id, name: user.name, email: user.email,
    is_admin: user.is_admin,
    picture: user.picture || null,
  };
}

// Practical email-format check — not RFC-perfect, but rejects the obvious
// garbage at the door (no @, no dot, embedded whitespace).
const _EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function normalizeEmail(input) {
  return String(input || '').trim().toLowerCase();
}
function isValidEmail(input) {
  const e = normalizeEmail(input);
  return e.length >= 5 && e.length <= 254 && _EMAIL_RE.test(e);
}

// Very-common-password floor. The 8-character minimum still admits '12345678'
// and similar trivials — block the worst offenders explicitly.
const _COMMON_PASSWORDS = new Set([
  '12345678','123456789','1234567890','qwerty123','password','password1',
  'password123','abc12345','iloveyou','letmein1','welcome1','admin123',
  'princess','football','monkey123','11111111','00000000','qwertyuiop',
  'baseball','master123','batman123','sunshine','pokemon1','starwars',
  'computer','superman','passw0rd','trustno1','dragon123','michael1',
]);
function passwordTooWeak(p) {
  return _COMMON_PASSWORDS.has(String(p).toLowerCase());
}

// Cloudflare Turnstile verification — no-op when TURNSTILE_SECRET_KEY isn't
// set, so the feature stays dormant until you configure it in Vercel.
// Strip BOM/zero-width and surrounding whitespace from the secret — pasted
// values often pick up a U+FEFF and Cloudflare returns success:false silently.
async function verifyTurnstile(token, ip) {
  const cleanEnv = (v) => (v == null ? '' : String(v)).replace(/^[﻿​\s]+|[﻿​\s]+$/g, '');
  const secret = cleanEnv(process.env.TURNSTILE_SECRET_KEY);
  if (!secret) return true;
  if (!token) return false;
  try {
    const params = new URLSearchParams({
      secret,
      response: String(token),
    });
    // remoteip intentionally omitted: on serverless/proxied requests (Vercel) the
    // observed IP often differs from the one that solved the challenge, which makes
    // Cloudflare return success:false with "remoteip-mismatch".
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: params });
    const j = await r.json();
    if (!j.success) console.error('[turnstile] not verified, error-codes:', JSON.stringify(j['error-codes'] || j));
    return !!j.success;
  } catch (e) {
    console.error('[turnstile] verify failed:', e.message);
    return false;
  }
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, password, turnstileToken } = req.body;
    const email = normalizeEmail(req.body && req.body.email);
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email e password são obrigatórios' });
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Email inválido' });
    if (password.length < 8) return res.status(400).json({ error: 'A palavra-passe deve ter pelo menos 8 caracteres' });
    if (passwordTooWeak(password)) return res.status(400).json({ error: 'Esta palavra-passe é demasiado comum. Escolha outra.' });

    if (!(await verifyTurnstile(turnstileToken, req.ip))) {
      return res.status(400).json({ error: 'Verificação de segurança falhou. Tente novamente.' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    // Don't leak whether the email is already registered — keep the response
    // shape generic so this endpoint can't be used to probe accounts.
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Não foi possível concluir o registo. Se já tem conta, faça login.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
      [name, email.toLowerCase(), passwordHash]
    );
    const user = rows[0];

    const token = signToken(user);
    res.cookie('hive_token', token, COOKIE_OPTS);
    res.status(201).json(authBody(req, user, token));
  } catch (e) {
    // Concurrent duplicate email that slipped past the existence check → the
    // UNIQUE constraint fires. Return the same generic 409 (no enumeration).
    if (e && e.code === '23505') {
      return res.status(409).json({ error: 'Não foi possível concluir o registo. Se já tem conta, faça login.' });
    }
    next(e);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body && req.body.email);
    if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' });

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!rows[0]) return res.status(401).json({ error: 'Email ou palavra-passe incorretos' });

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Email ou palavra-passe incorretos' });

    const user = await maybeBootstrapAdmin(rows[0]);
    const token = signToken(user);
    res.cookie('hive_token', token, COOKIE_OPTS);
    res.json(authBody(req, user, token));
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('hive_token', CLEAR_COOKIE_OPTS);
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

// GET /api/auth/config — public; surfaces the public keys the frontend needs
// to render Google sign-in and the Turnstile CAPTCHA. Empty strings mean the
// corresponding feature is disabled on the client (button/widget stays hidden).
router.get('/config', (req, res) => {
  res.json({
    googleClientId:    process.env.GOOGLE_CLIENT_ID || '',
    turnstileSiteKey:  process.env.TURNSTILE_SITE_KEY || '',
    assistantEnabled:  !!(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN),
  });
});

// POST /api/auth/google — exchange a Google ID token for a Hivex session cookie
// Body: { idToken: string }
//
// Behaviour:
//   - Verifies the ID token against GOOGLE_CLIENT_ID
//   - If a user exists with that google_id → log them in
//   - Else if a user exists with that email → link google_id to it, log them in
//   - Else → create a new user and log them in
router.post('/google', async (req, res, next) => {
  try {
    const client = googleClient();
    if (!client) {
      return res.status(503).json({ error: 'Google sign-in não está configurado' });
    }

    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'idToken é obrigatório' });

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

    // 3. Else create a new user.
    if (!user) {
      const { rows: created } = await pool.query(
        `INSERT INTO users (name, email, google_id, picture, company, phone)
         VALUES ($1, $2, $3, $4, '', '')
         RETURNING *`,
        [name, email, googleId, picture]
      );
      user = created[0];
    }

    user = await maybeBootstrapAdmin(user);
    const token = signToken(user);
    res.cookie('hive_token', token, COOKIE_OPTS);
    res.json(authBody(req, user, token));
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
    const email = normalizeEmail(req.body && req.body.email);
    if (!email) return res.status(400).json({ error: 'email é obrigatório' });
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Email inválido' });

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
    sendPasswordResetEmail(user, resetUrl)
      .then(() => console.log('[email] password reset sent to', user.email))
      .catch(err => console.error('[email] password reset failed:', err && (err.stack || err.message || err)));

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
    if (password.length < 8) return res.status(400).json({ error: 'A palavra-passe deve ter pelo menos 8 caracteres' });

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

// ── Account self-service ──────────────────────────────────────────────────
// POST /api/auth/change-password — body: { currentPassword, newPassword }
// Google-only users (no password_hash) can't use this — they'd need to set
// a password first via password reset.
router.post('/change-password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'A palavra-passe deve ter pelo menos 8 caracteres' });
    }
    if (passwordTooWeak(newPassword)) {
      return res.status(400).json({ error: 'Esta palavra-passe é demasiado comum. Escolha outra.' });
    }

    const { rows } = await pool.query('SELECT id, password_hash FROM users WHERE id = $1', [req.user.id]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Utilizador não encontrado' });
    if (!user.password_hash) {
      return res.status(400).json({ error: 'Esta conta não tem palavra-passe definida. Use a recuperação por email.' });
    }
    if (!currentPassword || !(await bcrypt.compare(currentPassword, user.password_hash))) {
      return res.status(401).json({ error: 'Palavra-passe atual incorreta' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, user.id]);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// DELETE /api/auth/me — permanently delete the caller's account.
// Body: { password } if the account has a password set (skipped for Google-only
// users, since the JWT cookie is itself proof of authentication). Companies
// created by the user are kept (created_by → NULL); reviews + favourites
// cascade-delete via the schema's foreign-key rules.
router.delete('/me', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT id, password_hash FROM users WHERE id = $1', [req.user.id]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Utilizador não encontrado' });

    if (user.password_hash) {
      const pwd = req.body?.password;
      if (!pwd || !(await bcrypt.compare(pwd, user.password_hash))) {
        return res.status(401).json({ error: 'Palavra-passe incorreta' });
      }
    }

    await pool.query('DELETE FROM users WHERE id = $1', [user.id]);
    res.clearCookie('hive_token', CLEAR_COOKIE_OPTS);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
