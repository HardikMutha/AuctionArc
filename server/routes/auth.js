const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../models/user");
const { createUser, loginUser, deleteUser } = require("../controllers/auth");
const { authenticateUser } = require("../middlewares/user");
router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/logout", (req, res) => {
  res.cookie("token", "none", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "None",
    expires: new Date(Date.now() + 1000),
    domain: "auction-arc-backend.vercel.app",
  });

  res.status(200).json({ message: "Logged Out" });
});

router.post("/authenticate-user", authenticateUser, async (req, res) => {
  const foundUser = await userModel.findById(req.user.id);
  return res.status(200).json({ user: foundUser, token: req.token });
});

router.get("/delete-account", authenticateUser, deleteUser);
module.exports = router;
