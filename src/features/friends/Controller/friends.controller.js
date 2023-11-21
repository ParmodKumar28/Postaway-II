// Friends controller is here pass data to the repository.
// Imports
import ApplicationError from "../../../errors/applicationError.js";
import FriendRepository from "../Model/friends.repository.js";

export default class FriendController{
    
    constructor()
    {
        this.friendRepository = new FriendRepository();
    }

    // Get a user's friends.
    async getFriends(req, res, next) {
        try {
            const userID = req.params.userId;
            if (!userID) {
                throw new ApplicationError("User id not received, please enter.", 404);
            }
            const friends = await this.friendRepository.getFriends(userID);
            if (!friends) {
                throw new ApplicationError("User friends couldn't be retrieved. ", 404);
            }
            return res.status(200).json({
                success: true,
                friends: friends,
                msg: 'User friends retrieved.'
            });
        } catch (error) {
            next(error);
        }
    }

    // Get pending friend requests.
    async getPendingFriendRequests(req, res, next) {
        try {
            const userID = req.userID;
            const pendingRequests = await this.friendRepository.getPendingRequests(userID);
            if (!pendingRequests) {
                throw new ApplicationError("Pending friend requests couldn't be retrieved. ", 404);
            }
            return res.status(200).json({
                success: true,
                pendingRequests: pendingRequests,
                msg: 'Pending friend requests retrieved.'
            });
        } catch (error) {
            next(error);
        }
    }

    // Toggle friendship with another user.
    async toggleFriendship(req, res, next) {
        try {
            const userID = req.userID;
            if (!userID) {
                throw new ApplicationError("User id not received, please enter.", 404);
            }
            const friendId = req.params.friendId;
            if (!friendId) {
                throw new ApplicationError("Friend id not received, please enter.", 404);
            }
            if (userID === friendId) {
                throw new ApplicationError("User cannot add itself as a friend.", 404);
            }
            const result = await this.friendRepository.toggleFriendship(userID, friendId);
            if (!result) {
                throw new ApplicationError("Toggle friendship failed, something went wrong.", 404);
            }
            return res.status(200).json({
                success: true,
                msg: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    // Accept or reject a friend request.
    async respondToRequest(req, res, next) {
        try {
            const userID = req.userID;
            const friendId = req.params.friendId;
            const response = req.body.response;
            if (!userID) {
                throw new ApplicationError("User id not received, please enter.", 404);
            }
            if (!friendId) {
                throw new ApplicationError("Friend id not received, please enter.", 404);
            }
            const result = await this.friendRepository.respondToRequest(userID, friendId, response);
            if (!result) {
                throw new ApplicationError("Respond to request failed, something went wrong.", 404);
            }
            return res.status(200).json({
                success: true,
                msg: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}