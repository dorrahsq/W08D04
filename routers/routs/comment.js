const express = require("express");

const { createComment  , deleteComment , updateComment , getPostComment} = require("./../controllers/comment");

const commentRouter = express.Router();

commentRouter.post("/create", createComment);
commentRouter.delete("/delete", deleteComment);
commentRouter.put("/update", updateComment);
commentRouter.get("/all", getPostComment);




module.exports = commentRouter;
