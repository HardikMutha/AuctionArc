const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const { authenticateUser } = require("./controllers/jwt_token_generation");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const wishListRoutes = require("./routes/wishlist");
const productRoutes = require("./routes/product");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use("/auth", authRoutes);
app.use("/wish-list", wishListRoutes);
app.use(express.json());
app.use(cookieParser());

app.listen(process.env.PORT, () => {
  console.log("Listening on PORT 3000");
});

app.use("/", productRoutes);
app.get("/", (req, res) => {
  res.send("nice");
});
app.use("/", productRoutes);

app.get("/dashboard", authenticateUser, (req, res, next) => {
  res.send(`Welcome, Nigga! This is your dashboard.`);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_STRING);
    console.log("Database connected");
    console.log("Current database:", mongoose.connection.db.databaseName);
  } catch (err) {
    console.error("Error connecting to database");
  }
};

connectDB();
