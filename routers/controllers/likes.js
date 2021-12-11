const likesModel = require("../../db/models/like");

// like toggle
const likePost = (req, res) => {
  const { by, onPost } = req.body; // by: req.token.id ?
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
          res.status(201).json(`liked successfully`);
        })
        .catch((err) => {
          res.send(err);
        });
    }
  });
};

const checkLike = (req, res) => {
  const { onPost } = req.params; // by: req.token.id ?
  likesModel.findOne({ by: req.token.id, onPost }).then((result) => {
    if (result) {
      res.status(201).json("its liked");
    } else {
      res.status(200).json(`its unliked`);
    }
  });
};

module.exports = {
  likePost,
  checkLike,
};
