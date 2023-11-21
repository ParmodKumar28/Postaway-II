// Likes controller all functions which pass data to like model.

// Imports
import ApplicationError from "../../../errors/applicationError.js";
import LikeRepository from "../Model/like.repository.js";

export default class LikeController{

    constructor()
    {
        this.likeRepository = new LikeRepository();
    }

    // Get likes for a specific post or comment.
    async gettingLikes(req,res,next){
        try {
            const id = req.params.id;
            const type = req.body.type;
            if(type != 'Post' && type != 'Comment')
            {
                throw new ApplicationError("Enter a valid type ie 'Post' or 'Comment'", 400);
            }
            if(!id)
            {
                throw new ApplicationError("Id not recieved enter id.", 400);
            }
            const likes = await this.likeRepository.getLikes(id,type);
            if(!likes)
            {
                throw new ApplicationError("Likes not retrieved something went wrong.", 404);
            }
            return res.status(200).json({
                success: true,
                likes: likes,
                msg: "likes retrieved."
            })
        } catch (error) {
            next(error);
        }
    }

    // Toggle like on a post or comment.
    async toggleLike(req,res,next){
        try {
            const id = req.params.id;
            const type = req.query.type;
            const userID = req.userID;
            if(!userID)
            {
                throw new ApplicationError("User Id not recieved.", 400);
            }
            if(!id)
            {
                throw new ApplicationError("Id not recieved enter id.", 400);
            }
            if(type != 'Post' && type != 'Comment')
            {
                throw new ApplicationError("Enter a valid type ie 'Post' or 'Comment'", 400);
            }
            const result = await this.likeRepository.toggleLike(userID, id, type);
            if(!result)
            {
                throw new ApplicationError("Like not added something went wrong.", 404);
            }
            return res.status(200).json({
                success: true,
                msg: result.message
            })
        } catch (error) {
            next(error);
        }
    }
}