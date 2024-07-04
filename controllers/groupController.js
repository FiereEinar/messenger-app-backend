const asyncHandler = require('express-async-handler');
const Response = require('../models/response');
const { validationResult } = require("express-validator");
const User = require('../models/user');
const Message = require('../models/message');
const Group = require('../models/group');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs/promises');

/**
 * GET - USER'S GROUPs
 */
exports.user_groups_get = asyncHandler(async (req, res) => {
  const { userID } = req.params;
  const globalChatID = '6686265df39e586794515b27';

  // exclude the global chat
  const userGroups = await Group.find({ members: userID, _id: { $ne: globalChatID } })

  return res.json(new Response(true, userGroups, 'User groups gathered', null));
});

/**
 * POST - CREATE GROUP
 */
exports.group_post = asyncHandler(async (req, res) => {
  const { creatorID, members, name } = req.body;
  const parsedMembers = JSON.parse(members);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json(new Response(false, null, 'Error in group name validation', errors.array()[0].msg));
  }

  let profileURL = '';
  let profilePublicID = '';

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);

    profileURL = result.secure_url;
    profilePublicID = result.public_id;

    await fs.unlink(req.file.path);
  }

  const group = new Group({
    name: name,
    members: [...parsedMembers, creatorID],
    admins: [creatorID],
    profile: {
      url: profileURL,
      publicID: profilePublicID
    }
  });

  await group.save();

  return res.json(new Response(true, group, 'Group created', null));
});

/**
 * GET - MESSAGES FROM GROUP CHAT
 */
exports.group_chats_get = asyncHandler(async (req, res) => {
  const { groupID } = req.params;

  const messages = await Message.find({ group: groupID })
    .populate({
      path: 'sender',
      select: '-password'
    }).exec();

  return res.json(new Response(true, messages, 'Group messages retrieved', null));
});

/**
 * POST - MESSSAGE FROM SENDER TO GROUP
 */
exports.group_chat_post = asyncHandler(async (req, res) => {
  const { senderID, groupID } = req.params;
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
    group: groupID,
    message: message,
    image: {
      url: imgURL,
      publicID: imgPublicID,
    }
  });

  await newMessage.save();

  return res.json(new Response(true, newMessage, 'Message sent to goup', null));
});


exports.group_info_get = asyncHandler(async (req, res) => {
  const { groupID } = req.params;

  const group = await Group.findById(groupID)
    .populate({
      path: 'members',
      select: '-password'
    })
    .populate({
      path: 'admins',
      select: '-password'
    })
    .exec();

  return res.json(new Response(true, group, 'Message info retrieved', null));
});
