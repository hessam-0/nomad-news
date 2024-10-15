const { fetchArticle } = require("../models/article-model");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticle(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}