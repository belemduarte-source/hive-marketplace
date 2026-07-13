const crypto = require('crypto');

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  // 5xx inesperados ficam registados em client_errors (source='api') para o
  // separador Erros do admin — fire-and-forget, nunca atrasa a resposta.
  if (status >= 500) {
    try {
      const msg = String(err.message || 'erro').slice(0, 500);
      const route = (req.method || '') + ' ' + (req.originalUrl || '').split('?')[0].slice(0, 200);
      const hash = crypto.createHash('sha1').update('api|' + route + '|' + msg).digest('hex');
      require('../db').query(
        `INSERT INTO client_errors (source, hash, message, stack, url)
         VALUES ('api', $1, $2, $3, $4)
         ON CONFLICT (hash) DO UPDATE SET count = client_errors.count + 1, last_at = NOW()`,
        [hash, msg, String(err.stack || '').slice(0, 1500), route]
      ).catch(() => {});
    } catch (_) {}
  }
  // Never leak internal error details (DB driver messages, stack hints) to the
  // client on 5xx — those go to the logs only. 4xx errors carry intentional,
  // user-safe messages set explicitly by the routes.
  const message = status >= 500
    ? 'Erro interno do servidor'
    : (err.message || 'Pedido inválido');
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
