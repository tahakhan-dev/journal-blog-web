const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login',authController.getLogin);

router.post('/login',

[
  body('email').isEmail().withMessage('Please enter a Valid email and password')
  .normalizeEmail(),
  body('password','password has to be Valid').isLength({min:5}).isAlphanumeric().trim()
],

authController.postLogin);

router.get('/signup',authController.getSignup);

router.post('/signup',
[
  //check kr raha hai ke email jo hai woh invalid toh nhi hai agr invalid hai toh error throw krdo
  check('email')
  .isEmail()
  .withMessage('Please enter a valid email.')
  // custom me jo value hai woh email ke hai or jo email se incoming request arahe hai woh check kr raha hai
  .custom((value, { req }) => {
    // if (value === 'test@test.com') {
    //   throw new Error('This email address if forbidden.');
    // }
    // return true;
    return User.findOne({ email: value }).then(userDoc => {
      if (userDoc) {
        return Promise.reject(
          'E-Mail exists already, please pick a different one.'
        );
      }
    });
  }).normalizeEmail(), // iska mtlb sb small leters me hoge,
  // or jo yeh body hai iske jaga hum cookie param or query ko bhi check kr sakte han
  // or isme yeh ho raha hai ke password check kr raha hai
  body(
    'password',
    'Please enter a password with only numbers and text and at least 5 characters.'
  )
  // length de we hai ke 5 se km alphabet na ho or aplha numeric ho
  .isLength({ min: 5 })
  .isAlphanumeric().trim(),// white space ko remove krna,
  body('confirmPassword').trim().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords have to match!');
    }
    return true;
  })
]
,authController.postSignup);

router.get('/logout',authController.postLogut);



module.exports = router;
