const express = require("express")
const { authenticateUser } = require("../controllers/jwt_token_generation")
const {addToWishList, removeFromWishlist, displayWishList} = require("../controllers/wishlist")
const router = express.Router();


// Protected routes verified by authenticateUser function
router.get("/", authenticateUser, displayWishList);
router.post("/add-to-wishlist", authenticateUser, addToWishList);
router.post("/remove-from-wishlist", authenticateUser, removeFromWishlist);


module.exports = router;