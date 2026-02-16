/**
 * Movie Controller
 * Handles HTTP requests for movie-related endpoints
 * Refactored to use movieService for clean separation of concerns
 */

const movieService = require('../services/movieService');
const { asyncHandler } = require('../middleware/authMiddleware');
const { AppError } = require('../utils/errors');

/**
 * @route   GET /api/movies/search
 * @desc    Search movies/TV shows
 * @access  Public (optional auth for personalization)
 */
exports.searchMovies = asyncHandler(async (req, res) => {
    const query = req.query.query;
    const genre = req.query.genre;
    const isFree = req.query.free === 'true';
    const page = parseInt(req.query.page) || 1;

    const results = await movieService.searchMovies({
        query,
        genre,
        isFree,
        page,
    });

    res.json({
        status: 'success',
        data: results,
        // Include user info if authenticated
        authenticated: !!req.user,
    });
});

/**
 * @route   GET /api/movies/providers/:id
 * @desc    Get watch providers for a movie/TV show
 * @access  Public
 */
exports.getProviders = asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.id);
    const type = req.query.type || 'movie';

    const providers = await movieService.getProviders(movieId, type);

    res.json({
        status: 'success',
        data: providers,
    });
});

/**
 * @route   GET /api/movies/trailer/:id
 * @desc    Get trailer for a movie/TV show
 * @access  Public
 */
exports.getTrailer = asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.id);
    const type = req.query.type || 'movie';

    const trailer = await movieService.getTrailer(movieId, type);

    if (!trailer) {
        throw new AppError('No trailer found for this item', 404);
    }

    res.json({
        status: 'success',
        data: trailer,
    });
});

/**
 * @route   GET /api/movies/details/:id
 * @desc    Get movie/TV show details
 * @access  Public
 */
exports.getDetails = asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.id);
    const type = req.query.type || 'movie';

    const details = await movieService.getMovieDetails(movieId, type);

    res.json({
        status: 'success',
        data: details,
    });
});

/**
 * @route   GET /api/movies/trending
 * @desc    Get trending movies/TV shows
 * @access  Public
 */
exports.getTrending = asyncHandler(async (req, res) => {
    const timeWindow = req.query.timeWindow || 'day';

    const trending = await movieService.getTrending(timeWindow);

    res.json({
        status: 'success',
        data: trending,
    });
});

