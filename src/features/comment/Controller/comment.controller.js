// Comments controller file which pass data to model.
// Imports
import ApplicationError from "../../../errors/applicationError.js";
import CommentRepository from "../Model/comment.repository.js";

export default class CommentController{
    
    constructor()
    {
        this.commentRepository = new CommentRepository();
    }

    // Get comments for a specific post.
    async getComments(req,res,next){
        try {
            const postId = req.params.postId;
            if(!postId)
            {
                throw new ApplicationError("Enter post id.", 400);
            }
            const comments = await this.commentRepository.get(postId);
            if(!comments || comments.length == 0)
            {
                throw new ApplicationError("Comments not retrieved something went wrong.", 400);
            }
            return res.status(200).json({
                success: true,
                comments: comments,
                msg: "Comments retrieved."
            })
        } catch (error) {
            next(error);
        }
    }

    // Add a comment to a specific post.
    async addComment(req,res,next){
        try {
            const userID = req.userID;
            const postId = req.params.postId;
            const content = req.body.content;
            if(!content)
            {
                throw new ApplicationError("Enter content.", 400);
            }
            if(!postId)
            {
                throw new ApplicationError("Enter post id.", 400);
            }
            const comment = await this.commentRepository.add(postId, userID, content);
            if(!comment)
            {
                throw new ApplicationError("New comment not added on this post something went wrong.", 400);
            }
            return res.status(201).json({
                success: true,
                comment: comment,
                msg: "New comment added!"
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete a specific comment.
    async deleteComment(req,res,next){
        try {
            const commentId = req.params.commentId;
            const userID = req.userID;
            if(!commentId)
            {
                throw new ApplicationError("Comment id not recieved enter comment id.", 400);
            }
            const result = await this.commentRepository.delete(commentId, userID);
            if(!result)
            {
                throw new ApplicationError("Comment not deleted something went wrong.", 400); 
            }
            return res.status(200).json({
                success: true,
                comment: result,
                msg: "Comment deleted!"
            })

        } catch (error) {
            next(error);
        }
    }

    // Update a specific comment.
    async updateComment(req,res,next){
        try {
            const commentId = req.params.commentId;
            const updatedContent = req.body.content;
            const userID = req.userID;
            if(!updatedContent)
            {
                throw new ApplicationError("Enter content to update.", 400);
            }
            if(!commentId)
            {
                throw new ApplicationError("Comment id not recieved enter comment id.", 400);
            }
            const updatedComment = await this.commentRepository.update(commentId, userID, updatedContent);
            if(!updatedComment)
            {
                throw new ApplicationError("Comment not updated something went wrong.", 400); 
            }
            return res.status(200).json({
                success: true,
                comment: updatedComment,
                msg: "Comment updated!"
            })

        } catch (error) {
            next(error);
        }
    }

}