const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Welcome to the world!',
        description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    });
});

router.get('/about', function(req, res) {
    res.render('about', {
        title: 'About',
        description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    });
});

module.exports = router;
