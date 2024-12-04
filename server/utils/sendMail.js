import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMPT_HOST,
  port: process.env.SMPT_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});



export  const sendMail = async (userEmail, token) => { 

const option = {
    email : userEmail.email,
    text : `https://localhost:3000/api/v1/user/resetPassword/${token}`,
    html : `<a href="https://localhost:3000/api/v1/user/resetPassword/${token}">${token}</a>`
}

    const message = {
        from: process.env.SMTP_MAIL, 
        to: option.email, 
        subject: "Reset Password", 
        text: option.text, 
        html: option.html, 
      }

  // send mail with defined transport object
  const info = await transporter.sendMail(message);

    return info;

}

