import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { deleteVideo, getVideoById, publishAVideo, updateVideo, getAllVideos } from "../controllers/video.controller.js";

const router = Router()


router.route("/uploadvideo").post(
    verifyJWT,
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

router.route("/allvideos").get(getAllVideos)
router.route("/getvideo/:videoId").get(getVideoById)
router.route("/update/:videoId").patch(verifyJWT, upload.single("thumbnail"), updateVideo)
router.route("/delete/:videoId").delete(verifyJWT, deleteVideo)

export default router