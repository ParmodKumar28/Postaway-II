// Post schema is here all post have these fields.

import mongoose from "mongoose";

export const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
    },
    caption: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Like'
        }
    ],

});

export const PostModel = mongoose.model('Post', postSchema);

