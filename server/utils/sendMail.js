import nodemailer from 'nodemailer';

// Function to send an email
export const sendMail = async (userEmail, token) => { 

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // Use true for 465, false for other ports
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  
  const option = {
    email: userEmail.email,
    text: `https://localhost:3000/api/v1/user/resetPassword/${token}`,
    html: `<a href="https://localhost:3000/api/v1/user/resetPassword/${token}">${token}</a>`
  };

  const message = {
    from: process.env.SMTP_MAIL, 
    to: option.email, 
    subject: "Reset Password", 
    text: option.text, 
    html: option.html, 
  };

  // Send mail with the defined transport object
  const info = await transporter.sendMail(message);
  return info;
}
