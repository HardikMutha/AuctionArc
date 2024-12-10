const joi = require("joi");

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

module.exports = productSchemaValidation;
