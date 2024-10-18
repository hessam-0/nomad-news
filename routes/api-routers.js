const apiRouter = require("express").Router();
//Sub-routers
const topicsRouter = require("./topics-router");
const articleRouter = require("./article-router");
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");
//Endpoint
const endpoints = require("../endpoints.json");

apiRouter.get("/", (req, res) => {
  res.status(200).send(endpoints);
})

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);



module.exports = apiRouter;
