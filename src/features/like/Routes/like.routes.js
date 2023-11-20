// 1. Import express.
import express from 'express';
import LikeController from '../Controller/like.controller.js';
import jwtAuth from '../../../middlewares/jwt.middleware.js';

// 2. Initialize Express router.
const likeRouter = express.Router();

// Contoller object to access controller functions.
const likesController = new LikeController();

// All the paths to controller methods.
// Get likes for a specific post or comment.
likeRouter.get('/:id', jwtAuth, (req,res,next)=>{
    likesController.gettingLikes(req,res,next);
});

// Toggle like on a post or comment.
likeRouter.get('/toggle/:id', jwtAuth, (req,res,next)=>{
    likesController.toggleLike(req,res,next);
});

// Exporting Router
export default likeRouter;