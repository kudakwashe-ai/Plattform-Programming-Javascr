/**
 * Authentication Routes
 * Defines all authentication-related endpoints
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
    validateRegister,
    validateLogin,
} = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.get('/verify', protect, authController.verifyToken);

module.exports = router;
