require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors({ credentials: true, origin: true }));
const { authenticateUser } = require("./controllers/jwt_token_generation");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const authRoutes = require("./routes/auth");
const wishListRoutes = require("./routes/wishlist");
const productRoutes = require("./routes/product");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));
app.use("/auth", authRoutes);
app.use("/wish-list", wishListRoutes);
app.use(express.json());

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

app.get("/*", async (req, res) => {
  res.status(404).send("Invalid URL");
});
