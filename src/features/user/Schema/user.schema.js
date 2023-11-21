// User schema conatins the fields which a user should have.

import mongoose from "mongoose";

// User schema
export const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        maxLength: [25, "Name can't be greater than 25 characters"],
    },
    avatar: {
        type: String,
        default: ""
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
    },
    posts: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Post'
        }
    ],
    token: [String]
});

// User Model
export const UserModel = mongoose.model('User', userSchema);

