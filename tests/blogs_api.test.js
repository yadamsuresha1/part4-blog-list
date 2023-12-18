const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const api = supertest(app);
const helper = require("./blog_helper");
const logger = require("../utils/logger");
const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

beforeEach(async () => {
  //Deleting all the blogs before each of the test and adding all the
  //6 blogs from the initialBlogs array
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
}, 30000);

test("Returns correct number of blog posts as json", async () => {
  const blogs = await api.get("/api/blogs");
  expect(blogs.body).toHaveLength(helper.initialBlogs.length);
}, 40000);

test("Unique Identifier property of the blog posts is named id", async () => {
  const blogs = await api.get("/api/blogs");
  blogs.body.forEach((blog) => {
    expect(blog).toHaveProperty("id");
  });
});

test("Creates a new blog post", async () => {
  const newBlog = {
    title: "New Blog Book",
    author: "Suresh Yadam",
    url: "https://sureshyadam.com/",
    likes: 10,
  };
  await api.post("/api/blogs").send(newBlog).expect(201);
  const blogsAtEnd = await helper.blogsInDB();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  const contents = blogsAtEnd.map((b) => b.title);
  expect(contents).toContain("New Blog Book");
});

test("likes property is available", async () => {
  const blogs = await api.get("/api/blogs");
  blogs.body.forEach((blog) => {
    expect(blog).toHaveProperty("likes");
  });
});

test("title and url properties are missing", async () => {
  await api.post("/api/blogs").send({ author: "Suresh Yadam" }).expect(400);
});

test("delete succeeds with status code 204 if id is valid", async () => {
  const blogsAtStart = await helper.blogsInDB();
  logger.info("blogsAtStart", blogsAtStart);
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDB();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((b) => b.title);

  expect(titles).not.toContain(blogToDelete.title);
}, 30000);

test("updating a blog post is working as expected", async () => {
  const newBlog = {
    likes: 20,
  };

  const blogsAtStart = await helper.blogsInDB();
  const blogToUpdate = blogsAtStart[0];

  logger.info("blogToUpdate", blogToUpdate);
  const updatedBlog = await api.put(`/api/blogs/${blogToUpdate.id}`).send({
    ...blogToUpdate,
    likes: 30,
  });
  logger.info("updatedBlog", updatedBlog.text);
  expect(updatedBlog.text).toEqual(
    JSON.stringify({
      ...blogToUpdate,
      likes: 30,
    })
  );
}, 20000);

describe("when there is initially one user in the db", () => {
  beforeEach(async () => {
    //delete all the users
    await User.deleteMany({});
    //add a new user - first user
    const passwordHash = await bcrypt.hash("password", 10);
    const user = {
      username: "root",
      passwordHash,
    };
    await new User(user).save();
  });

  test("creation succeedes with a fresh username", async () => {
    const usersBeforeAdding = await helper.usersInDB();
    const newUser = {
      username: "sureshy",
      name: "suresh",
      password: "suresh",
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const usersAfterAdding = await helper.usersInDB();
    expect(usersAfterAdding).toHaveLength(usersBeforeAdding.length + 1);

    const userNames = usersAfterAdding.map((user) => user.username);
    expect(userNames).toContain(newUser.username);
  }, 20000);

  test("creation fails with proper status code if the username already taken", async () => {
    const usersAtStart = await helper.usersInDB();

    const newUser = {
      name: "superuser",
      username: "root",
      password: "password",
    };
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    expect(result.body.error).toContain("expected `username` to be unique");
    const usersAtEnd = await helper.usersInDB();
    expect(usersAtEnd).toEqual(usersAtStart);
  }, 20000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
