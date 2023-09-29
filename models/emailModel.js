const mongoose = require('mongoose');
const validator = require('validator')

const subscriberModel = new mongoose.Schema({
    email: {
        type: String,
        validate: [validator.isEmail, "please provide a valid email"]
    }
});

module.exports = mongoose.model('Subscriber', subscriberModel);















