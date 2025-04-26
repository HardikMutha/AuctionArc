const express = require("express");
const userRoutes = express.Router();
const { authenticateUser } = require("../middlewares/user");

const { getUserFromId, getUserBidsFromId } = require("../controllers/user");

userRoutes.route("/user-details/:id").get(getUserFromId);

userRoutes.route("/get-user-bids/").get(authenticateUser, getUserBidsFromId);

module.exports = { userRoutes };
