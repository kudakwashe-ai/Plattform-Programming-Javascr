/**
 * Review Routes
 * Public and protected routes for movie reviews
 */

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, requirePremium } = require('../middleware/authMiddleware');
const {
    validateReview,
    validateUpdateReview,
} = require('../middleware/validationMiddleware');

// Public routes
router.get('/:movieId', reviewController.getReviews);

// Protected routes (Premium+)
router.post('/', protect, requirePremium, validateReview, reviewController.createReview);
router.put('/:id', protect, validateUpdateReview, reviewController.updateReview);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
