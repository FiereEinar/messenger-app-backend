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

  // generate tokens
  const accessToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1d' }
  );

  const refreshToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: '1d' }
  );

  // save the refresh token in the user
  user.refreshToken = refreshToken;
  await user.save();

  // send the refreshToken in a cookie
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge: 24 * 60 * 60 * 1000   // 1 day
  });

  // send the accessToken in the response
  res.json(new Response(true, { token: accessToken, userID: user._id }, 'Login in successfull', null));
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

/**
 * GET - REFRESH TOKEN
 */
exports.refresh_token = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  // no cookies
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  // find the user that has this refresh token
  const user = await User.findOne({ refreshToken: refreshToken })
  if (!user) {
    return res.sendStatus(403);
  }

  // verify the refreshToken
  const result = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY)
  if (!result || result.username !== user.username) {
    return res.sendStatus(403);
  }

  // if all is well, generate access token
  const accessToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '30s' }
  );

  // send the accessToken in the response
  res.json(new Response(true, { token: accessToken, userID: user._id }, 'Token refresh successfull', null));
});

/**
 * GET - LOGOUT
 */
exports.logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  // no cookies
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  // find the user that has this refresh token
  const user = await User.findOne({ refreshToken: refreshToken })
  if (!user) {
    // clear the cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    return res.sendStatus(204);
  }

  user.refreshToken = '';
  await user.save();

  // clear the cookie
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  res.sendStatus(204);
});

exports.check_auth = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const token = req.cookies.jwt;

  const user = await User.findOne({ refreshToken: token }).exec();

  if (!user) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_REFRESH_KEY, (err, data) => {
    if (err) return res.sendStatus(403);
    return res.sendStatus(202);
  });
});

exports.test_route = async (req, res) => {
  const result = await User.updateMany({}, { isOnline: false }).exec();

  return res.json(new Response(true, result, 'updated', null));
};

