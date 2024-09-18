const Product = require("../models/productModel");
const Seller = require("../models/sellerModel");
const deleteFile = require("../utils/deleteFile");
const handleImageUpload = require("../utils/imageUpload");

const newProduct = async (req, res, next) => {
    //access only for sellers
    try {
        let imageUrls;
        const productData = req.body;
        const isProductExist = await Product.findOne({
            name: productData.name,
            sellerId: productData.sellerId,
        });
        if (isProductExist) {
            return res.status(400).json({ message: "product already exist" });
        }
        if (req.files) {
            //uploading every images seperately and saving the new created array to imageUrls
            imageUrls = await Promise.all(
                req.files.map(
                    async (file) => await handleImageUpload(file.path)
                )
            );
        }
        const newProduct = new Product({
            ...productData,
            ...(imageUrls && { images: imageUrls }),
        });
        await newProduct.save();

        await Seller.findByIdAndUpdate(newProduct.sellerId, {
            $push: { products: newProduct._id },
        });
        res.status(200).json(newProduct);
        req.files.forEach((file) => deleteFile(file.path));
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        let imageUrls;
        const editedProductData = req.body;
        const isProductExist = await Product.findById(req.params.productId);
        if (!isProductExist)
            return res.status(404).json({ message: "review not exist" });

        if (req.files) {
            imageUrls = await Promise.all(
                req.files.map(
                    async (file) => await handleImageUpload(file.path)
                )
            );
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            {
                ...editedProductData,
                ...(imageUrls && { images: imageUrls }),
            },
            { new: true, runValidators: true }
        );
        res.status(200).json({
            message: "updated successfully",
            product: isProductExist.name,
            updated: editedProductData,
        });
        req.files.forEach((file) => deleteFile(file.path));
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const viewProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: "product not exist" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const removeProduct = async (req, res, next) => {
    //access only for the seller
    try {
        const product = await Product.findById(req.params.productId);
        await Product.findByIdAndDelete(product._id);
        await Seller.findByIdAndUpdate(product.sellerId, {
            $pull: { products: product._id },
        });

        res.status(200).json({ message: "product deleted" });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = {
    newProduct,
    updateProduct,
    viewProduct,
    removeProduct,
};
