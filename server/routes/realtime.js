const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/user");
const upload = require("../middlewares/upload.js");
const { validateRealtimeProduct } = require("../middlewares/product.js");
const {
  createAuction,
  completeAuction,
  getAllAuctions,
  getAuctionById,
} = require("../controllers/realtime.js");

const { checkAuctionHost } = require("../middlewares/realtime.js");

router.post(
  "/new-auction",
  authenticateUser,
  upload.array("images", 10),
  validateRealtimeProduct,
  createAuction
);

router.post("/complete-auction", authenticateUser, completeAuction);
router.get("/all-auctions", getAllAuctions);
router.get("/auction-details/:id", getAuctionById);
router.post("/check-host", authenticateUser, checkAuctionHost, (req, res) => {
  res.status(200).json({ msg: "Authorization Successfull" });
});

module.exports = router;
