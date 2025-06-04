const userModel = require("../models/user");
const productModel = require("../models/product");
const bidModel = require("../models/bids");

const getUserFromId = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(404).json({ message: "Invalid ID, User Not Found" });
  try {
    const foundUser = await userModel.findById(id);
    if (!foundUser) return res.status(404).json({ message: "User Not Found" });
    res.status(200).json({ foundUser });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Invalid User Id" });
  }
};

// This backend route is quite complex and involves lot of error handling.
// It returns ans array of objects, where each object contains
// {productDetails, BidInfo}

const getUserBidsFromId = async (req, res) => {
  const userid = req?.user?.id;

  if (!userid) return res.status(404).json({ message: "Invalid User Id" });
  try {
    const userBids = await userModel.getUserBidsFromId(userid);

    if (userBids?.length === 0)
      return res.status(404).json({ message: "Invalid User Id" });
    var r1 = [];
    for (let i = 0; i < userBids?.length; i++) {
      const foundProduct = await productModel.getProductbyId(userBids[i]?._id);
      const foundBid = await bidModel.getBidById(userBids[i]);
      const resObject = { product: foundProduct, bid: foundBid };
      r1.push(resObject);
    }
    return res.status(200).json({ data: r1 });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Invalid User Id" });
  }
};

module.exports = { getUserFromId, getUserBidsFromId };
