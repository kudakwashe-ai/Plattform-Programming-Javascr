const prisma = require('../utils/prisma');

const getAllArticles = async (filter = {}) => {
    return await prisma.article.findMany({
        where: filter,
        include: {
            author: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });
};

const createArticle = async (data) => {
    return await prisma.article.create({
        data,
        include: {
            author: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });
};

const getArticleById = async (id) => {
    return await prisma.article.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    id: true // Need ID for ownership check
                }
            }
        }
    });
};

const updateArticle = async (id, data) => {
    return await prisma.article.update({
        where: { id },
        data,
        include: {
            author: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });
};

const deleteArticle = async (id) => {
    return await prisma.article.delete({
        where: { id }
    });
};

module.exports = {
    getAllArticles,
    createArticle,
    getArticleById,
    updateArticle,
    deleteArticle,
};
