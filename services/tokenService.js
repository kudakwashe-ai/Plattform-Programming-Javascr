/**
 * Token Service
 * Centralized service for token management (JWT)
 * Handles generation, verification, and decoding of tokens
 */

const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../utils/errors');

/**
 * Generate a JWT token
 * @param {Object} payload - Data to include in the token
 * @param {Object} options - JWT sign options (expiresIn, etc.)
 * @returns {string} Signed JWT token
 */
const generateToken = (payload, options = {}) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = options.expiresIn || process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign(payload, secret, { ...options, expiresIn });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload
 * @throws {AuthenticationError} If token is invalid or expired
 */
const verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET;
        return jwt.verify(token, secret);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AuthenticationError('Token has expired');
        }
        throw new AuthenticationError('Invalid token');
    }
};

/**
 * Decode a JWT token without verifying signature
 * Useful for client-side inspections or pre-verification checks
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null
 */
const decodeToken = (token) => {
    return jwt.decode(token);
};

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
};
