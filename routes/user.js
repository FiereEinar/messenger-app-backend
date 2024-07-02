const express = require('express');
const router = express.Router();
const passport = require('../utils/passport');
const upload = require('../utils/multer');

const {
  users_get,
  user_info_get,
  user_update,
} = require('../controllers/userController');

router.get('/', passport.authenticate('jwt', { session: false }), users_get);
router.get('/:userID', passport.authenticate('jwt', { session: false }), user_info_get);
router.put('/:userID', passport.authenticate('jwt', { session: false }), upload.single('profileImg'), user_update);

module.exports = router;
