// 1. Import express.
import express from 'express';
import PostController from '../Controller/post.controller.js';
import jwtAuth from '../../../middlewares/jwt.middleware.js';
import { upload } from '../../../middlewares/file-upload.middleware.js';

// 2. Initialize Express router.
const postRouter = express.Router();

// Contoller object to access controller functions.
const postsController = new PostController();

// All the paths to controller methods.
// Retrieve all posts from various users to compile a news feed.
postRouter.get('/all', jwtAuth, (req,res,next)=>{
    postsController.getAllPosts(req,res,next);
});

// Retrieve a specific post by ID.
postRouter.get('/:postId', jwtAuth, (req,res,next)=>{
    postsController.getPostById(req,res,next);
});

// Retrieve all posts for a specific user to display on their profile page.
postRouter.get('/', jwtAuth, (req,res,next)=>{
    postsController.getUserPosts(req,res,next);
});

// Create a new post.
postRouter.post('/', jwtAuth, upload.single('imageUrl'), (req,res,next)=>{
    postsController.createNewPost(req,res,next);
});

// Delete a specific post.
postRouter.delete('/:postId', jwtAuth, (req,res,next)=>{
    postsController.deletePost(req,res,next);
});

// Update a specific post.
postRouter.put('/:postId', jwtAuth, upload.single('imageUrl'), (req,res,next)=>{
    postsController.updatePost(req,res,next);
});

// Exporting Router
export default postRouter;