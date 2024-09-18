const bcrypt = require("bcrypt");
const Seller = require("../models/sellerModel");
const { generateToken, cookieOptions } = require("../utils/generateToken");

const allsellers = async (req, res, next) => {
    //access only after middleware isAdmin
    try {
        const sellers = await Seller.find({}).select(
            "sellerName _id verified products orders"
        );
        if (sellers) return res.json(sellers);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const sellerJoin = async (req, res, next) => {
    try {
        let logoUrl;
        const sellerData = req.body;
        const isSellerExist = await Seller.findOne({ email: sellerData.email });
        if (isSellerExist) {
            return res.status(400).json({
                message: "this email already in use for another account",
            });
        }
        //checking if this sellername already in use
        const isSellerNameTaken = await Seller.findOne({
            sellerName: sellerData.sellerName,
        });
        if (isSellerNameTaken) {
            return res.status(400).json({
                message: `name "${sellerData.sellerName}" is taken, try with another`,
            });
        }

        if (req.file) {
            logoUrl = await handleImageUpload(req.file.path);
        }
        //encrypting password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hashSync(
            sellerData.password,
            saltRounds
        );

        const newSeller = new Seller({
            ...sellerData,
            password: hashedPassword,
            ...(logoUrl && { logo: logoUrl }),
        });
        //saving to DB
        await newSeller.save();

        // creating token for seller
        const data4token = {
            _id: newSeller._id,
            name: sellerData.name,
            email: sellerData.email,
            role: "seller",
        };
        console.log(`${sellerData.sellerName} seller joined`);
        const token = await generateToken(data4token);
        res.cookie("token", token, cookieOptions);
        res.status(201).json(data4token);
    } catch (error) {
        console.log("some error in signup");
        next(error);
    }
};

const sellerLogin = async (req, res, next) => {
    try {
        const loginData = req.body;
        if (!loginData) {
            return res
                .status(400)
                .json({ message: "incomplete username or password" });
        }
        //if got loginData
        const isSellerExist = await Seller.findOne({ email: loginData.email });
        if (!isSellerExist) {
            return res
                .status(404)
                .json({ success: false, message: "seller does not exist" });
        }
        //compares hashed userpassword with normal loginpassword
        const passMatch = bcrypt.compareSync(
            loginData.password,
            isSellerExist.password
        );
        if (!passMatch) {
            return res.status(401).json({ message: "seller not authorized" });
        }
        //generating token
        const data4token = {
            _id: isSellerExist._id,
            sellerName: isSellerExist.sellerName,
            role: "seller",
        };
        const token = await generateToken(data4token);
        res.cookie("token", token, cookieOptions);
        res.status(200).json({
            seller: data4token,
            success: true,
            message: "welcome, login successfull",
        });
    } catch (error) {
        console.log("some error in login:", error);
        next(error);
    }
};

const sellerUpdate = async (req, res, next) => {
    try {
        const newDetails = req.body; //user id is also  included in new details
        if (!newDetails)
            return res.status(406).json({ message: "no details given" });
        const isSellerExist = await Seller.findById(req.params.sellerId);
        if (!isSellerExist)
            return res.status(404).json({ messsage: "failed to update" });

        if (req.file) {
            imageUrl = await handleImageUpload(req.file.path);
        }
        const updatedSeller = await Seller.findByIdAndUpdate(
            isSellerExist._id,
            {
                ...newDetails,
                ...(logoUrl && { logo: logoUrl }),
            },
            { new: true, runValidators: true }
        );
        //generating new token
        const data4token = {
            _id: updatedSeller._id,
            sellerName: updatedSeller.name,
            email: updatedSeller.email,
            role: "seller",
        };
        const token = await generateToken(data4token);
        res.cookie("token", token, cookieOptions);
        res.status(200).json({
            message: "Successfully updated details",
            sellername: updatedSeller.sellerName,
            _id: updatedSeller._id,
            updated: newDetails,
        });
    } catch (error) {
        console.log(error);
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
        ).select("sellerName verified email _id");
        res.status(200).json({
            message: "Seller verified successfully",
            verifiedSeller,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const deleteSeller = async (req, res, next) => {
    try {
        const isSellerExist = await Seller.findById(req.params.sellerId).select(
            "sellerName"
        );
        if (!isSellerExist)
            return res.status(400).json({ message: "this seller not exist" });
        await Seller.findByIdAndDelete(req.params.sellerId);
        res.status(200).json({
            message: "sellerAccount deleted successfully",
        });
    } catch (error) {
        console.log(error);
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
