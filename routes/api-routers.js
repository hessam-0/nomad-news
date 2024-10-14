const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const endpoints = require("../endpoints.json");
const { end } = require("../db/connection");

apiRouter.get("/", (req, res) => {
  res.status(200).send(endpoints);
})

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;