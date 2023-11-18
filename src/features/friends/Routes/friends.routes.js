// 1. Import express.
import express from 'express';
import FriendController from '../Controller/friends.controller.js';

// 2. Initialize Express router.
const friendsRouter = express.Router();

// Contoller object to access controller functions.
const friendsController = new FriendController();

// All the paths to controller methods.
// Get a user's friends.
friendsRouter.get('/get-friends/:userId', (req,res,next)=>{

});

// Get pending friend requests.
friendsRouter.get('/get-pending-requests', (req,res,next)=>{

});

// Toggle friendship with another user.
friendsRouter.get('/toggle-friendship/:friendId', (req,res,next)=>{

});

// Accept or reject a friend request.
friendsRouter.get('/response-to-request/:friendId', (req,res,next)=>{

});



// Exporting Router
export default friendsRouter;