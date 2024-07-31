const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const auth = require('../middlewares/auth')

const {
  user_groups_get,
  group_post,
  group_chats_get,
  group_chat_post,
  group_info_get,
} = require('../controllers/groupController');
const { create_group_validation, message_post_validation } = require('../utils/validations');

router.post('/',
  auth,
  upload.single('groupProfile'),
  create_group_validation,
  group_post
);

router.get('/:userID',
  auth,
  user_groups_get
);

router.get('/:groupID/chats',
  // auth,
  group_chats_get
);

router.get('/:groupID/info',
  // auth,
  group_info_get
);

router.post('/chats/:senderID/:groupID',
  auth,
  upload.single('image'),
  message_post_validation,
  group_chat_post
);

module.exports = router;
