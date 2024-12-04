import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "rjtpmr@gmail.com",
    pass: "vksksahpvfqfzxuf",
  },
});

export  const sendMail = async (userEmail, token) => { 

const option = {
    email : userEmail.email,
    text : `https://localhost:3000/api/v1/user/resetPassword/${token}`,
    html : `<a href="https://localhost:3000/api/v1/user/resetPassword/${token}">${token}</a>`
}

    const message = {
        from: 'rjtpmr@gmail.com', 
        to: option.email, 
        subject: "Reset Password", 
        text: option.text, 
        html: option.html, 
      }

  // send mail with defined transport object
  const info = await transporter.sendMail(message);

    return info;

}

