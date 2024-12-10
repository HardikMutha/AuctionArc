const mongoose = require("mongoose");
const userModel = require("./user.js");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  category: String,
  listingPrice: Number,
  auctionStatus: { type: Boolean, default: true },
  duration: Date,
  productSeller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bidHistory: [Number],
});

module.exports = mongoose.model("ProductModel", productSchema);
