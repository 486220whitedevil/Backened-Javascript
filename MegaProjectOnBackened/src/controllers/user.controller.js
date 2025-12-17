import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/ApiResponse.js"


// This method will be used for generating the access and refresh token also it save refreshtoken in db


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    
    const AccessToken = user.generateAccessToken()

    const RefreshToken = user.generateRefreshToken()

    user.RefreshToken = RefreshToken
    
    await user.save({ validateBeforeSave: false })

    return { AccessToken, RefreshToken }
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating Access and Refresh token")
  }
}



export const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontened
  // user validation-not empty
  // check if user already exists: usernam , email
  // check for images , check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation 
  // return response 

  const { fullname, email, username, password } = req.body

  if ([fullname, email, username, password].some((field) =>
    field?.trim() === "")) {
    throw new ApiError(400, "All feilds are required")
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar || !avatar.url) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  console.log(avatar)

  if (!avatar) {
    throw new ApiError(400, " Avatar files are required ")
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")

  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully")
  )


})

export const loginUser = asyncHandler(async (req, res) => {

  // req body -> data 
  // username or email
  // find the user 
  // password check
  // access and refresh toke 
  // send cookie


  const { email, username, password } = req.body
  if (!(username || email)) {
    throw new ApiError(400, "Username or Email is required")
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(404, "Invalid User Credential")
  }

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("AccessToken", AccessToken, options)
    .cookie("RefreshToken", RefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, AccessToken, RefreshToken
        },
        "User LoggedIn Successfully"

      )
    )

})

export const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        RefreshToken: undefined
      }

    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.
    status(200)
    .clearCookie("AccessToken", options)
    .clearCookie("RefreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))
})


export const refreshAccessToken = asyncHandler ( async (req, res ) => {
  const incomingRefreshToken = req.cookies.RefreshToken || req.body.RefreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken?._id)
  
    if(!user){
      throw new ApiError(401, "Invalid refresh token")
    }
  
    if(incomingRefreshToken !== user?.RefreshToken){
      throw new ApiError(401, "Refresh token is expired or used")
    }
  
    const options = {
      httpOnly: true,
      secure: true
    }
  
    const {AccessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
  
    return res
    .status(200)
    .cookie("AccessToken", AccessToken, options)
    .cookie("RefreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          AccessToken, RefreshToken: newRefreshToken
        },
        "Access token refreshed"
      )
    )
  } catch (error) {
    throw new ApiError(401, "error?.message" || "Invalid Refresh Token")
  }

})


export const changeCurrentPassword = asyncHandler ( async (req, res ) => {
  const {oldPassword, newPassword} = req.body

  const user = await User.findById(req.user?._id)

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect){
    throw new ApiError(400, "Incorrect old password ")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .json(new ApiResponse(
    200, {}, "Password changed Successfully"
  ))
})

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200)
  .json(200, req.user, "Current user fetched Successfully")
})

export const updateAccountDetails = asyncHandler (async (req, res ) => {
  const {fullname, email} = req.body

  if(!fullname || !email){
    throw new ApiError(400, "All feilds are required")
  }

 const user = await User.findByIdAndUpdate(req.user?._id, {$set:{
  fullname, email
 }}, {new: true}).select("-password ")

 return res
 .status(200)
 .json(new ApiResponse(200, user, "Account details updated successfully"))

})

export const updateUserAvatar = asyncHandler (async(req, res ) => {
  const avatarLocalPath = req.file?.path

  if(avatarLocalPath){
    throw new ApiError(400, "Avatar file is missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if(!avatar.url){
    throw new ApiError(400, "Error while uploading on avatar")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id, { $set: { avatar: avatar.url}} , {new: true}
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200, user, "AvatarImage is updated successfully"))
})
export const updateUserCoverImage = asyncHandler (async(req, res ) => {
  const coverImageLocalPath = req.file?.path

  if(coverImageLocalPath){
    throw new ApiError(400, "coverImage file is missing")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!coverImage.url){
    throw new ApiError(400, "Error while uploading on coverImage")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id, { $set: { coverImage: coverImage.url}} , {new: true}
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200, user, "CoverImage is updated successfully"))
})
// export {registerUser}