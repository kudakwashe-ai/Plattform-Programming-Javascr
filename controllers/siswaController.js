const prisma = require('../prisma/client');

exports.getAllSiswa = async (req, res) => {
    try {
        const siswa = await prisma.siswa.findMany();
        res.status(200).json(siswa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSiswaById = async (req, res) => {
    try {
        const siswa = await prisma.siswa.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!siswa) return res.status(404).json({ message: "Siswa not found" });
        res.status(200).json(siswa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createSiswa = async (req, res) => {
    try {
        const { nama, umur, alamat } = req.body;
        const newSiswa = await prisma.siswa.create({
            data: { nama, umur: parseInt(umur), alamat }
        });
        res.status(201).json(newSiswa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateSiswa = async (req, res) => {
    try {
        const { nama, umur, alamat } = req.body;
        const updatedSiswa = await prisma.siswa.update({
            where: { id: parseInt(req.params.id) },
            data: { nama, umur: parseInt(umur), alamat }
        });
        res.status(200).json(updatedSiswa);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteSiswa = async (req, res) => {
    try {
        await prisma.siswa.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.status(200).json({ message: "Siswa deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
