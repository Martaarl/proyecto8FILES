const placesRouter = require("./places");
const postsRouter = require("./posts");
const usersRouter = require("./users");

const mainRouter = require("express").Router();

mainRouter.use("/places", placesRouter);
mainRouter.use("/posts", postsRouter);
mainRouter.use("/users", usersRouter);

module.exports = mainRouter;