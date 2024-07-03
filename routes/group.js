const express = require('express');
const router = express.Router();
const passport = require('../utils/passport');
const upload = require('../utils/multer');

const {
  user_groups_get,
  group_post,
} = require('../controllers/groupController');
const { create_group_validation } = require('../utils/validations');

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

module.exports = router;
