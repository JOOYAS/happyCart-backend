const express = require("express");
const {
    newProduct,
    viewProduct,
    removeProduct,
    updateProduct,
} = require("../../../controllers/productControllers");
const upload = require("../../../middlewares/multer");

const router = express.Router();

router.post("/", upload.array("images"), newProduct);
router.get("/:productId", viewProduct);
router.patch("/:productId", upload.array("images"), updateProduct);
router.delete("/:productId", removeProduct);

module.exports = { productRoutes: router };
