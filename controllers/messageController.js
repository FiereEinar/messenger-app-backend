const asyncHandler = require('express-async-handler');
const Response = require('../models/response');
const { validationResult } = require("express-validator");
const User = require('../models/user');
const Message = require('../models/message');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs/promises');

/**
 * GET - MESSAGES FROM SENDER TO RECEIVER
 */
exports.message_get = asyncHandler(async (req, res) => {
  const { senderID, receiverID } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: senderID, receiver: receiverID },
      { sender: receiverID, receiver: senderID },
    ]
  })
    .sort({ dateSent: 1 })
    .exec();

  return res.json(new Response(true, messages, 'Messages gathered', null));
});

/**
 * POST - MESSSAGE FROM SENDER TO RECEIVER
 */
exports.message_post = asyncHandler(async (req, res) => {
  const { senderID, receiverID } = req.params;
  const { message } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json(new Response(false, null, 'Error in message validation', errors.array()[0].msg));
  }

  let imgURL = '';
  let imgPublicID = '';

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);

    imgURL = result.secure_url;
    imgPublicID = result.public_id;

    await fs.unlink(req.file.path);
  }

  const newMessage = new Message({
    sender: senderID,
    receiver: receiverID,
    message: message,
    image: {
      url: imgURL,
      publicID: imgPublicID,
    }
  });

  // make the sender and receiver friends
  await User.findByIdAndUpdate(senderID, { $addToSet: { friends: receiverID } }).exec();
  await User.findByIdAndUpdate(receiverID, { $addToSet: { friends: senderID } }).exec();

  await newMessage.save();

  return res.json(new Response(true, newMessage, 'Message sent', null));
});
