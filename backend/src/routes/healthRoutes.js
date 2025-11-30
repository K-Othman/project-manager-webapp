/**
 * Health check routes.
 *
 * Provides endpoints to verify:
 *  - The API server is running
 *  - The database connection is working
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// Simple health check for the API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running'
  });
});

// Health check that also tests a DB query
router.get('/health/db', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS result');
    res.json({
      success: true,
      message: 'API and database are running',
      dbTest: rows[0]
    });
  } catch (error) {
    next(error); // Forward error to global error handler
  }
});

module.exports = router;
