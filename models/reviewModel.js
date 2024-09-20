const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
        images: [String],
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
