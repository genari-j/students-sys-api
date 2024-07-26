import nodemailer from 'nodemailer'

export const mailService = async (email: string, subject: string, html: any) => {
  const transport = nodemailer.createTransport({
    host: process.env.HOST_TO_SEND_RESET_PASSWORD as string,
    port: process.env.PORT_TO_SEND_RESET_PASSWORD as string,
    secure: false, // use TLS
    requireTLS: true, // require a secure connection
    auth: {
      user: process.env.EMAIL_TO_SEND_RESET_PASSWORD as string,
      pass: process.env.PASSWORD_TO_SEND_RESET_PASSWORD as string
    }
  })

  const mailOptions = {
    from: process.env.EMAIL_TO_SEND_RESET_PASSWORD as string,
    to: email,
    subject,
    html
  }

  try {
    const info = await transport.sendMail(mailOptions)
    console.log('Email sent:', info.response)
  } catch (err: any) {
    console.error('Error sending email:', err)
  }
}