const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.MAIL_ACCOUNT}`,
        pass: `${process.env.MAIL_PASSWORD}`
    }
});

function defaultCallback(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
}

function startSendMail(mailInfo, callback = defaultCallback) {
    let mailOptions = {
        from: process.env.MAIL_ACCOUNT,
        to: mailInfo.to,
        subject: mailInfo.subject,
        text: mailInfo.text
    };

    transporter.sendMail(mailOptions, callback);
}

module.exports = startSendMail;