require('dotenv').config();
const asyncHandler = require('express-async-handler');
const Response = require('../models/response');
const cloudinary = require('../utils/cloudinary');
const User = require('../models/user');
const Message = require('../models/message');
const fs = require('fs/promises');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uploadImage = require('../utils/uploader');

/**
 * GET - ALL USERS
 */
exports.users_get = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');

  return res.json(new Response(true, users, 'Users retreived', null));
});

/**
 * GET - USER INFO
 */
exports.user_info_get = asyncHandler(async (req, res) => {
  const { userID } = req.params;

  const user = await User.findById(userID)
    .populate({
      path: 'friends',
      select: '-password'
    })
    .select('-password')
    .exec();

  return res.json(new Response(true, user, 'User retreived', null));
});

/**
 * PUT - UPDATE USER
 */
exports.user_update = asyncHandler(async (req, res) => {
  const { userID } = req.params;
  const { firstname, lastname, username, bio } = req.body;

  // check if the user exists
  const user = await User.findById(userID);
  if (!user) {
    return res.json(new Response(false, null, 'User not found', null));
  }

  let profileURL = user.profile.url;
  let profilePublicID = user.profile.publicID;

  // if there is an uploaded image, update the user profile
  if (req.file) {
    // upload using file buffer
    const result = await uploadImage(req.file);

    profileURL = result.secure_url;
    profilePublicID = result.public_id;

    // if there was a previous profile, delete that from the cloud
    if (user.profile.publicID.length > 0) {
      await cloudinary.uploader.destroy(user.profile.publicID);
    }
  }

  const update = {
    firstname: firstname,
    lastname: lastname,
    username: username,
    bio: bio,
    profile: {
      url: profileURL,
      publicID: profilePublicID,
    }
  };

  const updatedUser = await User.findByIdAndUpdate(userID, update, { new: true }).exec();

  return res.json(new Response(true, updatedUser, 'User updated', null));
});

/**
 * PUT - UPDATE USER COVER PHOTO
 */
exports.user_cover_update = asyncHandler(async (req, res) => {
  const { userID } = req.params;

  // check if the user exists
  const user = await User.findById(userID);
  if (!user) {
    return res.json(new Response(false, null, 'User not found', null));
  }

  let coverURL = user.cover.url;
  let coverPublicID = user.cover.publicID;

  if (req.file) {
    // upload using file buffer
    const result = await uploadImage(req.file);

    coverURL = result.secure_url;
    coverPublicID = result.public_id;

    // if there was a previous cover, delete that from the cloud
    if (user.cover.publicID) {
      await cloudinary.uploader.destroy(user.cover.publicID);
    }
  }

  const update = {
    cover: {
      url: coverURL,
      publicID: coverPublicID,
    }
  };

  const updatedUser = await User.findByIdAndUpdate(userID, update, { new: true }).exec();

  return res.json(new Response(true, updatedUser, 'User cover photo updated', null));
});

exports.user_password_update = asyncHandler(async (req, res) => {
  const { userID } = req.params;
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  const user = await User.findById(userID);
  if (!user) {
    return res.json(new Response(false, null, 'User not found', null));
  }

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    return res.json(new Response(false, null, 'Old password is incorrect', 'oldPassword'));
  }

  if (newPassword !== confirmNewPassword) {
    return res.json(new Response(false, null, 'Passwords do not match', 'confirmNewPassword'));
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT))
  if (!hashedPassword) {
    return res.json(new Response(false, null, 'Error in password encryption', null));
  }

  const update = {
    password: hashedPassword
  }

  const result = await User.findByIdAndUpdate(userID, update, { new: true }).exec();

  const token = jwt.sign({ result }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

  return res.json(new Response(true, { result, token }, 'Password updated', null));
});
