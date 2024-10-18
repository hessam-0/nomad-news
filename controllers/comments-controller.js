const { fetchCommentsByArticleId, insertComment, removeCommentById, updateCommentVotes } = require("../models/comments-model");
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

    if(isNaN(article_id)){
        return (next({status: 400, msg: 'Bad Request'}))
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

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;

    if(isNaN(comment_id)){
        return next({status: 400, msg: 'Bad Request'})
    }

    removeCommentById(comment_id)
    .then((deletedComment) => {
      if(!deletedComment){
        return next({ status: 404, msg: 'Comment Not Found'})
       }
      res.status(204).send();
      })
    .catch(next)

}

exports.patchCommentVotes = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    
    if(inc_votes === undefined || isNaN(inc_votes)){
    return next({ status: 400, msg: 'Bad Request'})
    }

    if(isNaN(comment_id)){
        return next({ status: 400, msg: 'Bad Request'})
    }

  updateCommentVotes(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);



}
