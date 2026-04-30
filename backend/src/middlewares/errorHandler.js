const { nodeEnv } = require('../config/env');

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (nodeEnv !== 'test') {
    console.error(`[${status}] ${req.method} ${req.path} — ${message}`);
    if (status === 500) console.error(err.stack);
  }

  res.status(status).json({
    error: message,
    ...(nodeEnv === 'development' && status === 500 ? { stack: err.stack } : {}),
  });
}

module.exports = errorHandler;
