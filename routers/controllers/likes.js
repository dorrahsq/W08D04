const likesModel = require("../../db/models/like");

// like toggle
const likePost = (req, res) => {
  const { by, onPost } = req.body;
  likesModel.findOne({ by, onPost }).then((result) => {
    console.log(result);
    if (result) {
      likesModel.deleteOne({ by, onPost }, function (err) {
        if (err) return handleError(err);
      });
      res.status(200).json("unliked successfully");
    } else {
      const like = new likesModel({
        by,
        onPost,
      });
      like
        .save()
        .then((result) => {
          res.json(`liked successfully`);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
};

// Display user’s likes on fav part
const userLikes = (req, res) => {
  //note: the front cant take from the body if its get or delete
  const { by } = req.query;
  //we take user id and then populate to take all post
  likesModel
    .find({})
    .populate("onPost")
    .where("by")
    .equals(by)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

//delete all likes on post
const deleteAllLikes = (req, res) => {
  const { onPost } = req.query;
  likesModel.deleteMany({ onPost }, function (err) {
    if (err) return handleError(err);
  });
  likesModel
    .find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send(err);
    });
};

module.exports = {
  likePost,
  userLikes,
  deleteAllLikes,
};
