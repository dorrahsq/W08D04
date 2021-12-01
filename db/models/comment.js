const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: new Date() },
  by: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  onPost: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
});

module.exports = mongoose.model("comment", commentSchema);
