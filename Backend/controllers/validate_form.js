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

module.exports = { signupSchema, loginSchema };
