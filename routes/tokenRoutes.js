/**
 * Token Routes
 * Defines endpoints for token-related operations
 */

const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// Public routes for token inspection
router.post('/verify', tokenController.verify);
router.post('/decode', tokenController.decode);

module.exports = router;
