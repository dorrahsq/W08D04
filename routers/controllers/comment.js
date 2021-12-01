const commentModel = require("../../db/models/comment");
const roleModel = require("./../../db/models/role");

//comment
const createComment = (req, res) => {
  const { title, by, onPost } = req.body;
  const comment = new commentModel({
    title,
    by,
    onPost,
  });

  comment
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

//delete comment
//user and post owner and admin
const deleteComment = async (req, res) => {
  const { _id } = req.body;
  const reqUserId = req.token.id; //user
  const userId = req.token.role;
  const Result = await roleModel.findById(userId); //admin -- Result.role =="adimn"
  const Result2 = await commentModel.findById(_id).populate("onPost"); //post owner -- Result2.onPost.postedBy
  const Result3 = await commentModel.findById(_id); // comment owner
  if (
    Result.role == "adimn" ||
    Result2.onPost.postedBy == reqUserId ||
    Result3.by == reqUserId
  ) {
    commentModel.deleteOne({ _id }, function (err, result) {
      if (err) return handleError(err);
      if (result.deletedCount !== 0) {
        return res.status(200).json("deleted");
      } else {
        return res.status(404).json("not found");
      }
    });
  } else {
    return res.status(403).json({ message: "forbidden" });
  }
};

//update comment
const updateComment = async (req, res) => {
  const { _id, title } = req.body;
  const reqUserId = req.token.id;
  const Result = await commentModel.findById(_id);
  if (Result.by == reqUserId) {
    commentModel
      .findById({ _id })
      .then((result) => {
        if (!result) {
          return res.status(404).json("not found");
        } else if (!title.length) {
          return res.status(404).json("you need to write somthing");
        } else {
          commentModel.updateOne({ _id }, { $set: { title } }, function (err) {
            if (err) return handleError(err);
            return res.status(200).json("updated successfully");
          });
        }
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    return res.status(403).json({ message: "forbidden" });
  }
};

//get all comment on post
const getPostComment = (req, res) => {
  const { onPost } = req.body;
  commentModel
    .find({})
    .populate("onPost")
    .where("onPost")
    .equals(onPost)
    .exec(function (err, comments) {
      if (!comments) {
        return res.status(404).json("post not found");
      }
      if (!comments.length) {
        return res.json("this post dosnt have any comments");
      }
      if (err) return handleError(err);
      res.json(comments);
    });
};

module.exports = {
  createComment,
  deleteComment,
  updateComment,
  getPostComment,
};
