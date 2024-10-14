const express = require("express");
const apiRouter = require("./routes/api-routers");
const app = express();
const { psqlErrorHandler, serverErrorHandler, customErrorHandler } = require("./error-handlers.js");
app.use(express.json());
app.use("/api", apiRouter);

app.use((req, res, next) => {
  res.status(404).send({ msg: 'Not Found' });
});

app.use(psqlErrorHandler);
app.use(serverErrorHandler);
app.use(customErrorHandler);

module.exports = app;