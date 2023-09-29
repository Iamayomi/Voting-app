const voteController = require('../controller/voteController');
const pollController = require('../controller/pollController');

const express = require('express');
const router = express.Router();

router
    .get('/voteReview', voteController.updateVote);

router
    .get('/Home', pollController.activePoll);

router
    .route('/votting')
    .post(voteController.createVote);

router
    .route('/getVote/:id')
    .get(voteController.getAVoter);

router
    .route('/votters')
    .get(voteController.getAllVoter);

router
    .route('/clearVoter')
    .delete(voteController.clearAllVoter);

module.exports = router;
