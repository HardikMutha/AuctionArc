const User = require("../models/user");
const { createSecretToken } = require("../utils/token");
const { signupSchema, loginSchema } = require("./Schema");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { hashPassword, matchPassword } = require("../utils/password");

const createUser = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: `Validation error: ${error.details[0].message}` });
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists, please log in" });
    }
    hash = await hashPassword(req.body.password);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password_hash: hash,
    });
    const savedUser = await newUser.save();
    const token = createSecretToken(newUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expire: new Date(Date.now() + 28800000),
    });
    return res.status(200).json({ user: savedUser, token });
  } catch (err) {
    res
      .status(400)
      .json({ message: "An Error Occured Please try again later" });
  }
};
const loginUser = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: `Validation error: ${error.details[0].message}` });
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) return res.status(404).send("User Not Found");
    const password = req.body.password;
    const result = await matchPassword(password, existingUser.password_hash);
    if (!existingUser || !result) {
      return res.status(409).json({ message: "Invalid Credentials" });
    }
    const token = createSecretToken(existingUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 28800000),
    });
    res.json({ user: existingUser, token: token });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: "An Error Occured Please Try Again" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userID = req.user.id;
    const doc = await User.findOne({ _id: userID });

    if (!userID || !doc) {
      return res.status(201).json({ msg: "please log in!" });
    } else {
      res.clearCookie("token");
      User.deleteOne(doc).then((result) => console.log(result));
      return res.status(200).json({ msg: "user deleted!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "error" });
  }
};
module.exports = { createUser, loginUser, deleteUser };
