const express = require("express");
const productRoutes = express.Router();
const productModel = require("../models/product");
const productSchemaValidation = require("../validatedata");

const validateProduct = async (req, res, next) => {
  console.log(req.body);
  try {
    const isvalid = await productSchemaValidation.validateAsync(req.body);
    if (!isvalid) return res.sendStatus(400);
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(401);
  }
};

productRoutes
  .route("/add-newproduct")
  .get(async (req, res) => {
    res.send("Welcome Back");
  })
  .post(validateProduct, async (req, res) => {
    const newProduct = new productModel(req.body);
    console.log(newProduct);
    try {
      // await newProduct.save();
      res.status(200).send("Added to database successfully");
    } catch (err) {
      console.log();
      res.status(400).send("Error adding product");
    }
  });

module.exports = productRoutes;
