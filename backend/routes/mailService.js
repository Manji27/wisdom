const nodemailer = require('nodemailer');

async function sendReportEmail(guideId, reason) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wisdom.user76@gmail.com',  // your email
      pass: 'wisdomuser'  // your email password
    }
  });

  let info = await transporter.sendMail({
    from: '"Guide Reporting System" <yourEmail@gmail.com>',  // sender address
    to: 'manjiwow@gmail.com',  // list of receivers
    subject: `Guide ${guideId} has been reported`,  // Subject line
    text: `Guide with ID: ${guideId} has been reported for the following reason: ${reason}`,  // plain text body
  });

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendReportEmail;
