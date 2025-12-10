/**
 * Authentication controller
 *
 * Handles:
 *  - User registration
 *  - User login
 *
 * Responsibilities:
 *  - Validate input data
 *  - Interact with the database
 *  - Hash passwords using bcrypt
 *  - Generate JWT tokens for authenticated users
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { pool } = require('../config/db');


/**
 * Helper: Generate a signed JWT token for a user.
 */
function generateToken(user) {
  return jwt.sign(
    {
      uid: user.uid,
      username: user.username,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
  );
}

/**
 * POST /api/auth/register
 *
 * Registers a new user.
 * Expected body:
 *  - username
 *  - email
 *  - password
 */
async function register(req, res, next) {
  try {
    // Validate request body using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Check if username or email already exist
    const [existingUsers] = await pool.query(
      'SELECT uid FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already in use.'
      });
    }

    // Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    const [result] = await pool.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );

    // Retrieve the created user
    const [rows] = await pool.query(
      'SELECT uid, username, email, created_at FROM users WHERE uid = ?',
      [result.insertId]
    );
    const newUser = rows[0];

    // Generate a JWT for immediate login after registration
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user: newUser,
      token
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 *
 * Logs a user in.
 * Expected body:
 *  - usernameOrEmail
 *  - password
 */
async function login(req, res, next) {
  try {
    // Validate request body using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { usernameOrEmail, password } = req.body;

    // Find user by username OR email
    const [rows] = await pool.query(
      'SELECT uid, username, email, password FROM users WHERE username = ? OR email = ?',
      [usernameOrEmail, usernameOrEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const user = rows[0];

    // Compare plain password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Remove password before sending user object to client
    delete user.password;

    res.json({
      success: true,
      message: 'Logged in successfully.',
      user,
      token
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login
};
