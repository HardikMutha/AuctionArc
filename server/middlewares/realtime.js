const RealtimeAuctionModel = require("../models/RealtimeAuction");

const checkAuctionHost = async (req, res, next) => {
  const user = req?.user;
  const { id } = req.body;
  if (!id) return res.status(404).json({ msg: "Invalid id" });
  const foundAuction = await RealtimeAuctionModel.findOne({ auctionCode: id });
  if (!foundAuction) return res.status(404).json({ msg: "Invalid Auction" });
  if (foundAuction.productSeller.toString() === user?.id) {
    return next();
  }
  return res.status(401).json({ msg: "Unauthorized" });
};

module.exports = { checkAuctionHost };
