import mongoose from "mongoose";

export const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: '5m',
    }
});

export const OtpModel = mongoose.model('Otp', otpSchema);