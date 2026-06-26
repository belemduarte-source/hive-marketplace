function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  // Never leak internal error details (DB driver messages, stack hints) to the
  // client on 5xx — those go to the logs only. 4xx errors carry intentional,
  // user-safe messages set explicitly by the routes.
  const message = status >= 500
    ? 'Erro interno do servidor'
    : (err.message || 'Pedido inválido');
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
