// Imports
import bcrypt from 'bcrypt';
import ApplicationError from "../../../errors/applicationError.js";
import UserRepository from "../Model/user.repository.js";
import jwt from 'jsonwebtoken';

// UserController class
export default class UserController{
    
    // Constructor to initialize userRepository to class object.
    constructor()
    {
        this.userRepository = new UserRepository();
    }

    // Register a new user account.
    async SignUp(req,res,next){
        try {
            const {name,email,password,gender} = req.body;
            // Hashing The password for security.
            const hashedPassword = await bcrypt.hash(password, 12);
            if(!hashedPassword)
            {
                throw new ApplicationError("Having issue in hasing the password", 400);
            }
            // Creating user object.
            const user = {name,email,password,gender};
            user.password = hashedPassword;
            // Calling signUp function in repository.
            const newUser = await this.userRepository.signUp(user);
            // Sending response.
            return res.status(201).json({
                success: true,
                user: newUser,
                msg: "New user added successfully."
            });
        } catch (error) {
            next(error);
        }
    }

    // Log in as a user.
    async SignIn(req, res, next) {
        try {
            const { email, password } = req.body;
    
            // Check for missing email or password.
            if (!email) {
                throw new ApplicationError("Please enter email", 400);
            } else if (!password) {
                throw new ApplicationError("Please enter password", 400);
            }
    
            // Find user by email.
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    msg: "Invalid Credentials"
                });
            }
    
            // Compare password with hashed password.
            const passwordMatch = await bcrypt.compare(password, user.password);
    
            if (passwordMatch) {
                // Create a token with user information
                const token = jwt.sign(
                    { userID: user._id, email: user.email },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '1h' }
                );
    
                // Send token in response upon successful login.
                return res.status(200).json({
                    success: true,
                    msg: "User sign-in successful",
                    token: token
                });
            } else {
                // Invalid password.
                return res.status(400).json({
                    success: false,
                    msg: "Invalid Credentials"
                });
            }
        } catch (error) {
            // Handle any unexpected error.
            next(error);
        }
    }

    // Log out the currently logged-in user.
    async Logout(req,res,next){
        try {

        } catch (error) {
            next(error);
        }
    }
    
    // Log out the user from all devices.
    async LogoutFromAllDevices(req,res,next){
        try {
            
        } catch (error) {
            next(error);
        }
    }


    // User Profile Routes.
    // Retrieving user by its id.
    async GetUserDetails(req,res,next){
        try {
            const id = req.params.userId;
            if(!id)
            {
                throw new ApplicationError("Enter user id.", 400);
            }
            const user = await this.userRepository.findById(id);
            if(!user)
            {
                throw new ApplicationError("No user found by this id", 404);
            }
            return res.status(200).json({
                success: true,
                user: user,
                msg: "User found."
            })
        } catch (error) {
            next(error);
        }
    }

    // Retrieve information for all users.
    async GetUsers(req,res,next){
        try {
            const users = await this.userRepository.findAllUsers();
            if(users.length==0)
            {
                throw new ApplicationError("No users are there", 400);
            }
            return res.status(200).json({ 
                success: true, 
                users: users, msg: 
                "users found" 
            });
        } catch (error) {
            next(error);
        }
    }

    // Updating user by id.
    async UpdateUser(req, res, next) {
        try {
            const id = req.params.userId;
            if (!id) {
                throw new ApplicationError("Please enter user id", 400);
            }
            
            const userDataToUpdate = req.body;
            if (!userDataToUpdate || Object.keys(userDataToUpdate).length === 0) {
                throw new ApplicationError("Please enter user data to update", 400);
            }
    
            const updatedUser = await this.userRepository.updateById(id, userDataToUpdate);
            if (!updatedUser) {
                throw new ApplicationError("No user found by this id", 404);
            }
    
            return res.status(200).json({
                success: true,
                updatedUser: updatedUser,
                message: "User updated successfully"
            });
        } catch (error) {
            next(error);
        }
    }
    
}