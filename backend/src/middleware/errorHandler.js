/**
 * Global error handling middleware.
 *
 * This should be the last middleware in the chain.
 * It catches any errors passed via next(err) and returns
 * a consistent JSON response structure.
 */

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
