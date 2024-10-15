const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const articleRouter = require("./article-router");
//const commentsRouter = require("./comments-router");
const endpoints = require("../endpoints.json");
const { end } = require("../db/connection");

apiRouter.get("/", (req, res) => {
  res.status(200).send(endpoints);
})

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articleRouter);


module.exports = apiRouter;