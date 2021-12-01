const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  onPost: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
});

module.exports = mongoose.model("like", likeSchema);
