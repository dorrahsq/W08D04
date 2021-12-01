const express = require("express");
const authentication = require("./../middleWhere/authentication");

const {
  createPost,
  getUserPosts,
  deletePost,
  updatePost,
  archivePost,
  getOnePost,
} = require("./../controllers/posts");

const postsRouter = express.Router();

postsRouter.get("/userPost", authentication, getUserPosts);
postsRouter.get("/onePost", authentication, getOnePost);
postsRouter.post("/create", authentication, createPost);
postsRouter.delete("/archivePost", authentication, archivePost);
postsRouter.put("/update", authentication, updatePost);

//owner and admin
postsRouter.delete("/delete", authentication, deletePost);

module.exports = postsRouter;
