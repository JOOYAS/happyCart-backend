const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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