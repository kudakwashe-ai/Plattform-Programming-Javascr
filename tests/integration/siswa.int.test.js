const request = require('supertest');
const app = require('../../app');
const prisma = require('../../prisma/client');

describe('Siswa Integration Tests', () => {
    let testSiswaId;

    afterAll(async () => {
        if (testSiswaId) {
            await prisma.siswa.delete({ where: { id: testSiswaId } }).catch(() => { });
        }
        await prisma.$disconnect();
    });

    it('should create a new student', async () => {
        const newStudent = {
            nama: "Budi Integration",
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

    it('should get all students', async () => {
        const response = await request(app).get('/api/siswa');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.some(s => s.id === testSiswaId)).toBe(true);
    });

    it('should update a student', async () => {
        const updatedData = {
            nama: "Budi Updated Integr",
            umur: 18,
            alamat: "Jl. Merdeka No. 2"
        };
        const response = await request(app)
            .put(`/api/siswa/${testSiswaId}`)
            .send(updatedData);

        expect(response.statusCode).toBe(200);
        expect(response.body.nama).toBe(updatedData.nama);
    });

    it('should delete a student', async () => {
        const response = await request(app).delete(`/api/siswa/${testSiswaId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Siswa deleted successfully");
        testSiswaId = null;
    });
});
