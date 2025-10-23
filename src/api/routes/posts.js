
//const { upload } = require("../../middlewares/multer");
const { getPosts } = require("../controllers/posts");

const postsRouter = require("express").Router();

postsRouter.get("/", getPosts);


module.exports = postsRouter;