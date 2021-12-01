const express = require("express");
const {
  likePost,
  userLikes,
  deleteAllLikes,
} = require("./../controllers/likes");

const likesRouter = express.Router();

likesRouter.put("/", likePost);
likesRouter.get("/userLikes", userLikes);
likesRouter.delete("/deleteLikes", deleteAllLikes);

module.exports = likesRouter;
