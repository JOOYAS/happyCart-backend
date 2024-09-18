const Category = require("../models/categoryModel");
const Review = require("../models/reviewModel");
const deleteFile = require("../utils/deleteFile");

const newCategory = async (req, res, next) => {
    try {
        let imageUrl;
        const categoryData = req.body;
        const isCategoryExist = await Category.findOne({ name: req.body.name });
        if (isCategoryExist) {
            return res
                .status(400)
                .json({ message: `${isCategoryExist.name} already exist` });
        }

        if (req.file) {
            imageUrl = await handleImageUpload(req.file.path);
        }
        const newCategory = new Category({
            ...categoryData,
            ...(imageUrl && { image: imageUrl }),
        });
        await newCategory.save();

        res.status(200).json(newCategory);
        deleteFile(req.file.path);
    } catch (error) {
        console.log(error);
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
        console.log(error);
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
        console.log(error);
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        let imageUrl;
        const isCategoryExist = await Category.findById(req.params.categoryId);
        if (!isCategoryExist)
            return res.status(404).json({ message: "Category not exist" });
        const editedCategoryData = req.body;
        if (!editedCategoryData)
            return res.status(400).json({ message: "no details to update" });

        if (req.file) {
            imageUrl = await handleImageUpload(req.file.path);
        }
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.categoryId,
            {
                ...editedCategoryData,
                ...(imageUrl && { image: imageUrl }),
            },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            message: "updated successfully",
            editedCategoryData,
        });
        deleteFile(req.file.path);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const removeCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category)
            return res.status(400).json({ message: "Incorrect category Id" });
        await Category.findByIdAndDelete(req.params.categoryId);

        res.status(200).json({ message: "category deleted successfully" });
    } catch (error) {
        console.log(error);
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
