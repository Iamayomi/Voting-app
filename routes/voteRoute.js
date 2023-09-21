const voteController = require('../controller/voteController');
// const authController = require('../controller/voterController');

const express = require('express');
const router = express.Router();

router
    .get('/Home', voteController.updateVote);

router
    .route('/voting')
    .post(voteController.checkVote);

router
    .route('/voters')
    .get(voteController.getAllVoter);

router
    .route('/clearVoter')
    .delete(voteController.clearAllVoter);

module.exports = router;
