const express = require('express');
const router = express.Router();

const {
  login_post,
  signup_post,
  test_route,
  refresh_token,
  logout
} = require('../controllers/authController');
const { signup_validation, login_validation } = require('../utils/validations');

router.post('/login',
  login_validation,
  login_post
);

router.post('/signup',
  signup_validation,
  signup_post
);

router.get('/refresh',
  refresh_token
);

router.get('/logout',
  logout
);

router.get('/test',
  test_route
);

module.exports = router;
