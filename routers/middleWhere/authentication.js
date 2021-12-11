const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRETKEY = process.env.SECRETKEY;

const authentication = (req, res, next) => {
  try {
    //1)check if there is a token
    if (!req.headers.authorization) {
      return res.status(403).json({ message: "forbidden" });
    }

    //2)check if the token vaild or  not
    const token = req.headers.authorization.split(" ")[1];
    phraseToken = jwt.verify(token, SECRETKEY);
    req.token = phraseToken;
    next();
  } catch (error) {
    res.status(403).json(error);
  }
};

module.exports = authentication;
