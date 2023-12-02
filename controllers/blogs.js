const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");

blogsRouter.get("/", (req, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs);
  });
});

blogsRouter.post("/", (req, res) => {
  const body = req.body;
  if (!body.title) {
    return res.status(400).json({
      error: "Title is mandatory",
    });
  }
  const blog = {
    title: body.title,
    author: body.author || "Anonymus",
    url: body.url,
    likes: body.likes ? Number(body.likes) : 0,
  };

  const newBlog = new Blog(blog);
  newBlog
    .save()
    .then((createdBlog) => {
      res.status(201).json(createdBlog);
    })
    .catch((err) => logger.error(err.message));
});

module.exports = blogsRouter;
