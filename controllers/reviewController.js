/**
 * Review Controller
 * Handles HTTP requests for review endpoints
 */

const userService = require('../services/userService');
const { asyncHandler } = require('../middleware/authMiddleware');
const { AuthorizationError } = require('../utils/errors');

/**
 * @route   GET /api/reviews/:movieId
 * @desc    Get reviews for a movie
 * @access  Public
 */
exports.getReviews = asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.movieId);
    const movieType = req.query.type || 'movie';

    const reviews = await userService.getReviewsForMovie(movieId, movieType);

    res.json({
        status: 'success',
        data: { reviews },
    });
});

/**
 * @route   POST /api/reviews
 * @desc    Create a review
 * @access  Private (Premium+)
 */
exports.createReview = asyncHandler(async (req, res) => {
    const review = await userService.createReview(req.user.id, req.body);

    res.status(201).json({
        status: 'success',
        data: { review },
    });
});

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review
 * @access  Private (Owner only)
 */
exports.updateReview = asyncHandler(async (req, res) => {
    const review = await userService.getReviewById(req.params.id);

    // Check ownership (admins can update any review)
    if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
        throw new AuthorizationError('You can only update your own reviews');
    }

    const updatedReview = await userService.updateReview(req.params.id, req.body.content);

    res.json({
        status: 'success',
        data: { review: updatedReview },
    });
});

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private (Owner or Admin)
 */
exports.deleteReview = asyncHandler(async (req, res) => {
    const review = await userService.getReviewById(req.params.id);

    // Check ownership (admins can delete any review)
    if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
        throw new AuthorizationError('You can only delete your own reviews');
    }

    await userService.deleteReview(req.params.id);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
