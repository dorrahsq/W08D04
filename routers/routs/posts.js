const express = require("express");
const {
  createPost,
  getUserPosts,
  deletePost,
  updatePost,
} = require("./../controllers/posts");

const postsRouter = express.Router();


postsRouter.get("/userPost", getUserPosts);
postsRouter.post("/create", createPost);
postsRouter.delete("/delete", deletePost);
postsRouter.put("/update", updatePost);

module.exports = postsRouter;
