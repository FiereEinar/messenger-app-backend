const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { change_password_validation } = require('../utils/validations');
const auth = require('../middlewares/auth')

const {
  users_get,
  user_info_get,
  user_update,
  user_cover_update,
  user_password_update,
  user_status_put,
} = require('../controllers/userController');

router.get('/',
  // auth,
  users_get
);

router.get('/:userID',
  auth,
  user_info_get
);

router.put('/:userID/cover',
  auth,
  upload.single('coverPhoto'),
  user_cover_update
);

router.put('/:userID/password',
  auth,
  change_password_validation,
  user_password_update
);

router.put('/:userID/status',
  auth,
  user_status_put
);

router.put('/:userID',
  auth,
  upload.single('profileImg'),
  user_update
);

module.exports = router;
