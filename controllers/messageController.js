const asyncHandler = require('express-async-handler');
const Response = require('../models/response');
const { validationResult } = require("express-validator");
const User = require('../models/user');
const Message = require('../models/message');

exports.message_get = asyncHandler(async (req, res) => {
  const { senderID, receiverID } = req.params;

  const messages = await Message
    .find({ sender: senderID, receiver: receiverID })
    .sort({ dateSent: 1 })
    .exec();

  return res.json(new Response(true, messages, 'Messages gathered', null));
});

exports.message_post = asyncHandler(async (req, res) => {
  const { senderID, receiverID } = req.params;
  const { message } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json(new Response(false, null, 'Error in message validation', errors.array()[0].msg));
  }

  const newMessage = new Message({
    sender: senderID,
    receiver: receiverID,
    message: message,
  });

  // make the sender and receiver friends
  await User.findByIdAndUpdate(senderID, { $addToSet: { friends: receiverID } }).exec();
  await User.findByIdAndUpdate(receiverID, { $addToSet: { friends: senderID } }).exec();

  await newMessage.save();

  return res.json(new Response(true, newMessage, 'Message sent', null));
});
