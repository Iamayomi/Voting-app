const { Schema, model } = require('mongoose');
const { randomBytes, createHash } = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userModel = new Schema({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },

    role: {
        type: String,
        enum: ['amin', 'user'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, "Please provide a password"],
        min: [8, "password must be at least 6"]
    },

    confirmPassword: {
        type: String,
        required: [true, "Please your password"],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: "Passwords are not the same"
        }
    },

    passwordChangedAt: {
        type: Date,
        default: Date.now()
    },

    passwordResetToken: String,

    passwordResetExpires: Date
});


userModel.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
    next();
});


userModel.methods.comparePassword = function (signinPassword, userPassword) {
    return bcrypt.compare(signinPassword, userPassword);
};


userModel.methods.createPasswordResetToken = function () {
    const resetToken = randomBytes(32).toString('hex');

    this.passwordResetToken = createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;

};

userModel.methods.checkPasswordChangedAt = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);

        return JWTTimestamp < changedTimestamp;
    };
    return false;
};

module.exports = model('User', userModel);


