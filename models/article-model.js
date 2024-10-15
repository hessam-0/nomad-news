const db = require("../db/connection");

exports.fetchArticle = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((res) => {
        return res.rows[0];
    })
}