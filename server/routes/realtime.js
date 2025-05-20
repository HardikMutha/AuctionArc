const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/user");
const upload = require("../middlewares/upload.js");
const { validateRealtimeProduct } = require("../middlewares/product.js");
const {
  createAuction,
  completeAuction,
  getAllAuctions,
} = require("../controllers/realtime.js");

router.post(
  "/new-auction",
  authenticateUser,
  upload.array("images", 10),
  validateRealtimeProduct,
  createAuction
);

router.post("/complete-auction", authenticateUser, completeAuction);
router.get("/all-auctions", getAllAuctions);

module.exports = router;
