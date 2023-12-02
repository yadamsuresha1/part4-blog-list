const logger = require("../utils/logger");
const dummy = (blogs) => {
  return 1;
};

const numberOfLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }
  return blogs.reduce((sum, item) => {
    return sum + item.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  //Blog with more likes
  const allLikes = blogs.map((blog) => blog.likes);
  const maxLike = Math.max(...allLikes);
  const blog = blogs.find((blog) => blog.likes === maxLike);
  return blog;
};

const mostBlogs = (blogs) => {
  const authors = {};
  blogs.forEach((blog) => {
    if (authors[blog.author]) {
      authors[blog.author] = authors[blog.author] + 1;
    } else {
      authors[blog.author] = 1;
    }
  });
  const mostNumberOfBlogs = Math.max(...Object.values(authors));
  const author = Object.keys(authors).find(
    (author) => authors[author] === mostNumberOfBlogs
  );
  console.log(author);
  return {
    author: author,
    blogs: mostNumberOfBlogs,
  };
};

const mostLikes = (blogs) => {
  const authors = {};
  blogs.forEach((blog) => {
    if (authors[blog.author]) {
      authors[blog.author] = authors[blog.author] + blog.likes;
    } else {
      authors[blog.author] = blog.likes;
    }
  });
  const mostLikes = Math.max(...Object.values(authors));
  const author = Object.keys(authors).find(
    (author) => authors[author] === mostLikes
  );
  console.log(author);
  return {
    author: author,
    likes: mostLikes,
  };
};

module.exports = {
  dummy,
  numberOfLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
