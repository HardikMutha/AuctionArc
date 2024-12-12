require("dotenv").config();
const jwt = require("jsonwebtoken");

const createSecretToken = function (id) {
  return jwt.sign({ id }, process.env.SECRET_HASH_STRING, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const authenticateUser = (req, res, next) => {
  let token = req.headers.cookie
  // console.log(token)
  if (!token) {
    return res.status(401).send("Access Denied: No Token Provided");
  }

  try {
    token = token.replace("token=", "")
    const verifiedUser = jwt.verify(token, process.env.SECRET_HASH_STRING);
    req.user = verifiedUser;
    delete token
    next();
  } catch (err) {
    res.status(403).send("Invalid Token");
  }
};

module.exports = { createSecretToken, authenticateUser };
