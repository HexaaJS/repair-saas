const { isDev } = require('../config/env');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur';

  const response = {
    success: false,
    message,
  };

  if (isDev) {
    response.stack = err.stack;
  }

  console.error(`❌ ${statusCode} - ${message}`);

  res.status(statusCode).json(response);
};

module.exports = errorHandler;