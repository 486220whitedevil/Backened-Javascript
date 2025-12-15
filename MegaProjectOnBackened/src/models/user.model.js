import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        trim: true,
        index: true,

    },
    avatar: {
        type: String, // cloudinary url
        required: true

    },
    coverImage: {
        type: String // cloudinary url

    },
    watchhistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    },

},{timeseries: true})


export const User = mongoose.model("User" , userSchema)