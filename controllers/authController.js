/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 * Following MVC pattern and separation of concerns
 */

const {
    registerUser,
    loginUser,
    getUserById,
} = require('../services/authService');
const { asyncHandler } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    const { user, token } = await registerUser({
        email,
        username,
        password,
        role,
    });

    // Set cookie (optional, for browser clients)
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
        status: 'success',
        data: {
            user,
            token,
        },
    });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
    const { emailOrUsername, password } = req.body;

    const { user, token } = await loginUser(emailOrUsername, password);

    // Set cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
        status: 'success',
        data: {
            user,
            token,
        },
    });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clear cookie)
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
    res.cookie('token', 'loggedout', {
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 1000),
    });

    res.json({
        status: 'success',
        message: 'Logged out successfully',
    });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
    const user = await getUserById(req.user.id);

    res.json({
        status: 'success',
        data: {
            user,
        },
    });
});

/**
 * @route   GET /api/auth/verify
 * @desc    Verify token validity
 * @access  Private
 */
exports.verifyToken = asyncHandler(async (req, res) => {
    res.json({
        status: 'success',
        message: 'Token is valid',
        data: {
            user: req.user,
        },
    });
});
