const express = require("express");
const {
    newReview,
    viewReview,
    editReview,
    removeReview,
} = require("../../../controllers/reviewControllers");

const router = express.Router();

router.post("/", newReview);
router.get("/:reviewId", viewReview);
router.patch("/:reviewId", editReview);
router.delete("/:reviewId", removeReview);

module.exports = { reviewRoutes: router };
