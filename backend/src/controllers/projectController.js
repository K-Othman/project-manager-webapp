/**
 * Project controller
 *
 * Handles:
 *  - Public project listing and search
 *  - Project details
 *  - Authenticated user's own projects
 *
 * Security:
 *  - Uses parameterised queries to prevent SQL injection
 *  - Validates input before inserting/updating
 *  - Enforces ownership: users can only modify their own projects
 */

const { validationResult } = require('express-validator');
const { pool } = require('../config/db');

/**
 * GET /api/projects
 *
 * Public endpoint: returns a list of all projects.
 * Only exposes safe fields (no sensitive user data).
 */
async function getAllProjects(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT 
         p.pid,
         p.title,
         p.start_date,
         p.short_description,
         p.phase,
         p.created_at,
         u.username
       FROM projects p
       JOIN users u ON p.uid = u.uid
       ORDER BY p.created_at DESC`
    );

    res.json({
      success: true,
      projects: rows
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/projects/:id
 *
 * Public endpoint: returns full details of a single project,
 * including owner's email as required by the specification.
 */
async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT 
         p.pid,
         p.title,
         p.start_date,
         p.end_date,
         p.short_description,
         p.phase,
         p.created_at,
         u.username,
         u.email AS owner_email
       FROM projects p
       JOIN users u ON p.uid = u.uid
       WHERE p.pid = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    res.json({
      success: true,
      project: rows[0]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/projects/search
 *
 * Public endpoint: search projects by title and/or start_date.
 * Query params:
 *  - title (optional, partial match)
 *  - startDate (optional, exact date: YYYY-MM-DD)
 */
async function searchProjects(req, res, next) {
  try {
    const { title, startDate } = req.query;

    // Build dynamic WHERE clause safely
    const conditions = [];
    const params = [];

    if (title) {
      conditions.push('p.title LIKE ?');
      params.push(`%${title}%`);
    }

    if (startDate) {
      conditions.push('p.start_date = ?');
      params.push(startDate);
    }

    let sql = `
      SELECT 
        p.pid,
        p.title,
        p.start_date,
        p.short_description,
        p.phase,
        u.username
      FROM projects p
      JOIN users u ON p.uid = u.uid
    `;

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY p.start_date DESC';

    const [rows] = await pool.query(sql, params);

    res.json({
      success: true,
      projects: rows
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/projects/mine
 *
 * Protected endpoint: returns projects belonging to the
 * currently authenticated user.
 */
async function getMyProjects(req, res, next) {
  try {
    const userId = req.user.uid;

    const [rows] = await pool.query(
      `SELECT 
         pid,
         title,
         start_date,
         end_date,
         short_description,
         phase,
         created_at
       FROM projects
       WHERE uid = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      projects: rows
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/projects
 *
 * Protected endpoint: creates a new project for the
 * authenticated user.
 *
 * Expected body:
 *  - title
 *  - start_date (YYYY-MM-DD)
 *  - end_date (optional, YYYY-MM-DD)
 *  - short_description
 *  - phase (one of: design, development, testing, deployment, complete)
 */
async function createProject(req, res, next) {
  try {
    // Validate body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const userId = req.user.uid;
    const {
      title,
      start_date,
      end_date,
      short_description,
      phase
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO projects 
         (title, start_date, end_date, short_description, phase, uid)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, start_date, end_date || null, short_description, phase, userId]
    );

    const [rows] = await pool.query(
      `SELECT 
         pid,
         title,
         start_date,
         end_date,
         short_description,
         phase,
         created_at
       FROM projects
       WHERE pid = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      project: rows[0]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/projects/:id
 *
 * Protected endpoint: updates an existing project.
 * Only the owner of the project can update it.
 */
async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    // Validate body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      title,
      start_date,
      end_date,
      short_description,
      phase
    } = req.body;

    // Check ownership: project must belong to the authenticated user
    const [projects] = await pool.query(
      'SELECT uid FROM projects WHERE pid = ?',
      [id]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    const project = projects[0];

    if (project.uid !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorised to update this project.'
      });
    }

    // Perform the update
    await pool.query(
      `UPDATE projects
       SET title = ?, 
           start_date = ?, 
           end_date = ?, 
           short_description = ?, 
           phase = ?
       WHERE pid = ?`,
      [title, start_date, end_date || null, short_description, phase, id]
    );

    // Return updated project
    const [rows] = await pool.query(
      `SELECT 
         pid,
         title,
         start_date,
         end_date,
         short_description,
         phase,
         created_at
       FROM projects
       WHERE pid = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Project updated successfully.',
      project: rows[0]
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  searchProjects,
  getMyProjects,
  createProject,
  updateProject
};
