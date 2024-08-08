import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { publishAVideo } from "../controllers/video.controller.js";

const router = Router()

router.route("/uploadvideo").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        }, 
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
)

export default router