const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const auth = require('../middlewares/auth')

const {
  message_get,
  message_post,
  message_delete,
} = require('../controllers/messageController');
const { message_post_validation } = require('../utils/validations');

router.get('/:senderID/:receiverID',
  auth,
  message_get
);

router.post('/:senderID/:receiverID',
  auth,
  upload.single('image'),
  message_post_validation,
  message_post
);

router.delete('/:messageID',
  auth,
  message_delete
);

module.exports = router;
