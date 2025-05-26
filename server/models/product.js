const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  category: String,
  listingPrice: Number,
  auctionStatus: { type: Boolean, default: true },
  duration: {
    type: Date,
    default: Date.now(),
  },
  currentPrice: { type: Number, default: 0.0 },
  productSeller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  bidHistory: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "bidModel" }],
    default: [],
  },
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
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
    return foundProduct.listingPrice;
  }
};

productSchema.statics.getProductbyId = async function (productId) {
  try {
    const foundProduct = await this.findById(productId);
    return foundProduct;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
  // if (!foundProduct) return new Error("Product Not Found");
};

productSchema.statics.getSoldProducts = async function () {
  try {
    const foundProducts = await this.find({ auctionStatus: false })
      .populate("bidHistory")
      .populate("soldTo");
    return foundProducts;
  } catch (err) {
    console.log(err);
    return new Error("An Error Occured Try again later");
  }
};

module.exports = mongoose.model("ProductModel", productSchema);
