// Posts repository file all database activities is happening here like CRUD.
// Imports
import { ObjectId } from "mongodb";
import ApplicationError from "../../../errors/applicationError.js";
import handleDatabaseError from "../../../errors/databaseError.js";
import { PostModel } from "../Schema/post.schema.js";
import { UserModel } from "../../user/Schema/user.schema.js";

export default class PostRepository{

    // Create a new post.
    async createPost(userID,caption,imageUrl)
    {
        try {
        // Create a new post
        const newPost = new PostModel({
            user: userID,
            caption: caption,
            imageUrl: imageUrl,
        });

        // Save the post
        const savedPost = await newPost.save();

        // Find the user by ID
        const user = await UserModel.findById(userID);
        user.posts.push(newPost);
        await user.save();

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

    // Getting user posts only.
    async getUserPosts(userID) {
        try {
            const posts = await PostModel.find({ user: userID })
                .populate({
                    path: 'user',
                    select: 'name email gender _id'
                })
                .populate({
                    path: 'comments',
                    select: '-_id'
                })
                .populate({
                    path: 'likes',
                    select: '-_id'
                });

            if (posts.length === 0) {
                throw new ApplicationError("User has not posted anything.", 404);
            }

            // Adding likes counts and comments counts.
            const postsWithCounts = posts.map(post => ({
                ...post.toObject(),
                commentsCount: post.comments.length,
                likesCount: post.likes.length
            }));

            return postsWithCounts;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Getting post by id.
    async getPost(postId) {
        try {
            const post = await PostModel.findById(postId)
                .populate({
                    path: 'user',
                    select: 'name email gender _id'
                })
                .populate({
                    path: 'comments',
                    select: '-_id'
                })
                .populate({
                    path: 'likes',
                    select: '-_id'
                });

            if (!post) {
                throw new ApplicationError("No post found on this id.", 404);
            }

            // Adding likes counts and comments counts.
            const postWithCounts = {
                ...post.toObject(),
                commentsCount: post.comments.length,
                likesCount: post.likes.length
            };

            return postWithCounts;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Updating post by id.
    async update(postId, userID, updatedPostData) {
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
            const updatedPost = await PostModel.findByIdAndUpdate(postId, updatedPostData, { new: true })
                .populate({
                    path: 'user',
                    select: 'name email gender _id'
                })
                .populate({
                    path: 'comments',
                    select: '-_id'
                })
                .populate({
                    path: 'likes',
                    select: '-_id'
                });

            // Adding likes counts and comments counts.
            const postWithCounts = {
                ...updatedPost.toObject(),
                commentsCount: updatedPost.comments.length,
                likesCount: updatedPost.likes.length
            };

            return postWithCounts;
        } catch (error) {
            handleDatabaseError(error);
        }
    }
    
    // Retrieve all posts from various users to compile a news feed.
    async getPosts()
    {
        try {
            const posts = await PostModel.aggregate([
                {
                    $lookup: {
                        from: 'comments', // Collection name for comments
                        localField: '_id',
                        foreignField: 'post',
                        as: 'comments'
                    }
                },
                {
                    $lookup: {
                        from: 'likes', // Collection name for likes
                        localField: '_id',
                        foreignField: 'likeable',
                        as: 'likes'
                    }
                },
                {
                    $addFields: {
                        commentsCount: { $size: '$comments' },
                        likesCount: { $size: '$likes' }
                    }
                },
                {
                    $unset: ['comments', 'likes'] // Remove unnecessary arrays after counting
                },
                {
                    $lookup: {
                        from: 'users', // Collection name for users if needed
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $project: {
                        'user.name': 1,
                        'user.email': 1,
                        'user._id': 1,
                        caption: 1,
                        imageUrl: 1,
                        createdAt: 1,
                        commentsCount: 1,
                        likesCount: 1
                    }
                }
            ]);
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