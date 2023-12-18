const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
loginRouter.post("/", async (req, res) => {
  //you get username and the password
  //check if the username and password are exists
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).send({ error: "username is mandatory" });
  }
  if (!password) {
    return res.status(400).send({ error: "password is mandatory" });
  }
  const user = await User.findOne({ username });
  logger.info("userfound", user);
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "username or password is invalid" });
  }
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });
  res.status(200).json({ token, name: user.name, username: user.username });
});

module.exports = loginRouter;
