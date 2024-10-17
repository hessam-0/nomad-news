const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
    const query =  `SELECT articles.*,
                        (SELECT COUNT(*)::INT
                        FROM comments
                        WHERE comments.article_id = articles.article_id) AS comment_count
                    FROM articles
                    WHERE articles.article_id = $1;`;
    return db.query(query, [article_id])
    .then(({ rows }) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows[0];
    })
}

exports.fetchAllArticles = (topic, sort_by = 'created_at', order = 'DESC' ) => {
    const validSortColumns = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count'];
    const validOrders = ['ASC', 'DESC'];

    if (!validSortColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Bad Request: Invalid Sort Column' });
    }

    if (!validOrders.includes(order.toUpperCase())) {
        return Promise.reject({ status: 400, msg: 'Bad Request: Invalid Sort Order' });
    }

    let query =`
                    SELECT
                                articles.author,
                                articles.title,
                                articles.article_id,
                                articles.topic,
                                articles.created_at,
                                articles.votes,
                                articles.article_img_url,
                                COUNT(comments.comment_id)::INT AS comment_count

                    FROM        articles
                    LEFT JOIN   comments
                    ON          articles.article_id = comments.article_id
                `
    const queryOptions = []

    if (topic) {
        query += ' WHERE articles.topic = $1'
        queryOptions.push(topic);
    }

    query += `
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order.toUpperCase()}
    `

    return db.query(query, queryOptions)
    .then(({ rows }) => {
        if (rows.length === 0 && topic){
            return db.query('SELECT * FROM topics WHERE slug = $1', [topic])
            .then(({ rows: topicRows }) => {
                if(topicRows.length === 0){
                    return Promise.reject({ status: 404, msg: 'Topic Not Found'});
                }
                return []
            })
        }
        return rows
    })
}

exports.updateArticleVotesById = (article_id, inc_votes) => {
    const query = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`
    return db.query(query, [inc_votes, article_id])
    .then(({ rows }) => {
        if(rows.length === 0){
            return Promise.reject({ status: 404, msg: 'Article Not Found'})
        }
        return rows[0]
    })
}
