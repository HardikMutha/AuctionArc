const productModel = require("../models/product");
const userModel = require("../models/user");
const bidModel = require("../models/bids");
const mongoose = require("mongoose");

const checkProduct = async (req, res, next) => {
  const productId = req.params.id;
  if (!productId)
    return res.status(404).json({ message: "Product Id not provided" });
  next();
};

const uploadProduct = async (req, res) => {
  const userid = req.user?.id;
  const inputFiles = req.files;
  const inputData = req.body;
  const images = inputFiles.map((f) => f.path);
  const newProduct = {
    ...inputData,
    images: images,
    productSeller: userid,
    bidHistory: [],
    soldTo: userid,
  };
  const finalProduct = new productModel(newProduct);
  try {
    const savedProduct = await finalProduct.save();
    const currentUser = await userModel.findById(userid);
    currentUser.products.push(savedProduct._id);
    const savedUser = await currentUser.save();
    res.status(200).json({
      msg: "Added to database successfully",
      id: savedProduct._id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

const deleteProduct = async (req, res) => {
  const userid = req.user?.id;
  const productId = req.params.id;
  const foundUser = await userModel.findById(userid);
  foundUser.products.pull({ _id: productId });
  await foundUser.save();
  const allUsers = await userModel.find();
  for (let i = 0; i < allUsers.length; i++) {
    const newArr = allUsers[i].ongoingBids.filter(
      (bid) => !bid.Bid._id.equals(productId)
    );
    allUsers[i].updateOne({ ongoingBids: newArr });
  }
  try {
    await productModel.findByIdAndDelete(productId);
    return res.status(200).json({ message: "The value has been removed" });
  } catch (err) {
    return res
      .status(404)
      .json({ message: "An Error Occurred Please Try Again" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const userId = req.user?.id;
    const productId = req.params.id;
    const updatedContent = req.body;
    console.log(productId);
    if (!productId) return res.status(400).json({ message: "Invalid Request" });
    const product = await productModel.findByIdAndUpdate(
      productId,
      updatedContent
    );
    return res.status(200).json({ message: "Product Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Invalid Product Id" });
  }
};

const getUserProducts = async (req, res) => {
  try {
    const userid = req.user?.id;
    const page = parseInt(req.params.page) || 1;
    const limit = 4;
    if (!userid) return res.status(404).json({ message: "User Not Found" });
    const updatedId = new mongoose.Types.ObjectId(userid);
    const foundUser = await userModel.findOne({ _id: updatedId });

    if (!foundUser)
      return res
        .status(404)
        .json({ message: "Invalid User Id, user not found" });

    const numberofProducts = foundUser.products.length;

    const products = await productModel
      .find({ productSeller: updatedId })
      .skip((page - 1) * limit)
      .limit(limit);
    console.log(products);

    res
      .status(200)
      .json({ products: products, totalProducts: numberofProducts });
  } catch (err) {
    console.log(err);
    res.status(404).send("User Not Found");
  }
};

const getSimilarProducts = async (req, res) => {
  const productID = req.params?.id;

  // Check if the productId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(productID)) {
    return res.status(400).json({ message: "Invalid Product ID format" });
  }

  try {
    const product = await productModel.findOne({ _id: productID });
    if (!product)
      return res.status(404).json({ message: "Invalid Product Id" });
    const productCategory = product.category
      ? product.category.toLowerCase()
      : null;
    if (!productCategory) {
      return res
        .status(404)
        .json({ message: "Product does not have a valid category" });
    }

    // Find similar products based on category
    const similarProducts = await productModel.find({
      category: productCategory,
      _id: { $ne: productID }, // Exclude the current product from the similar products
    });

    return res.status(200).json(similarProducts);
  } catch {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await productModel.find();
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(404).json({ message: "Please Try again later" });
  }
};

const getSingleProduct = async (req, res) => {
  const productId = req.params.id;
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(404).json({ message: "Invalid Product ID" });
  }
  try {
    const foundProduct = await productModel.findById(productId);
    // Check if the product was found
    if (!foundProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(foundProduct);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error ");
  }
};

const getProductPrice = async (req, res) => {
  const productId = req.params.id;
  try {
    const price = await productModel.getProductPrice(productId);
    return res.status(200).json({ price: price });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Requested Product Not Found" });
  }
};

// const placeBid = async (req, res) => {
//   const productId = req.params?.id;
//   if (!req.body.bidAmount)
//     return res.status(400).json({ message: "No Bid Amount Specified" });
//   try {
//     const product = await productModel.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product Not Found" });
//     const userid = req.user?.id;
//     const foundUser = await userModel.findById(userid);
//     const newBid = new bidModel({
//       bidder: userid,
//       bidAmount: req.body.bidAmount,
//       bidDate: Date.now(),
//     });
//     const bidId = newBid._id;
//     if (product.bidHistory.length == 0) {
//       await newBid.save();
//       product.bidHistory.push(bidId);
//       foundUser.ongoingBids.push({ product: product._id, Bid: newBid._id });
//       await foundUser.save();
//       await product.save();
//       return res.status(200).json({ message: "Bid Placed Successfully" });
//     } else {
//       if (
//         req.body.bidAmount <
//         product.bidHistory[product.bidHistory.length - 1].bidAmount
//       ) {
//         return res.status(400).json({ message: "Invalid Bid Amount" });
//       } else {
//         await newBid.save();
//         product.bidHistory.push(newBid);
//         foundUser.ongoingBids.push({ product: product._id, Bid: newBid._id });
//         await foundUser.save();
//         await product.save();
//         return res.status(200).json({ message: "Bid Placed Successfully" });
//       }
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(404).send("Invalid Product Id");
//   }
// };

const placeBid = async (req, res) => {
  const productId = req.params.id;
  const { bidAmount } = req.body;

  if (!bidAmount) {
    return res.status(400).json({ message: "No Bid Amount Specified" });
  }

  try {
    const product = await productModel.findById(productId).populate("bidHistory");
    if (!product) return res.status(404).json({ message: "Product Not Found" });

    const userid = req.user?.id;
    const foundUser = await userModel.findById(userid);

    const newBid = new bidModel({
      bidder: userid,
      bidAmount,
      bidDate: Date.now(),
    });

    const lastBid = product.bidHistory.length
      ? await bidModel.findById(product.bidHistory[product.bidHistory.length - 1])
      : null;

    if (lastBid && bidAmount <= lastBid.bidAmount) {
      return res.status(400).json({ message: "Bid must be higher than the current highest bid." });
    }

    await newBid.save();
    product.bidHistory.push(newBid._id);
    foundUser.ongoingBids.push({ product: product._id, Bid: newBid._id });

    await foundUser.save();
    await product.save();

    return res.status(200).json({ message: "Bid Placed Successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

const getProductsInfiniteScroll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const totalProductCount = await productModel.countDocuments();

    const products = await productModel.find().skip(skip).limit(limit);
    res.status(200).json(products);
  } catch (err) {
    res.status(404).json({ message: "Please Try again later" });
  }
};

module.exports = {
  uploadProduct,
  deleteProduct,
  updateProduct,
  getUserProducts,
  getSimilarProducts,
  getAllProducts,
  getSingleProduct,
  checkProduct,
  getProductPrice,
  placeBid,
  getProductsInfiniteScroll,
};
