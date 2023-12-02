const logger = require("./utils/logger");
const config = require("./utils/config");
const app = require("./app");
const blogsRouter = require("./controllers/blogs");

app.use(blogsRouter);

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
});
