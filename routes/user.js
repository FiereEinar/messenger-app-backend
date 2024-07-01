const express = require('express');
const router = express.Router();
const { jwt_authenticate } = require('../utils/passport');

const {
  users_get,
  user_info_get,
} = require('../controllers/userController');

router.get('/', jwt_authenticate, users_get);
router.get('/:userID', jwt_authenticate, user_info_get);

module.exports = router;
