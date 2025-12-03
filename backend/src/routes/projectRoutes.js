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
// Note: using '/search/query' to avoid conflict with '/:id'

// -------------------- Protected routes --------------------

// Get projects belonging to authenticated user
router.get('/mine/list', requireAuth, getMyProjects);

// Create a new project
router.post('/', requireAuth, projectValidation, createProject);

// Update an existing project (owner only)
router.put('/:id', requireAuth, projectValidation, updateProject);

module.exports = router;
