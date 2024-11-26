const Category = require("../models/categoryModel");
const Review = require("../models/reviewModel");
const deleteFile = require("../utils/deleteFile");
const handleImageUpload = require("../utils/imageUpload");

const newCategory = async (req, res, next) => {
    try {
        let imageUrl;
        const categoryData = req.body;
        const { name, description } = categoryData;
        if (!name || !req.file || !description) {
            return res.status(400).json({
                message:
                    "Please complete all the required information to proceed",
            });
        }
        const isCategoryExist = await Category.findOne({ name: name });
        if (isCategoryExist) {
            return res.status(400).json({
                message: `Category ${name.toUpperCase()} is already Available`,
            });
        }

        if (req.file) {
            imageUrl = await handleImageUpload(req.file.path);
            deleteFile(req.file.path);
        }
        const newCategory = new Category({
            ...categoryData,
            ...(imageUrl && { image: imageUrl }),
        });
        await newCategory.save();

        res.status(200).json(newCategory);
    } catch (error) {
        console.log("category-creation-error :", error);
        error.message = "couldn't Create the Category";
        next(error);
    }
};

const listCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({});
        if (!categories)
            return res
                .status(400)
                .json({ message: "couldn't find categories" });
        res.status(200).json(categories);
    } catch (error) {
        console.log("Category-list", error);
        next(error);
    }
};

const viewCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category)
            return res.status(404).json({ message: "category not exist" });

        res.status(200).json(category);
    } catch (error) {
        console.log("viewCategory", error);
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        let imageUrl;
        const isCategoryExist = await Category.findById(req.params.categoryId);
        if (!isCategoryExist || Object.keys(isCategoryExist).length === 0)
            return res.status(404).json({ message: "Category not exist" });
        const editedCategoryData = req.body;
        if (!editedCategoryData)
            return res.status(400).json({ message: "no details to update" });
        if (editedCategoryData.name != isCategoryExist.name) {
            //check the new name is already in use
            const categoryNameTaken = await Category.findOne({
                name: editedCategoryData.name,
            });
            if (categoryNameTaken) {
                return res.status(400).json({
                    message: `Category ${editedCategoryData.name.toUpperCase()} is in use, Can't change to that name, Name before was ${isCategoryExist.name.toUpperCase()}`,
                });
            }
        }
        if (req.file) {
            imageUrl = await handleImageUpload(req.file.path);
            deleteFile(req.file.path);
        }
        const updatedCategory = await Category.findByIdAndUpdate(
            isCategoryExist._id,
            {
                ...editedCategoryData,
                ...(imageUrl && { image: imageUrl }),
            },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            message: "updated successfully",
            updatedCategory,
        });
    } catch (error) {
        console.log("updatedCategory : ", error);
        next(error);
    }
};

const removeCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category)
            return res
                .status(400)
                .json({ message: "Tried to delete non-existing Category" });
        await Category.findByIdAndDelete(req.params.categoryId);

        res.status(200).json({
            message: `category ${category.name.toUpperCase()} deleted successfully`,
        });
    } catch (error) {
        console.log("removeCategory : ", error);
        next(error);
    }
};

module.exports = {
    newCategory,
    viewCategory,
    updateCategory,
    removeCategory,
    listCategories,
};
