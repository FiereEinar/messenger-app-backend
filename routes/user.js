const express = require('express');
const router = express.Router();
const passport = require('../utils/passport');

const {
  users_get,
  user_info_get,
} = require('../controllers/userController');

router.get('/', passport.authenticate('jwt', { session: false }), users_get);
router.get('/:userID', passport.authenticate('jwt', { session: false }), user_info_get);

module.exports = router;
