const userModel = require("./../../db/models/user");
const postsModel = require("../../db/models/posts");
const commentModel = require("../../db/models/comment");
const likeModel = require("../../db/models/like");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// used to share security information between two parties — a client and a server
const jwt = require("jsonwebtoken");
const SECRETKEY = process.env.SECRETKEY;

//bcrypt > library to hash passwords.
const bcrypt = require("bcrypt");
const SALT = Number(process.env.SALT);

const signUp = async (req, res) => {
  const { email, username, password, role } = req.body;
  const saveEmail = email.toLowerCase();
  const saveUsername = username.toLowerCase();

  const found = await userModel.findOne({
    $or: [{ email: saveEmail }, { username: saveUsername }],
  });
  if (found) {
    return res.status(204).json("already there");
  }
  if (password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)) {
    console.log("okkkk");
    const savePass = await bcrypt.hash(password, SALT);

    const newUser = new userModel({
      email: saveEmail,
      password: savePass,
      username: saveUsername,
      role,
    });

    newUser
      .save()
      .then((result) => {
        // generate token
        const token = jwt.sign({ _userId: result._id }, SECRETKEY, {
          expiresIn: "24h",
        });
        // Send email (use verified sender's email address & generated API_KEY on SendGrid)
        const transporter = nodemailer.createTransport(
          sendgridTransport({
            auth: {
              api_key: process.env.ApiKey,
            },
          })
        );

        const mailOptions = {
          from: "durh1999@gmail.com",
          to: result.email,
          subject: "Account Verification Link",
          text:
            "Hello " +
            req.body.username +
            ",\n\n" +
            "Please verify your account by clicking the link: \nhttp://" +
            req.headers.host +
            "/user/confirmation/" +
            result.email +
            "/" +
            token +
            "\n\nThank You!\n",
        };

        transporter.sendMail(mailOptions, function (err) {
          if (err) {
            return res.status(500).send({
              msg: "Technical Issue!, Please click on resend for verify your Email.",
            });
          }
          return res
            .status(200)
            .send(
              "A verification email has been sent to " +
                result.email +
                ". It will be expire after one day"
            );
        });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(210).json("you need to insert a complix password");
  }
};

const confirmEmail = (req, res) => {
  token = req.params.token;
  jwt.verify(token, SECRETKEY, (err, resul) => {
    console.log(resul);
    if (err) {
      return res
        .status(400)
        .send(
          "Your verification link may have expired. Please click on resend for verify your Email."
        );
    } else {
      userModel.findOne(
        { _id: resul._userId, email: req.params.email },
        function (err, user) {
          // not valid user
          if (!user) {
            return res.status(401).send({
              msg: "We were unable to find a user for this verification. Please SignUp!",
            });
          }
          // user is already verified
          else if (user.isVerified) {
            return res
              .status(200)
              .send("User has been already verified. Please Login");
          }
          // verify user
          else {
            // change isVerified to true
            user.isVerified = true;
            user.save(function (err) {
              // error occur
              if (err) {
                return res.status(500).send({ msg: err.message });
              }
              // account successfully verified
              else {
                return res
                  .status(200)
                  .send(`Your account has been successfully verified <a href="https://socialmedia-website.netlify.app">Back to log in</a>`);
              }
            });
          }
        }
      );
    }
  });

  //  check valid user
};

const ForgetPassword = (req, res) => {
  const { email } = req.body;
  userModel.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(201).send("this user does not exisits");
    }
    if (!user.isVerified) {
      return res.status(201).send("verify your email first ");
    }

    const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "60m",
    });

    const transporter = nodemailer.createTransport(
      sendgridTransport({
        auth: {
          api_key: process.env.ApiKey,
        },
      })
    );

    const mailOptions = {
      from: "durh1999@gmail.com",
      to: email, // or user.email,
      subject: "password reset Link",
      text:
        "Hello " +
        user.username +
        ",\n\n" +
        "Please reset your password by using the following code  :" +
        ",\n\n" +
        token + //splice
        "\n\nThank You!\n",
    };
    //        token.slice(token.length - 10) +

    return user.updateOne({ resetLink: token }, (err, result) => { //splice
      if (err) {
        return res.status(400).send("rest password link error");
      } else {
        transporter.sendMail(mailOptions, function (err) {
          if (err) {
            return res.status(500).send({
              msg: "Technical Issue!",
            });
          }
          return res
            .status(200)
            .send("A rest password email has been sent to " + user.email);
        });
      }
    });
  });
};

