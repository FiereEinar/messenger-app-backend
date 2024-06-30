const { body } = require("express-validator");

exports.signup_validation = [
  body('username', 'Username must not be empty')
    .trim()
    .isLength({ min: 1 }),

  body('password', 'Password must not be empty')
    .trim()
    .isLength({ min: 1 }),

  body('firstname', 'First name must not be empty')
    .trim()
    .isLength({ min: 1 }),

  body('lastname', 'Last name must not be empty')
    .trim()
    .isLength({ min: 1 }),

];

exports.login_validation = [
  body('username', 'Username must not be empty')
    .trim()
    .isLength({ min: 1 }),

  body('password', 'Password must not be empty')
    .trim()
    .isLength({ min: 1 }),

];

exports.message_post_validation = [
  body('message', 'Message must not be empty')
    .trim()
    .isLength({ min: 1 }),
]