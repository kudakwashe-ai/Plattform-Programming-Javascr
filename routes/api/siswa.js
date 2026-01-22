const express = require('express');
const router = express.Router();
const siswaController = require('../../controllers/siswaController');

router.get('/', siswaController.getAllSiswa);
router.get('/:id', siswaController.getSiswaById);
router.post('/', siswaController.createSiswa);
router.put('/:id', siswaController.updateSiswa);
router.delete('/:id', siswaController.deleteSiswa);

module.exports = router;
