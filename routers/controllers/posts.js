const postsModel = require("../../db/models/posts");
const likesModel = require("../../db/models/like");
const commentModel = require("../../db/models/comment");
const roleModel = require("./../../db/models/role");

const getAllPosts = (req, res) => {
  postsModel
    .find({})
    .sort({ date: -1 })
    .populate("postedBy")
    .exec(function (err, posts) {
      if (err) return handleError(err);
      res.json(posts);
    });
};

//get all posts for one user
const getUserPosts = (req, res) => {
  const { postedBy } = req.params;
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
const getOnePost = (req, res) => {
  const { _id } = req.params;
  postsModel
    .findById({ _id })
    .populate("postedBy")
    .then((result) => {
      console.log(result);
      if (result.isDeleted) {
        return res.status(201).json("this post already have been deleted");
      }
      finalResult = [];
      likesModel
        .find({ onPost: _id })
        .populate("onPost")
        .populate("by")
        .exec()
        .then((likesresult) => {
          commentModel
            .find({ onPost: _id })
            .populate("onPost")
            .populate("by")
            .exec()
            .then((commentresult) => {
              finalResult.push({
                describe: result.describe,
                img: result.img,
                _id: result._id,
                date: result.date,
                postedBy: result.postedBy,
              });
              finalResult.push({ likes: likesresult.length });
              finalResult.push(
                commentresult.map((elem) => {
                  console.log(elem);
                  return {
                    title: elem.title,
                    by: elem.by.username,
                    _id: elem.by._id,
                    commentId: elem._id,
                    img: elem.by.img,
                  };
                })
              );

              res.json(finalResult);
            });
        });
    })
    .catch((err) => {
      res.send(err);
    });
};

//create post
const createPost = (req, res) => {
  const { img, describe, postedBy } = req.body; // postedBy: req.token.id ?
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
const deletePost = async (req, res) => {
  console.log("here is delete");
  const reqUserId = req.token.id;
  const userId = req.token.role;
  const Result = await roleModel.findById(userId);

  const { _id } = req.params; //_id: post id\
  console.log(_id, "iddd");
  postsModel.findOne({ _id }).then((result) => {
    console.log(result);
    if (result.postedBy == reqUserId || Result.role === "admin") {
      postsModel.deleteOne({ _id }, function (err, result2) {
        if (result2.deletedCount !== 0) {
          likesModel.deleteMany({ onPost: _id }, function (err) {
            if (err) return handleError(err);
          });
          commentModel.deleteMany({ onPost: _id }, function (err) {
            if (err) return handleError(err);
          });

          return res.status(200).json("deleted");
        } else {
          return res.status(404).json("not found");
        }
      });
    } else {
      return res.status(403).json({ message: "forbidden" });
    }
  });
};

// soft delete
const archivePost = async (req, res) => {
  const reqUserId = req.token.id;
  const { _id } = req.body; //_id: post id
  postsModel
    .findById({ _id })
    .then((result) => {
      if (result) {
        if (result.postedBy == reqUserId) {
          if (!result.isDeleted) {
            postsModel.updateOne(
              { _id },
              { $set: { isDeleted: true } },
              function (err) {
                if (err) return handleError(err);
              }
            );

            return res.status(200).json("done");
          }
          return res.json("this post already have been archived");
        } else {
          return res.status(403).json({ message: "forbidden" });
        }
      } else {
        return res.status(404).json("not found");
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//update post describe
const updatePost = (req, res) => {
  const { _id, newdescribe } = req.body; //_id: post id
  const reqUserId = req.token.id;
  //get user id by post id
  postsModel.findById({ _id }).then((result) => {
    console.log(result);

    if (result.postedBy == reqUserId) {
      if (result.isDeleted == true) {
        return res.json(
          "you cant update on this post because its have been archived"
        );
      } else {
        if (!newdescribe.length) {
          return res.json("you need to type at least 1 character");
        } else {
          postsModel.updateOne(
            { _id },
            { $set: { describe: newdescribe } },
            function (err) {
              if (err) return handleError(err);
            }
          );
          postsModel
            .find({ _id })
            .then((result) => {
              res.json(result);
            })
            .catch((err) => {
              res.send(err);
            });
        }
      }
    } else {
      return res.status(403).json({ message: "forbidden" });
    }
  });
};

module.exports = {
  getAllPosts, //-----------------
  createPost,
  getUserPosts,
  deletePost,
  updatePost,
  getOnePost,
  archivePost,
};
