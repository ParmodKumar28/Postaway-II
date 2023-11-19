import ApplicationError from "./applicationError.js";
import mongoose from "mongoose";

// Centralized error handling for database errors
const handleDatabaseError = (error)=>{
    console.log(error); // Logging error for debugging
    if(error instanceof mongoose.Error.ValidationError){
        throw error;
    }else{
        throw new ApplicationError(error.message, error.statuscode || 500);
    }
}

export default handleDatabaseError;
