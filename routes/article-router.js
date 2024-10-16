const express = require("express");
const { getArticleById, getAllArticles } = require("../controllers/article-controller");
const { getCommentsByArticleId, postComment } = require("../controllers/comments-controller")
const articleRouter = express.Router();

//GET
articleRouter.get('/:article_id', getArticleById);
articleRouter.get('/', getAllArticles);
articleRouter.get('/:article_id/comments', getCommentsByArticleId);

//POST
articleRouter.post('/:article_id/comments', postComment);

module.exports = articleRouter;