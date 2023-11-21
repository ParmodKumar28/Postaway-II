// 1. Import express.
import express from 'express';
import UserController from '../Controller/user.controller.js';
import jwtAuth from '../../../middlewares/jwt.middleware.js';
import { upload } from '../../../middlewares/file-upload.middleware.js';

// 2. Initialize Express router.
const userRouter = express.Router();

// Contoller object to access controller functions.
const usersController = new UserController();

// All the paths to controller methods.
// Authentication Routes

// Register a new user account.
userRouter.post('/signup', (req,res,next)=>{
    usersController.SignUp(req,res,next);
})

// Log in as a user.
userRouter.post('/signin', (req,res,next)=>{
    usersController.SignIn(req,res,next);
});

// Log out the currently logged-in user.
userRouter.get('/logout', jwtAuth, (req,res,next)=>{
    usersController.Logout(req,res,next);
});

// Log out the user from all devices.
userRouter.get('/logout-all-devices', jwtAuth, (req,res,next)=>{
    usersController.LogoutFromAllDevices(req,res,next);
});

// ***********************************************************//
// User Profile Routes

// Retrieve user information, ensuring sensitive data like passwords is not exposed.
userRouter.get('/get-details/:userId', jwtAuth, (req,res,next)=>{
    usersController.GetUserDetails(req,res,next);
});

// Retrieve information for all users, avoiding display of sensitive credentials like passwords.
userRouter.get('/get-all-details', jwtAuth, (req,res,next)=>{
    usersController.GetUsers(req,res,next);
});

// Update user details while ensuring that sensitive data like passwords remains secure and undisclosed.
userRouter.put('/update-details/:userId', jwtAuth, (req,res,next)=>{
    usersController.UpdateUser(req,res,next);
});

// Avatar upload for the user profile;
userRouter.post('/avatar-upload', jwtAuth, upload.single('avatar'), (req,res,next)=>{
    usersController.avatarUpload(req,res,next);
});

// Exporting Router
export default userRouter;