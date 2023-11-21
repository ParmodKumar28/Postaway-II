// Like repository adding like and removing and getting likes here.
// Imports 
import { ObjectId } from "mongodb";
import ApplicationError from "../../../errors/applicationError.js";
import { PostModel } from "../../post/Schema/post.schema.js";
import { LikeModel } from "../Schema/like.schema.js";
import handleDatabaseError from "../../../errors/databaseError.js";
import { CommentModel } from "../../comment/Schema/comment.schema.js";

export default class LikeRepository{
    
    // Get likes for a specific post or comment.
    async getLikes(id, type)
    {
        try {
            let likeable;
            if (type === 'Post') {
                likeable = await PostModel.findById(id);
            } else if (type === 'Comment') {
                likeable = await CommentModel.findById(id);
            }

            if (!likeable) {
                throw new ApplicationError(`No ${type.toLowerCase()} found with this ID.`, 404);
            }

            const likes = await LikeModel.find({ likeable: new ObjectId(id), on_model: type })
            .populate({
                path: 'user',
                select: 'name email _id' // Specify the fields to include
            }).populate('likeable');

            if (likes.length === 0) {
                throw new ApplicationError(`There are no likes for this ${type.toLowerCase()}.`, 404);
            }

            return likes;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Toggle like on a post or comment.
    async toggleLike(userID,likeableId,type)
    {
        try {
            let likeable;

            if (type === 'Post') {
                likeable = await PostModel.findById(likeableId);
            } else if (type === 'Comment') {
                likeable = await CommentModel.findById(likeableId);
            }

            if (!likeable) {
                throw new ApplicationError(`No ${type.toLowerCase()} found by this id.`, 404);
            }

            const existingLike = await LikeModel.findOne({
                user: new ObjectId(userID),
                likeable: new ObjectId(likeableId),
                on_model: type,
            });

            if (existingLike) {
                await LikeModel.findByIdAndDelete(existingLike._id);
            // Remove like from the respective array (post or comment)
            const index = likeable.likes.indexOf(existingLike._id);
            if (index > -1) {
                likeable.likes.splice(index, 1);
                await likeable.save();
            }
                return { message: 'Like removed' };
            } else {
                const newLike = new LikeModel({
                    user: new ObjectId(userID),
                    likeable: new ObjectId(likeableId),
                    on_model: type,
                });
                const liked = await newLike.save(); 
                if(liked)
                {
                    // Add like to the respective array (post or comment)
                    likeable.likes.push(newLike._id);
                    await likeable.save();
                    return { message: 'Like added' };
                } 
            }
        } catch (error) {
            handleDatabaseError(error);   
        }
    }
}