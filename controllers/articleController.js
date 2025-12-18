const articleService = require('../services/articleService');

const getAllArticles = async (req, res, next) => {
    try {
        const { authorId } = req.query;
        const filter = {};

        if (authorId) {
            filter.authorId = authorId;
        }

        const articles = await articleService.getAllArticles(filter);
        res.status(200).json({ message: 'Success', data: articles });
    } catch (error) {
        next(error);
    }
};

const createArticle = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const article = await articleService.createArticle({
            title,
            content,
            authorId: req.user.id
        });
        res.status(201).json({ message: 'Article created', data: article });
    } catch (error) {
        next(error);
    }
};

const updateArticle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const article = await articleService.getArticleById(id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Authorization Check
        // Authorization Check
        if (req.user.role !== 'admin' && article.author.id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: You can only update your own articles' });
        }

        const updatedArticle = await articleService.updateArticle(id, { title, content });
        res.status(200).json({ message: 'Article updated', data: updatedArticle });
    } catch (error) {
        next(error);
    }
};

const deleteArticle = async (req, res, next) => {
    try {
        const { id } = req.params;

        const article = await articleService.getArticleById(id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Authorization Check
        // Authorization Check
        if (req.user.role !== 'admin' && article.author.id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: You can only delete your own articles' });
        }

        await articleService.deleteArticle(id);
        res.status(200).json({ message: 'Article deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllArticles,
    createArticle,
    updateArticle,
    deleteArticle
};
