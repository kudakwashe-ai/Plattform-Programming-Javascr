/**
 * Integration Tests for Authentication Endpoints
 * Testing register, login, and protected routes
 */

const request = require('supertest');
const app = require('../../app');
const { prisma } = require('../../config/db');

describe('Authentication Endpoints - Integration Tests', () => {
    // Clean up database before and after tests
    beforeAll(async () => {
        // Connect to test database
        await prisma.$connect();
    });

    afterAll(async () => {
        // Clean up and disconnect
        await prisma.user.deleteMany({
            where: {
                email: {
                    contains: 'test@'
                }
            }
        });
        await prisma.$disconnect();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    username: 'testuser',
                    password: 'Test@123',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.data.user).toBeDefined();
            expect(res.body.data.token).toBeDefined();
            expect(res.body.data.user.email).toBe('test@example.com');
            expect(res.body.data.user.password).toBeUndefined(); // Password should not be returned
        });

        it('should reject duplicate email', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    username: 'anotheruser',
                    password: 'Test@123',
                });

            expect(res.statusCode).toBe(409);
            expect(res.body.message).toContain('already');
        });

        it('should reject weak password', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test2@example.com',
                    username: 'testuser2',
                    password: 'weak',
                });

            expect(res.statusCode).toBe(400);
        });

        it('should reject invalid email', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    username: 'testuser3',
                    password: 'Test@123',
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    emailOrUsername: 'test@example.com',
                    password: 'Test@123',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data.user).toBeDefined();
            expect(res.body.data.token).toBeDefined();
        });

        it('should reject invalid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    emailOrUsername: 'test@example.com',
                    password: 'WrongPassword@123',
                });

            expect(res.statusCode).toBe(401);
        });

        it('should reject non-existent user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    emailOrUsername: 'nonexistent@example.com',
                    password: 'Test@123',
                });

            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/auth/me', () => {
        let authToken;

        beforeAll(async () => {
            // Login to get token
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    emailOrUsername: 'test@example.com',
                    password: 'Test@123',
                });
            authToken = res.body.data.token;
        });

        it('should get current user with valid token', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.user.email).toBe('test@example.com');
        });

        it('should reject request without token', async () => {
            const res = await request(app)
                .get('/api/auth/me');

            expect(res.statusCode).toBe(401);
        });

        it('should reject request with invalid token', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token');

            expect(res.statusCode).toBe(401);
        });
    });
});
