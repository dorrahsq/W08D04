const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role: { type: String, required: true },
  permissions: { type: Array, required: true },
});

module.exports = mongoose.model("Role", roleSchema);
