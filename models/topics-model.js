const db = require("../db/connection");

exports.fetchAllTopics = () => {
    return db.query('SELECT slug, description FROM topics;')
    .then((res) => {
        return res.rows;
    })
}