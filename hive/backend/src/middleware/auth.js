const jwt = require('jsonwebtoken');
const pool = require('../db');

// Pull the JWT from the httpOnly cookie (web) or, failing that, an
// `Authorization: Bearer <jwt>` header (the native app, where cross-origin
// cookies don't flow). Cookie-first keeps the web path byte-for-byte unchanged.
function extractToken(req) {
  if (req.cookies && req.cookies.hive_token) return req.cookies.hive_token;
  const auth = req.headers && req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7).trim();
  return null;
}

function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, async () => {
    if (req.user.is_admin) return next();
    // The admin flag lives in the JWT, so a token signed BEFORE a promotion
    // says false for up to 7 days. Before rejecting, check the DB — the flag
    // there is the source of truth. Costs one indexed query and only on the
    // would-be-rejected path, so regular admin traffic never pays it.
    try {
      const { rows } = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
      if (rows[0] && rows[0].is_admin === true) {
        req.user.is_admin = true;
        return next();
      }
    } catch (_) { /* DB hiccup → fall through to the 403 */ }
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  });
}

// Like requireAuth, but never blocks the request — populates req.user when a
// valid token is present, leaves it undefined otherwise. Useful for endpoints
// whose response shape depends on whether the caller is the resource owner.
function optionalAuth(req, res, next) {
  const token = extractToken(req);
  if (token) {
    try { req.user = jwt.verify(token, process.env.JWT_SECRET); } catch { /* ignore */ }
  }
  next();
}

module.exports = { requireAuth, requireAdmin, optionalAuth, extractToken };
