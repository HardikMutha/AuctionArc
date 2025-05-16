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
// Placing a Bid

productRoutes
  .route("/place-bid/:id")
  .post(authenticateUser, validateBidAmount, placeBid)
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
