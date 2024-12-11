const User = require("../models/user");
const { createSecretToken } = require("./jwt_token_generation");
const { signupSchema, loginSchema } = require("./validate_form");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// const encryptPassword = (password, salt) => {
//     return scryptSync(password, salt, 32).toString('hex');
// };

// const hashPassword = (password) => {
//     // Any random string here (ideally should be at least 16 bytes)
//     const salt = randomBytes(16).toString('hex');
//     return encryptPassword(password, salt) + salt;
// };

// const matchPassword = (password, hash) => {
//     // extract salt from the hashed string
//     // our hex password length is 32*2 = 64
//     const salt = hash.slice(64);
//     const originalPassHash = hash.slice(0, 64);
//     const currentPassHash = hashPassword(password, salt);
//     return originalPassHash === currentPassHash;
// };

const hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    if (!hash) return;
    return hash;
  } catch (err) {
    console.log(err);
    return;
  }
};
const matchPassword = async (password, hashed_password) => {
  try {
    const result = await bcrypt.compare(password, hashed_password);
    if (!result) return false;
    else return true;
  } catch (err) {
    console.log("Invalid Password");
    return "Invalid";
  }
};

const createUser = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .send(`Validation error: ${error.details[0].message}`);
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).send("User already exists, please log in");
    }

    // hash = hashPassword(req.body.password);
    hash = req.body.password;

    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password_hash: hash,
    });

    const user = await newUser.save();

    // Creates the jwt token
    const token = createSecretToken(user._id);

    // Cookie name == Token
    res.cookie("token", token, {
      path: "/", // Accessible across the app
      httpOnly: true, // Prevent client-side access
      secure: false, // Use `true` only for HTTPS
      sameSite: "Lax", // Allow basic cross-origin
    });
    console.log("cookie set successfully", token);
    res.json(user);
    console.log("New User added !");
    return;
  } catch (err) {
    console.log("Got an error", err);
  }
};

const loginUser = async (req, res) => {
  console.log("Request body:", req.body);

  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .send(`Validation error: ${error.details[0].message}`);
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser || !(req.body.password === existingUser.password_hash)) {
      return res.status(409).send("Invalid Credentials");
    }

    const token = createSecretToken(existingUser._id);
    res.cookie("token", token, {
      path: "/", // Accessible across the app
      httpOnly: true, // Prevent client-side access
      secure: false, // Use `true` only for HTTPS
      sameSite: "Lax", // Allow basic cross-origin
    });
    console.log("Logged IN!");
    res.json({ token });
  } catch (err) {
    console.log("Got an error", err);
  }
};

module.exports = { createUser, loginUser };
