const { getAllSiswa, createSiswa } = require('../../controllers/siswaController');
const { prismaMock } = require('./helpers/prismaMock');

describe('Siswa Unit Tests', () => {
    let req, res;

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('getAllSiswa', () => {
        it('should return all students', async () => {
            const siswaList = [{ id: 1, nama: 'Budi', umur: 17, alamat: 'Jakarta' }];
            prismaMock.siswa.findMany.mockResolvedValue(siswaList);

            await getAllSiswa(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(siswaList);
        });
    });

    describe('createSiswa', () => {
        it('should create and return new student', async () => {
            const newSiswa = { nama: 'Budi', umur: 17, alamat: 'Jakarta' };
            req.body = newSiswa;
            prismaMock.siswa.create.mockResolvedValue({ id: 1, ...newSiswa });

            await createSiswa(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1, nama: 'Budi' }));
        });
    });
});
