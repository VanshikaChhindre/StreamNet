import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadToCloudinary} from "../utils/cloudinary.js"

const createTweet = asyncHandler(async (req, res) => {
    //Tested OK
    const {content} = req.body
    const photoLocalPath = req.files?.photo ? req.files.photo[0]?.path : null;

    if(!content){
       throw new ApiError(400, "Tweet is required.")
    }  

    if(!photoLocalPath){
        console.log("no Photo found")
    }

    let photo = {};
    if (photoLocalPath) {
        // If there is a photo, upload it to Cloudinary
        const uploadedPhoto = await uploadToCloudinary(photoLocalPath);
        if (uploadedPhoto) {
            photo = {
                url: uploadedPhoto.url,
                public_id: uploadedPhoto.public_id,
            };
        }
    }

    const user = req.user._id;
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const tweet = await Tweet.create({
        content,
        photo, // Assigning the photo object (it will be empty if no photo was uploaded)
        owner: user,
    });

    res.status(200).json( new ApiResponse(200, tweet, "Tweet created successfully!"))
})



const getUserTweets = asyncHandler(async (req, res) => {
    // Tested OK

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


const getAllTweets = asyncHandler(async(req, res)=>{

     // Fetch all tweets and populate the owner details
    const tweets = await Tweet.find()
    .populate('owner', 'fullName username avatar') // Replace with actual fields you want
    .sort({ createdAt: -1 }); // Sort by creation date, most recent first

    // Check if tweets were found
    if (!tweets) {
        throw new ApiError(404, "No tweets Found.")
    }

    return res.status(200).json(new ApiResponse(200, tweets, "All Tweets fetched"));

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
    getAllTweets,
    updateTweet,
    deleteTweet
}