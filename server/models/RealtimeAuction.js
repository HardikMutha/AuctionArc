const mongoose = require("mongoose");
const userModel = require("./user.js");
const bidModel = require("./bids.js");

const RealtimeAuctionSchema = new mongoose.Schema({
  name: String,
  description: String,
  images: [String],
  category: String,
  listingPrice: Number,
  productSeller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  status: {
    type: Boolean,
    default: true,
  },
  auctionCode: {
    type: String,
  },
});

module.exports = mongoose.model("RealtimeAuction", RealtimeAuctionSchema);
