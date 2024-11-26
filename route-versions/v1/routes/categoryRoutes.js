const express = require("express");
//{ subCategoryRoutes } = require("./subCategoryRoutes");

const {
    newCategory,
    viewCategory,
    updateCategory,
    removeCategory,
    listCategories,
} = require("../../../controllers/categoryControllers");
const upload = require("../../../middlewares/multer");
const adminAuth = require("../../../middlewares/adminAuth");
const validateObjectId = require("../../../middlewares/validateObjectId");

const router = express.Router();

//routes for subcategories
//router.use("/sub", subCategoryRoutes);

router.post("/", adminAuth, upload.single("image"), newCategory);
router.get("/", listCategories);
router.get("/:categoryId", validateObjectId, viewCategory);
router.patch(
    "/:categoryId",
    validateObjectId,
    adminAuth,
    upload.single("image"),
    updateCategory
);
router.delete("/:categoryId", validateObjectId, adminAuth, removeCategory);

module.exports = { categoryRoutes: router };
