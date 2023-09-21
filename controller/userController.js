const sendEmail = require('./../util/email');
const Email = require('./../models/emailModel');
const Voter = require('./../models/voteModels');

// exports.signup = (req, res) => {
//     res.status(201).json({
//         message: "Success"
//     });
// };

exports.emailSubscriber = async function (req, res) {
    try {

        await Email.create({ email: req.body.email });

        const { email } = await Email.find();

        const totalVote = await Voter.aggregate([
            {
                $group: {
                    _id: '$party',
                    totalVote: { $count: {} }
                }
            }]);

        await sendEmail({
            email: email,
            subject: "Total vote count update",
            text: `total vote for party ${totalVote}`
        })

        res.status(200).json({
            status: "success",
            message: "Vote result successfully sent to the subscriber"
        })
    } catch (err) {
        res.status(401).json({
            status: "fail",
            Message: err
        })
    }
};

