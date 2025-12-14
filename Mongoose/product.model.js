import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description: {
        required: true, 
        type: String,
    },
    name: {
        required: true, 
        type: String
    },

    productImage: {
        type: String,

    }, 
    price: {
        type: Number,
        default: 0
    },
    stock: {
        default: 0,
        type: Number
    },
    catagory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "catagory",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

export const product = mongoose.model("product", productSchema)