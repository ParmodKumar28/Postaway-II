// Otp databse activties are happening here.

// Imports
import otpGenerator from 'otp-generator';
import handleDatabaseError from "../../../errors/databaseError.js";
import { UserModel } from '../../user/Schema/user.schema.js';
import ApplicationError from '../../../errors/applicationError.js';
import { OtpModel } from '../Schema/otp.schema.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import sendMail from '../../../middlewares/mailSend.middleware.js';

export default class OtpRepository{    
    // Send an OTP for password reset.
    async send(email)
    {
        try {
            const isUser = await UserModel.findOne({email: email});
            if(!isUser)
            {
                throw new ApplicationError("No user found on this email", 404);
            }
            const otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
            const newOtp = new OtpModel({
                otp: otp,
                user: email
            });
            await newOtp.save();
            // Sending otp on email to the user;
            sendMail(email,otp);
            return otp;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Verify an OTP.
    async verify(email, otp)
    {
        try {
            const isUser = await UserModel.findOne({email: email});
            if(!isUser)
            {
                throw new ApplicationError("No user found on this email", 404);
            }
            const otpRecord = await OtpModel.findOne({ otp: otp, user: email});
            if(!otpRecord)
            {
                throw new ApplicationError("Invalid OTP.", 400);
            }

            // Verifying if otp is expired or not here.
            const otpExpirationDuration = 60 * 1000;
            if(otpRecord.createdAt.getTime() + otpExpirationDuration < Date.now()){
                throw new ApplicationError("Expired OTP.", 400);
            }
            return true;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Reset the user's password.
    async resetPassword(email, newPassword)
    {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            const updatedUser = await UserModel.findOneAndUpdate(
                {email: email},
                {password: hashedPassword},
                {new: true}
            );
            if(!updatedUser)
            {
                throw new ApplicationError("User not found", 404);
            }
            return true;
        } catch (error) {
            handleDatabaseError(error); 
        }
    }
}