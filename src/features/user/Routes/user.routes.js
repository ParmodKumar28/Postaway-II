// 1. Import express.
import express from 'express';
import UserController from '../Controller/user.controller.js';

// 2. Initialize Express router.
const userRouter = express.Router();

// Contoller object to access controller functions.
const usersController = new UserController();

// All the paths to controller methods.
// Authentication Routes
// Register a new user account.
userRouter.post('/signup', (req,res,next)=>{

})

// Log in as a user.
userRouter.post('/signin', (req,res,next)=>{

});

// Log out the currently logged-in user.
userRouter.get('/logout', (req,res,next)=>{

});

// Log out the user from all devices.
userRouter.get('/logout-all-devices', (req,res,next)=>{

});

// ***********************************************************//
// User Profile Routes
// Retrieve user information, ensuring sensitive data like passwords is not exposed.
userRouter.get('/get-details/:userId',(req,res,next)=>{

});

// Retrieve information for all users, avoiding display of sensitive credentials like passwords.
userRouter.get('/get-all-details',(req,res,next)=>{

});

// Update user details while ensuring that sensitive data like passwords remains secure and undisclosed.
userRouter.get('/update-details/:userId',(req,res,next)=>{

});

// Exporting Router
export default userRouter;