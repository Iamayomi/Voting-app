const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/userModels');
const Poll = require('../models/pollModels');

exports.createPoll = async function(req, res, next) {
	try {
		let token;
        if (req.headers.authorization?.startsWith('Bearer'))
            token = req.headers.authorization.split(' ')[1];

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id).select('+password');

        const newPoll = req.body;

        console.log(newPoll.password, currentUser.password);

        if (!(await bcrypt.compare(newPoll.password, currentUser.password))) {
            return next(res.status(401).send('incorrect password'));
        };

        const checkPassword = function () {
            const passwordChanged = parseInt(this.passwordChangedAt.getTime() / 1000);
            return decoded.iat < passwordChanged;
        };

        if (!checkPassword) {
            return next(res.status(401).send('User recently changed password! please log in again.'));
        };

        const {firstname, lastname} = currentUser;

        const fullname = firstname + " " + lastname;
        
        if(!(fullname === newPoll.fullName)){
           return next(res.status(401).send("invalid name, please provide a valid fullName"));
        };

        newPoll.password = undefined;

        const polls = await Poll.create(newPoll);

        res.status(200).json({
            status: "success",
            candidates: {
                data: polls
            }
        });
	} catch(err){
         res.status(401).json({
            status: "fail",
            message: "invalid in data"
        })
	}

};

exports.activePoll = async function(req, res, next){
    try {
       const activePoll = await Poll.find();
       
       res.status(200).json({
        status: "success",
        activePoll: {
            data: activePoll
          }
       })
    }catch(error){
        next(res.status(401).send(error.message));
    }

    
};