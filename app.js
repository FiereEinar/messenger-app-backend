require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

//controllers

// connect to mongoDB
// const mongoose = require('mongoose');
// mongoose.set('strictQuery', false);
// const mongoDB = process.env.MONGO_URI;

// main().catch((err) => console.log(err));
// async function main() {
//   await mongoose.connect(mongoDB);
// }

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes

// Error handlers
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message, error: err });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})