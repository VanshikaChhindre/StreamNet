import { User } from '../models/user.model'
import {uploadToCloudinary} from '../utils/cloudinary'
import {asyncHandler} from '../utils/asyncHandler'
import {ApiError} from '../utils/ApiErrors'
import {ApiResponse} from '../utils/ApiResponse'
import { trusted } from 'mongoose'

const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = User.generateAccessToken()
        const refreshToken = User.generateRefreshToken()

        user.refreshToken = refreshToken
        await User.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, error.message || "Token generation failed")
    }
}

const registerUser = asyncHandler(
    async(req, res) =>{
        const {fullName, username, email, password} = req.body
        if([fullName, username, email, password].some((field)=> field?.trim()==="")){
            throw new ApiError(400, "All fields are required!")
        }
        const existedUser = await User.findOne({
            $or: [{username}, {email}]
        })
        if(existedUser){
            throw new ApiError(409, "User already exists!")
        }

        const avatarLocalPath = req.files?.avatar[0].path;
        
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
            let coverImageLocalPath;
            coverImageLocalPath = req.files.coverImage[0].path
        }

        if(!avatarLocalPath){
            throw new ApiError(400, "avatar is required.")
        }

        const avatar = await uploadToCloudinary(avatarLocalPath)
        const coverImage = await uploadToCloudinary(coverLocalPath)

        if(!avatar){
            throw new ApiError(400, "Avatar image is required.")
        }

        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url,
            username : username.toLowerCase(),
            email,
            password
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
        
        if(!createdUser){
            throw new ApiError(500, "User registration failed.")
        }

        return res
        .status(200)
        .json(new ApiResponse(200, user, "Registration successfull"))
} )

const loginUser = asyncHandler(async(req, res)=>{
    //req body -> user
    //email or username validation
    //find the user in database
    //password check
    //access and refresh token
    //send cookies

    const { username, email, password} = req.body

    if(!(username || email)){
        throw new ApiError(400, "username or email is required.")
    }

    const userExists = await User.findOne({
        $or : [{username}, {email}]
    })

    if(!userExists){
        throw new ApiError(400, "User does not exists.")
    }

    const isPasswordValid = await userExists.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400, "Invalid credentials!")
    }

    const {accessToken, refreshToken} = generateAccessAndRefreshToken(userExists._id)
    const loggedInUser = await User.findById(userExists._id).select("-password -refreshToken")

    //cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json( new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User logged in successfully"))

})

const logoutUser = asyncHandler(async(req, res)=>{
        await User.findByIdAndUpdate(req.user._id, 
            {
                $set: { refreshToken: undefined}
            },
            {new: true}
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res 
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json( new ApiResponse(200, {}, "User logged out"))
})

const refreshAccesToken = asyncHandler(async(req, res) => {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingToken){
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken._id)
        if(!user){
            throw new ApiError(401, "Invalid refresh token!")
        }
    
        if(incomingToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh Token is expired or used.")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, refreshToken} = generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: refreshToken},
                "Access token refreshed."
            )
        )
    } catch (error) {
        console.log(error.message)
        throw error
        
    }
})

const updateCurrentPassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user._id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if(!isPasswordValid){
        throw new ApiError(400, "Invalid old password!")
    }

    user.password = newPassword

    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "password changed")
    )
})

const getCurrentUser = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(200, req.user, "current user fetched.")
})

const updateAccountDetails = asyncHandler(async(req, res)=>{
    const {username, fullName, email} = req.body

    if(!email || !fullName || !username){
        throw new ApiError(400, "Fields are required!")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set : {
            fullName: fullName,
            email: email,
            username: username
        }
    }, 
    { new: true}).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "account details updated successfully")
        )
})

const updateUserAvatar = asyncHandler(async(req, res) =>{
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar missing.")
    }

    const avatar = await uploadToCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(400, "error while uploading!")
    }

    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(400, "couldnt find user")
    }
    
    if (user.avatar?.public_id) {
        await deleteFromCloudinary(user.avatar.public_id);
    } 

    user.avatar = { url: avatar.url, public_id: avatar.public_id };
    await user.save({validateBeforeSave: false}); 


    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar Image updated.")
    )
})

const updateUserCoverImage = asyncHandler(async(req, res) =>{
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover image is missing.")
    }

    const coverImage = await uploadToCloudinary(avatarLocalPath)
    if(!coverImage.url){
        throw new ApiError(400, "error while uploading!")
    }

    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(400, "couldnt find user")
    }
    
    if (user.coverImage?.public_id) {
        await deleteFromCloudinary(user.coverImage.public_id);
    } 

    user.avatar = { url: coverImage.url, public_id: coverImage.public_id };
    await user.save({validateBeforeSave: false}); 


    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover Image updated.")
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccesToken
}