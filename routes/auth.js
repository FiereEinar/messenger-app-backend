const express = require('express');
const router = express.Router();

const {
  login_post,
  signup_post,
} = require('../controllers/authController');
const { signup_validation } = require('../utils/validations');

// order: authenticate, upload, validate, 
router.post('/login', login_post);
router.post('/signup', signup_validation, signup_post);

module.exports = router;
