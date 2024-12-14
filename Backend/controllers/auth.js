const User = require("../models/user");
const { createSecretToken } = require("./jwt_token_generation");
const { signupSchema, loginSchema } = require("./validate_form");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
    return result;
  } catch (err) {
    console.log("Invalid Password");
    return false;
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

    hash = await hashPassword(req.body.password);

    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password_hash: hash,
    });

    await newUser.save();
    
    // Cookie name == Token
    const token = createSecretToken(newUser._id);
    res.cookie("token", token, {
      path: "/", // Accessible across the app
      httpOnly: true, // Prevent client-side access
      secure: false, // Use `true` only for HTTPS
      sameSite: "Lax", // Allow basic cross-origin
    });
    //console.log("cookie set successfully", token);
    // res.json(user);

    // console.log("cookie set successfully", token);
    console.log("New User added !");
    return res.status(200).json(req.body);
  } catch (err) {
    res.status(400).send(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .send(`Validation error: ${error.details[0].message}`);
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) return res.status(404).send("User Not Found");
    const password = req.body.password;
    const result = await matchPassword(password, existingUser.password_hash);
    if (!existingUser || !result) {
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

const deleteUser = async (req, res) => {
  try {
    const userID = req.user.id;
    console.log(userID)
    const doc = await User.findOne({_id : userID});

    if(!userID || !doc) {
      return res.status(201).json({msg : "please log in!"})
    } else {
      res.clearCookie("token")
      // res.json({ message: "Logged Out" })
      User.deleteOne(doc).then((result) => console.log(result));
      return res.status(200).json({msg : "user deleted!"}) ;
    }
  } catch(err) {
    console.log(err);
    return res.status(500).json({msg : "error"})
  }

}
module.exports = { createUser, loginUser, deleteUser };
