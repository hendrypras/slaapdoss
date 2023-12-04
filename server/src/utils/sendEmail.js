const nodemailer = require('nodemailer')

const sendEmail = async data => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ID, // generated ethereal user
      pass: process.env.MP, // generated ethereal password
    },
  })

  let info = await transporter.sendMail({
    from: process.env.MAIL_ID,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.htm,
  })
  const urlMessage = nodemailer.getTestMessageUrl(info)
  return { info, urlMessage }
}

module.exports = sendEmail
