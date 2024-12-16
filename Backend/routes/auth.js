const express = require("express");
const router = express.Router();
const { createUser, loginUser, deleteUser } = require("../controllers/auth");
const { authenticateUser } = require("../controllers/jwt_token_generation");
router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged Out" });
});

router.get("/delete-account", authenticateUser, deleteUser);
module.exports = router;
