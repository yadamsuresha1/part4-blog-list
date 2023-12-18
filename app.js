const express = require("express");
const mongoose = require("mongoose");
require("express-async-errors");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/login");
const app = express();

mongoose
  .connect(config.MONGODB_URI)
  .then((res) => {
    logger.info("Connected to mongo db!");
  })
  .catch((err) => {
    logger.error("Error connecting to mongo db!", err.message);
  });

app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(middleware.errorHandler);

module.exports = app;
