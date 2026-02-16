/**
 * User Controller
 * Handles HTTP requests for user-related endpoints
 * Watchlist, favorites, and profile management
 */

const { updateUserProfile } = require('../services/authService');
const userService = require('../services/userService');
const { asyncHandler } = require('../middleware/authMiddleware');

// ========== Profile Management ==========

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
    const user = await updateUserProfile(req.user.id, req.body);

    res.json({
        status: 'success',
        data: { user },
    });
});

// ========== Watchlist Operations ==========

/**
 * @route   GET /api/users/watchlist
 * @desc    Get user's watchlist
 * @access  Private (Premium+)
 */
exports.getWatchlist = asyncHandler(async (req, res) => {
    const watchlist = await userService.getWatchlist(req.user.id);

    res.json({
        status: 'success',
        data: { watchlist },
    });
});

/**
 * @route   POST /api/users/watchlist
 * @desc    Add item to watchlist
 * @access  Private (Premium+)
 */
exports.addToWatchlist = asyncHandler(async (req, res) => {
    const item = await userService.addToWatchlist(req.user.id, req.body);

    res.status(201).json({
        status: 'success',
        data: { item },
    });
});

/**
 * @route   DELETE /api/users/watchlist/:id
 * @desc    Remove item from watchlist
 * @access  Private (Premium+)
 */
exports.removeFromWatchlist = asyncHandler(async (req, res) => {
    await userService.removeFromWatchlist(req.user.id, req.params.id);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

// ========== Favorites Operations ==========

/**
 * @route   GET /api/users/favorites
 * @desc    Get user's favorites
 * @access  Private (Premium+)
 */
exports.getFavorites = asyncHandler(async (req, res) => {
    const favorites = await userService.getFavorites(req.user.id);

    res.json({
        status: 'success',
        data: { favorites },
    });
});

/**
 * @route   POST /api/users/favorites
 * @desc    Add item to favorites
 * @access  Private (Premium+)
 */
exports.addToFavorites = asyncHandler(async (req, res) => {
    const item = await userService.addToFavorites(req.user.id, req.body);

    res.status(201).json({
        status: 'success',
        data: { item },
    });
});

/**
 * @route   DELETE /api/users/favorites/:id
 * @desc    Remove item from favorites
 * @access  Private (Premium+)
 */
exports.removeFromFavorites = asyncHandler(async (req, res) => {
    await userService.removeFromFavorites(req.user.id, req.params.id);

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

// ========== Ratings ==========

/**
 * @route   POST /api/users/ratings
 * @desc    Set rating for a movie
 * @access  Private (Premium+)
 */
exports.setRating = asyncHandler(async (req, res) => {
    const rating = await userService.setRating(req.user.id, req.body);

    res.json({
        status: 'success',
        data: { rating },
    });
});

/**
 * @route   GET /api/users/ratings/:movieId
 * @desc    Get user's rating for a movie
 * @access  Private
 */
exports.getRating = asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.movieId);
    const movieType = req.query.type || 'movie';

    const rating = await userService.getUserRating(req.user.id, movieId, movieType);

    res.json({
        status: 'success',
        data: { rating },
    });
});
