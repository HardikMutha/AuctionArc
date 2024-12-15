require("dotenv").config();
const jwt = require("jsonwebtoken");
const productModel = require("../models/product");
const mongoose = require("mongoose");
const userModel = require("../models/user");

const createSecretToken = function (id) {
  return jwt.sign({ id }, process.env.SECRET_HASH_STRING, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

const authenticateUser = (req, res, next) => {
  // console.log("Cookies received by server:", req.headers.cookie); // Log raw cookie header
  // console.log("Parsed Cookies:", req.cookies); // Log parsed cookies
  var token = req.headers.cookie; // Safely access the token
  // console.log(token)
  if (!token) {
    res.status(401).send("Access Denied: No Token Provided");
  }

  try {
    token = token.replace("token=", "");
    const verifiedUser = jwt.verify(token, process.env.SECRET_HASH_STRING);
    req.user = verifiedUser;
    delete token;
    next();
  } catch (err) {
    res.status(403).send("Invalid Token");
  }
};

// MiddleWare to check if the user is the product owner for DELETE request.
const checkProductOwner = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const productId = req.params.id;
    const foundUser = await userModel.findById(userId);
    const products = foundUser.products;
    if (!products.includes(productId))
      return res.status(401).json({ message: "Product Not Found Nigga" });
    next();
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Invalid User Id" });
  }
};

module.exports = { createSecretToken, authenticateUser, checkProductOwner };
