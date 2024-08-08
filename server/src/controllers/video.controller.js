import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getVideoMetadata, uploadToCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if(!title && !description){
        throw new ApiError(400, "title and description are required.")
    }
    console.log(req.files)
     const videoFileLocalPath = req.files?.videoFile[0]?.path;
     console.log(videoFileLocalPath)
    if(!videoFileLocalPath){
        throw new ApiError(404, "Video not found.")
    } 

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    console.log(thumbnailLocalPath)
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required!")
    }


    const videoFile = await uploadToCloudinary(videoFileLocalPath)
   const thumbnail = await uploadToCloudinary(thumbnailLocalPath) 

    if(!videoFile){
        throw new ApiError(400, "Video is required!")
    }
     if(!thumbnail){
        throw new ApiError(400, "thumbnail is required.")
    } 
    const publicId = videoFile.public_id
    console.log(publicId)
   const duration = await getVideoMetadata(publicId) 
  
    const createdVideo = Video.create({
        title,
        description,
        videoFile: {url:videoFile.url,  public_id:videoFile.public_id},
        duration,
        thumbnail: {url:thumbnail.url,  public_id:thumbnail.public_id},
    }) 

    if(createdVideo){
        console.log("Video created successfully")
    }
    return res.status(201).json(
        new ApiResponse(200, createdVideo, "Video created succesfully" )
    )
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}