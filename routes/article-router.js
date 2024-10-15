const express = require("express");
const { getArticleById } = require("../controllers/article-controller");
const articleRouter = express.Router();

articleRouter.get('/:article_id', getArticleById);

module.exports = articleRouter;