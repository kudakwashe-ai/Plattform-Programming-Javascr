const request = require('supertest');
const app = require('../../app');
const prisma = require('../../prisma/client');

describe('Auth Integration Tests', () => {
    const testUser = {
        name: 'Test Integration',
        email: 'integration@example.com',
        password: 'password123'
    };

    beforeAll(async () => {
        await prisma.user.deleteMany({ where: { email: testUser.email } });
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { email: testUser.email } });
        await prisma.$disconnect();
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send(testUser);

        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/auth/login');

        const user = await prisma.user.findUnique({ where: { email: testUser.email } });
        expect(user).toBeTruthy();
    });

    it('should login the user', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/member/dashboard');
    });
});
