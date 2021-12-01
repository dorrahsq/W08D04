const express = require("express");
const {
  createPost,
  getUserPosts,
  deletePost,
  updatePost,
  archivePost ,
  getOnePost
} = require("./../controllers/posts");

const postsRouter = express.Router();


postsRouter.get("/userPost", getUserPosts);
postsRouter.post("/create", createPost);
postsRouter.delete("/delete", deletePost);
postsRouter.delete("/archivePost", archivePost);
postsRouter.put("/update", updatePost);
postsRouter.get("/onePost", getOnePost);



module.exports = postsRouter;
