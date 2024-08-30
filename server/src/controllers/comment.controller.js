import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body
    const owner = req.user._id

    if(!videoId){
        throw new ApiError(400, "VideoId not found!")
    }
    
    if(!content){
        throw new ApiError(400, "Comment is required!")
    }

    const createdComment = Comment.create({
        content,
        owner,
        video : videoId
    })

    res.status(200).json( new ApiResponse(200, createdComment, "Comment created successfully!"))
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