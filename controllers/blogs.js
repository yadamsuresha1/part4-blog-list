const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  const body = req.body;
  if (!body.title) {
    return res.status(400).json({
      error: "Title is mandatory",
    });
  }
  if (!body.url) {
    return res.status(400).json({
      error: "url is mandatory",
    });
  }

  const decodedToken = jwt.verify(req.token, process.env.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: "invalid token" });
  }

  const user = await User.findById(decodedToken.id);
  logger.info("first user", user);
  const blog = {
    title: body.title,
    author: body.author || "Anonymus",
    url: body.url,
    likes: body.likes ? Number(body.likes) : 0,
    user: user.id,
  };

  const newBlog = new Blog(blog);
  const createdBlog = await newBlog.save();
  user.blogs = user.blogs.concat(createdBlog._id);
  await user.save();
  res.status(201).json(createdBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
  //check if the blog is being deleted by the creator.
  //get the token from the one who is planning to delete it.
  //get the id from the token(user id) and compare it with the id from the user object associated wth the blog.

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "invalid token" });
  }

  const blog = await Blog.findById(req.params.id);
  logger.info("blog", blog.user.toString());
  logger.info("userid", decodedToken.id);

  if (blog.user.toString() !== decodedToken.id) {
    return res
      .status(401)
      .json({ error: "you don't have access to delete this blog" });
  }

  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).send({ message: "Deleted successfully!" });
});

blogsRouter.put("/:id", async (req, res) => {
  const { title, url, likes, user } = req.body;
  logger.info("body", req.body);
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      title,
      url,
      likes,
      user,
    },
    { new: true, runValidators: true, context: "query" }
  ).populate("user");

  res.json(updatedBlog);
});
module.exports = blogsRouter;
