const express = require('express');
const router = express.Router();
const passport = require('../utils/passport');
const upload = require('../utils/multer');

const {
  message_get,
  message_post,
  message_delete,
} = require('../controllers/messageController');
const { message_post_validation } = require('../utils/validations');

router.get('/:senderID/:receiverID', passport.authenticate('jwt', { session: false }), message_get);
router.post('/:senderID/:receiverID', passport.authenticate('jwt', { session: false }), upload.single('image'), message_post_validation, message_post);
router.delete('/:messageID', passport.authenticate('jwt', { session: false }), message_delete);

module.exports = router;
