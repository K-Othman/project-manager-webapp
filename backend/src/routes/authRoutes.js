/**
 * Authentication routes
 *
 * Endpoints:
 *  - POST /api/auth/register
 *  - POST /api/auth/login
 *
 * Security:
 *  - Validation (express-validator)
 *  - Rate-limiting on auth routes (authLimiter)
 */

const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { authLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

/**
 * Registration validation:
 *  - username: required, 3–50 chars
 *  - email: required, must be valid
 *  - password: required, >= 8 chars
 */
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters.'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email address is required.'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
];

/**
 * Login validation:
 *  - usernameOrEmail: required
 *  - password: required
 */
const loginValidation = [
  body('usernameOrEmail')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required.'),

  body('password')
    .notEmpty()
    .withMessage('Password is required.')
];

// -------------------------------
// Routes
// -------------------------------

// Registration (rate-limited + validation)
router.post(
  '/register',
  authLimiter,
  registerValidation,
  register
);

// Login (rate-limited + validation)
router.post(
  '/login',
  authLimiter,
  loginValidation,
  login
);

module.exports = router;
