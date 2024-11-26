// const Category = require("../models/categoryModel");
// const SubCategory = require("../models/subCategoryModel");
// const deleteFile = require("../utils/deleteFile");

// const newSubCategory = async (req, res, next) => {
//     try {
//         let imageUrl;
//         const subCategoryData = req.body;
//         const isSubCategoryExist = await SubCategory.findOne({
//             name: req.body.name,
//         });
//         if (isSubCategoryExist) {
//             return res
//                 .status(400)
//                 .json({ message: `${isSubCategoryExist.name} already exist` });
//         }

//         if (req.file) {
//             imageUrl = await handleImageUpload(req.file.path);
//             deleteFile(req.file.path);
//         }
//         const newSubCategory = new SubCategory({
//             ...subCategoryData,
//             ...(imageUrl && { image: imageUrl }),
//         });
//         await newSubCategory.save();

//         await Category.findByIdAndUpdate(newSubCategory.category, {
//             $push: { subCategories: newSubCategory._id },
//         });

//         res.status(200).json(newSubCategory);
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// const listSubCategories = async (req, res, next) => {
//     try {
//         const sub_categories = await SubCategory.find({});
//         if (!sub_categories)
//             return res
//                 .status(400)
//                 .json({ message: "couldn't find subCategories" });
//         res.status(200).json(sub_categories);
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// const viewSubCategory = async (req, res, next) => {
//     try {
//         const subCategory = await SubCategory.findById(
//             req.params.subCategoryId
//         );
//         if (!subCategory) {
//             return res.status(404).json({ message: "SubCategory not exist" });
//         }

//         res.status(200).json(subCategory);
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// const updateSubCategory = async (req, res, next) => {
//     try {
//         let imageUrl;
//         const isSubCategoryExist = await SubCategory.findById(
//             req.params.subCategoryId
//         ).select("name");
//         if (!isSubCategoryExist)
//             return res.status(404).json({ message: "SubCategory not exist" });
//         const editedSubCategoryData = req.body;
//         if (!editedSubCategoryData)
//             return res.status(400).json({ message: "no details to update" });

//         if (req.file) {
//             imageUrl = await handleImageUpload(req.file.path);
//             deleteFile(req.file.path);
//         }
//         const updatedSubCategory = await SubCategory.findByIdAndUpdate(
//             req.params.SubCategoryId,
//             {
//                 ...editedSubCategoryData,
//                 ...(imageUrl && { image: imageUrl }),
//             },
//             { new: true, runValidators: true }
//         );
//         res.status(200).json({
//             message: "updated successfully",
//             whereadded: isSubCategoryExist,
//             editedSubCategoryData,
//         });
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// const removeSubCategory = async (req, res, next) => {
//     try {
//         const subCategory = await SubCategory.findById(
//             req.params.subCategoryId
//         ).select("name");
//         if (!subCategory) {
//             return res
//                 .status(400)
//                 .json({ message: "Incorrect SubCategory Id" });
//         }
//         await SubCategory.findByIdAndDelete(req.params.subCategoryId);

//         res.status(200).json({
//             message: `SubCategory "${subCategory.name}" deleted successfully`,
//         });
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

// module.exports = {
//     newSubCategory,
//     listSubCategories,
//     viewSubCategory,
//     updateSubCategory,
//     removeSubCategory,
// };
