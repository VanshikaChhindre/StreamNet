import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const user = req.user._id

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID.");
    }

    if(!likedBy){
        throw new ApiError(400, "User not found.")
    }

    const existingLike = await Like.findOne({video : videoId, likedBy : user})

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        res.status(200).json( new ApiResponse(200, null, "Like removed successfully!"))
    } else {
        const newLike = await Like.create({
            video: videoId,
            likedBy: user
        });
        res.status(200).json(new ApiResponse(200, newLike, "Like added successfully"));
    }
    //TODO: toggle like on video
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const user = req.user._id

    if(!commentId){
        throw new ApiError(400, "Video url not found.")
    }

    if(!likedBy){
        throw new ApiError(400, "User not found.")
    }

    const existingLike = await Like.findOne({comment : commentId, likedBy : user})

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        res.status(200).json( new ApiResponse(200, null, "Like removed successfully!"))
    } else {
        const newLike = await Like.create({
            comment : commentId,
            likedBy: user
        });
        res.status(200).json(new ApiResponse(200, newLike, "Like added successfully"));
    }
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const user = req.user._id

    if(!tweetId){
        throw new ApiError(400, "Video url not found.")
    }

    if(!likedBy){
        throw new ApiError(400, "User not found.")
    }

    const existingLike = await Like.findOne({tweet : tweetId, likedBy : user})

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        res.status(200).json( new ApiResponse(200, null, "Like removed successfully!"))
    } else {
        const newLike = await Like.create({
            tweet : tweetId,
            likedBy: user
        });
        res.status(200).json(new ApiResponse(200, newLike, "Like added successfully"));
    }
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    
        const userId = req.user._id;
    
        if (!userId) {
            throw new ApiError(400, "User ID is required");
        }
    
        
        const likedVids = await Like.find({ likedBy: userId })
            .populate('video') 
            .exec();
    
      
        const likedVideos = likedVids.map(like => like.video);
    
        res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos retrieved successfully"));
  
    
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}