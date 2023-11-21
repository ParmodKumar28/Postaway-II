// Friends model is here or repository and all database activities is happening here.
// Imports
import { ObjectId } from "mongodb";
import ApplicationError from "../../../errors/applicationError.js";
import handleDatabaseError from "../../../errors/databaseError.js";
import { FriendshipModel } from "../Schema/friends.schema.js";
import { UserModel } from "../../user/Schema/user.schema.js";

export default class FriendRepository{

        // Get a user's friends.
        async getFriends(userID) {
            try {
                const user = await UserModel.findById(userID);
                if (!user) {
                    throw new ApplicationError("User not found", 404);
                }

                const friends = await FriendshipModel.find({
                $or:[
                {
                    user: new ObjectId(userID),
                    status: "accepted"
                },
                {
                    friend: new ObjectId(userID),
                    status: "accepted"
                }]
            }).populate('user', 'name').populate('friend', 'name', );
                if (friends.length === 0) {
                    throw new ApplicationError("User has no friends yet. Let's add someone.", 404);
                }
                return friends;
            } catch (error) {
                handleDatabaseError(error);
            }
        }
    
        // Get pending friend requests.
        async getPendingRequests(userID) {
            try {
                const user = await UserModel.findById(userID);
                if (!user) {
                    throw new ApplicationError("User not found", 404);
                }

                const pendingRequests = await FriendshipModel.find({
                    friend: new ObjectId(userID),
                    status: 'pending'
                }).populate('user', 'name',);
                if (pendingRequests.length === 0) {
                    throw new ApplicationError("User has no pending friend requests.", 404);
                }
                return pendingRequests;
            } catch (error) {
                handleDatabaseError(error);
            }
        }
    
        // Toggle friendship with another user.
        async toggleFriendship(userID, friendId) {
            try {
                const user = await UserModel.findById(friendId);
                if (!user) {
                    throw new ApplicationError("User not found", 404);
                }

                const existingFriendship = await FriendshipModel.findOne({
                    $or: [
                        { user: new ObjectId(userID), friend: new ObjectId(friendId) },
                        { user: new ObjectId(friendId), friend: new ObjectId(userID) }
                    ]
                });
        
                if (existingFriendship) {
                    if (existingFriendship.status === 'pending') {
                        // Friendship exists as a pending request, delete the pending request
                        await FriendshipModel.deleteOne({
                            $or: [
                                { user: new ObjectId(userID), friend: new ObjectId(friendId) },
                                { user: new ObjectId(friendId), friend: new ObjectId(userID) }
                            ],
                            status: 'pending'
                        });
                        return { message: "Friend request cancelled." };
                    } else if (existingFriendship.status === 'accepted') {
                        // Friendship exists and is accepted, delete it
                        await FriendshipModel.deleteOne({
                            $or: [
                                { user: new ObjectId(userID), friend: new ObjectId(friendId) },
                                { user: new ObjectId(friendId), friend: new ObjectId(userID) }
                            ]
                        });
                        return { message: "Friend removed." };
                    }
                    else if (existingFriendship.status === 'rejected') {
                        // Friendship exists and is rejected

                        return { message: "Your request is rejected." };
                    }
                } else {
                    // Friendship doesn't exist, create a new pending request
                    const newFriendship = new FriendshipModel({
                        user: new ObjectId(userID),
                        friend: new ObjectId(friendId),
                        status: 'pending'
                    });
                    await newFriendship.save();
                    return { message: "Friend request sent." };
                }
            } catch (error) {
                handleDatabaseError(error);
            }
        }
    
        // Accept or reject a friend request.
        async respondToRequest(userID, friendId, response) {
            try {
                // Find the friendship
                let friendship = await FriendshipModel.findOne({ user: new ObjectId(friendId), friend: new ObjectId(userID), status: 'pending' });
                if (friendship) {
                    // Update the status based on the response
                    friendship.status = response;
                    await friendship.save();
                    return { message: `Friend request ${response}.` };
                } else {
                    throw new ApplicationError('Friend request not found', 404);
                }
            } catch (error) {
                handleDatabaseError(error);
            }
        }
}