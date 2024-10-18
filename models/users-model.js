const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query('SELECT username, name, avatar_url FROM users;')
  .then(({ rows }) => {
      return rows;
    })
  .catch((err) => {
      throw err;
    })
}

exports.fetchUserByUsername = async (username) => {
  const result = await db.query(
    'SELECT username, name, avatar_url FROM users WHERE username = $1;'
    ,[username]
  )
  if(result.rows.length === 0){
    return Promise.reject({ status: 404, msg: 'User Not Found'})
  }
  return result.rows[0];
}
