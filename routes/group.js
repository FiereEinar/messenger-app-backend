const express = require('express');
const router = express.Router();
const passport = require('../utils/passport');
const upload = require('../utils/multer');

const {
  user_groups_get,
  group_post,
  group_chats_get,
  group_chat_post,
  group_info_get,
} = require('../controllers/groupController');
const { create_group_validation, message_post_validation } = require('../utils/validations');

router.post('/',
  passport.authenticate('jwt', { session: false }),
  upload.single('groupProfile'),
  create_group_validation,
  group_post
);

router.get('/:userID',
  passport.authenticate('jwt', { session: false }),
  user_groups_get
);

router.get('/:groupID/chats',
  passport.authenticate('jwt', { session: false }),
  group_chats_get
);

router.get('/:groupID/info',
  passport.authenticate('jwt', { session: false }),
  group_info_get
);

router.post('/chats/:senderID/:groupID',
  passport.authenticate('jwt', { session: false }),
  upload.single('image'),
  message_post_validation,
  group_chat_post
);

module.exports = router;
