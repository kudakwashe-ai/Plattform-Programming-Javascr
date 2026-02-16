/**
 * Token Controller
 * Handles HTTP requests for token operations
 */

const tokenService = require('../services/tokenService');
const { asyncHandler } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/tokens/verify
 * @desc    Verify a token and return its payload
 * @access  Public (or semi-protected depending on use case)
 */
exports.verify = asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            status: 'fail',
            message: 'Token is required',
        });
    }

    const payload = tokenService.verifyToken(token);

    res.json({
        status: 'success',
        data: {
            payload,
        },
    });
});

/**
 * @route   POST /api/tokens/decode
 * @desc    Decode a token without verification
 * @access  Public
 */
exports.decode = asyncHandler(async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            status: 'fail',
            message: 'Token is required',
        });
    }

    const payload = tokenService.decodeToken(token);

    res.json({
        status: 'success',
        data: {
            payload,
        },
    });
});
