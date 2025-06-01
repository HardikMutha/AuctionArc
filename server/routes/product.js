const express = require("express");
const productRoutes = express.Router();
const productModel = require("../models/product");
const userModel = require("../models/user");
const { authenticateUser } = require("../middlewares/user");
const {
  checkProductOwner,
  validateProduct,
} = require("../middlewares/product");

const upload = require("../middlewares/upload.js");

const { validateBidAmount } = require("../middlewares/bids");

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
  deleteBid,
} = require("../controllers/product.js");

productRoutes
  .route("/add-newproduct")
  .post(
    authenticateUser,
    upload.array("images", 10),
    validateProduct,
    uploadProduct
  );

productRoutes
  .route("/update-product/:id")
  .put(authenticateUser, checkProductOwner, updateProduct);

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

productRoutes
  .route("/place-bid/:id")
  .post(authenticateUser, validateBidAmount, placeBid)
  .delete(authenticateUser, deleteBid);

module.exports = productRoutes;
