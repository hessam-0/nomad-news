const { fetchUsers, fetchUserByUsername } = require("../models/users-model");

exports.getUsers = (req, res, next) => {
  fetchUsers()
  .then((users) => {
      res.status(200).json({ users })
    })
  .catch((err) => {
      next(err);
    })
}

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;

  const usernameRegExp = /^[a-z0-9_-]+$/i

  if(!usernameRegExp.test(username)){
    return next({ status: 400, msg: 'Invalid Username Format'})
  }

  fetchUserByUsername(username)
  .then((user) => { 
    res.status(200).send({ user })
    })
  .catch(next);
}

