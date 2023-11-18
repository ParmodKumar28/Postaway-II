// 1. Import express.
import express from 'express';
import OtpController from '../Controller/otp.controller.js';

// 2. Initialize Express router.
const otpRouter = express.Router();

// Contoller object to access controller functions.
const otpController =  new OtpController();

// All the paths to controller methods.
// Send an OTP for password reset.
otpRouter.post('/send', (req,res,next)=>{

});

// Verify an OTP.
otpRouter.post('/verify', (req,res,next)=>{

});

// Reset the user's password.
otpRouter.put('/reset-password', (req,res,next)=>{

});


// Exporting Router
export default otpRouter;