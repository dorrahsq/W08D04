const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", taskSchema);
