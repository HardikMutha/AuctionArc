const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const { createSecretToken, authenticateUser } = require('./controllers/jwt_token_generation')
const cookieParser = require("cookie-parser");


// Cookie parser middleware
app.use(cookieParser());
// Body parser middleware
app.use(express.json()); // Add this line
app.use(bodyParser.urlencoded({ extended: true }));

// Login routes
app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log("Listening on PORT 3000");
});


app.get("/", (req, res) => {
  res.send("nice");
});



app.get("/dashboard", authenticateUser, (req, res, next) => {
  res.send(`Welcome, Nigga! This is your dashboard.`);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_STRING);
    console.log("Database connected");
    console.log('Current database:', mongoose.connection.db.databaseName);
  } catch (err) {
    console.error("Error connecting to database");
  }
};

connectDB();
