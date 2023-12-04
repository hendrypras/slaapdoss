const forgotPasswordBodyEmail = (username, token) => {
  return (
    '<!DOCTYPE html>' +
    '<html><head><title>Reset Passowrd</title>' +
    '</head><body><div>' +
    `<h1>Hi ${username},</h1>` +
    '<p>You have requested yor account password to be reset. Please click the following link to change your password:</p>' +
    `<a style="background-color: #000; color: #ffffff; padding: 10px 20px; text-decoration: none; cursor: pointer; font-weight:600" href='${process.env.BASE_URL_CLIENT}/reset-password/${token}'>Change My Password</a>` +
    '<p>If you did not request this, please ignore this email!</p>' +
    'This link will expire in 5 minutes' +
    '</div></body></html>'
  )
}

const requestOtpBodyEmail = (recipientName, OTP) => `
<!DOCTYPE html>
<html>
  <head>
    <title>OTP Generated</title>
  </head>
  <body>
    <div>
      <p>Hi ${recipientName},</p>
      <p>This is the OTP code you received:</p>
      <p>${OTP}</p>
      <p>Please note that this OTP is valid for 5 minutes.</p>
    </div>
  </body>
</html>
`

module.exports = { forgotPasswordBodyEmail, requestOtpBodyEmail }
