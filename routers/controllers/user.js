const userModel = require("./../../db/models/user");
const postsModel = require("../../db/models/posts");

require("dotenv").config();

// used to share security information between two parties — a client and a server
const jwt = require("jsonwebtoken");
const SECRETKEY = process.env.SECRETKEY;

//bcrypt > library to hash passwords.
const bcrypt = require("bcrypt");
const SALT = Number(process.env.SALT);

const signUp = async (req, res) => {
  const { email, username, password, role } = req.body;
  const saveEmail = email.toLowerCase();
  const savePass = await bcrypt.hash(password, SALT);

  const newUser = new userModel({
    email: saveEmail,
    password: savePass,
    username,
    role,
  });

  newUser
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const logIn = (req, res) => {
  const { email, password, username } = req.body;
  userModel
    .findOne({ $or: [{ email }, { username }] })
    .then(async (result) => {
      if (result) {
        if ((email && email == result.email)  ||  (username && username == result.username)) { //////////////
          //unhash password
          const savePass = await bcrypt.compare(password, result.password); //compare return boolean
          if (savePass) {
            const payload = {
              role: result.role,
              id: result._id,
            };
            const token = await jwt.sign(payload, SECRETKEY); //options
            res.status(200).json({ result, token });
          } else {
            res.status(400).json("invalid email or password");
          }
        } else {
          res.status(400).json("invalid email or password");
        }
      } else {
        res.status(404).json("not found");
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const allUsers = async (req, res) => {
  userModel
    .find({})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//soft
const deleteUser = async (req, res) => {
  const { _id } = req.body;
  userModel
    .findById({ _id })
    .then((result) => {
      if (result) {
        if (!result.isDeleted) {
          userModel.updateOne(
            { _id },
            { $set: { isDeleted: true } },
            function (err) {
              if (err) return handleError(err);
            }
          );
          postsModel.updateMany(
            { postedBy: _id },
            { $set: { isDeleted: true } },
            function (err) {
              if (err) return handleError(err);
            }
          );

          return res.status(200).json("done");
        }
        return res.json("this user already have been deleted");
      } else {
        return res.status(404).json("user not found");
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

module.exports = { signUp, logIn, allUsers, deleteUser };
