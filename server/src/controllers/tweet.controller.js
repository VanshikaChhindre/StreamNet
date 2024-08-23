import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if(!content){
       throw new ApiError(400, "Tweet is required.")
    }

    const user = req.user._id
    if(!user){
        throw new ApiError(404, "user not found")
    }

    const tweet = await Tweet.create(
        {
            content,
            owner: user
        
        }
    )

    res.status(200).json( new ApiResponse(200, tweet, "Tweet created successfully!"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const userID = req.params.userID ? req.params.userID : req.user._id

    if(!userID){
       throw new ApiError(400, "User not found")
    }

    const tweets = await Tweet.find({ owner: userID}).sort({createdAt: -1})

    if(!tweets.length){
        throw new ApiError(404, "No tweets found for this user")
    }

    res.status(200).json(new ApiResponse(200, tweets, "Tweets fetched"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {content} = req.body
    const {tweetID} = req.params

    if(!tweetID){
        throw new ApiError(400, "Tweet is required!")
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetID, 
        {
            $set:{
                content
            }
        },  {new: true}
    )

    res.status(200).json( new ApiResponse(200, updatedTweet, "Tweet updated"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetID} = req.params
    if(!tweetID){
        throw new ApiError(400, "Tweet id not found")
    }

    if (!content) {
        throw new ApiError(400, "Content is required to update the tweet.");
    }

    const response = await Tweet.findByIdAndDelete(tweetID)

    res.status(200).json( new ApiResponse(200, response, "Tweet deleted successfully!"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}