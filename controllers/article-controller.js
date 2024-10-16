const { fetchArticleById, fetchAllArticles, updateArticleVotesById } = require("../models/article-model");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    fetchArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles()
    .then((articles) => {
        res.status(200).send({ articles });
    })
    .catch((err) => {
        next(err)
    })
}

exports.updateArticleVotes = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if(inc_votes === undefined){
        return next({ status: 400, msg: "Bad Request"})
    }

    updateArticleVotesById(article_id, inc_votes)
    .then((updatedArticle) => {
        res.status(200).json({ article: updatedArticle })
    })
    .catch(next)
}