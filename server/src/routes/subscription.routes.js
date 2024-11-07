import { Router } from "express";
import { 
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js"

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()


router.route("/toggle-subscription/:channelId").post(verifyJWT, toggleSubscription);
router.route("/channel-subscribers/:channelId").get(verifyJWT, getUserChannelSubscribers);
router.route("/subscribed-channels/:channelId").get(verifyJWT, getSubscribedChannels)

 
export default router