const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router
    .route('/signup')
    .post(authController.signup);

router
    .route('/signin')
    .post(authController.protect, authController.signin);

router
    .route('/forgetPassword')
    .post(authController.forgetPassword);

router
    .route('/resetPassword/:token')
    .patch(authController.resetPassword);

router
    .route('/emailSubscriber')
    .get(userController.emailSubscriber);


module.exports = router;
