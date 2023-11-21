// Posts controller which links with routes and models here.
// Imports
import ApplicationError from "../../../errors/applicationError.js";
import PostRepository from "../Model/post.repository.js";

export default class PostController{

    constructor()
    {
        this.postRepository = new PostRepository();
    }

    // Create a new post.
    async createNewPost(req,res,next){
        try {
            const caption = req.body.caption;
            const imageUrl = req.file.filename;
            // Fetching user Id from token here.
            if(!imageUrl)
            {
                throw new ApplicationError("Image url is not recieved.", 400);
            }
            const userID = req.userID;
            if(!userID)
            {
                throw new ApplicationError("User id is not received.", 400);
            }
            const newPost = await this.postRepository.createPost(userID,caption,imageUrl);
            if(!newPost)
            {
                throw new ApplicationError("Post not created something went wrong.", 400);
            }
            return res.status(201).json({
                success: true,
                post: newPost,
                msg: "post created successfully."
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete a specific post.
    async deletePost(req,res,next){
        try {
            const postId = req.params.postId;
            const userID = req.userID;
            if(!postId)
            {
                throw new ApplicationError("postId is not recieved enter postId.", 400);
            }
            const result = await this.postRepository.delete(postId,userID);
            if(result)
            {
                return res.status(200).json({
                    success: true,
                    msg: "Post deleted successfully."
                });
            }
        } catch (error) {
            next(error);
        }
    }

    // Update a specific post.
    async updatePost(req, res, next) {
        try {
            const postId = req.params.postId;
            const caption = req.body.caption;
    
            const updatedPostData = {
                caption: caption // Assign the caption from the request body
            };
    
            if (req.file) {
                const imageUrl = req.file.filename; // Correct the access to filename
                updatedPostData.imageUrl = imageUrl; // Assign the imageUrl to updatedPostData
            }
    
            console.log(updatedPostData);
    
            if (!updatedPostData || Object.keys(updatedPostData).length === 0) {
                throw new ApplicationError("Enter details of the post that need to be updated.", 400);
            }
    
            if (!postId) {
                throw new ApplicationError("postId is not received. Please enter the postId.", 400);
            }
    
            const userID = req.userID;
    
            if (!userID) {
                throw new ApplicationError("User id not received.", 400);
            }
    
            const updatedPost = await this.postRepository.update(postId, userID, updatedPostData);
    
            if (!updatedPost) {
                throw new ApplicationError("Post was not updated. Something went wrong.", 404);
            }
    
            return res.status(201).json({
                success: true,
                updatedPost: updatedPost,
                msg: "Post updated successfully."
            });
        } catch (error) {
           next(error);
        }
    }
    

    // Retrieve all posts for a specific user to display on their profile page.
    async getUserPosts(req,res,next){
        try {
            const userID = req.userID;
            if(!userID)
            {
                throw new ApplicationError("User id not recieved.", 400);
            }
            const posts = await this.postRepository.getUserPosts(userID);
            res.status(200).json({
                success: true,
                posts: posts,
                msg: "posts retrieved"
            });
        } catch (error) {
            next(error);
        }
    }

    // Retrieve a specific post by ID.
    async getPostById(req,res,next){
        try {
            const postId = req.params.postId;
            if(!postId)
            {
                throw new ApplicationError("postId is not recieved enter postId.", 400);
            }
            const post = await this.postRepository.getPost(postId);
            res.status(200).json({
                success: true,
                post: post,
                msg: "post retrieved"
            });
        } catch (error) {
            next(error);
        }
    }
    

    // Retrieve all posts from various users to compile a news feed.
    async getAllPosts(req,res,next){
        try {
            const posts = await  this.postRepository.getPosts();
            res.status(200).json({
                success: true,
                posts: posts,
                msg: "posts retrieved"
            });
        } catch (error) {
            next(error);
        }
    }
}