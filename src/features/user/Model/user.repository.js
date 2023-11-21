// User repository file here all user database functions are handled.
// Imports
import mongoose from "mongoose";
import ApplicationError from '../../../errors/applicationError.js'
import handleDatabaseError from "../../../errors/databaseError.js";
import { UserModel } from "../Schema/user.schema.js";

// UserRepository class
export default class UserRepository{

    // User signup
    async signUp(user)
    {
        try {
            const newUser = new UserModel(user);
            const savedUser = await newUser.save();
            const userWithoutPassword = {...savedUser.toObject()};
            delete userWithoutPassword.password;
            return userWithoutPassword;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Find user by email
    async findByEmail(email)
    {
        try {
            const user = await UserModel.findOne({email});
            if(!user)
            {
                throw new ApplicationError("No user found by this email.", 400);
            }
            return user;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Find user by id
    async findById(id)
    {
        try {
            const user = await UserModel.findById(id).select('-password  -token').populate('posts');
            if(!user)
            {
                throw new ApplicationError("No user found by this id", 400);
            }
            return user;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Find all users details
    async findAllUsers()
    {
        try {
            const users = await UserModel.find({}, {password: 0, token: 0}).populate('posts');
            
            if(users.length == 0)
            {
                throw new  ApplicationError("No users are there.", 400);
            }
            return users;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Update user by id
    async updateById(id, user)
    {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(id, user, {new: true}).select('-password -tokens').populate('posts');
            if(!updatedUser)
            {
                throw new ApplicationError("No user found by this id", 400);
            }
            return updatedUser;
        } catch (error) {
            handleDatabaseError(error);
        }

    }

        // Log out the user from a single device
        async logout(userId, token) {
            try {
                const user = await UserModel.findById(userId);
    
                if (!user) {
                    throw new ApplicationError("User not found", 404);
                }
    
                // Remove the provided token from the user's tokens array
                user.token = user.token.filter(t => t !== token);
                await user.save();
                
                return { message: "Logged out successfully from this device" };
            } catch (error) {
                handleDatabaseError(error);
            }
        }
    
        // Log out the user from all devices
        async logoutAllDevices(userId) {
            try {
                const user = await UserModel.findById(userId);
    
                if (!user) {
                    throw new ApplicationError("User not found", 404);
                }
    
                // Clear all tokens from the user's tokens array
                user.token = [];
                await user.save();
    
                return { message: "Logged out successfully from all devices" };
            } catch (error) {
                handleDatabaseError(error);
            }
        }

        // Uploading avatar for user profile
        async avatarUpload(avatar, userID) {
            try {
                const user = await UserModel.findById(userID);
                if (!user) {
                    throw new ApplicationError("User not found", 404);
                }
                user.avatar = avatar;
                return await user.save();
            } catch (error) {
                handleDatabaseError(error);
            }
        }

}