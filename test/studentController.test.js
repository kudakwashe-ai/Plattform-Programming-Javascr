const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Siswa API Operations', () => {
    let testSiswaId;

    // Clean up or seed before tests if necessary
    beforeAll(async () => {
        // Optional: clear table or ensure state
    });

    afterAll(async () => {
        // Clean up created test data
        if (testSiswaId) {
            await prisma.siswa.delete({ where: { id: testSiswaId } }).catch(() => { });
        }
        await prisma.$disconnect();
    });

    // 8. Add the program code for the 'get' test
    test('GET /api/siswa should return all students', async () => {
        const response = await request(app).get('/api/siswa');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // 9. Add the program code for the 'post' test
    test('POST /api/siswa should create a new student', async () => {
        const newStudent = {
            nama: "Budi",
            umur: 17,
            alamat: "Jl. Merdeka No. 1"
        };
        const response = await request(app)
            .post('/api/siswa')
            .send(newStudent);

        expect(response.statusCode).toBe(201);
        expect(response.body.nama).toBe(newStudent.nama);
        testSiswaId = response.body.id;
    });

    // 10. Add the program code for the 'put' test
    test('PUT /api/siswa/:id should update a student', async () => {
        const updatedData = {
            nama: "Budi Updated",
            umur: 18,
            alamat: "Jl. Merdeka No. 2"
        };
        const response = await request(app)
            .put(`/api/siswa/${testSiswaId}`)
            .send(updatedData);

        expect(response.statusCode).toBe(200);
        expect(response.body.nama).toBe(updatedData.nama);
    });

    // 11. Add the program code for the 'delete' test
    test('DELETE /api/siswa/:id should delete a student', async () => {
        const response = await request(app).delete(`/api/siswa/${testSiswaId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Siswa deleted successfully");
        testSiswaId = null; // Mark as deleted so afterAll doesn't try again
    });
});
