const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
    console.log(article_id, "<<< this should be the id")
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
        console.log(rows, "<< this should be the rows")
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows[0];
    })
}