import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    console.log(req.params)
    const user = req.user._id

    if(!channelId || !isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel")
    }

    const existingSubscriber = await Subscription.findOne({subscriber : user, channel : channelId})

    if(existingSubscriber){
        await Subscription.findByIdAndDelete(existingSubscriber._id)
        res.status(200).json( new ApiResponse(200, null, "Unsubscribed successfully!"))
    } else {
        const subscribed = await Subscription.create({
            subscriber : user,
            channel : channelId
        })
        res.status(200).json(new ApiResponse(200, subscribed, "Subscribed successfully"));
    }
    // TODO: toggle subscription
})

const checkIfUserIsSubscribed = asyncHandler(async(req, res) => {
    console.log(req.params)
    const {channelId} = req.params;
    const userId = req.user._id;
    console.log(req.user._id
    )

    if(!channelId || !isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }

    if(!userId || !isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }

    const result = await Subscription.findOne({subscriber : userId, channel : channelId});
    console.log("result", result)
    res.status(200).json(new ApiResponse(200, {isSubscribed : !!result}, "subscription data fetched"))
})
// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    
    const {channelId} = req.params


    if(!channelId || !isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }

    const pipeline = [
        {$match : {channel : channelId}},

        {
            $lookup : {
                from : "users",
                localField : "subscriber",
                foreignField : "_id",
                as : "subscriberDetails"
            }
        },

        {
            $unwind : "$subscriberDetails"
        },
        {
            $project : {
                _id : 0,
                subscriberId: "$subscriberDetails._id", 
                username: "$subscriberDetails.username", 
                avatar: "$subscriberDetails.avatar" 
            }
        }

    ]

    const subscriberList = await Subscription.aggregate(pipeline)
   
    if(!subscriberList){
        throw new ApiError(500, "Could not fetch subscribers!")
    }
    

    res.status(200).json(200, subscriberList, "Subscribers fetched successfully!")
    
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId || isValidObjectId( subscriberId)){
        throw new ApiError(400, "Invalid subscriber id")
    }

    const pipeline = [
        {$match : {subscriberId :  mongoose.Types.ObjectId(subscriberId) }},

        {
            $lookup : {
                from : "users",
                localField : "channel",
                foreignField : "_id",
                as : "channelDetails"
            }
        },

        {
            $unwind : "$channelDetails"
        },
        {
            $project : {
                _id : 0,
                channelId: "$channelDetails._id", 
                username: "$channelDetails.username", 
                avatar: "$channelDetails.avatar" 
            }
        }

    ]

    const channelList = await Subscription.aggregate(pipeline)
   
    if(!channelList){
        throw new ApiError(500, "Could not fetch channels!")
    }
    

    res.status(200).json(200, channelList, "Channels fetched successfully!")
    
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    checkIfUserIsSubscribed
}