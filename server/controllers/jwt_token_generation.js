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

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

// MiddleWare to check if the user is the product owner for DELETE request.
const checkProductOwner = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const productId = req.params.id;
    const foundUser = await userModel.findById(userId);
    const products = foundUser.products;
    const newId = new mongoose.Types.ObjectId(productId);
    for (let i = 0; i < products.length; i++) {
      if (products[i].equals(newId)) return next();
    }
    return res.status(401).json({ message: "Product Not Found Nigga" });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Invalid User Id" });
  }
};

module.exports = { createSecretToken, authenticateUser, checkProductOwner };
