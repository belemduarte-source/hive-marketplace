const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.hive_token;
  if (!token) return res.status(401).json({ error: 'Não autenticado' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!req.user.is_admin) return res.status(403).json({ error: 'Acesso restrito a administradores' });
    next();
  });
}

// Like requireAuth, but never blocks the request — populates req.user when a
// valid token is present, leaves it undefined otherwise. Useful for endpoints
// whose response shape depends on whether the caller is the resource owner.
function optionalAuth(req, res, next) {
  const token = req.cookies && req.cookies.hive_token;
  if (token) {
    try { req.user = jwt.verify(token, process.env.JWT_SECRET); } catch { /* ignore */ }
  }
  next();
}

module.exports = { requireAuth, requireAdmin, optionalAuth };
