const express = require("express");
const userRouter = express.Router();
const authentication = require("./../middleWhere/authentication");
const authorization = require("./../middleWhere/authorization");

const {
  signUp,
  logIn,
  allUsers,
  deleteUser,
} = require("./../controllers/user");

userRouter.post("/create", signUp);
userRouter.post("/log", logIn); // post for security -- post is more secure than get

//just admin
userRouter.get("/", authentication, authorization, allUsers);
userRouter.delete("/", authentication, authorization, deleteUser);

module.exports = userRouter;
