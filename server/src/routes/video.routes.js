import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { deleteVideo, getVideoById, publishAVideo, updateVideo } from "../controllers/video.controller.js";

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

router.route("/getvideo/:videoId").get(getVideoById)
router.route("/update/:videoId").patch(upload.single("thumbnail"), updateVideo)
router.route("/delete/:videoId").delete(deleteVideo)

export default router