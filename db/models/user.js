const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email",
    },
  },
  username: { type: String, required: true },
  isDeleted:{ type: Boolean, default:false} ,
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
  img: {
    type: String,
    default:
      "https://i.pinimg.com/564x/e7/c3/f4/e7c3f4a076b8472e0b1bd9c00a847f7f.jpg",
  },
});

module.exports = mongoose.model("user", userSchema);
