const articleService = require('../services/articleService');

const authorizeArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const article = await articleService.getArticleById(id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Admin can manage all articles
        // Member can only manage their own articles
        if (req.user.role !== 'admin' && article.author.id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: You can only manage your own articles' });
        }

        // Attach article to request to avoid fetching it again in the controller
        req.article = article;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authorizeArticle;
