const express = require("express");
const apiRouter = require("./routes/api-routers");
const app = express();
const { psqlErrorHandler, serverErrorHandler, customErrorHandler } = require("./error-handlers.js");
const endpoints = require("./endpoints.json");

app.use(express.json());
app.use("/api", apiRouter);


app.use((req, res, next) => {
  res.status(404).send({ msg: 'Not Found' });
});

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;