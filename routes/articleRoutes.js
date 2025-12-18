const express = require('express');
const articleController = require('../controllers/articleController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Public route: Read only
router.get('/', articleController.getAllArticles);

// Protected routes
router.post('/', authenticateToken, articleController.createArticle);
router.put('/:id', authenticateToken, articleController.updateArticle);
router.delete('/:id', authenticateToken, articleController.deleteArticle);

module.exports = router;
