// Comments repository file is here all database activities is happening here.
// Imports
import { ObjectId } from "mongodb";
import handleDatabaseError from "../../../errors/databaseError.js";
import { CommentModel } from "../Schema/comment.schema.js";
import ApplicationError from "../../../errors/applicationError.js";
import { PostModel } from "../../post/Schema/post.schema.js";

export default class CommentRepository{
    
    // Get comments for a specific post.
    async get(postId)
    {
        try {
            const post = await PostModel.findById(postId);
            if(!post)
            {
                throw new  ApplicationError("No post found on this id", 404);
            }
            const comments = await CommentModel.find({post: new ObjectId(postId)}).populate({
                path: 'user',
                select: 'name email _id' // Specify the fields to include
            });
            if(!comments || comments.length == 0)
            {
                throw new  ApplicationError("No comments found on this post.", 404);
            }
            return comments;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Add a comment to a specific post.
    async add(postId, userID, content)
    {
        try {
            const post = await PostModel.findById(postId);
            if(!post)
            {
                throw new  ApplicationError("No post found on this id", 404);
            }
            const newComment = new CommentModel({
                user: new ObjectId(userID),
                post: new ObjectId(postId),
                content: content,
            });
            const savedComment = await newComment.save();
            // Adding to post comments Array
            post.comments.push(savedComment);
            await post.save();
            return savedComment.populate({path: 'user', select: 'name email _id'});
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Delete a specific comment.
    async delete(commentId, userID)
    {
        try {
            const comment = await CommentModel.findById(commentId);
            if(!comment)
            {
                throw new  ApplicationError("No comment found on this id", 404);
            }
            if(String(comment.user) !== userID)
            {
                throw new  ApplicationError("You are not allowed to delete this comment.", 404);
            }
            const post = await PostModel.findById(comment.post);
            if (!post) {
                throw new ApplicationError("Associated post not found.", 404);
            }
            // Remove comment ID from post's comments array
            const index = post.comments.indexOf(commentId);
            if (index > -1) {
                post.comments.splice(index, 1);
                await post.save();
            }
            const result = await CommentModel.findByIdAndDelete(commentId);
            return result;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Update a specific comment.
    async update(commentId, userID, updatedContent)
    {
        try {
            const commentToUpdate = await CommentModel.findById(commentId);
            if (!commentToUpdate) {
                throw new ApplicationError("No comment found with this ID", 404);
            }
            if (String(commentToUpdate.user) !== userID) {
                throw new ApplicationError("You are not allowed to update this comment", 403);
            }
            commentToUpdate.content = updatedContent; // Assuming 'content' is the field to be updated
            const updatedComment = await commentToUpdate.save();
            return updatedComment.populate({
                path: 'user',
                select: 'name email _id' // Specify the fields to include
            });
        } catch (error) {
            handleDatabaseError(error);
        }
    }
}