const express = require('express');
const router = express.Router();
const { jwt_authenticate } = require('../utils/passport');
const upload = require('../utils/multer');

const {
  message_get,
  message_post,
} = require('../controllers/messageController');
const { message_post_validation } = require('../utils/validations');

router.get('/:senderID/:receiverID', jwt_authenticate, message_get);
router.post('/:senderID/:receiverID', jwt_authenticate, upload.single('image'), message_post_validation, message_post);

module.exports = router;
