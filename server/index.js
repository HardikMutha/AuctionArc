require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors({ credentials: true, origin: true }));

const authRoutes = require("./routes/auth");
const wishListRoutes = require("./routes/wishlist");
const realtimeRoutes = require("./routes/realtime");
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use(express.json());
app.listen(process.env.PORT, () => {
  console.log(`Listening on PORT ${process.env.PORT}`);
});

app.use("/product", productRoutes);
app.use("/user", userRoutes);
app.use("/wish-list", wishListRoutes);
app.use("/auth", authRoutes);
app.use("/realtime", realtimeRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_STRING);
    console.log("Current database:", mongoose.connection.db.databaseName);
  } catch (err) {
    console.error("Error connecting to database");
  }
};

connectDB();
