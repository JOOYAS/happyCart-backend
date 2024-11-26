const express = require("express");
const {
    newReview,
    viewReview,
    editReview,
    removeReview,
    viewReviews,
} = require("../../../controllers/reviewControllers");
const upload = require("../../../middlewares/multer");
const validateObjectId = require("../../../middlewares/validateObjectId");
const userAuth = require("../../../middlewares/userAuth");

const router = express.Router();

router.post("/order/:orderId", userAuth, upload.array("images"), newReview);
router.get("/:reviewId", validateObjectId, viewReview);
router.get("/product/:productId", validateObjectId, viewReviews);

router.patch(
    "/:reviewId",
    validateObjectId,
    upload.array("images"),
    editReview
);
router.delete("/:reviewId", validateObjectId, removeReview);

module.exports = { reviewRoutes: router };
