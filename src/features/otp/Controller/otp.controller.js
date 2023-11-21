// Otp controllers which links to routes and the model.
// Imports
import ApplicationError from "../../../errors/applicationError.js";
import OtpRepository from "../Model/otp.repository.js";

export default class OtpController{
    
    constructor()
    {
        this.otpRepository = new OtpRepository();
    }

    // Send an OTP for password reset.
    async sendOtp(req,res,next)
    {
        try {
            const email = req.body.email;
            const otp = await this.otpRepository.send(email);
            if(!otp)
            {
                throw new ApplicationError("Otp not send something went wrong.", 404);
            }
            return res.status(200).json({
                success: true,
                msg: `otp send to ${email} valid for 1 minute.`
            })
        } catch (error) {
            next(error);
        }
    }

    // Verify an OTP.
    async verifyOtp(req,res,next){
        try {
            const {email,otp} = req.body;
            if(!email || !otp)
            {
                throw new ApplicationError("Enter email and otp both.", 400);
            }
            const result = await this.otpRepository.verify(email, otp);
            if(!result)
            {
                throw new ApplicationError("Verification failed something went wrong", 400);
            }
            return res.status(200).json({
                success: true,
                msg: "Otp verified you can change password now."
            });
        } catch (error) {
            next(error);
        }
    }

    // Reset the user's password.
    async resetPassword(req,res,next){
        try {
            const {email, password} = req.body;
            if(!email || !password)
            {
                throw new ApplicationError("Enter user email and new password both.", 400);
            }
            const result = await this.otpRepository.resetPassword(email, password);
            if(!result)
            {
                throw new ApplicationError("Password reset failed something went wrong.", 400);
            }
            return res.status(200).json({
                success: true,
                msg: "password updated successfully."
            })
        } catch (error) {
            next(error);
        }
    }
}