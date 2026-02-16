/**
 * Movie Routes
 * Public routes for TMDB API interactions
 * Optional authentication for personalized results
 */

const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { optionalAuth } = require('../middleware/authMiddleware');
const { validateSearch, validateTrailer } = require('../middleware/validationMiddleware');

// All routes support optional authentication for personalization
router.get('/search', optionalAuth, validateSearch, movieController.searchMovies);
router.get('/trending', optionalAuth, movieController.getTrending);
router.get('/details/:id', optionalAuth, movieController.getDetails);
router.get('/trailer/:id', validateTrailer, movieController.getTrailer);
router.get('/providers/:id', validateTrailer, movieController.getProviders);

module.exports = router;
