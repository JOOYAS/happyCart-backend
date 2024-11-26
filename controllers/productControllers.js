const Product = require("../models/productModel");
const Seller = require("../models/sellerModel");
const deleteFile = require("../utils/deleteFile");
const handleImageUpload = require("../utils/imageUpload");

//admin access only
const listAllProduct = async (req, res, next) => {
    try {
        const products = await Product.find({}).select("name _id");
        if (!products)
            return res
                .status(400)
                .json({ message: "no product added in the website" });
        res.status(200).json(products);
    } catch (error) {
        console.log("listAllProducts : ", error);
        next(error);
    }
};

const newProduct = async (req, res, next) => {
    //access only for seller
    try {
        let imageUrls;
        const productData = req.body;
        const { name, description, price, category } = productData;
        if (!name || !description || !price || !category || !req.user._id) {
            return res.status(400).json({
                message:
                    "Please complete all the required information to proceed",
            });
        }
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
            req.files.forEach((file) => deleteFile(file.path));
        }
        const newProduct = new Product({
            ...productData,
            ...(req.user._id && { seller: req.user._id }),
            ...(imageUrls && { images: imageUrls }),
        });
        await newProduct.save();

        res.status(200).json(newProduct);
    } catch (error) {
        console.log("newProduct : ", error);
        next(error);
    }
};

const viewProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: "product doesn't exist" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.log("viewPtroduct : ", error);
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        let imageUrls;
        const editedProductData = req.body;
        if (!editedProductData || Object.keys(editedProductData).length === 0)
            return res
                .status(400)
                .json({ message: "no details given to update" });

        const isProductExist = await Product.findById(req.params.productId);
        if (!isProductExist)
            return res.status(404).json({ message: "product not exist" });
        if (editedProductData?.name != isProductExist.name) {
            //check the new name is already in use
            const productNameTaken = await Product.findOne({
                name: editedProductData.name,
            });
            if (productNameTaken) {
                return res.status(400).json({
                    message: `Product ${editedProductData.name.toUpperCase()} is in use, Can't change to that name, Name before was ${isProductExist.name.toUpperCase()}`,
                });
            }
        }
        if (req.files) {
            imageUrls = await Promise.all(
                req.files.map(
                    async (file) => await handleImageUpload(file.path)
                )
            );
            req.files.forEach((file) => deleteFile(file.path));
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
    } catch (error) {
        console.log("updateProduct : ", error);
        next(error);
    }
};

const removeProduct = async (req, res, next) => {
    //access only for the seller
    try {
        const product = await Product.findById(req.params.productId);

        if (!product)
            return res.status(400).json({ message: "product does not exist" });

        await Product.findByIdAndDelete(product._id);

        res.status(200).json({
            message: `product ${product.name.toUpperCase()} deleted`,
        });
    } catch (error) {
        console.log("removeProduct : ", error);
        next(error);
    }
};

module.exports = {
    newProduct,
    updateProduct,
    listAllProduct,
    viewProduct,
    removeProduct,
};
