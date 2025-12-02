/**
 * Authentication middleware
 *
 * Verifies the JWT token sent by the client and attaches
 * the authenticated user to the request object.
 *
 * Expected:
 *  - Authorization header in the form:
 *      "Bearer <token>"
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to require authentication.
 *
 * If token is valid:
 *  - req.user will contain { uid, username, email, iat, exp }
 *
 * If token is missing or invalid:
 *  - returns 401 Unauthorized
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing.'
    });
  }

  // Expect format: "Bearer <token>"
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization format.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
}

module.exports = {
  requireAuth
};
