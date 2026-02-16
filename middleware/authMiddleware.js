/**
 * Authentication Middleware
 * JWT verification and Role-Based Access Control (RBAC)
 * Following security best practices from Meta, Google, Anthropic
 */

const { getUserById } = require('../services/authService');
const { verifyToken } = require('../services/tokenService');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');

/**
 * Async handler wrapper
 * Catches async errors and passes to error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Protect routes - requires valid JWT
 * Adds user object to request
 */
const protect = asyncHandler(async (req, res, next) => {
    // 1. Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        throw new AuthenticationError('You are not logged in. Please log in to get access.');
    }

    // 2. Verify token
    const decoded = verifyToken(token);

    // 3. Check if user still exists
    const user = await getUserById(decoded.userId);

    if (!user.isActive) {
        throw new AuthenticationError('User account is deactivated');
    }

    // 4. Grant access to protected route
    req.user = user;
    next();
});

/**
 * Optional authentication
 * Adds user to request if token is present, but doesn't require it
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (token) {
        try {
            const decoded = verifyToken(token);
            const user = await getUserById(decoded.userId);
            if (user.isActive) {
                req.user = user;
            }
        } catch (error) {
            // Token invalid, continue without user
            console.log('Optional auth failed:', error.message);
        }
    }

    next();
});

/**
 * Restrict routes to specific roles
 * Must be used after protect middleware
 * @param  {...string} roles - Allowed roles
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new AuthenticationError('You must be logged in to access this resource');
        }

        if (!roles.includes(req.user.role)) {
            throw new AuthorizationError(
                `You do not have permission to perform this action. Required role: ${roles.join(' or ')}`
            );
        }

        next();
    };
};

/**
 * Check if user owns the resource
 * Admins can access any resource
 */
const checkOwnership = (resourceUserIdField = 'userId') => {
    return asyncHandler(async (req, res, next) => {
        const resourceUserId = req.body[resourceUserIdField] || req.params[resourceUserIdField];

        // Admins can access any resource
        if (req.user.role === 'ADMIN') {
            return next();
        }

        // Check ownership
        if (resourceUserId !== req.user.id) {
            throw new AuthorizationError('You can only access your own resources');
        }

        next();
    });
};

/**
 * Require premium or admin role
 * Shorthand for common restriction
 */
const requirePremium = restrictTo('PREMIUM', 'ADMIN');

/**
 * Require admin role
 * Shorthand for admin-only routes
 */
const requireAdmin = restrictTo('ADMIN');

module.exports = {
    asyncHandler,
    protect,
    optionalAuth,
    restrictTo,
    checkOwnership,
    requirePremium,
    requireAdmin,
};
