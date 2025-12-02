//Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//Routes
const userRoutes = require("./routes/users");
const workoutRoutes = require("./routes/workouts");

//Environment Setup
// const port = 4000;
require("dotenv").config();

//Server Setup
const app = express();

app.use(express.json());

const corsOptions = {
  origin: [
    "http://localhost:8000",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//Database Connection
//Connect to our MongoDB database
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
);

//Backend Routes
app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`API is now online on port ${process.env.PORT || 3000}`);
  });
}

module.exports = { app, mongoose };
