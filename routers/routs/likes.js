const express = require("express");
const { likePost } = require("./../controllers/likes");
const authentication = require("./../middleWhere/authentication");

const likesRouter = express.Router();

likesRouter.put("/", authentication, likePost);

module.exports = likesRouter;
