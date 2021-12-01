const express = require("express");
const { likePost } = require("./../controllers/likes");

const likesRouter = express.Router();

likesRouter.put("/", likePost);

module.exports = likesRouter;
