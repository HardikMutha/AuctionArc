const productModel = require("../models/product");

const validateBidAmount = async (req, res, next) => {
  const { bidAmount } = req.body;
  if (!bidAmount) {
    return res.status(400).json({ message: "No Bid Amount Specified" });
  }
  if (isNaN(bidAmount) || bidAmount <= 0) {
    return res.status(400).json({ message: "Invalid Bid Amount" });
  }
  const productId = req.params.id;
  const foundProduct = await productModel.findById(productId);
  console.log("Current Price:" , foundProduct.currentPrice);
  console.log("Bid Amount:", bidAmount);
  if (foundProduct.currentPrice >= bidAmount) {
    return res
      .status(400)
      .json({ message: "Bid Amount must be greater than current price" });
  }
  req.product = foundProduct;
  return next();
};

module.exports = { validateBidAmount };
