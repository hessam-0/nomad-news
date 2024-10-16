const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {

  return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({ rows: articleRows }) => {
      if (articleRows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      }
      const query = `SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC`
      return db.query(query, [article_id])
    })
    .then(({ rows }) => {
      return rows;
    })
}

exports.insertComment = (article_id, username, body) => {
    const query = `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`
    return db.query(query, [article_id, username, body])
    .then(({ rows }) => {
        return rows[0]
    })
}

exports.removeCommentById = async (comment_id) => {
    const query = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`
    const { rows } = await db.query(query, [comment_id])

    return rows[0] || null;
  }

