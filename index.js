const express = require("express");
require("dotenv").config();

var cors = require("cors");

require("./db");

const app = express();
app.use(express.json());
app.use(cors());

const roleRouter = require("./routers/routs/role");
app.use("/role", roleRouter);

const userRouter = require("./routers/routs/user");
app.use("/user", userRouter);

const likesRouter = require("./routers/routs/likes");
app.use("/likes", likesRouter);

const postsRouter = require("./routers/routs/posts");
app.use("/posts", postsRouter);

const commentRouter = require("./routers/routs/comment");
app.use("/comment", commentRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
