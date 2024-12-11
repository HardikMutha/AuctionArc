const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  ongoingBids: {},
});

module.exports = mongoose.model("User", userSchema);
