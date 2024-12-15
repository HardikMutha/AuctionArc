const express = require("express");
const productRoutes = express.Router();
const productModel = require("../models/product");
const userModel = require("../models/user");
const { productSchemaValidation } = require("../controllers/validate_form");
const jwt = require("jsonwebtoken");
const bidModel = require("../models/bids");
const {
  authenticateUser,
  checkProductOwner,
} = require("../controllers/jwt_token_generation");

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

// add new-product route
productRoutes
  .route("/add-newproduct")
  .get(authenticateUser, async (req, res) => {
    res.send("Welcome Back");
  })
  .post(authenticateUser, validateProduct, async (req, res) => {
    const userid = req.user?.id;
    console.log(req.body);
    req.body.category = req.body.category.toLowerCase();
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

// Update Route for Products
// Image Updation not Included
productRoutes
  .route("/update-product/:id")
  .put(authenticateUser, checkProductOwner, async (req, res) => {
    try {
      const userId = req.user?.id;
      const productId = req.params.id;
      const updatedContent = req.body;
      if (!productId)
        return res.status(400).json({ message: "Invalid Request" });
      const product = await productModel.findByIdAndUpdate(
        productId,
        updatedContent
      );
      return res.status(200).json({ message: "Product Updated Successfully" });
    } catch (err) {
      console.log(err);
      res.status(403).json({ message: "Invalid Product Id" });
    }
  });

// Delete Route For Products

productRoutes
  .route("/delete-product/:id")
  .post(authenticateUser, checkProductOwner, async (req, res) => {
    const userid = req.user?.id;
    const productId = req.params.id;
    const foundUser = await userModel.findById(userid);
    foundUser.products.pull({ _id: productId });
    await foundUser.save();
    console.log(foundUser);
    const allUsers = await userModel.find();
    for (let i = 0; i < allUsers.length; i++) {
      const newArr = allUsers[i].ongoingBids.filter(
        (bid) => !bid.Bid._id.equals(productId)
      );
      allUsers[i].updateOne({ ongoingBids: newArr });
    }
    await productModel.findByIdAndDelete(productId);
    return res.status(200).json({ message: "The value has been removed" });
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
      console.log(err);
      res.status(404).send("User Not Found");
    }
  });

// Placing a Bid

productRoutes
  .route("/place-bid/:id")
  .post(authenticateUser, async (req, res) => {
    const productId = req.params?.id;
    if (!req.body.bidAmount)
      return res.status(400).json({ message: "No Bid Amount Specified" });
    try {
      const product = await productModel.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Product Not Found" });
      const userid = req.user?.id;
      const foundUser = await userModel.findById(userid);
      const newBid = new bidModel({
        bidder: userid,
        bidAmount: req.body.bidAmount,
        bidDate: Date.now(),
      });
      const bidId = newBid._id;
      if (product.bidHistory.length == 0) {
        await newBid.save();
        product.bidHistory.push(bidId);
        foundUser.ongoingBids.push({ product: product._id, Bid: newBid._id });
        await foundUser.save();
        await product.save();
        return res.status(200).json({ message: "Bid Placed Successfully" });
      } else {
        if (
          req.body.bidAmount < product.bidHistory[product.bidHistory.length - 1]
        ) {
          return res.status(400).json({ message: "Invalid Bid Amount" });
        } else {
          await newBid.save();
          product.bidHistory.push(newBid);
          foundUser.ongoingBids.push({ product: product._id, Bid: newBid._id });
          await foundUser.save();
          await product.save();
          return res.status(200).json({ message: "Bid Placed Successfully" });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(404).send("Invalid Product Id");
    }
  })
  .delete(authenticateUser, async (req, res) => {
    const productId = req.params?.id;
    if (!productId)
      return res.status(404).json({ message: "Invalid Product Id" });
    const bidId = req.body.bidId;
    if (!bidId) return res.status(404).json({ message: "Invalid Product Id" });
    const userid = req.user?.id;
    try {
      const foundUser = await userModel.findById(userid);
      const foundProduct = await productModel.findById(productId);
      foundProduct.bidHistory.pull({ _id: bidId });
      await foundProduct.save();
      const newArr = foundUser.ongoingBids.filter(
        (bid) => !bid.Bid.equals(bidId)
      );
      const updatedUser = await userModel.findByIdAndUpdate(userid, {
        ongoingBids: newArr,
      }); // This returns the previous state of the updated user model,To obtain newState,pass {new:true} as parameter
      return res.status(200).json({ message: "Bid Removed Successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Invalid Request Nigga" });
    }
  });

productRoutes
  .route("/get-similar-products/:id")
  .get(authenticateUser, async (req, res) => {
    const productID = req.params?.id;

    const product = await productModel.findOne({ _id: productID });
    if (!product)
      return res.status(404).json({ message: "Invalid Product Id" });

    const productCategory = product.category.toLowerCase();
    if (!productCategory)
      return res.status(404).json({ message: "Invalid Product Id" });
    // console.log(productCategory);
    if (!product)
      return res.status(404).json({ message: "Invalid Product Id" });

    const similarProducts = await productModel.find({
      category: productCategory,
      _id: { $ne: productID },
    });
    console.log(similarProducts);

    return res.status(200).json(similarProducts);
  });

// Todo -  Figure out the update Model for Bid.

module.exports = productRoutes;
