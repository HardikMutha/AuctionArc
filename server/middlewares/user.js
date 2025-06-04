require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access Denied: No Token Provided");
  }
  try {
    const verifiedUser = jwt.verify(token, process.env.SECRET_HASH_STRING);
    req.user = verifiedUser;
    req.token = token;
    return next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = { authenticateUser };
