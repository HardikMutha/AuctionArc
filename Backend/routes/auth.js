const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../models/user");
const { createUser, loginUser, deleteUser } = require("../controllers/auth");
const { authenticateUser } = require("../controllers/jwt_token_generation");
router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/logout", (req, res) => {
  res.cookie("token", "logoutToken", {
    path: "/",
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
    expires: new Date(Date.now() + 5000),
  });
  res.status(200).json({ message: "Logged Out" });
});
router.post("/authenticate-user", authenticateUser, async (req, res) => {
  console.log(req.user.id);
  const foundUser = await userModel.findById(req.user.id);
  return res.status(200).json(foundUser);
});

router.get("/delete-account", authenticateUser, deleteUser);
module.exports = router;
