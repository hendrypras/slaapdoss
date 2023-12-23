const config = require('../../config')

const forgotPasswordBodyEmail = (username, token) => {
  return (
    '<!DOCTYPE html>' +
    '<html><head><title>Reset Passowrd</title>' +
    '</head><body><div>' +
    `<h1>Hi ${username},</h1>` +
    '<p>You have requested yor account password to be reset. Please click the following link to change your password:</p>' +
    `<a style="background-color: #00b4ab; color: #ffffff; padding: 10px 20px; text-decoration: none; cursor: pointer; font-weight: 600" href='${config.baseUrlClient}/callback/reset-password/${token}'>Change My Password</a>` +
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
const responsePaymentBodyEmail = () => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pembayaran Tertunda</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 80%;
      margin: 20px auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
    }
    p {
      color: #555;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Pembayaran Anda Tertunda</h1>
    <p>Maaf, pembayaran Anda sedang dalam proses verifikasi.</p>
    <p>Segera kami akan memberikan konfirmasi lebih lanjut.</p>
    <p>Terima kasih atas kesabaran Anda.</p>
    <a href='${config.baseUrlClient}' class="button">Kunjungi Situs Kami</a>
  </div>
</body>
</html>`
}

module.exports = {
  forgotPasswordBodyEmail,
  requestOtpBodyEmail,
  responsePaymentBodyEmail,
}
