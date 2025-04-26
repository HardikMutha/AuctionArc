const jwt = require("jsonwebtoken");

const createSecretToken = function (id) {
  return jwt.sign({ id }, process.env.SECRET_HASH_STRING, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET_HASH_STRING);
};

module.exports = { createSecretToken, verifyToken };
