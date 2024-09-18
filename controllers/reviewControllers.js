const Product = require("../models/productModel");
const Review = require("../models/reviewModel");

const newReview = async (req, res, next) => {
    try {
        let imageUrls;
        const reviewData = req.body;
        const isAlreadyReviewed = await Review.findOne({
            userId: reviewData.userId,
            productId: reviewData.productId,
        });
        if (isAlreadyReviewed) {
            return res.status(409).json({ message: "product already exist" });
        }

        if (req.files) {
            imageUrls = await Promise.all(
                req.files.map(
                    async (file) => await handleImageUpload(file.path)
                )
            );
        }
        const newReview = new Review({
            ...reviewData,
            ...(imageUrls && { images: imageUrls }),
        });
        await newReview.save();

        await Product.findByIdAndUpdate(newReview.productId, {
            $push: { reviews: newReview._id },
        });
        res.status(200).json(newReview);
        req.files.forEach((file) => deleteFile(file.path));
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const editReview = async (req, res, next) => {
    try {
        let imageUrls;
        const editedReviewData = req.body;
        const isReviewed = await Review.findById(req.params.reviewId);
        if (!isReviewed)
            return res.status(404).json({ message: "review not exist" });

        if (req.files) {
            imageUrls = await Promise.all(
                req.files.map(
                    async (file) => await handleImageUpload(file.path)
                )
            );
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
        req.files.forEach((file) => deleteFile(file.path));
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const viewReview = async (req, res, next) => {
    try {
        const review = await Review.findOne({ _id: req.id });
        if (!review) {
            return res.status(404).json({ message: "review not exist" });
        }

        res.status(200).json(review);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const removeReview = async (req, res, next) => {
    try {
        const review = await Review.findOne(req.params.reviewid);
        await Review.findByIdAndDelete(review._id);
        await Product.findByIdAndUpdate(review.productId, {
            $pull: { reviews: review._id },
        });

        res.status(200).json({ message: "review deleted" });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
module.exports = {
    newReview,
    editReview,
    viewReview,
    removeReview,
};
