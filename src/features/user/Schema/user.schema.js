import mongoose from "mongoose";

// User schema
export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        maxLength: [25, "Name can't be greater than 25 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter email"],
        unique: true,
        match: [/.+\@.+\../, "Please enter a valid email."]
    },
    password: {
        type: String,
        required: [true, "Please enter password."]
    },
    gender: {
        type: String,
        required: [true, "Please enter gender."]
    }
});

// User Model
export const UserModel = mongoose.model('User', userSchema);

