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

module.exports = {
  likePost,
};
