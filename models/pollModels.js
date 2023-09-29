const mongoose = require('mongoose');
// const User = require('./voteModels');

const pollSchema = new mongoose.Schema({
  
	fullName:{
		type: String,
		require: true
	},
    party: {
        type: String,
        require: true
    },
    
    password: {
        type: String,
        require: [true, 'Please provide your password']
    },

    pollTime: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('poll', pollSchema);