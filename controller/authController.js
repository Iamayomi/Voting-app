const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');
const { promisify } = require('util');

exports.signup = async function (req, res, next) {
    try {
        const newUser = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(201).json({
            status: "Success",
            token,
            data: {
                user: newUser
            }
        }
        )
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error
        })

    };
};


exports.signin = async function (req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(console.log("please provide email and password"))
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password, user.password))) {
            return next(console.log("Incorrect email or password"));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(200).json({
            status: 'success',
            token
        })

    } catch (error) {
        res.status(401).json({
            status: "fail",
            message: error
        })
    }

};



exports.protect = async function (req, res, next) {
    let token;
    if (req.headers.authorization?.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    console.log(token);

    if (!token) {
        res.status(401).send('You are not logged in, Please log in to get access')
    };

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        next(res.status(401).send('This user token does not longer exist'));
    }

    const checkPassword = function () {
        const passwordChanged = parseInt(this.passwordChangedAt.getTime() / 1000);
        return decoded.iat < passwordChanged;
    };

    if (!checkPassword) {
        return next(res.status(401).send('User recently changed password! please log in again.'));
    };

    if (currentUser.checkPasswordChangedAt(decoded.iat)) {
    next(res.status(401).send('User recently changed password! please log in again.'));
    }

    req.user = currentUser;
    next();
};

exports.forgetPassword = async function (req, res, next) {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(res.status(404).send('There is no user with is email'));
    }

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get('host')}/voting-app/user/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password
    and confirmPassword to: ${resetURL}.\nIf you didn't forget your password, please ignore
    this email`;

        res.status(200).json({
          status: 'success',
          resetToken
       })

   // try {
   //      await sendEmail({
   //        email: user.email,
   //        subject: 'Your password reset token valid for 3 min',
   //        message
   //     })

   //      res.status(200).json({
   //        status: 'success',
   //        message: 'Token sent to sendEmail'
   //     })
        
   //  } catch(err){
   //      user.passwordResetToken = undefined;
   //      user.passwordResetExpires = undefined;
   //      await user.save({ validateBeforeSave: false });

   //      return next(res.status(500).send('There was an error sending the email. Try again later!'));
   //  }

};

exports.resetPassword = async function(req, res, next) {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({ 
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
     });

    if (!user) {
         return next(res.status(400).send('Time has expired'));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
    });


    res.status(200).json({
        status: "Success",
        token
    })
};

exports.toRestrict = async function (roles) {
    return (req, res, next) => {
        if (!(roles === req.user.role)) {
            next(res.status(401).send('You do not have permission for this action'))
        }
        next();
    };

};



















