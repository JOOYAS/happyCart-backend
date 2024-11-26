const express = require("express");
const {
    newProduct,
    viewProduct,
    removeProduct,
    updateProduct,
    listAllProduct,
} = require("../../../controllers/productControllers");
const upload = require("../../../middlewares/multer");
const adminAuth = require("../../../middlewares/adminAuth");
const validateObjectId = require("../../../middlewares/validateObjectId");
const sellerAuth = require("../../../middlewares/sellerAuth");

const router = express.Router();
router.get("/", adminAuth, listAllProduct);

router.post("/", sellerAuth, upload.array("images"), newProduct);
router.get("/:productId", validateObjectId, viewProduct);
router.patch(
    "/:productId",
    validateObjectId,
    upload.array("images"),
    updateProduct
);
router.delete("/:productId", validateObjectId, removeProduct);

module.exports = { productRoutes: router };
