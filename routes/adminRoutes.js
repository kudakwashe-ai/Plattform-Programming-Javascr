/**
 * Admin Routes
 * Admin-only routes for user management and analytics
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

// All routes require admin role
router.use(protect, requireAdmin);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// Analytics
router.get('/stats', adminController.getStats);

module.exports = router;
