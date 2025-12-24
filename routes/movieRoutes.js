const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { validateSearch, validateTrailer } = require('../middleware/validationMiddleware');


router.get('/search', validateSearch, movieController.searchMovies);
router.get('/trailer/:id', validateTrailer, movieController.getTrailer);
router.get('/providers/:id', validateTrailer, movieController.getProviders); // Reusing validateTrailer as params are same

module.exports = router;