const resetPassword = (req, res) => {
  const { resetLink, newPassword } = req.body;
  if (
    newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)
  ) {
    if (resetLink) {
      jwt.verify(
        resetLink, //splice
        process.env.RESET_PASSWORD_KEY,
        async (err, result) => {
          if (err) {
            return res.status(201).json("token error");
          }
          const savePass = await bcrypt.hash(newPassword, SALT);
          userModel.findOne({ resetLink }, (err, user) => { //splice
            if (err || !user) {
              return res
                .status(201)
                .json("user with this token does not exists");
            }

            return user.updateOne(
              { resetLink: "", password: savePass },
              (err, resultt) => {
                if (err) {
                  return res.status(400).json("error");
                }
                return res
                  .status(200)
                  .json("your password has been updated successfully");
              }
            );
          });
        }
      );
    } else {
      return res.status(201).json("authentication error");
    }
  } else {
    res.status(201).json("you need to insert a complix password");
  }
};

const logIn = (req, res) => {
  const { input, password } = req.body;
  newInput = input.toLowerCase();
  userModel
    .findOne({ $or: [{ email: newInput }, { username: newInput }] })
    .then(async (result) => {
      if (result) {
        if (result.isDeleted) {
          return res.status(203).json("your account has been deleted");
        }
        //unhash password
        const savePass = await bcrypt.compare(password, result.password); //compare return boolean
        if (savePass) {
          if (!result.isVerified) {
            return res.status(203).json("Your Email has not been verified");
          }
          const payload = {
            role: result.role,
            id: result._id,
          };
          const token = await jwt.sign(payload, SECRETKEY); //options
          res.status(200).json({ result, token });
        } else {
          res.status(206).json("invalid email or password");
        }
      } else {
        res.status(206).json("invalid email or password");
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const allUsers = async (req, res) => {
  userModel
    .find({ isDeleted: false })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const oneUser = async (req, res) => {
  const { _id } = req.params;
  userModel
    .find({ _id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

//soft
const deleteUser = async (req, res) => {
  const { _id } = req.query;
  console.log(_id);
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
          commentModel.deleteMany({ by: _id }, function (err) {
            if (err) return handleError(err);
          });
          likeModel.deleteMany({ by: _id }, function (err) {
            if (err) return handleError(err);
          });

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

const googlelogin = (req, res) => {
  const { idToken } = req.body;
  client
    .verifyIdToken({
      idToken,
      audience: `${process.env.GOOGLE_CLIENT_ID}`,
    })
    .then((response) => {
      console.log(response);
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        userModel.findOne({ email }).exec((err, user) => {
          if (err) {
            return res.status(400).json("somthing went wrong...");
          } else {
            if (user) {
              const token = jwt.sign({ id: user._id , role: user.role }, SECRETKEY);
              const { _id, username, email, role } = user;
              res
                .status(200)
                .json({ token, user: { _id, username, email, role } });
            } else {
              const newUser = new userModel({
                email,
                username: name.trim(),
                role: "61a4e07ba6502019b9898c1c",
                isVerified: true,
              });

              newUser.save().then((result) => {
                const token = jwt.sign({ id: result._id }, SECRETKEY);
                const { _id, username, email } = newUser;
                res.json({ token, user: { _id, username, email } });
              });
            }
          }
        });
      }
    });
};

module.exports = {
  signUp,
  oneUser,
  logIn,
  allUsers,
  deleteUser,
  confirmEmail,
  ForgetPassword,
  resetPassword,
  googlelogin,
};
