const express = require("express");
const productRoutes = express.Router();
const productModel = require("../models/product");
const userModel = require("../models/user");
const { productSchemaValidation } = require("../controllers/validate_form");
const mongoose = require("mongoose");
const bidModel = require("../models/bids");
const {
  authenticateUser,
  checkProductOwner,
} = require("../controllers/jwt_token_generation");
const multer = require("multer");
const { storage } = require("../Cloudinary.js");
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// const upload = multer({ dest: "../uploads/" });

const validateProduct = async (req, res, next) => {
  try {
    const isvalid = await productSchemaValidation.validateAsync(req.body);
    if (!isvalid) return res.sendStatus(400);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Validation of Data Failed");
  }
};

// add new-product route
productRoutes
  .route("/add-newproduct")
  .get(authenticateUser, async (req, res) => {
    res.send("Welcome Back");
  })
  .post(
    authenticateUser,
    upload.array("images", 12),
    validateProduct,
    async (req, res) => {
      const userid = req.user?.id;
      const inputFiles = req.files;
      const inputData = req.body;
      const images = inputFiles.map((f) => f.path);
      const newProduct = {
        ...inputData,
        images: images,
        productSeller: userid,
        bidHistory: [],
        soldTo: userid,
      };
      const finalProduct = new productModel(newProduct);
      try {
        const savedProduct = await finalProduct.save();
        const currentUser = await userModel.findById(userid);
        currentUser.products.push(savedProduct._id);
        const savedUser = await currentUser.save();
        res.status(200).json({
          msg: "Added to database successfully",
          id: savedProduct._id,
        });
      } catch (err) {
        console.log(err);
        res.status(400).send(err);
      }
    }
  );
// .post(authenticateUser, validateProduct, async (req, res) => {

// Update Route for Products
// Image Updation not Included
productRoutes
  .route("/update-product/:id")
  .put(authenticateUser, checkProductOwner, async (req, res) => {
    try {
      const userId = req.user?.id;
      const productId = req.params.id;
      const updatedContent = req.body;
      console.log(productId);
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
    const allUsers = await userModel.find();
    for (let i = 0; i < allUsers.length; i++) {
      const newArr = allUsers[i].ongoingBids.filter(
        (bid) => !bid.Bid._id.equals(productId)
      );
      allUsers[i].updateOne({ ongoingBids: newArr });
    }
    try {
      await productModel.findByIdAndDelete(productId);
      return res.status(200).json({ message: "The value has been removed" });
    } catch (err) {
      return res
        .status(404)
        .json({ message: "An Error Occurred Please Try Again" });
    }
  });

productRoutes.route("/my-products").get(authenticateUser, async (req, res) => {
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

    // Check if the productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    try {
      const product = await productModel.findOne({ _id: productID });
      if (!product)
        return res.status(404).json({ message: "Invalid Product Id" });
      const productCategory = product.category
        ? product.category.toLowerCase()
        : null;
      if (!productCategory) {
        return res
          .status(404)
          .json({ message: "Product does not have a valid category" });
      }

      // Find similar products based on category
      const similarProducts = await productModel.find({
        category: productCategory,
        _id: { $ne: productID }, // Exclude the current product from the similar products
      });

      return res.status(200).json(similarProducts);
    } catch {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  });

productRoutes.route("/all-products").get(async (req, res) => {
  try {
    const allProducts = await productModel.find();
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(404).json({ message: "Please Try again later" });
  }
});
productRoutes.route("/products/:id").get(async (req, res) => {
  const productId = req.params.id;
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(404).json({ message: "Invalid Product ID" });
  }
  try {
    const foundProduct = await productModel.findById(productId);
    // Check if the product was found
    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(foundProduct);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error ");
  }
});

// Todo -  Figure out the update Model for Bid.

module.exports = productRoutes;
