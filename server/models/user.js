const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bidModel = require("./bids");
const product = require("./product");

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password_hash: {
    type: String,
    require: true,
  },
  products: {
    type: [Schema.Types.ObjectId],
    ref: "ProductModel",
    default: [],
  },
  wishList: {
    type: [Schema.Types.ObjectId],
    ref: "ProductModel",
    default: [],
  },
  ongoingBids: [
    {
      type: {
        product: {
          type: Schema.Types.ObjectId,
          ref: "ProductModel",
        },
        Bid: {
          type: Schema.Types.ObjectId,
          ref: "bidModel",
        },
      },
    },
  ],
});

userSchema.statics.getUserBidsFromId = async function (userId) {
  try {
    const foundUser = await this.findById(userId).populate("ongoingBids");
    const userBids = foundUser.ongoingBids;
    return userBids;
  } catch (err) {
    console.err(err);
    return null;
  }
};

module.exports = mongoose.model("User", userSchema);
