const nodemailer = require('nodemailer');

const sendEmail = async options => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'Voting app <hello@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.text
    }


    transporter.sendMail(mailOptions, function (err, data) {
        if (err) console.log('Error Occur', err);
        else console.log('Email sent', data);

    });
};


module.exports = sendEmail;



