const joi = require("joi");

// Signup Schema
const signupSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  username: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

// Login Schema
const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const productSchemaValidation = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
  images: [joi.string().required().uri()],
  category: joi.string().required(),
  listingPrice: joi.number().required(),
  auctionStatus: joi.boolean(),
  duration: joi.date().required(),
  productSeller: joi.string(),
  bidHistory: [joi.number().required()],
});

module.exports = { signupSchema, loginSchema, productSchemaValidation };
