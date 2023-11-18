// 1. Import express.
import express from 'express';
import LikeController from '../Controller/like.controller.js';

// 2. Initialize Express router.
const likeRouter = express.Router();

// Contoller object to access controller functions.
const likesController = new LikeController();

// All the paths to controller methods.
// Get likes for a specific post or comment.
likeRouter.get('/:id', (req,res,next)=>{

});

// Toggle like on a post or comment.
likeRouter.get('/toggle/:id', (req,res,next)=>{

});

// Exporting Router
export default likeRouter;