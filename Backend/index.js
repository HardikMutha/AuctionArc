const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const productRoutes = require("./routes/product");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT, () => {
  console.log("Listening on PORT 3000");
});

app.use("/", productRoutes);
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_STRING);
    console.log("Database connected");
  } catch (err) {
    console.error("Error connecting to database");
  }
};

connectDB();
