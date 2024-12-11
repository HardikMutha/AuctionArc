const mongoose = require("mongoose");
const userModel = require("./user.js");

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
    type: [
      {
        bidder: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        bidAmount: {
          type: Number,
        },
        bidDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: "6757231c22b9b895928c3a7b",
  },
});

module.exports = mongoose.model("ProductModel", productSchema);
