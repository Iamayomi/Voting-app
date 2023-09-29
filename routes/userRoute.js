const express = require('express');
const authController = require('../controller/authController');
const subController = require('../controller/subController');
const userController = require('../controller/userController');
const pollController = require('../controller/pollController');


const router = express.Router();

router
    .route('/signup')
    .post(authController.signup);

router
    .route('/getAllUser')
    .get(userController.getAllUser);

router
    .route('/getAUser/:id')
    .get(userController.getAUser);

router.use(authController.protect);

router
    .route('/signin')
    .post(authController.signin);

router
    .route('/polling')
    .post(pollController.createPoll);

router
    .route('/forgetPassword')
    .post(authController.forgetPassword);

router
    .route('/resetPassword/:token')
    .patch(authController.resetPassword);

router
    .route('/subscriber')
    .get(subController.subscriber);


module.exports = router;
