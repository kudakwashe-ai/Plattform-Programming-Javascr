const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { isGuest } = require('../../middleware/auth');

// Pages
router.get('/login', isGuest, (req, res) => {
    res.render('auth/login', { message: null });
});

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register', { message: null });
});

// Actions
router.post('/login', isGuest, authController.login);
router.post('/register', isGuest, authController.register);
router.get('/logout', authController.logout);

module.exports = router;
