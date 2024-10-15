const { fetchCommentsByArticleId } = require("../models/comments-model");

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
