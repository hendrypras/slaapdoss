const nodemailer = require('nodemailer')
const config = require('../../config')

const sendEmail = async data => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.nodemailer.mailId,
      pass: config.nodemailer.mp,
    },
  })

  let info = await transporter.sendMail({
    from: config.nodemailer.mailId,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.htm,
  })
  const urlMessage = nodemailer.getTestMessageUrl(info)
  return { info, urlMessage }
}

module.exports = sendEmail
