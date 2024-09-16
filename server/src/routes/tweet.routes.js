import { Router } from "express";
import { 
    createTweet, 
    updateTweet,
    deleteTweet, 
    getUserTweets 
} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"

const router = Router()

router.route("/add-tweet").post(verifyJWT, upload.single("post"), createTweet)
router.route("/update-tweet").post(verifyJWT, updateTweet);
router.route("/delete-tweet").delete(verifyJWT, deleteTweet);
router.route("/tweets/:userId").get(verifyJWT, getUserTweets);
 
export default router