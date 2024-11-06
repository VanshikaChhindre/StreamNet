import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    console.log(videoId)
    const {page = 1, limit = 10} = req.query
    if (!videoId) {
        throw new ApiError(400, "VideoId is required!");
    }

    // Set up the aggregation pipeline to fetch comments
    const pipeline = [
        { $match: { video: videoId } },  // Match comments for the specific videoId
        { $sort: { createdAt: -1 } }     // Sort comments by newest first
    ];

    // Pagination options
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    try {
        const result = await Comment.aggregatePaginate(Comment.aggregate(pipeline), options);
        console.log(result)

        // Send the response in the required format using ApiResponse
        res.status(200).json(
            new ApiResponse(
                200,
                result.docs,  // Paginated comments
                "Comments retrieved successfully!",
                {
                    totalComments: result.totalDocs, // Total comment count
                    currentPage: result.page,         // Current page
                    totalPages: result.totalPages     // Total pages
                }
            )
        );
    } catch (error) {
        throw new ApiError(500, "Error retrieving comments");
    }

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { content } = req.body
    const videoId = req.params.videoId || req.body.videoId;
    
    const owner = req.user._id

    if(!videoId){
        throw new ApiError(400, "VideoId not found!")
    }
    
    if(!content){
        throw new ApiError(400, "Comment is required!")
    }

    const createdComment = await Comment.create({
        content,
        owner,
        video : videoId
    })

    const populatedComment = await Comment.findById(createdComment._id).populate({
        path: 'owner',
        select: '_id username avatar'  // Only fetch username and avatar
    });

    res.status(200).json( new ApiResponse(200, populatedComment, "Comment created successfully!"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { updatedContent } = req.body

    if(!commentId){
        throw new ApiError(400, "Comment id not found")
    }

    if(!updatedContent){
        throw new ApiError(400, "Updated content is required!")
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        $set: {
            content : updatedContent   
        }
    }, { new: true })

    if(!updatedComment){
        throw new ApiError(400, "Comment not found!")
    }

    res.status(200).json( new ApiResponse(200, updatedComment, "Comment updated successfully!"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params
    if(!commentId){
        throw new ApiError(400, "Comment id not found")
    }

    const response = await Comment.findByIdAndDelete(commentId)

    res.status(200).json(new ApiResponse(200, response, "Comment deleted successfully!"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }