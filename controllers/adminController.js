/**
 * Admin Controller
 * Handles HTTP requests for admin-only endpoints
 * User management and analytics
 */

const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/authMiddleware');
const { ValidationError, NotFoundError } = require('../utils/errors');

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination
 * @access  Private (Admin only)
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                firstName: true,
                lastName: true,
                isActive: true,
                createdAt: true,
                _count: {
                    select: {
                        watchlist: true,
                        favorites: true,
                        reviews: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count(),
    ]);

    res.json({
        status: 'success',
        data: {
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        },
    });
});

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role
 * @access  Private (Admin only)
 */
exports.updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const validRoles = ['FREE', 'PREMIUM', 'ADMIN'];

    if (!validRoles.includes(role)) {
        throw new ValidationError('Invalid role');
    }

    const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { role },
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
            updatedAt: true,
        },
    });

    res.json({
        status: 'success',
        data: { user },
    });
});

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Activate/deactivate user account
 * @access  Private (Admin only)
 */
exports.updateUserStatus = asyncHandler(async (req, res) => {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
        throw new ValidationError('isActive must be a boolean');
    }

    const user = await prisma.user.update({
        where: { id: req.params.id },
        data: { isActive },
        select: {
            id: true,
            email: true,
            username: true,
            isActive: true,
            updatedAt: true,
        },
    });

    res.json({
        status: 'success',
        data: { user },
    });
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user
 * @access  Private (Admin only)
 */
exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
    });

    if (!user) {
        throw new NotFoundError('User not found');
    }

    // Prevent deleting yourself
    if (user.id === req.user.id) {
        throw new ValidationError('You cannot delete your own account');
    }

    await prisma.user.delete({
        where: { id: req.params.id },
    });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

/**
 * @route   GET /api/admin/stats
 * @desc    Get application statistics
 * @access  Private (Admin only)
 */
exports.getStats = asyncHandler(async (req, res) => {
    const [
        totalUsers,
        freeUsers,
        premiumUsers,
        adminUsers,
        totalReviews,
        totalWatchlist,
        totalFavorites,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'FREE' } }),
        prisma.user.count({ where: { role: 'PREMIUM' } }),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.review.count(),
        prisma.watchlist.count(),
        prisma.favorite.count(),
    ]);

    // Get recent activity
    const recentReviews = await prisma.review.findMany({
        take: 5,
        include: {
            user: {
                select: {
                    username: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    res.json({
        status: 'success',
        data: {
            stats: {
                users: {
                    total: totalUsers,
                    free: freeUsers,
                    premium: premiumUsers,
                    admin: adminUsers,
                },
                content: {
                    reviews: totalReviews,
                    watchlist: totalWatchlist,
                    favorites: totalFavorites,
                },
            },
            recentReviews,
        },
    });
});
