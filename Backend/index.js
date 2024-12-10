const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const productRoutes = require("./routes/product");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.listen(process.env.PORT, () => {
  console.log("Listening on PORT 3000");
});

app.use("/", productRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_STRING);
    console.log("Database connected");
  } catch (err) {
    console.error("Error connecting to database");
  }
};

connectDB();
