// Imports
import { ObjectId } from "mongodb";
import ApplicationError from "../../../errors/applicationError.js";
import handleDatabaseError from "../../../errors/databaseError.js";
import { PostModel } from "../Schema/post.schema.js";

export default class PostRepository{

    // Create a new post.
    async createPost(userID,caption,imageUrl)
    {
        try {
            const newPost = new PostModel({
                user: userID,
                caption: caption,
                imageUrl: imageUrl,
            });
            const savedPost = await newPost.save({new :true});
            return savedPost;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Delete a specific post.
    async delete(postId,userID)
    {
        try {
            const post = await PostModel.findById(postId);
            if(!post)
            {
                throw new ApplicationError("No post exist on this id.", 404);
            }
            if(String(post.user) !== userID)
            {
                throw new ApplicationError("You are not allowed to delete this post.", 404);
            }
            const result = await PostModel.findByIdAndDelete(postId);
            if(!result)
            {
                throw new ApplicationError("No post exist on this id.", 404);
            }
            return result; 
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Update a specific post.
    async update(postId,userID,updatedPostData)
    {
        try {
            const postToUpdate = await PostModel.findById(postId);
            if(!postToUpdate)
            {
                throw new ApplicationError("No post exist on this id.", 404);
            }
            if(String(postToUpdate.user) !== userID)
            {
                throw new ApplicationError("You are not allowed to update this post.", 404);
            }
            const updatedPost = await PostModel.findByIdAndUpdate(postId,updatedPostData);
            if(!updatedPost)
            {
                throw new ApplicationError("No post exist on this id.", 404);
            }
            return updatedPost;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Retrieve all posts for a specific user to display on their profile page.
    async getUserPosts(userID)
    {
        try {
            const posts = await PostModel.find({user: userID});
            if(posts.length==0 || !posts)
            {
                throw new ApplicationError("User has not posted anything.", 404);
            }
            return posts;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Retrieve a specific post by ID.
    async getPost(postId)
    {
        try {
            const post = await PostModel.findById(postId);
            if(!post)
            {
                throw new ApplicationError("No post found on this id.", 404);
            }
            return post;
        } catch (error) {
            handleDatabaseError(error);
        }
    }
    
    // Retrieve all posts from various users to compile a news feed.
    async getPosts()
    {
        try {
            const posts = await PostModel.find();
            if(posts.length == 0)
            {
                throw new ApplicationError("There are no posts let's post something.", 404);
            }
            return posts;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

}