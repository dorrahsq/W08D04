const express = require("express");
const userRouter = express.Router();
const authentication = require("./../middleWhere/authentication");
const authorization = require("./../middleWhere/authorization");

const {
  signUp,
  logIn,
  allUsers,
  deleteUser,
  confirmEmail,
  ForgetPassword,
  resetPassword,
  oneUser,
  googlelogin,
} = require("./../controllers/user");

userRouter.post("/create", signUp);
userRouter.post("/log", logIn);
userRouter.get("/confirmation/:email/:token", confirmEmail);
userRouter.put("/forgetPassword", ForgetPassword);
userRouter.put("/resetPassword", resetPassword);
userRouter.post("/googlelogin", googlelogin);

//just admin
userRouter.get("/all", authentication, authorization, allUsers);
userRouter.delete("/delete", authentication, authorization, deleteUser);

userRouter.get("/:_id", authentication, oneUser);

module.exports = userRouter;
