const express = require("express");
const authentication = require("./../middleWhere/authentication");

const {
  createComment,
  deleteComment,
  updateComment,
  getPostComment,
} = require("./../controllers/comment");

const commentRouter = express.Router();

commentRouter.get("/all", authentication, getPostComment);
commentRouter.post("/create", authentication, createComment);
commentRouter.put("/update", authentication, updateComment);

//user and post owner and admin
commentRouter.delete("/delete", authentication, deleteComment);

module.exports = commentRouter;
