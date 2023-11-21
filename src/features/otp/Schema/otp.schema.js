// Otp schema otp should have these fields.

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
        expires: 60,
    }
});

export const OtpModel = mongoose.model('Otp', otpSchema);