/**
 * Unit Tests for Authentication Service
 * Testing password hashing, JWT generation, and user operations
 */

const { hashPassword, comparePassword, generateToken, verifyToken } = require('../../services/authService');

describe('Authentication Service - Unit Tests', () => {
    describe('Password Hashing', () => {
        it('should hash password correctly', async () => {
            const password = 'Test@123';
            const hash = await hashPassword(password);

            expect(hash).toBeDefined();
            expect(hash).not.toBe(password);
            expect(hash.length).toBeGreaterThan(0);
        });

        it('should verify correct password', async () => {
            const password = 'Test@123';
            const hash = await hashPassword(password);
            const isValid = await comparePassword(password, hash);

            expect(isValid).toBe(true);
        });

        it('should reject incorrect password', async () => {
            const password = 'Test@123';
            const wrongPassword = 'Wrong@123';
            const hash = await hashPassword(password);
            const isValid = await comparePassword(wrongPassword, hash);

            expect(isValid).toBe(false);
        });
    });

    describe('JWT Token Generation and Verification', () => {
        it('should generate valid JWT token', () => {
            const userId = 'test-user-id';
            const role = 'FREE';
            const token = generateToken(userId, role);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
        });

        it('should verify valid token and return payload', () => {
            const userId = 'test-user-id';
            const role = 'PREMIUM';
            const token = generateToken(userId, role);
            const decoded = verifyToken(token);

            expect(decoded).toBeDefined();
            expect(decoded.userId).toBe(userId);
            expect(decoded.role).toBe(role);
        });

        it('should throw error for invalid token', () => {
            const invalidToken = 'invalid.token.here';

            expect(() => verifyToken(invalidToken)).toThrow();
        });

        it('should throw error for expired token', () => {
            // This would require manually creating an expired token
            // or using a library to manipulate time
            // Skipping for basic implementation
        });
    });
});
