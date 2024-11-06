import { Router } from "express";
import { 
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js"

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()


router.route("/video-comments/:videoId").get(getVideoComments);
router.route("/add-comment").post(verifyJWT, addComment);
router.route("/update-comment").post(verifyJWT, updateComment);
router.route("delete-comment").delete(verifyJWT, deleteComment);
 
export default router