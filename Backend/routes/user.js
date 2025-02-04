const express = require("express");
const userRoutes = express.Router();
const {
  authenticateUser,
  checkProductOwner,
} = require("../controllers/jwt_token_generation");

const { getUserFromId } = require("../controllers/user");

userRoutes.route("/user-details/:id").get(getUserFromId);

module.exports = { userRoutes };
