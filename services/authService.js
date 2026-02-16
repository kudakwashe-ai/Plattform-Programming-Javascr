/**
 * Authentication Service
 * Core business logic for user authentication and authorization
 * Following separation of concerns principle used at top tech companies
 */

const bcrypt = require('bcryptjs');
const tokenService = require('./tokenService');
const { prisma } = require('../config/db');
const {
    AuthenticationError,
    ConflictError,
    ValidationError
} = require('../utils/errors');

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    return await bcrypt.hash(password, rounds);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if match
 */
const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {string} JWT token
 */
const generateToken = (userId, role) => {
    return tokenService.generateToken({ userId, role });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
    return tokenService.verifyToken(token);
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user and token
 */
const registerUser = async ({ email, username, password, role = 'FREE' }) => {
    // Validate role
    const validRoles = ['FREE', 'PREMIUM', 'ADMIN'];
    if (!validRoles.includes(role)) {
        throw new ValidationError('Invalid role');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() },
            ],
        },
    });

    if (existingUser) {
        if (existingUser.email === email.toLowerCase()) {
            throw new ConflictError('Email already registered');
        }
        throw new ConflictError('Username already taken');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            username: username.toLowerCase(),
            password: hashedPassword,
            role: role,
        },
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
            firstName: true,
            lastName: true,
            avatar: true,
            createdAt: true,
        },
    });

    // Generate token
    const token = generateToken(user.id, user.role);

    return { user, token };
};

/**
 * Login user
 * @param {string} emailOrUsername - Email or username
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} User and token
 */
const loginUser = async (emailOrUsername, password) => {
    // Find user by email or username
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: emailOrUsername.toLowerCase() },
                { username: emailOrUsername.toLowerCase() },
            ],
        },
    });

    if (!user) {
        throw new AuthenticationError('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
        throw new AuthenticationError('Account is deactivated. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new AuthenticationError('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
            firstName: true,
            lastName: true,
            avatar: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) {
        throw new AuthenticationError('User not found');
    }

    return user;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Promise<Object>} Updated user
 */
const updateUserProfile = async (userId, updates) => {
    const allowedUpdates = ['firstName', 'lastName', 'avatar'];
    const filteredUpdates = {};

    Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
            filteredUpdates[key] = updates[key];
        }
    });

    const user = await prisma.user.update({
        where: { id: userId },
        data: filteredUpdates,
        select: {
            id: true,
            email: true,
            username: true,
            role: true,
            firstName: true,
            lastName: true,
            avatar: true,
            updatedAt: true,
        },
    });

    return user;
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
    registerUser,
    loginUser,
    getUserById,
    updateUserProfile,
};
