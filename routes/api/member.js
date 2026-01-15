const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { checkRole } = require('../../middleware/roles');
const memberController = require('../../controllers/memberController');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/cvs');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDFs are allowed'));
    }
});

// Protect routes
router.use(checkRole('USER'));

router.get('/dashboard', memberController.getDashboard);
router.get('/profile/edit', memberController.getEditProfile);
router.post('/profile/edit', upload.single('cv'), memberController.postUpdateProfile);
router.post('/jobs/:id/apply', memberController.postApply);

module.exports = router;
