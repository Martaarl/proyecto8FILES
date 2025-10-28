
const { upload } = require("../../middlewares/multer");
const { getPosts, getPostById, createPost, updatePost, deletePost } = require("../controllers/posts");

const postsRouter = require("express").Router();

postsRouter.get("/", getPosts);
postsRouter.get("/:id", getPostById);
postsRouter.post("/", upload.single("image"), createPost);
postsRouter.put("/:id", updatePost);
postsRouter.delete("/:id", deletePost)


module.exports = postsRouter;