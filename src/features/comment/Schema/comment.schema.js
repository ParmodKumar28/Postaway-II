import mongoose from "mongoose";

export const commentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        }
    ]
});

export const CommentModel = mongoose.model('Comment', commentSchema);