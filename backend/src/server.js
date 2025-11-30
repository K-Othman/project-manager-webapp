/**
 * Server entry point.
 *
 * Starts the Express HTTP server and initialises the database connection.
 */

const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5001;

async function startServer() {
  // Test DB connection before starting the server
  await testConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
