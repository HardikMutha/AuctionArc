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
  currentPrice: { type: Number, default: 0.0 },
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
  const foundProduct = await this.findById(productId).populate("bidHistory");
  if (!foundProduct) {
    return new Error("Product Not Found");
  }
  try {
    const bidAmt =
      foundProduct.bidHistory[foundProduct.bidHistory.length - 1].bidAmount;
    return bidAmt;
  } catch (err) {
    return null;
  }
};

module.exports = mongoose.model("ProductModel", productSchema);
