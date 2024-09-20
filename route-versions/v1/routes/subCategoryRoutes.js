const express = require("express");
const {
    newSubCategory,
    viewSubCategory,
    updateSubCategory,
    removeSubCategory,
    listSubCategories,
} = require("../../../controllers/subCategoryControllers");
const { listCategories } = require("../../../controllers/categoryControllers");
const upload = require("../../../middlewares/multer");
const adminAuth = require("../../../middlewares/adminAuth");

const router = express.Router();

router.post("/", adminAuth,upload.single("image"), newSubCategory);
router.get("/", listSubCategories);
router.get("/:subCategoryId", viewSubCategory);
router.patch("/:subCategoryId", adminAuth,upload.single("image"), updateSubCategory);
router.delete("/:subCategoryId", adminAuth,removeSubCategory);

module.exports = { subCategoryRoutes: router };
