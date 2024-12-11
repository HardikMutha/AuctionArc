require("dotenv").config();
const jwt = require("jsonwebtoken");

const createSecretToken = function (id) {
  return jwt.sign({ id }, process.env.SECRET_HASH_STRING, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const authenticateUser = (req, res, next) => {
  console.log("Cookies received by server:", req.headers.cookie); // Log raw cookie header
  console.log("Parsed Cookies:", req.cookies); // Log parsed cookies

  const token = req.cookies?.token; // Safely access the token
  if (!token) {
    return res.status(401).send("Access Denied: No Token Provided");
  }

  try {
    const verifiedUser = jwt.verify(token, process.env.SECRET_HASH_STRING);
    req.user = verifiedUser;
    next();
  } catch (err) {
    res.status(403).send("Invalid Token");
  }
};

module.exports = { createSecretToken, authenticateUser };
