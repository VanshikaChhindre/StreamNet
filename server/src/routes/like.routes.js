import { Router } from "express";
import { 
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} from "../controllers/like.controller.js"

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()


router.route("/like-video/:videoId").post(toggleVideoLike);
router.route("/like-comment/:commentId").post(verifyJWT, toggleCommentLike,);
router.route("/like-tweet/:tweetId").post(verifyJWT, toggleTweetLike,);
router.route("/liked-videos").get(verifyJWT, getLikedVideos);
 
export default router