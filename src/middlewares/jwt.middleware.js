import jwt from "jsonwebtoken";

const jwtAuth = (req,res,next)=>{
    // 1. Read  the token
    const token = req.headers['authorization'];

    // 2. If no token return error
    if(!token)
    {
        return res.status(401).send('Unauthorized');
    }

    // 3. Check if token is valid
    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        // Adding userID to request object which is used in code in other places for security.
        req.userID = payload.userID;
    } catch (error) {
        // 4. Return error
        res.status(401).send('Unauthorized');
    }

    // 5. Call next middleware
    next();
}

export default jwtAuth;