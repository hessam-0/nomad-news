const express = require("express");
const { getArticleById, getAllArticles } = require("../controllers/article-controller");
const articleRouter = express.Router();

articleRouter.get('/:article_id', getArticleById);
articleRouter.get('/', getAllArticles);

module.exports = articleRouter;