const { fetchCommentsByArticleId, insertComment } = require("../models/comments-model");
const { fetchArticleById } = require("../models/article-model");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    if(!article_id || isNaN(article_id)) {
        return next({status: 400, msg: 'Invalid Id'})
    }

    fetchCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    if (!username || !body || body.length === 0){
        return next ({status: 400, msg: 'Invalid comment'})
    }

    fetchArticleById(article_id)
    .then(() => {
        return insertComment(article_id, username, body);

    })
    .then((comment) => {
        res.status(201).json({ comment });
    } )
    .catch((err) => {
        next(err)
    });
}