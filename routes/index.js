const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* GET home page currently listing users */
router.get('/', userController.getAllUsers);

/* GET register page */
router.get('/register', userController.formUser);

/* POST submit user */
router.post('/submit', userController.submitUser);

module.exports = router;
