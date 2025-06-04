const mongoose = require("mongoose");
const userModel = require("./user");
const Schema = mongoose.Schema;

const bidSchema = new Schema({
  bidder: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bidAmount: {
    type: Number,
    default: 0.0,
  },
  bidDate: {
    type: Date,
    default: Date.now(),
  },
});

bidSchema.statics.getBidById = async function (bidId) {
  const foundBid = await this.findById(bidId._id);
  if (!foundBid) throw new Error("Bid not found");
  return foundBid;
};

module.exports = mongoose.model("bidModel", bidSchema);
