import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const user = req.user._id
    if(!name && !description){
        throw new ApiError(400, "Name and description is required!")
    }

    const createdPlaylist = await Playlist.create(
        {
            name,
            description,
            owner : user
        }
    )

    if(!createdPlaylist){
        throw new ApiError(500, "couldn't create playlist.")
    }

    res.status(200).json(new ApiResponse(200, createdPlaylist, "Playlist created successfully!"))

    //TODO: create playlist
})

const getUserPlaylistsVideos = asyncHandler(async (req, res) => {
    const {userId} = req.params
    
    console.log(req.params)
    if(!userId || !isValidObjectId(userId)){
        throw new ApiError(400, "Invalid userId")
    }

    const pipeline = [
        { $match: { owner: userId } }, // Match playlists where owner is the user
        {
            $lookup: {
                from: "videos", // Join with the "videos" collection
                localField: "videos", // Field in Playlist that references Video IDs
                foreignField: "_id", // Field in Video documents that matches localField
                as: "videos" // Output field containing video details
            }
        },
        {
            $addFields: {
                // Sort videos to get the first added video
                sortedVideos: { $slice: ["$videos", 1] }
            }
        },
        {
            $addFields: {
                // Extract thumbnail from the first video
                thumbnail: { $arrayElemAt: ["$sortedVideos.thumbnail", 0] }
            }
        },
        {
            $addFields: {
                videoCount: { $size: "$videos" } // Add videoCount field
            }
        },
        { $project: { videos: 0, sortedVideos: 0 } } // Clean up the result
    ];

    const userPlaylists = await Playlist.aggregate(pipeline).exec();

    /* if (!userPlaylists.length) {
        return res.status(404).json(new ApiResponse(404, null, "No playlists found for this user"));
    }  */

    res.status(200).json(new ApiResponse(200, userPlaylists, "Playlists retrieved successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    if (!userId || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId");
    }

    const pipeline = [
        { $match: { owner: new mongoose.Types.ObjectId(userId) } }, // Match playlists where owner is the user
        { $project: { name: 1, description: 1 } } // Project only name and description for debugging
    ];

    const userPlaylists = await Playlist.aggregate(pipeline).exec();

    if (!userPlaylists.length) {
        return res.status(404).json(new ApiResponse(404, [], "No playlists found for this user"));
    }

    res.status(200).json(new ApiResponse(200, userPlaylists, "Playlists retrieved successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if(!playlistId || !isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid Playlist Id")
    }

    const playlist = await Playlist.findById(playlistId)

    res.status(200).json(new ApiResponse(200, playlist, "Playlist successfully fetched."))
    //TODO: get playlist by id 
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!playlistId || !mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video is already in the playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist successfully"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!playlistId || !mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    if (!videoId || !mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video not found in the playlist");
    }

    playlist.videos = playlist.videos.filter(video => !video.equals(videoId));
    await playlist.save();

    res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist successfully"));
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId || isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist ID")
    }

    await Playlist.findByIdAndDelete(playlistId)

    res.status(200).json(new ApiResponse(200, null, "Playlist deleted successfully"));
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if(!playlistId || isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist ID")
    }

    if(!name && !description){
        throw new ApiError(400, "Name and description is required!")
    }
    
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $set : {
            name,
            description
        }
    }, {new : true})

    if(!updatedPlaylist){
        throw new ApiError(500, "Could not update playlist")
    }

    res.status(200).json(200, updatePlaylist, "Playlist updated!")
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylistsVideos,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}