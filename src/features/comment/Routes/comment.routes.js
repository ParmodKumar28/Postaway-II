// 1. Import express.
import express from 'express';
import CommentController from '../Controller/comment.controller.js';
import jwtAuth from '../../../middlewares/jwt.middleware.js';

// 2. Initialize Express router.
const commentRouter = express.Router();

// Contoller object to access controller functions.
const commentsController = new CommentController();

// All the paths to controller methods.
// Get comments for a specific post.
commentRouter.get('/:postId', jwtAuth, (req,res,next)=>{
    commentsController.getComments(req,res,next);
});

// Add a comment to a specific post.
commentRouter.post('/:postId', jwtAuth, (req,res,next)=>{
    commentsController.addComment(req,res,next);
});

// Delete a specific comment.
commentRouter.delete('/:commentId', jwtAuth, (req,res,next)=>{
    commentsController.deleteComment(req,res,next);
});

// Update a specific comment.
commentRouter.put('/:commentId', jwtAuth, (req,res,next)=>{
    commentsController.updateComment(req,res,next);
});

// Exporting Router
export default commentRouter;