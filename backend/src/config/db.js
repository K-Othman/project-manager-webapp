/**
 * Database connection pool configuration
 *
 * Responsible for creating and exporting a reusable MySQL connection pool.
 * All queries in the application should use this pool to ensure:
 *  - Efficient connection reuse
 *  - Centralised configuration
 *  - Easier error tracking
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

// Create a connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,      // Max number of connections in the pool
  queueLimit: 0,            // Unlimited queued requests
  dateStrings: true,
});

/**
 * Simple helper to test and log the DB connection status.
 * Call this from the server startup file.
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    console.log('MySQL connection established successfully.');
    connection.release();
  } catch (error) {
    console.error('Unable to connect to MySQL:', error.message);
  }
}

module.exports = {
  pool,
  testConnection
};
