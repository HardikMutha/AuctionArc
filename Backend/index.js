const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const {createSecretToken, authenticateUser} = require('./controllers/jwt_token_generation')
const cookieParser = require("cookie-parser");


// Cookie parser middleware
app.use(cookieParser());
// Body parser middleware
app.use(express.json()); // Add this line
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // Set CORS headers
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL); // Replace with your frontend domain
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies, etc.)

  // Pass to next layer of middleware
  next();
});


// Login routes
app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log("Listening on PORT 3000");
});


app.get("/", (req, res) => {
  res.send("nice");
});



app.get("/dashboard",authenticateUser, (req, res, next) => {
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
