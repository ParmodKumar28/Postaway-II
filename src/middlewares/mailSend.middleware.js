// Middleware to send otp on user email.
import nodemailer from 'nodemailer';

const sendMail = (email,otp)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    // Sending Email          
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for verification',
        text: `Your OTP is ${otp}. Please use this code to verify your account.`
    };

    transporter.sendMail(mailOptions, (error,info)=>{
        if(error){
            console.log(error);
        }else{
            console.log('Email sent: ' + info.response);
        }
    });
}

export default sendMail;
