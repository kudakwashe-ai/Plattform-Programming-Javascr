const request = require('supertest');
const app = require('../../app');
const prisma = require('../../prisma/client');

describe('Vacancies Integration Tests', () => {
    let testJobId;

    beforeAll(async () => {
        const job = await prisma.job.create({
            data: {
                title: 'Software Engineer Test',
                company: 'Test Tech Corp',
                location: 'Remote',
                type: 'FULL_TIME',
                category: 'Engineering',
                description: 'Build great things',
                requirements: 'Node.js, Prisma',
                deadline: new Date(Date.now() + 86400000),
                isActive: true
            }
        });
        testJobId = job.id;
    });

    afterAll(async () => {
        await prisma.job.deleteMany({ where: { id: testJobId } });
        await prisma.$disconnect();
    });

    it('should list all active jobs', async () => {
        const response = await request(app).get('/jobs');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Software Engineer Test');
    });

    it('should show job details', async () => {
        const response = await request(app).get(`/jobs/${testJobId}`);
        expect(response.status).toBe(200);
        expect(response.text).toContain('Test Tech Corp');
    });
});
