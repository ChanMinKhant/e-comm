// nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: `E Com <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: text,
  };
  // verify
  await transporter.verify();
  await transporter.sendMail(mailOptions);
};
