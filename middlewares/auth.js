require('dotenv').config();
const asyncHandler = require("express-async-handler");
const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies.jwt) return res.sendStatus(401)

  jwt.verify(cookies.jwt, process.env.JWT_REFRESH_KEY, async (err, data) => {
    if (err) return res.sendStatus(403);

    const user = await User.findById(data.id)
    if (!user) return res.sendStatus(403);

    req.user = user;
    next();
  });
});
