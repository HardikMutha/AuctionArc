const mongoose = require("mongoose");
const userModel = require("./user.js");
const bidModel = require("./bids.js");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  category: String,
  listingPrice: Number,
  auctionStatus: { type: Boolean, default: true },
  duration: {
    type: Date,
    default: Date.now,
  },
  productSeller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: "6757231c22b9b895928c3a7b",
  },
  bidHistory: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "bidModel" }],
    default: [],
  },
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: "6757231c22b9b895928c3a7b",
  },
});

productSchema.statics.getProductPrice = async function (productId) {
  // try {
  //   const foundProduct = await this.findById(productId).populate("bidHistory");
  //   return foundProduct.bidHistory[foundProduct.bidHistory.length - 1]
  //     .bidAmount;
  // } catch (err) {
  //   console.log(err);
  //   return err;
  // }
  const foundProduct = await this.findById(productId).populate("bidHistory");
  if (!foundProduct) {
    return new Error("Product Not Found");
  }
  return foundProduct.bidHistory[foundProduct.bidHistory.length - 1].bidAmount;
};

module.exports = mongoose.model("ProductModel", productSchema);
