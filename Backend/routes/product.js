const express = require("express");
const productRoutes = express.Router();
const productModel = require("../models/product");
const userModel = require("../models/user");
const { productSchemaValidation } = require("../controllers/validate_form");
const jwt = require("jsonwebtoken");
const { authenticateUser } = require("../controllers/jwt_token_generation");

const validateProduct = async (req, res, next) => {
  try {
    const isvalid = await productSchemaValidation.validateAsync(req.body);
    if (!isvalid) return res.sendStatus(400);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Unauthorized Access");
  }
};

productRoutes
  .route("/add-newproduct")
  .get(authenticateUser, async (req, res) => {
    res.send("Welcome Back");
  })
  .post(authenticateUser, validateProduct, async (req, res) => {
    const userid = req.user?.id;
    console.log(req.body);
    const inputData = req.body;
    const newProduct = {
      ...inputData,
      productSeller: userid,
      bidHistory: [],
      soldTo: userid,
    };
    const finalProduct = new productModel(newProduct);
    try {
      const savedProduct = await finalProduct.save();
      const currentUser = await userModel.findById(userid);
      currentUser.products.push(savedProduct._id);
      await currentUser.save();
      res.status(200).send("Added to database successfully");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  });

productRoutes
  .route("/show-my-products")
  .get(authenticateUser, async (req, res) => {
    try {
      const userid = req.user?.id;
      const foundUser = await userModel.findById(userid).populate("products");
      const products = foundUser.products;
      res.status(200).json(products);
    } catch (err) {
      res.status(404).send("User Not Found");
    }
  });

productRoutes
  .route("/place-bid/:id")
  .post(authenticateUser, async (req, res) => {
    const productId = req.params?.id;
    if (!req.body.bidAmount)
      return res.status(400).json({ message: "No Bid Amount Specified" });
    try {
      const product = await productModel.findById(productId);
      const userid = req.user?.id;
      const foundUser = await userModel.findById(userid);
      const bidAmount = req.body.bidAmount;
      const bidDate = Date.now();
      const bid = {
        bidder: foundUser._id,
        bidAmount,
        bidDate,
      };
      product.bidHistory.push(bid);
      foundUser.ongoingBids.push({ product: productId, bidAmount: bidAmount });
      await product.save();
      await foundUser.save();
      return res.status(200).send("Bid Placed Successfully");
    } catch (err) {
      return res.status(404).send("Invalid Product Id");
    }
  })
  .delete(authenticateUser, async (req, res) => {});

module.exports = productRoutes;
