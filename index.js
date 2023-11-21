// Importing env
import './env.js'

// Modules Imported
import express from 'express';

// Routers Imported
import userRouter from './src/features/user/Routes/user.routes.js';
import postRouter from './src/features/post/Routes/post.routes.js';
import commentRouter from './src/features/comment/Routes/comment.routes.js';
import likeRouter from './src/features/like/Routes/like.routes.js';
import friendsRouter from './src/features/friends/Routes/friends.routes.js';
import otpRouter from './src/features/otp/Routes/otp.routes.js';
import { errorHandlerMiddleware } from './src/middlewares/error-handler.middleware.js';
import { connectUsingMongoose } from './config/mongooseConfig.js';
import loggerMiddleware from './src/middlewares/logger.middleware.js';

// Server Created
const app = express();

// Json parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes related to all features
app.use('/api/users', userRouter);
app.use('/api/posts',loggerMiddleware, postRouter);
app.use('/api/comments',loggerMiddleware, commentRouter);
app.use('/api/likes',loggerMiddleware, likeRouter);
app.use('/api/friends',loggerMiddleware, friendsRouter);

// Additional features
app.use('/api/otp', otpRouter);

// Default route
app.get('/', (req,res)=>{
    res.status(200).send("Welcome to the Social Media REST-API's");
});

// Error handler
app.use(errorHandlerMiddleware);

// 404 Route middelware handles 404 requests
app.use((req,res)=>{
    res.status(404).send("API not found please give valid API.");
});

// Server is listening here
app.listen('8000', ()=>{
    console.log("Server is listening on: localhost:8000");
    connectUsingMongoose();
});