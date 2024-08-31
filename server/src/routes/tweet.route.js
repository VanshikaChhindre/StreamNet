import { Router } from "express";
import { 
    createTweet, 
    updateTweet,
    deleteTweet, 
    getUserTweets 
} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
