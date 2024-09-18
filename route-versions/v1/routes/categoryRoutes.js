const express = require("express");
const { subCategoryRoutes } = require("./subCategoryRoutes");
const {
    newCategory,
    viewCategory,
    updateCategory,
    removeCategory,
    listCategories,
} = require("../../../controllers/categoryControllers");
const upload = require("../../../middlewares/multer");

const router = express.Router();

//routes for subcategories
router.use("/sub", subCategoryRoutes);

router.post("/", upload.single("image"), newCategory);
router.get("/", listCategories);
router.get("/:categoryId", viewCategory);
router.patch("/:categoryId", upload.single("image"), updateCategory);
router.delete("/:categoryId", removeCategory);

module.exports = { categoryRoutes: router };
