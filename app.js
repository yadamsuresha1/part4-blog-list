const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const app = express();

app.use(express.json());

mongoose
  .connect(config.MONGODB_URI)
  .then((res) => {
    logger.info("Connected to mongo db!");
  })
  .catch((err) => {
    logger.error("Error connecting to mongo db!", err.message);
  });

module.exports = app;
