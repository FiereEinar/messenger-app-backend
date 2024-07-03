const asyncHandler = require('express-async-handler');
const Response = require('../models/response');
const { validationResult } = require("express-validator");
const User = require('../models/user');
const Message = require('../models/message');
const Group = require('../models/group');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs/promises');

exports.user_groups_get = asyncHandler(async (req, res) => {
  const { userID } = req.params;
  const userGroups = await Group.find({ members: userID })

  return res.json(new Response(true, userGroups, 'User groups gathered', null));
});

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
