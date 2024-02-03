const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("express-async-errors");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/login");

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI)
  .then((res) => {
    logger.info("Connected to mongo db!");
  })
  .catch((err) => {
    logger.error("Error connecting to mongo db!", err.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.errorHandler);

module.exports = app;
