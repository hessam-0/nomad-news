const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");

// apiRouter.get("/", (req, res) => {
//   res.status(200).send("Status: OK");
// })

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter;