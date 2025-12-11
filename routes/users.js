const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * User Routes
 * All routes delegate to the UserController
 */

// GET /users - Get all users
router.get('/', userController.getAllUsers.bind(userController));

// POST /users - Create a new user
router.post('/', userController.createUser.bind(userController));

// GET /users/:id - Get user by ID
router.get('/:id', userController.getUserById.bind(userController));

// PUT /users/:id - Update user
router.put('/:id', userController.updateUser.bind(userController));

// DELETE /users/:id - Delete user
router.delete('/:id', userController.deleteUser.bind(userController));

module.exports = router;
