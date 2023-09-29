// const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/userModels');
const Voter = require('../models/voteModels');




exports.createVote = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer'))
            token = req.headers.authorization.split(' ')[1];

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id).select('+password');

        const newVoter = req.body;

        console.log(newVoter.password, currentUser.password);

        if (!(await bcrypt.compare(newVoter.password, currentUser.password))) {
            return next(res.status(401).send('incorrect password'));
        };

        const checkPassword = function () {
            const passwordChanged = parseInt(this.passwordChangedAt.getTime() / 1000);
            return decoded.iat < passwordChanged;
        };

        if (!checkPassword) {
            return next(res.status(401).send('User recently changed password! please log in again.'));
        };

        newVoter.password = undefined;

        const votes = await Voter.create(newVoter);
        console.log(votes)

        res.status(200).json({
            status: "success",
            voter: {
                data: votes
            }
        })

    } catch (err) {
        res.status(401).json({
            status: "fail",
            message: " "
        })
    }

};


exports.updateVote = async function (req, res, next) {
    try {
        const updateVote = await Voter.aggregate([
            {
                $group: {
                    _id: '$party',
                    totalVote: { $count: {} }
                }
            }]);

        res.status(200).json({
            status: "Success",
            data: {
                updateVote
            }
        })

    } catch (err) {
        res.status(401).json({
            status: "fail",
            message: err
        })
    }
};


exports.getAllVoter = async function(req, res, next){
    try {
          const getAllVoters = await Voter.find();

          res.status(200).json({
          status: "Success",
          AllVoters: getAllVoters.length,
          data: {
             voters: getAllVoters
           }
        })
    } catch(error){
        return next(res.status(401).send(error.message));
    }
};

exports.getAVoter = async function (req, res) {
    try {
        const aVoter = await Voter.findById(req.params.id).select("-__v");


        res.status(200).json({
            status: "success",
            vote: {
                aVoter
            }
        })
    } catch (err) {
        res.status(401).send(err.message);
    }
};


exports.clearAllVoter = async function (req, res) {
    try {
        await Voter.deleteMany();
        res.status(200).json({
            status: "success",
            voters: {
                data: null
            }
        })
    } catch (err) {
        res.status(401).json({
            status: "fail",
            Message: err
        })
    }
};



