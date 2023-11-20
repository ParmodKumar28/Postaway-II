// Imports
import { ObjectId } from "mongodb";
import ApplicationError from "../../../errors/applicationError.js";
import handleDatabaseError from "../../../errors/databaseError.js";
import { FriendshipModel } from "../Schema/friends.schema.js";

export default class FriendRepository{
    
    // Get a user's friends.
    async getFriends(userID)
    {
        try {
            const friends = await FriendshipModel.find({
                user: new ObjectId(userID),
                status: 'accepted'
            }).populate('friend', 'username');
            if(friends.length == 0)
            {
                throw new ApplicationError("User has no friends let's add someone.", 404);
            }
            return friends;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Get pending friend requests.
    async getPendingRequests(userID)
    {
        try {
            const pendingRequests = await FriendshipModel.find({
                user: new ObjectId(userID),
                status: 'pending'
            }).populate('friend', 'user');
            if(pendingRequests == 0)
            {
                throw new ApplicationError("User has no pending friend request.", 404);
            }
            return pendingRequests;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Toggle friendship with another user.
    async toggleFriendship(userID, friendId)
    {
        try {
        // Check if a friendship already exists
        let friendship = await FriendshipModel.findOne({ user: userID, friend: friendId });
        
        if (friendship) {
            // If it exists, remove it
            await FriendshipModel.deleteOne({ _id: friendship._id });
        } else {
            // If it doesn't exist, create it
            friendship = new FriendshipModel({ user: userID, friend: friendId, status: 'pending' });
            await friendship.save();
        }
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Accept or reject a friend request.
    async respondToRequest(userID, friendId, response){
        try {
        // Find the friendship
        let friendship = await FriendshipModel.findOne({ user: friendId, friend: userID, status: 'pending' });
        
        if (friendship) {
            // Update the status based on the response
            friendship.status = response;
            await friendship.save();
        } else {
            throw new ApplicationError('Friend request not found', 404);
        }
        } catch (error) {
            handleDatabaseError(error);
        }
    }
}