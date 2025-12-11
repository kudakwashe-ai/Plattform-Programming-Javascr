const prisma = require('../prisma/client');

/**
 * User Service
 * Handles all database operations for User model
 */

class UserService {
    /**
     * Get all users
     * @returns {Promise<Array>} List of all users
     */
    async getAllUsers() {
        return await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    /**
     * Get user by ID
     * @param {string} id - User ID
     * @returns {Promise<Object|null>} User object or null
     */
    async getUserById(id) {
        return await prisma.user.findUnique({
            where: { id }
        });
    }

    /**
     * Create a new user
     * @param {Object} userData - User data { name, email }
     * @returns {Promise<Object>} Created user
     */
    async createUser(userData) {
        const { name, email } = userData;
        return await prisma.user.create({
            data: {
                name,
                email
            }
        });
    }

    /**
     * Update user by ID
     * @param {string} id - User ID
     * @param {Object} userData - Updated user data
     * @returns {Promise<Object>} Updated user
     */
    async updateUser(id, userData) {
        const updateData = {};
        if (userData.name) updateData.name = userData.name;
        if (userData.email) updateData.email = userData.email;

        return await prisma.user.update({
            where: { id },
            data: updateData
        });
    }

    /**
     * Delete user by ID
     * @param {string} id - User ID
     * @returns {Promise<Object>} Deleted user
     */
    async deleteUser(id) {
        return await prisma.user.delete({
            where: { id }
        });
    }

    /**
     * Check if email exists
     * @param {string} email - Email address
     * @returns {Promise<boolean>} True if email exists
     */
    async emailExists(email) {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        return !!user;
    }
}

module.exports = new UserService();
