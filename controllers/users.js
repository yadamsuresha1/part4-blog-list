const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const { name, username, password } = req.body;
  //Password validations has to be done here as we store passwordHash in the database
  if (!password) {
    return res.status(400).send({ error: "password must be given" });
  }
  if (password.length < 3) {
    return res
      .status(400)
      .send({ error: "password should have atleast 3 characters long" });
  }
  //we can't save the password directly. It has to be a passwordHash
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = {
    username,
    passwordHash,
    name,
  };
  const createdUser = await new User(user).save();

  res.status(201).json(createdUser);
});

module.exports = usersRouter;
