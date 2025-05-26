const RealtimeAuctionModel = require("../models/RealtimeAuction");
const productModel = require("../models/product");
const userModel = require("../models/user");
const mongoose = require("mongoose");
const { uploadImagesToCloudinary } = require("./product");
const fs = require("fs");

const createAuction = async (req, res) => {
  const userid = req?.user?.id;
  const inputData = req.body;
  const inputFiles = await uploadImagesToCloudinary(req);
  if (inputFiles.length == 0) {
    return res
      .status(401)
      .json({ message: "File Size too large, Upload Failed" });
  }
  if (inputFiles.length > 0) {
    for (const file of req.files) {
      fs.rmSync(file.path);
    }
  }
  const images = inputFiles.map((f) => f);
  const auctionCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  const newProduct = {
    ...inputData,
    images: images,
    productSeller: userid,
    auctionCode: `${auctionCode}`,
  };
  const finalProduct = new RealtimeAuctionModel(newProduct);
  try {
    const savedProduct = await finalProduct.save();
    res.status(200).json({
      msg: "Auction Created Succefully, Redirecting...",
      id: savedProduct._id,
      auctionCode: savedProduct.auctionCode,
    });
  } catch (err) {
    res.status(400).json({ msg: err?.message });
  }
};

const completeAuction = async (req, res) => {
  const { productId, soldTo } = req.body;

  const product = await RealtimeAuctionModel.findById(productId);
  if (!product) {
    res.status(404).json({ msg: "Product Not Found Invalid Request" });
    return;
  }
  if (soldTo === "unsold") {
    (product.soldTo = null), (product.status = false), await product.save();
    return res
      .status(200)
      .json({ message: "Auction Completed with Product going unsold" });
  }
  const newUser = await userModel
    .findById(soldTo)
    .select(["username", "email", "_id"]);
  if (!newUser) {
    res.status(404).json({ msg: "Product Not Found Invalid Request" });
    return;
  }
  product.soldTo = newUser._id;
  product.status = false;
  await product.save();
  res
    .status(200)
    .json({ message: "Auction Completed Successfully", winner: newUser });
};

const getAllAuctions = async (req, res) => {
  const auctions = await RealtimeAuctionModel.find();
  res.status(200).json({ data: auctions });
  return;
};

const getAuctionById = async (req, res) => {
  const { id } = req.params;
  const foundAuction = await RealtimeAuctionModel.findOne({ auctionCode: id });
  if (!foundAuction) {
    return res.status(404).json({ msg: "Auction Not Found" });
  }
  return res.status(200).json({ data: foundAuction });
};

module.exports = {
  createAuction,
  completeAuction,
  getAllAuctions,
  getAuctionById,
};
