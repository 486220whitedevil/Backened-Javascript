import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"

import { ApiResponse } from "../utils/ApiResponse.js"




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
  console.log("email: ", email);

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

// export {registerUser}