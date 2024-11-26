const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Review = require("../models/reviewModel");
const deleteFile = require("../utils/deleteFile");
const handleImageUpload = require("../utils/imageUpload");

const newReview = async (req, res, next) => {
    try {
        let imageUrls;
        const reviewData = req.body;
        const { rating, comment } = reviewData;
        if (!rating || !comment || !comment.length) {
            return res.status(400).json({ message: "no review data given" });
        }

        const order = await Order.findById(req.params.orderId).select(
            "_id product statusList user"
        );
        if (order.user.toString() !== req.user._id)
            return res.status(400).json({
                message: "You are not permitted to perform this action",
            });
        if (
            order.statusList.length > 0 &&
            order.statusList[order.statusList.length - 1].status !== "delivered"
        ) {
            return res.status(400).json({
                message:
                    "Reviews can only be added after a successful delivery",
            });
        }

        const isAlreadyReviewed = await Review.findOne({
            order: req.params.orderId,
        });
        if (isAlreadyReviewed) {
            return res
                .status(409)
                .json({ message: "this order is already reviewed" });
        }

        if (req.files) {
            console.log(req.files);
            imageUrls = await Promise.all(
                req.files.map(
                    async (file) => await handleImageUpload(file.path)
                )
            );
            req.files.forEach((file) => deleteFile(file.path));
        }

        const newReview = new Review({
            user: req.user._id,
            order: order._id,
            product: order.product,
            ...reviewData,
            ...(imageUrls && { images: imageUrls }),
        });
        await newReview.save();

        res.status(200).json(newReview);
    } catch (error) {
        console.log("new Review : ", error);
        next(error);
    }
};

const editReview = async (req, res, next) => {
    try {
        let imageUrls;
        const editedReviewData = req.body;
        if (!editedReviewData || Object.keys(editedReviewData).length === 0)
            return res
                .status(400)
                .json({ message: "no details given to update" });
        const isReviewed = await Review.findById(req.params.reviewId);
        if (!isReviewed)
            return res.status(404).json({ message: "review doesn't exist" });

        if (req.files) {
            imageUrls = await Promise.all(
                req.files.map(
                    async (file) => await handleImageUpload(file.path)
                )
            );
            req.files.forEach((file) => deleteFile(file.path));
        }
        const updated = await Review.findByIdAndUpdate(
            isReviewed._id,
            {
                ...editedReviewData,
                ...(imageUrls && { images: imageUrls }),
            },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            message: "updated successfully",
            updated,
        });
    } catch (error) {
        console.log("edit Review : ", error);
        next(error);
    }
};

const viewReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review doesn't exist" });
        }

        res.status(200).json(review);
    } catch (error) {
        console.log("View Review : ", error);
        next(error);
    }
};

//for a product
const viewReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ product: req.params.productId });

        if (!reviews || !reviews.length) {
            return res.status(404).json({ message: "No reviews" });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.log("view revieews of a product : ", error);
        next(error);
    }
};

//
const removeReview = async (req, res, next) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.reviewId);
        if (!review)
            return res.status(400).json({ message: "no review to delete" });

        res.status(200).json({ success: true, message: "review deleted" });
    } catch (error) {
        console.log("delete Review : ", error);
        next(error);
    }
};
module.exports = {
    newReview,
    editReview,
    viewReview,
    viewReviews,
    removeReview,
};
