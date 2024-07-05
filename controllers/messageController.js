const asyncHandler = require('express-async-handler');
const Response = require('../models/response');
const { validationResult } = require("express-validator");
const User = require('../models/user');
const Message = require('../models/message');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs/promises');
const uploadImage = require('../utils/uploader');

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
    const result = await uploadImage(req.file);

    imgURL = result.secure_url;
    imgPublicID = result.public_id;
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

exports.message_delete = asyncHandler(async (req, res) => {
  const { messageID } = req.params;

  const message = await Message.findById(messageID)

  if (!message) {
    return res.json(new Response(false, null, 'Message ID not found', null));
  }

  // if there is an existing id, delete that image from cloud storage
  if (message.image.publicID.length > 0) {
    await cloudinary.uploader.destroy(message.image.publicID);
  }

  const result = await Message.findByIdAndDelete(messageID);

  return res.json(new Response(true, result, 'Message deleted', null));
});
