const express = require("express");
const productRoutes = express.Router();
const productModel = require("../models/product");
const userModel = require("../models/user");
const { productSchemaValidation } = require("../controllers/Schema");
const mongoose = require("mongoose");
const bidModel = require("../models/bids");
const {
  authenticateUser,
  checkProductOwner,
} = require("../controllers/jwt_token_generation");
const {
  uploadProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getSimilarProducts,
  getUserProducts,
  getSingleProduct,
  checkProduct,
  getProductPrice,
  placeBid,
  getProductsInfiniteScroll,
  getSoldProducts,
} = require("../controllers/product.js");

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
    uploadProduct
  );

// Update Route for Products
// Image Updation not Included
productRoutes
  .route("/update-product/:id")
  .put(authenticateUser, checkProductOwner, updateProduct);

// Delete Route For Products

productRoutes
  .route("/delete-product/:id")
  .post(authenticateUser, checkProductOwner, deleteProduct);

productRoutes
  .route("/my-products/:page")
  .get(authenticateUser, getUserProducts);

productRoutes
  .route("/get-similar-products/:id")
  .get(authenticateUser, getSimilarProducts);

productRoutes.route("/all-products").get(getAllProducts);

productRoutes.route("/products/:id").get(getSingleProduct);

productRoutes
  .route("/get-current-price/:id")
  .get(checkProduct, getProductPrice);

productRoutes
  .route("/all-products-infinite-scroll")
  .get(getProductsInfiniteScroll);

productRoutes.route("/get-sold-products").get(getSoldProducts);
// Placing a Bid

productRoutes
  .route("/place-bid/:id")
  .post(authenticateUser, placeBid)
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
      res.status(400).json({ message: "Invalid Request " });
    }
  });

// Todo -  Figure out the update Model for Bid.

module.exports = productRoutes;
