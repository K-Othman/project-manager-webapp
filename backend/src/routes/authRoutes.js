/**
 * Authentication routes
 *
 * Endpoints:
 *  - POST /api/auth/register
 *  - POST /api/auth/login
 */

const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

/**
 * Validation rules for registration
 *
 * - username: required, 3–50 chars
 * - email: required, valid email format
 * - password: required, min 8 chars
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
 * Validation rules for login
 *
 * - usernameOrEmail: required
 * - password: required
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

// Registration route
router.post('/register', registerValidation, register);

// Login route
router.post('/login', loginValidation, login);

module.exports = router;
