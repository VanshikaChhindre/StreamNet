
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getVideoMetadata, uploadToCloudinary } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";
import { cloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    //ok tested
    const { page = 1, limit = 10, search, sortBy = "createdAt", sortType = "desc", ownerId} = req.query;

    const query = { isPublished: false };
    
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }
    
    if (ownerId) {
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            throw new ApiError(400, 'Invalid owner ID format');
        }
        query.owner = mongoose.Types.ObjectId(ownerId);
    }
    
    const pipeline = [
        { $match: query },
        {
            $lookup: {
                from: 'users', // The collection name for users
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        },
        {
            $unwind: {
                path: '$ownerDetails',
            }
        },
        
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                isPublished: 1,
                owner: {
                    _id: '$ownerDetails._id',
                    avatar: '$ownerDetails.avatar',
                    username: '$ownerDetails.username',
                },
                createdAt: 1,
                updatedAt: 1
            }
        }
    ];

    if (sortBy) {
        const sort = { [sortBy]: sortType === 'desc' ? -1 : 1 };
        pipeline.push({ $sort: sort });
    }

    const aggregateFn = Video.aggregate(pipeline);

    const options = {
        page: Number(page),
        limit: Number(limit),
    };

    try {
        const videos = await Video.aggregatePaginate(aggregateFn, options);

        return res.status(200).json(
            new ApiResponse(200, videos, 'Unpublished videos fetched successfully!')
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

const getUserVideos = asyncHandler(async(req, res)=>{
    const { userId } = req.params;
  const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query;

  // Validate userId
  if (!userId || !isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid or missing user ID" });
  }

    const query = { owner: userId };

    // Sorting logic
    const sort = { [sortBy]: sortType === "desc" ? -1 : 1 };

    // Get the paginated videos using skip and limit
    const videos = await Video.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('owner', 'username _id avatar');

      if(!videos){
        throw new ApiError(500, "Could not fetch videos")
      }

    // Return the result directly
    return res.status(200).json(new ApiResponse(200, videos, "user videos fetched"));
  
});


const publishAVideo = asyncHandler(async (req, res) => {
   
    //test ok!
    const { title, description } = req.body
    const userId = req.user._id
   
    if(!title){
        throw new ApiError(400, "title and description are required.")
    }
    if(!description){
        throw new ApiError(400, "desc req")
    }
   
     const videoFileLocalPath = req.files?.videoFile[0]?.path;
    if(!videoFileLocalPath){
        throw new ApiError(404, "Video not found.")
    } 

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
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
  
    const createdVideo = await Video.create({
        title,
        description,
        videoFile: {url:videoFile.url,  public_id:videoFile.public_id},
        duration,
        thumbnail: {url:thumbnail.url,  public_id:thumbnail.public_id},
        owner: userId,
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
   
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId)
    .populate({
        path: 'owner', // Assuming 'owner' is the reference field
        select: '_id avatar username email', // Select only the fields you need
    });

    if(!video){
        throw new ApiError(404,"video not found")
    }

    console.log("Video fetched successfully!")

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"))

    /* console.log("video id", video.url)

    const videoUrl = cloudinary.url(video.public_id, {
        resource_type: "video",
        format: "mp4",
        transformation: [{ streaming_profile: "full_hd" }],
      });

    console.log("Video fetched successfully!")
    console.log("genetrated video url", videoUrl)
 
    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"))*/
    
  //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    //tested ok
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(404, "Video not found in url")
    }
    
    const { title, description } = req.body
    const updatedData = {};

    if(title){
        updatedData.title = title;
    }

    if(description){
        updatedData.description = description;
    }

    if(req.file){
        const thumbnailLocalPath  = req.file?.path 

        if(!thumbnailLocalPath){
            throw new ApiError(400, "Thumbnail file not found")
        }

        const thumbnail = await uploadToCloudinary(thumbnailLocalPath)

        updatedData.thumbnail = {
            url: thumbnail.url,
            public_id: thumbnail.public_id
        }
    } 

   

    const updatedVideo = await Video.findByIdAndUpdate(videoId, 
        {
            $set: updatedData
        }, { new: true }
    )
    
    updateVideo? console.log("Video updated") : console.log("Video update failed")

    return res
    .status(200)
    .json( new ApiResponse(200, updatedVideo, "Video updated"))
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    //tested ok!
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

    if(!videoId){
        throw new ApiError(400, "Video id not found.")
    }

    const { isPublished } = req.body

    const publishedVideo = await Video.findByIdAndUpdate(videoId, 
        { $set: {isPublished : isPublished} },
    {new : true})

    if(publishedVideo) console.log("Video published")

    return res
    .status(200)
    .json( new ApiResponse(200, publishedVideo, "Video published successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getUserVideos
}