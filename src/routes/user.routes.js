import { upload } from "../middleware/multer.middleware"
import { Router } from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller"
import { verifyJWT } from "../middleware/auth.middleware"

const router = Router()

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]),
   registerUser
)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)

export default router