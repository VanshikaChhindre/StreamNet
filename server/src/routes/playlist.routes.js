import { Router } from "express";
import { 
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import {upload} from "../middleware/multer.middleware.js"

const router = Router()


router.route("/create-playlist").post(verifyJWT, createPlaylist);
router.route("/user-playlists/:userId").get(verifyJWT, getUserPlaylists);
router.route("/playlist/:playlistId").get(verifyJWT, getPlaylistById);
router.route("/add-video-to-playlist/:playlistId/:videoId").post(verifyJWT, addVideoToPlaylist);
router.route("/remove-video-from-playlist/:playlistId/:videoId").post(verifyJWT, removeVideoFromPlaylist);
router.route("/delete-playlist").delete(verifyJWT, deletePlaylist);
router.route("/update-playlist-details").post(verifyJWT, updatePlaylist);
 
export default router