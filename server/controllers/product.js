const productModel = require("../models/product");
const userModel = require("../models/user");
const bidModel = require("../models/bids");
const fs = require("fs");
const mongoose = require("mongoose");

const { cloudinary } = require("../Cloudinary");

const checkProduct = async (req, res, next) => {
  const productId = req.params.id;
  if (!productId)
    return res.status(404).json({ message: "Product Id not provided" });
  next();
};

const uploadImagesToCloudinary = async (req) => {
  const inputFiles = req?.files;
  const uploadResults = [];
  const streamUpload = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { timeout: 120000 },
        (error, result) => {
          if (result) resolve(result.url);
          else reject(error);
        }
      );
      stream.end(fileBuffer);
    });
  };
  for (const image of inputFiles) {
    try {
      const resultUrl = await streamUpload(image.buffer);
      uploadResults.push(resultUrl.replace("http", "https"));
    } catch (err) {
      console.log("Cloudinary upload error:", err);
    }
  }
  return uploadResults;
};

const uploadProduct = async (req, res) => {
  const userid = req.user?.id;
  const inputData = req.body;
  const inputFiles = await uploadImagesToCloudinary(req);
  if (inputFiles.length == 0) {
    return res
      .status(401)
      .json({ message: "File Size too large, Upload Failed" });
  }
  const images = inputFiles.map((f) => f);
  const newProduct = {
    ...inputData,
    images: images,
    productSeller: userid,
    bidHistory: [],
    soldTo: userid,
  };
  const finalProduct = new productModel(newProduct);
  try {
    finalProduct.currentPrice = finalProduct.listingPrice;
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
      (bid) => !bid._id.equals(productId)
    );
    allUsers[i].updateOne({ ongoingBids: newArr });
  }
  try {
    const foundProduct = await productModel.findByIdAndDelete(productId);
    for (let i = 0; i < foundProduct.images.length; i++) {
      const newURL = foundProduct.images[i];
      await cloudinary.uploader.destroy(newURL);
    }
    return res.status(200).json({ message: "The Product has been removed" });
  } catch (err) {
    console.log(err);
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
    const limit = 3;
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
  if (!mongoose.Types.ObjectId.isValid(productID)) {
    return res.status(400).json({ message: "Invalid Product ID format" });
  }

  try {
    const product = await productModel.findOne({ _id: productID });
    if (!product)
      return res.status(404).json({ message: "Invalid Product Id" });
    const productCategory = product.category ? product.category : null;
    if (!productCategory) {
      return res
        .status(404)
        .json({ message: "Product does not have a valid category" });
    }

    // Find similar products based on category
    const similarProducts = await productModel.find({
      category: productCategory,
      _id: { $ne: productID }, // Exclude the current product from the similar products
      auctionStatus: true, // Ensure only products that are currently up for auction are returned
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

const placeBid = async (req, res) => {
  try {
    const user = req?.user;
    const product = req?.product;
    if (!req?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { bidAmount } = req.body;

    // Creating a new Bid object to store in Bid History
    const newBid = new bidModel({
      bidder: user?.id,
      bidAmount: bidAmount,
      bidDate: new Date(),
      product: product?._id,
    });

    await newBid.save();
    product.bidHistory.push(newBid._id);

    product.currentPrice = bidAmount;
    await product.save();

    const foundUser = await userModel.findById(user?.id);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const productIdStr = product._id.toString();

    // Add only if product ID string not already in array
    if (!foundUser.ongoingBids.includes(newBid._id)) {
      foundUser.ongoingBids.push(newBid._id);
    }

    await foundUser.save();

    res.status(200).json({ message: "Bid Placed Successfully" });
  } catch (err) {
    console.error("Error placing bid:", err);
    res
      .status(500)
      .json({ message: "An error occurred while placing the bid" });
  }
};

const getProductsInfiniteScroll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const totalProductCount = await productModel.countDocuments();

    const products = await productModel
      .find({ auctionStatus: true })
      .skip(skip)
      .limit(limit);
    res.status(200).json(products);
  } catch (err) {
    res.status(404).json({ message: "Please Try again later" });
  }
};

const getSoldProducts = async (req, res) => {
  try {
    const foundProducts = await productModel.getSoldProducts();
    return res.status(200).json({ data: foundProducts });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "An Error Occurred" });
  }
};

const deleteBid = async (req, res) => {
  const productId = req.params?.id;
  if (!productId)
    return res.status(404).json({ message: "Invalid Product Id" });
  const bidId = req.body.bidId;
  if (!bidId) return res.status(404).json({ message: "Invalid Product Id" });
  const userid = req.user?.id;
  try {
    const foundUser = await userModel.findById(userid);
    const foundProduct = await productModel.findById(productId);
    foundProduct.bidHistory.pull({ _id: bidId });
    await foundProduct.save();
    const newArr = foundUser.ongoingBids.filter(
      (bid) => !bid.Bid.equals(bidId)
    );
    await userModel.findByIdAndUpdate(userid, {
      ongoingBids: newArr,
    });
    return res.status(200).json({ message: "Bid Removed Successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid Request " });
  }
};

const updateAllProductStatus = async (req, res) => {
  try {
    const allProducts = await productModel.find();

    for (let i = 0; i < allProducts.length; i++) {
      let product = allProducts[i];

      if (product?.auctionStatus && product?.duration < new Date()) {
        // mark the product as sold
        product.auctionStatus = false;

        // Find the highest bid in the bid history of the product (always the last one because we push to the end)
        const highestBidID = product?.bidHistory[product.bidHistory.length - 1];

        // find the user who placed the highest bid
        const foundUser = await bidModel.findById(highestBidID);
        if (foundUser) {
          // Update the product's soldTo field with the user's ID
          product.soldTo = foundUser?._id;
          foundUser.ongoingBids?.filter((bid) => !bid.equals(highestBidID));
          await foundUser?.save();
        }
        await product.save();
      }
    }

    res.status(200).json({ msg: "All products updated successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ msg: `Error updating product status: ${err.message}` });
    console.error(err);
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
  getSoldProducts,
  uploadImagesToCloudinary,
  deleteBid,
  updateAllProductStatus,
};
