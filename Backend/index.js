const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

app.listen(process.env.PORT, () => {
  console.log("Listening on PORT 3000");
});

app.get("/", (req, res) => {
  res.send("nice");
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_STRING);
    console.log("Database connected");
  } catch (err) {
    console.error("Error connecting to database");
  }
};

connectDB();
