require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

//controllers
const authRouter = require('./routes/auth');
const messageRouter = require('./routes/message');
const userRouter = require('./routes/user');
const groupRouter = require('./routes/group');

// connect to mongoDB
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGO_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/auth', authRouter);
app.use('/message', messageRouter);
app.use('/user', userRouter);
app.use('/group', groupRouter);

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