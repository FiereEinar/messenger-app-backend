require('dotenv').config();
const asyncHandler = require('express-async-handler');
const Response = require('../models/response');
const { validationResult } = require("express-validator");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * POST - LOGIN
 */
exports.login_post = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // check for body validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(new Response(false, null, 'Error in sign up validation', errors.array()[0].msg));
  }

  // check if the user exists
  const user = await User.findOne({ username: username }).exec();
  if (!user) {
    return res.json(new Response(false, null, 'Invalid username', null));
  }

  // check if the password match
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.json(new Response(false, null, 'Invalid password', null));
  }

  // generate a token
  const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

  return res.json(new Response(true, { token, userID: user._id }, 'Login in successfull', null));
});

/**
 * POST - SIGNUP
 */
exports.signup_post = asyncHandler(async (req, res) => {
  const { username, password, firstname, lastname } = req.body;
  const defaultImgURL = 'https://res.cloudinary.com/dkidfx99m/image/upload/v1719707237/uiotniwyo7xalhdurrf9.webp';
  const defaultImgID = 'zioyniwyo9xalhduarf1';

  // check for body validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(new Response(false, null, 'Error in sign up validation', errors.array()[0].msg));
  }

  // check for existing username
  const existingUsername = await User.findOne({ username: username }).exec();
  if (existingUsername) {
    return res.json(new Response(false, null, 'Username already exists', null));
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT))
  if (!hashedPassword) {
    return res.json(new Response(false, null, 'Error in password encryption', null));
  }

  // create the user
  const user = new User({
    firstname: firstname,
    lastname: lastname,
    username: username,
    password: hashedPassword,
    profile: {
      url: defaultImgURL,
      publicID: defaultImgID,
    },
    cover: {
      url: '',
      publicID: '',
    }
  });

  await user.save()

  return res.json(new Response(true, user, 'Signup in successfull', null));
});

exports.test_route = async (req, res) => {
  return res.json(new Response(true, null, 'updated', null));
};
