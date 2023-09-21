const { Schema, model } = require('mongoose');

const voteSchema = new Schema({
    party: {
        type: String,
        require: true
    },
    voteFor: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: [true, 'Please provide your password']
    },
    timeVote: {
        type: Date,
        default: Date.now()
    }
});



module.exports = model('Voter', voteSchema);

