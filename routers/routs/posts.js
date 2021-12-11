const express = require("express");
const authentication = require("./../middleWhere/authentication");

const {
  getAllPosts,
  createPost,
  getUserPosts,
  deletePost,
  updatePost,
  archivePost,
  getOnePost,
} = require("./../controllers/posts");

const postsRouter = express.Router();

postsRouter.get("/", authentication, getAllPosts); //--------------------
postsRouter.get("/userPost/:postedBy", authentication, getUserPosts);
postsRouter.get("/onePost/:_id", authentication, getOnePost); //---------
postsRouter.post("/create", authentication, createPost);
postsRouter.delete("/archivePost/:_id", authentication, archivePost);
postsRouter.put("/update", authentication, updatePost);

//owner and admin
postsRouter.delete("/delete/:_id", authentication, deletePost);

module.exports = postsRouter;
