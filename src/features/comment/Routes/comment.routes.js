// 1. Import express.
import express from 'express';
import CommentController from '../Controller/comment.controller.js';

// 2. Initialize Express router.
const commentRouter = express.Router();

// Contoller object to access controller functions.
const commentsController = new CommentController();

// All the paths to controller methods.
// Get comments for a specific post.
commentRouter.get('/:postId', (req,res,next)=>{

});

// Add a comment to a specific post.
commentRouter.post('/:postId', (req,res,next)=>{

});

// Delete a specific comment.
commentRouter.delete('/:commentId', (req,res,next)=>{

});

// Update a specific comment.
commentRouter.put('/:commentId', (req,res,next)=>{

});

// Exporting Router
export default commentRouter;