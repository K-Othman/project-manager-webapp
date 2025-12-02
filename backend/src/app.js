/**
 * Express application configuration
 *
 * This file:
 *  - Creates the Express app instance
 *  - Registers global middleware (security, logging, CORS, JSON parsing)
 *  - Mounts route handlers
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const healthRoutes = require('./routes/healthRoutes');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes'); 

dotenv.config();

const app = express();

// ---------------------- Global Middleware ----------------------

// Set various HTTP headers to help protect the app
app.use(helmet());

// Enable CORS for the frontend application
// For now, allow all origins in development. Later, restrict this.
app.use(cors({
  origin: '*',               // TODO: change to specific origin in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse incoming JSON bodies
app.use(express.json());

// HTTP request logging (development)
app.use(morgan('dev'));

// -------------------------- Routes -----------------------------

// Health check endpoints
app.use('/api', healthRoutes);

// TODO: Later I will mount:
app.use('/api/auth', authRoutes);
// app.use('/api/projects', projectRoutes);

// --------------------- Error Handling --------------------------

// Global error handler (must be after all routes)
app.use(errorHandler);

module.exports = app;
