import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getVideoMetadata, uploadToCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, sortBy, sortType, userId } = req.query

    const query = {};
    if(search){
        query.title = { $regex : search, $options : 'i'}
    }
     if(userId){
        query.owner = userId
     }
    const sort = {}
    if(sortBy){
        sort[sortBy] = sortType === 'desc'? -1 : 1;
    } 

    const options = {
        page,
        limit,
        sort
    }

    const aggregateFn = await Video.aggregate([{$match : query}]);
        
    const videos = await Video.aggregatePaginate(aggregateFn, options)

    return res
    .status(200)
    .json(
        new ApiResponse(200, videos, "search videos fetched!")
    )
        
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
    const duration = await getVideoMetadata(publicId) 
  
    const createdVideo = Video.create({
        title,
        description,
        videoFile: {url:videoFile.url,  public_id:videoFile.public_id},
        duration,
        thumbnail: {url:thumbnail.url,  public_id:thumbnail.public_id},
        owner: req.user._id 
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

    if(!videoId){
        throw new ApiError(404, "Video id not found in url")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"video not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"))
    
  //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(404, "Video not found in url")
    }
    
    const { title, description } = req.body

    const thumbnailLocalPath  = req.files?.thumbnail[0].path
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail file not found")
    }

    const thumbnail = await uploadToCloudinary(thumbnailLocalPath)

    const updatedVideo = await Video.findByIdAndUpdate(videoId, 
        {
            $set: {
                thumbnail: {
                    url: thumbnail.url,
                    public_id: thumbnail.public_id,    
                },
                title: title,
                description: description,
            },
        }, { new: true }
    )

    return res
    .status(200)
    .json( new ApiResponse(200, updatedVideo, "Video updated"))
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(404, "Video id not found in url")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    await Video.findByIdAndDelete(videoId)
    return res
    .status(200)
    .json( new ApiResponse(200, {}, "Video deleted successfully"))

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