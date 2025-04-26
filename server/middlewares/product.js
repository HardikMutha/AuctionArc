const mongoose = require("mongoose");
const userModel = require("../models/user");

const checkProductOwner = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const productId = req.params.id;
    const foundUser = await userModel.findById(userId);
    const products = foundUser.products;
    const newId = new mongoose.Types.ObjectId(productId);
    for (let i = 0; i < products.length; i++) {
      if (products[i].equals(newId)) return next();
    }
    return res.status(401).json({ message: "Product Not Found" });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Invalid User Id" });
  }
};

module.exports = { checkProductOwner };
