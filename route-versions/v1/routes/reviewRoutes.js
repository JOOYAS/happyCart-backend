const express = require("express");
const {
    newReview,
    viewReview,
    editReview,
    removeReview,
} = require("../../../controllers/reviewControllers");
const upload = require("../../../middlewares/multer");

const router = express.Router();

router.post("/", upload.array("images"), newReview);
router.get("/:reviewId", viewReview);
router.patch("/:reviewId", upload.array("images"), editReview);
router.delete("/:reviewId", removeReview);

module.exports = { reviewRoutes: router };
