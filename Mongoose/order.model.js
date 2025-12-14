import mongoose from "mongoose";

const orderItemsSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    }
})

const orderSchema = new mongoose.Schema({
    orderPrice: {
        required: true, 
        type: Number,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
   orderItems: {
    type: [orderItemsSchema]
   },
   address: {
    type: String,
    required: true
   },
   status: {
    type: String,
    enum: ["PENDING", "CANCELLED", "DELIVERED"],
    default: "PENDING"
   }
}, {timestamps: true})

export const Order  = mongoose.model("Order", orderSchema)