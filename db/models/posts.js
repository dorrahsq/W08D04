const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  img: { type: String },
  isDeleted: { type: Boolean, default: false },
  date: { type: Date, default: new Date() },
  describe: { type: String, required: true },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = mongoose.model("post", postSchema);
