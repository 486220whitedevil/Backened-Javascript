// This middleware will check whether user is present or not

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";

import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {

        // there is a bug which has to be fixed -> accessToken where it exist
        const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized Request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if (!user) {
            // NEXT_VIDEO: discuss about frontened
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user
        
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})