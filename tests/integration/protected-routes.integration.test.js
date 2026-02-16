/**
 * Integration Tests for Protected Routes and RBAC
 * Testing role-based access control enforcement
 */

const request = require('supertest');
const app = require('../../app');
const { prisma } = require('../../config/db');

describe('Protected Routes and RBAC - Integration Tests', () => {
    let freeUserToken, premiumUserToken, adminToken;
    let testMovieId = 550; // Fight Club

    beforeAll(async () => {
        await prisma.$connect();

        // Create test users with different roles
        const freeUser = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'free@test.com',
                username: 'freeuser',
                password: 'Test@123',
                role: 'FREE',
            });
        freeUserToken = freeUser.body.data.token;

        const premiumUser = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'premium@test.com',
                username: 'premiumuser',
                password: 'Test@123',
                role: 'PREMIUM',
            });
        premiumUserToken = premiumUser.body.data.token;

        // Login as admin (would need to be seeded)
        // For this example, we'll upgrade the premium user to admin
        const premiumUserId = premiumUser.body.data.user.id;
        await prisma.user.update({
            where: { id: premiumUserId },
            data: { role: 'ADMIN' },
        });
        adminToken = premiumUserToken;
    });

    afterAll(async () => {
        await prisma.user.deleteMany({
            where: {
                email: {
                    contains: '@test.com'
                }
            }
        });
        await prisma.$disconnect();
    });

    describe('Watchlist Endpoints (Premium+)', () => {
        it('should allow premium user to access watchlist', async () => {
            const res = await request(app)
                .get('/api/users/watchlist')
                .set('Authorization', `Bearer ${premiumUserToken}`);

            expect(res.statusCode).toBe(200);
        });

        it('should reject free user from accessing watchlist', async () => {
            const res = await request(app)
                .get('/api/users/watchlist')
                .set('Authorization', `Bearer ${freeUserToken}`);

            expect(res.statusCode).toBe(403);
        });

        it('should allow premium user to add to watchlist', async () => {
            const res = await request(app)
                .post('/api/users/watchlist')
                .set('Authorization', `Bearer ${premiumUserToken}`)
                .send({
                    movieId: testMovieId,
                    movieType: 'movie',
                    title: 'Fight Club',
                    posterPath: '/test.jpg',
                    overview: 'Test overview',
                });

            expect(res.statusCode).toBe(201);
        });
    });

    describe('Review Endpoints', () => {
        it('should allow anyone to read reviews', async () => {
            const res = await request(app)
                .get(`/api/reviews/${testMovieId}`);

            expect(res.statusCode).toBe(200);
        });

        it('should allow premium user to create review', async () => {
            const res = await request(app)
                .post('/api/reviews')
                .set('Authorization', `Bearer ${premiumUserToken}`)
                .send({
                    movieId: testMovieId,
                    movieType: 'movie',
                    content: 'Great movie! Really enjoyed it.',
                    movieTitle: 'Fight Club',
                });

            expect(res.statusCode).toBe(201);
        });

        it('should reject free user from creating review', async () => {
            const res = await request(app)
                .post('/api/reviews')
                .set('Authorization', `Bearer ${freeUserToken}`)
                .send({
                    movieId: testMovieId,
                    movieType: 'movie',
                    content: 'Great movie!',
                    movieTitle: 'Fight Club',
                });

            expect(res.statusCode).toBe(403);
        });
    });

    describe('Admin Endpoints', () => {
        it('should allow admin to access user list', async () => {
            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.users).toBeDefined();
        });

        it('should reject premium user from admin endpoints', async () => {
            // First get a fresh premium token
            const newPremium = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'premium2@test.com',
                    username: 'premium2',
                    password: 'Test@123',
                    role: 'PREMIUM',
                });

            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${newPremium.body.data.token}`);

            expect(res.statusCode).toBe(403);
        });

        it('should reject free user from admin endpoints', async () => {
            const res = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${freeUserToken}`);

            expect(res.statusCode).toBe(403);
        });
    });

    describe('Public Movie Endpoints', () => {
        it('should allow unauthenticated access to movie search', async () => {
            const res = await request(app)
                .get('/api/movies/search?query=fight');

            expect(res.statusCode).toBe(200);
        });

        it('should allow unauthenticated access to trending', async () => {
            const res = await request(app)
                .get('/api/movies/trending');

            expect(res.statusCode).toBe(200);
        });
    });
});
