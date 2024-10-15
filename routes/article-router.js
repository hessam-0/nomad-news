const express = require("express");
const { getArticleById, getAllArticles } = require("../controllers/article-controller");
//const commentsRouter = require("./comments-router");
const { getCommentsByArticleId } = require("../controllers/comments-controller")
const articleRouter = express.Router();

articleRouter.get('/:article_id', getArticleById);
articleRouter.get('/', getAllArticles);
articleRouter.get('/:article_id/comments', getCommentsByArticleId);

module.exports = articleRouter;