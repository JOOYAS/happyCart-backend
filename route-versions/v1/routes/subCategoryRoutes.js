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

const router = express.Router();

router.post("/", upload.single("image"), newSubCategory);
router.get("/", listSubCategories);
router.get("/:subCategoryId", viewSubCategory);
router.patch("/:subCategoryId", upload.single("image"), updateSubCategory);
router.delete("/:subCategoryId", removeSubCategory);

module.exports = { subCategoryRoutes: router };
