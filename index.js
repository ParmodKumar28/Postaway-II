// Modules Imported
import express from 'express';

// Routers Imported
import userRouter from './src/features/user/Routes/user.routes.js';
import postRouter from './src/features/post/Routes/post.routes.js';
import commentRouter from './src/features/comment/Routes/comment.routes.js';
import likeRouter from './src/features/like/Routes/like.routes.js';
import friendsRouter from './src/features/friends/Routes/friends.routes.js';
import otpRouter from './src/features/otp/Routes/otp.routes.js';

// Server Created
const app = express();

// Json parser
app.use(express.json());

// Routes related to all features
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);
app.use('/api/friends', friendsRouter);

// Additional features
app.use('/api/otp', otpRouter);

// Default route
app.get('/', (req,res)=>{
    res.status(200).send("Welcome to the Social Media REST-API's");
})

// Error handler

// 404 Route middelware handles 404 requests
app.use((req,res)=>{
    res.status(404).send("API not found please give valid API.");
})

// Server is listening here
app.listen('8000', ()=>{
    console.log("Server is listening on: localhost:8000");
})