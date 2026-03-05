
const { isAuth } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/multer");
const { getPosts, getPostById, createPost, updatePost, deletePost } = require("../controllers/posts");

const postsRouter = require("express").Router();

postsRouter.get("/", getPosts);
postsRouter.get("/:id", getPostById);
postsRouter.post("/", isAuth, upload.single("image"), createPost);
postsRouter.put("/:id", isAuth, upload.single("image"), updatePost);
postsRouter.delete("/:id", isAuth,  deletePost)


module.exports = postsRouter;