// Like schema like should have these fields.
import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required:  true,
        ref: 'User'
    },
    likeable: {
        type: mongoose.Schema.ObjectId,
        refPath: 'on_model'
    },
    on_model: {
        type: String,
        enum: ['Post', 'Comment'],
        required: true
    }
});

// Like Model
export const LikeModel = mongoose.model('Like', likeSchema);