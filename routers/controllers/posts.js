const postsModel = require("../../db/models/posts");
const likesModel = require("../../db/models/like");
const commentModel = require("../../db/models/comment");

//get all posts for one user
const getUserPosts = (req, res) => {
  const { postedBy } = req.query;
  postsModel
    .find({})
    .populate("postedBy")
    .where("postedBy")
    .equals(postedBy)
    .sort({ date: -1 })
    .exec(function (err, posts) {
      if (err) return handleError(err);
      res.json(posts);
    });
};

//get post (with comment and likes )
//post soft delete

//create post
const createPost = (req, res) => {
  const { img, describe, postedBy } = req.body;
  const post = new postsModel({
    img,
    describe,
    postedBy,
  });

  post
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

//delete post
const deletePost = (req, res) => {
  const { _id } = req.body;
  postsModel.deleteOne({ _id }, function (err, result) {
    if (!result) {
      return res.status(200).json("not found");
    }
    if (result.deletedCount !== 0) {
      likesModel.deleteMany({ onPost: _id }, function (err) {
        if (err) return handleError(err);
      });
      commentModel.deleteMany({ onPost: _id }, function (err) {
        if (err) return handleError(err);
      });

      return res.status(200).json("deleted");
    } else {
      return res.status(404).json("this post already have been deleted");
    }
  });
};

//update post describe
const updatePost = (req, res) => {
  const { _id, newdescribe } = req.body;

  taskModel.findById({ _id }).then((result) => {
    console.log(result);
    if (!newdescribe.length) {
      return res.json("you need to type at least 1 character");
    } else {
      taskModel.updateOne(
        { _id },
        { $set: { describe: newdescribe } },
        function (err) {
          if (err) return handleError(err);
        }
      );
      taskModel
        .find({ _id })
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
};

module.exports = {
  createPost,
  getUserPosts,
  deletePost,
  updatePost,
};