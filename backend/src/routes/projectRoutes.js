/**
 * Project routes
 *
 * Endpoints:
 *  - GET    /api/projects            (public, list all)
 *  - GET    /api/projects/:id        (public, details)
 *  - GET    /api/projects/search     (public, search)
 *  - GET    /api/projects/mine       (private, my projects)
 *  - POST   /api/projects            (private, create)
 *  - PUT    /api/projects/:id        (private, update if owner)
 *  - DELETE /projects/:id
 */

const express = require('express');
const { body } = require('express-validator');
const {
  getAllProjects,
  getProjectById,
  searchProjects,
  getMyProjects,
  createProject,
  updateProject
} = require('../controllers/projectController');

const { requireAuth } = require('../middleware/authMiddleware');
const { pool } = require("../config/db");

const router = express.Router();

/**
 * Shared validation rules for creating/updating a project.
 */
const projectValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters.'),

  body('start_date')
    .isISO8601()
    .withMessage('Start date must be a valid date in YYYY-MM-DD format.'),

  body('end_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('End date must be a valid date in YYYY-MM-DD format.'),

  body('short_description')
    .trim()
    .isLength({ min: 10, max: 255 })
    .withMessage('Short description must be between 10 and 255 characters.'),

  body('phase')
    .isIn(['design', 'development', 'testing', 'deployment', 'complete'])
    .withMessage('Phase must be one of: design, development, testing, deployment, complete.')
];

// -------------------- Public routes --------------------

// List all projects
router.get('/', getAllProjects);

// Get single project details
router.get('/:id', getProjectById);

// Search projects by title and/or start_date
router.get('/search/query', searchProjects);

// -------------------- Protected routes --------------------

// Get projects belonging to authenticated user
router.get('/mine/list', requireAuth, getMyProjects);

// Create a new project
router.post('/', requireAuth, projectValidation, createProject);

// Update an existing project (owner only)
router.put('/:id', requireAuth, projectValidation, updateProject);

// Deletes a project if the authenticated user owns it
// -------------------------------------------------------------
router.delete("/:id", requireAuth, async (req, res) => {
  const pid = req.params.id;
  const uid = req.user.uid; // set by requireAuth

  try {
    // Check project exists and belongs to user
    const [rows] = await pool.query(
      "SELECT uid FROM projects WHERE pid = ?",
      [pid]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    if (rows[0].uid !== uid) {
      return res.status(403).json({
        success: false,
        message: "You are not authorised to delete this project.",
      });
    }

    // Delete the project
    await pool.query("DELETE FROM projects WHERE pid = ?", [pid]);

    return res.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (err) {
    console.error("Delete project error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting project.",
    });
  }
});



module.exports = router;
