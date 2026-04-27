const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

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

module.exports = router;
