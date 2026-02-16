/**
 * User Service
 * Business logic for user-related operations
 * Handles watchlist, favorites, reviews, and user management
 */

const { prisma } = require('../config/db');
const { NotFoundError, ConflictError, AuthorizationError } = require('../utils/errors');

// ========== Watchlist Operations ==========

/**
 * Get user's watchlist
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Watchlist items
 */
const getWatchlist = async (userId) => {
    return await prisma.watchlist.findMany({
        where: { userId },
        orderBy: { addedAt: 'desc' },
    });
};

/**
 * Add item to watchlist
 * @param {string} userId - User ID
 * @param {Object} item - Watchlist item data
 * @returns {Promise<Object>} Created watchlist item
 */
const addToWatchlist = async (userId, item) => {
    // Check if already in watchlist
    const existing = await prisma.watchlist.findUnique({
        where: {
            userId_movieId_movieType: {
                userId,
                movieId: item.movieId,
                movieType: item.movieType,
            },
        },
    });

    if (existing) {
        throw new ConflictError('Item already in watchlist');
    }

    return await prisma.watchlist.create({
        data: {
            userId,
            ...item,
        },
    });
};

/**
 * Remove item from watchlist
 * @param {string} userId - User ID
 * @param {string} watchlistId - Watchlist item ID
 * @returns {Promise<Object>} Deleted item
 */
const removeFromWatchlist = async (userId, watchlistId) => {
    const item = await prisma.watchlist.findUnique({
        where: { id: watchlistId },
    });

    if (!item) {
        throw new NotFoundError('Watchlist item not found');
    }

    if (item.userId !== userId) {
        throw new AuthorizationError('You can only remove your own watchlist items');
    }

    return await prisma.watchlist.delete({
        where: { id: watchlistId },
    });
};

// ========== Favorites Operations ==========

/**
 * Get user's favorites
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Favorite items
 */
const getFavorites = async (userId) => {
    return await prisma.favorite.findMany({
        where: { userId },
        orderBy: { addedAt: 'desc' },
    });
};

/**
 * Add item to favorites
 * @param {string} userId - User ID
 * @param {Object} item - Favorite item data
 * @returns {Promise<Object>} Created favorite item
 */
const addToFavorites = async (userId, item) => {
    const existing = await prisma.favorite.findUnique({
        where: {
            userId_movieId_movieType: {
                userId,
                movieId: item.movieId,
                movieType: item.movieType,
            },
        },
    });

    if (existing) {
        throw new ConflictError('Item already in favorites');
    }

    return await prisma.favorite.create({
        data: {
            userId,
            ...item,
        },
    });
};

/**
 * Remove item from favorites
 * @param {string} userId - User ID
 * @param {string} favoriteId - Favorite item ID
 * @returns {Promise<Object>} Deleted item
 */
const removeFromFavorites = async (userId, favoriteId) => {
    const item = await prisma.favorite.findUnique({
        where: { id: favoriteId },
    });

    if (!item) {
        throw new NotFoundError('Favorite item not found');
    }

    if (item.userId !== userId) {
        throw new AuthorizationError('You can only remove your own favorite items');
    }

    return await prisma.favorite.delete({
        where: { id: favoriteId },
    });
};

// ========== Review Operations ==========

/**
 * Get reviews for a movie
 * @param {number} movieId - Movie ID
 * @param {string} movieType - 'movie' or 'tv'
 * @returns {Promise<Array>} Reviews
 */
const getReviewsForMovie = async (movieId, movieType) => {
    return await prisma.review.findMany({
        where: { movieId, movieType },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};

/**
 * Create review
 * @param {string} userId - User ID
 * @param {Object} reviewData - Review data
 * @returns {Promise<Object>} Created review
 */
const createReview = async (userId, reviewData) => {
    const existing = await prisma.review.findUnique({
        where: {
            userId_movieId_movieType: {
                userId,
                movieId: reviewData.movieId,
                movieType: reviewData.movieType,
            },
        },
    });

    if (existing) {
        throw new ConflictError('You have already reviewed this item');
    }

    return await prisma.review.create({
        data: {
            userId,
            ...reviewData,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
        },
    });
};

/**
 * Update review
 * @param {string} reviewId - Review ID
 * @param {string} content - Updated content
 * @returns {Promise<Object>} Updated review
 */
const updateReview = async (reviewId, content) => {
    return await prisma.review.update({
        where: { id: reviewId },
        data: { content },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
        },
    });
};

/**
 * Delete review
 * @param {string} reviewId - Review ID
 * @returns {Promise<Object>} Deleted review
 */
const deleteReview = async (reviewId) => {
    return await prisma.review.delete({
        where: { id: reviewId },
    });
};

/**
 * Get review by ID
 * @param {string} reviewId - Review ID
 * @returns {Promise<Object>} Review
 */
const getReviewById = async (reviewId) => {
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
        },
    });

    if (!review) {
        throw new NotFoundError('Review not found');
    }

    return review;
};

// ========== Rating Operations ==========

/**
 * Set rating for a movie
 * @param {string} userId - User ID
 * @param {Object} ratingData - Rating data
 * @returns {Promise<Object>} Created/updated rating
 */
const setRating = async (userId, ratingData) => {
    return await prisma.rating.upsert({
        where: {
            userId_movieId_movieType: {
                userId,
                movieId: ratingData.movieId,
                movieType: ratingData.movieType,
            },
        },
        update: {
            rating: ratingData.rating,
        },
        create: {
            userId,
            ...ratingData,
        },
    });
};

/**
 * Get user's rating for a movie
 * @param {string} userId - User ID
 * @param {number} movieId - Movie ID
 * @param {string} movieType - 'movie' or 'tv'
 * @returns {Promise<Object|null>} Rating or null
 */
const getUserRating = async (userId, movieId, movieType) => {
    return await prisma.rating.findUnique({
        where: {
            userId_movieId_movieType: {
                userId,
                movieId,
                movieType,
            },
        },
    });
};

module.exports = {
    // Watchlist
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    // Favorites
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    // Reviews
    getReviewsForMovie,
    createReview,
    updateReview,
    deleteReview,
    getReviewById,
    // Ratings
    setRating,
    getUserRating,
};
