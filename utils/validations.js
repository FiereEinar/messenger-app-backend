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
  body('message')
    .trim(),
]

exports.user_update_validation = [
  body('username', 'Username must not be empty')
    .trim()
    .isLength({ min: 1 }),

  body('firstname', 'First name must not be empty')
    .trim()
    .isLength({ min: 1 }),

  body('lastname', 'Last name must not be empty')
    .trim()
    .isLength({ min: 1 }),

];

exports.change_password_validation = [
  body('oldPassword', 'Password must be atleast 5 characters')
    .trim()
    .isLength({ min: 5 }),

  body('newPassword', 'Password must be atleast 5 characters')
    .trim()
    .isLength({ min: 5 }),

  body('confirmNewPassword', 'Password must be atleast 5 characters')
    .trim()
    .isLength({ min: 5 }),

];