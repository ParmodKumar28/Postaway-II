// Friend schema each friend should have these fields.
import mongoose from "mongoose";

export const friendSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    friend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, {timestamps: true});

// Friend Model
export const FriendshipModel = mongoose.model('Friendship', friendSchema);

