require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  var token = req.headers?.cookie; // Safely access the token
  if (!token) {
    return res.status(401).send("Access Denied: No Token Provided");
  }
  try {
    // Extract the token from the cookie string
    const token = req.headers.cookie
      .split("; ")
      .find((item) => item.startsWith("token="))
      ?.split("=")[1]; // Safely split and retrieve the token value
    if (!token) {
      return res.status(401).json({ message: "Access Denied: Token Missing" });
    }
    // Verify the token
    const verifiedUser = jwt.verify(token, process.env.SECRET_HASH_STRING);
    req.user = verifiedUser;
    req.token = token;
    return next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = { authenticateUser };
