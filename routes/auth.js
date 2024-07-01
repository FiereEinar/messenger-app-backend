const express = require('express');
const router = express.Router();

const {
  login_post,
  signup_post,
  test_route,
} = require('../controllers/authController');
const { signup_validation, login_validation } = require('../utils/validations');

router.post('/login', login_validation, login_post);
router.post('/signup', signup_validation, signup_post);
router.get('/test', test_route);

module.exports = router;
