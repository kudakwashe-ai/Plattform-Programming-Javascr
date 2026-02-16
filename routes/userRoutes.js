/**
 * User Routes
 * Protected routes for user-related operations
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, requirePremium } = require('../middleware/authMiddleware');
const {
    validateUpdateProfile,
    validateWatchlist,
    validateFavorite,
    validateRating,
} = require('../middleware/validationMiddleware');

// All routes require authentication
router.use(protect);

// Profile management
router.put('/profile', validateUpdateProfile, userController.updateProfile);

// Watchlist routes (Premium+)
router.get('/watchlist', requirePremium, userController.getWatchlist);
router.post('/watchlist', requirePremium, validateWatchlist, userController.addToWatchlist);
router.delete('/watchlist/:id', requirePremium, userController.removeFromWatchlist);

// Favorites routes (Premium+)
router.get('/favorites', requirePremium, userController.getFavorites);
router.post('/favorites', requirePremium, validateFavorite, userController.addToFavorites);
router.delete('/favorites/:id', requirePremium, userController.removeFromFavorites);

// Ratings routes (Premium+)
router.post('/ratings', requirePremium, validateRating, userController.setRating);
router.get('/ratings/:movieId', userController.getRating);

module.exports = router;
