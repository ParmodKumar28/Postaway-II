// 1. Import express.
import express from 'express';
import PostController from '../Controller/post.controller.js';

// 2. Initialize Express router.
const postRouter = express.Router();

// Contoller object to access controller functions.
const postsController = new PostController();

// All the paths to controller methods.
// Retrieve all posts from various users to compile a news feed.
postRouter.get('/all', (req,res,next)=>{

});

// Retrieve a specific post by ID.
postRouter.get('/:postId', (req,res,next)=>{

});

// Retrieve all posts for a specific user to display on their profile page.
postRouter.get('/', (req,res,next)=>{

});

// Create a new post.
postRouter.post('/', (req,res,next)=>{

});

// Delete a specific post.
postRouter.delete('/:postId', (req,res,next)=>{

});

// Update a specific post.
postRouter.put('/:postId', (req,res,next)=>{

});

// Exporting Router
export default postRouter;