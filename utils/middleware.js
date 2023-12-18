const User = require("../models/user");
const logger = require("./logger");
const jwt = require("jsonwebtoken");
const errorHandler = (error, req, res, next) => {
  logger.error("suresh", error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  }
  next();
};

module.exports = {
  errorHandler,
  tokenExtractor,
};
