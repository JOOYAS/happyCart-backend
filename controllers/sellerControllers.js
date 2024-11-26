const bcrypt = require("bcrypt");
const Seller = require("../models/sellerModel");
const { generateToken, cookieOptions } = require("../utils/generateToken");
const deleteFile = require("../utils/deleteFile");
const handleImageUpload = require("../utils/imageUpload");
const haveToken = require("../utils/haveToken");
const Product = require("../models/productModel");

//access only after middleware isAdmin
const allsellers = async (req, res, next) => {
    try {
        const sellers = await Seller.find({}).select(
            "_id sellerName brand verified logo"
        );
        if (sellers) return res.json(sellers);
    } catch (error) {
        console.log("all Sellers adm : ", error);
        next(error);
    }
};

//admin verifies seller
const verifySeller = async (req, res, next) => {
    try {
        const verifiedSeller = await Seller.findByIdAndUpdate(
            req.params.sellerId,
            { verified: true },
            { new: true }
        ).select("sellerName verified");
        if (!verifiedSeller) {
            return res.status(400).json({ message: "this seller not exist" });
        }
        res.status(200).json({
            success: true,
            message: `${verifiedSeller?.sellerName?.toUpperCase()} is now verified`,
            verifiedSeller, //should be removed
        });
    } catch (error) {
        console.log("verify Seller adm : ", error);
        next(error);
    }
};

const sellerJoin = async (req, res, next) => {
    try {
        let logoUrl;
        const sellerData = req.body;
        const { email, password, sellerName } = sellerData;

        if (!email || !password || !sellerName) {
            return res.status(400).json({
                message: "Please complete all required information to proceed",
            });
        }
        const isSellerExist = await Seller.findOne({
            email: email,
        });
        if (isSellerExist) {
            return res.status(400).json({
                message: "email already is in use",
            });
        }
        //checking if this sellername already in use
        const isSellerNameTaken = await Seller.findOne({
            sellerName: sellerName,
        });
        if (isSellerNameTaken) {
            return res.status(400).json({
                message: `"${sellerName?.toUpperCase()}" is taken, try with another seller name`,
            });
        }

        if (req.file) {
            logoUrl = await handleImageUpload(req.file.path);
            deleteFile(req.file.path);
        }
        //encrypting password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hashSync(password, saltRounds);

        const newSeller = new Seller({
            ...sellerData,
            password: hashedPassword,
            ...(logoUrl && { logo: logoUrl }),
        });
        //saving to DB
        await newSeller.save();

        // creating token for seller
        const data4token = {
            _id: newSeller?._id,
            name: sellerName,
            role: "seller",
        };
        console.log(`new Seller ${sellerName?.toUpperCase()}`);
        const token = await generateToken(data4token);
        res.cookie("token", token, cookieOptions);
        res.status(201).json({
            seller: data4token,
            success: true,
            message: `${sellerName?.toUpperCase()}, welcome aboard—let's start on selling!`,
        });
    } catch (error) {
        console.log("sellersignup :", error);
        error.message = "couldn't SignUp, try again later.";
        next(error);
    }
};

const sellerLogin = async (req, res, next) => {
    try {
        const alreadyLoggedIn = await haveToken(req, res);
        if (alreadyLoggedIn) return;

        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "incomplete username or password" });
        }
        //if got loginData
        const isSellerExist = await Seller.findOne({ email: email });
        if (!isSellerExist) {
            return res
                .status(404)
                .json({ success: false, message: "seller does not exist" });
        }
        //compares hashed userpassword with normal loginpassword
        const passMatch = bcrypt.compareSync(password, isSellerExist.password);
        if (!passMatch) {
            return res.status(401).json({ message: "Incorrect Pasword🔒" });
        }
        //generating token
        const data4token = {
            _id: isSellerExist?._id,
            sellerName: isSellerExist?.sellerName,
            role: "seller",
        };
        const token = await generateToken(data4token);
        res.cookie("token", token, cookieOptions);
        res.status(200).json({
            success: true,
            message: `${isSellerExist?.sellerName?.toUpperCase()}, the shop's open, let's sell!`,
        });
    } catch (error) {
        console.log("Seller-login :", error);
        error.message = "couldn't Login, Try again later";
        next(error);
    }
};

const sellerUpdate = async (req, res, next) => {
    try {
        let logoUrl;
        const newDetails = req.body;
        if (!newDetails || Object.keys(newDetails).length === 0)
            return res.status(406).json({ message: "no details to update" });
        const isSellerExist = await Seller.findById(req?.params?.sellerId);
        if (!isSellerExist)
            return res.status(404).json({ messsage: "incorrect seller" });

        if (req.file) {
            logoUrl = await handleImageUpload(req.file.path);
            deleteFile(req.file.path);
        }
        const updatedSeller = await Seller.findByIdAndUpdate(
            isSellerExist?._id,
            {
                ...newDetails,
                ...(logoUrl && { logo: logoUrl }),
            },
            { new: true, runValidators: true }
        );
        //generating new token
        const data4token = {
            _id: isSellerExist?._id,
            sellerName: updatedSeller?.name,
            role: "seller",
        };
        const token = await generateToken(data4token);
        res.cookie("token", token, cookieOptions);
        res.status(200).json({
            message: "Successfully updated details",
            updatedSeller,
        });
    } catch (error) {
        console.log("Seller-update : ", error);
        error.message = "Error in updating the new details";
        next(error);
    }
};

const deleteSeller = async (req, res, next) => {
    try {
        const isSellerExist = await Seller.findById(
            req.params?.sellerId
        ).select("sellerName");
        if (!isSellerExist)
            return res.status(400).json({ message: "this seller not exist" });
        await Product.updateMany(
            { seller: isSellerExist._id }, // Find all products with this seller_id
            { $set: { verified: false } } // Set the 'verified' field to false
        );
        await Seller.findByIdAndDelete(req.params.sellerId);
        res.status(200).json({
            message: `seller ${isSellerExist?.sellerName?.toUpperCase()} got deleted`,
        });
    } catch (error) {
        console.log("delete seller : ", error);
        error.message = "couldn't delete seller";
        next(error);
    }
};

module.exports = {
    allsellers,
    sellerJoin,
    sellerLogin,
    sellerUpdate,
    verifySeller,
    deleteSeller,
};
