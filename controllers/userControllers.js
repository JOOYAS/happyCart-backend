const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { generateToken, cookieOptions } = require("../utils/generateToken");
const handleImageUpload = require("../utils/imageUpload");
const deleteFile = require("../utils/deleteFile");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const haveToken = require("../utils/haveToken");

//access only after middleware isAdmin
const allUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select("name _id email");
        if (users) return res.status(200).json(users);
    } catch (error) {
        console.log("allUsers adm : ", error);
        next(error);
    }
};

const userSignup = async (req, res, next) => {
    try {
        let imageUrl;
        const userData = req.body;
        const { email, password, name } = userData;
        if (!email || !password || !name) {
            return res.status(400).json({
                message:
                    "Please complete all the required information to proceed",
            });
        }
        const isUserExist = await User.findOne({ email: email });
        if (isUserExist) {
            return res.status(400).json({ message: "user already exist" });
        }

        //encrypting password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        if (req.file) {
            imageUrl = await handleImageUpload(req.file.path);
            deleteFile(req.file.path);
        }

        const newUser = new User({
            ...userData,
            ...(imageUrl && { profile: imageUrl }),
            password: hashedPassword,
        });
        //saving to DB
        await newUser.save();

        // creating token for user
        const data4token = {
            _id: newUser._id,
            name: userData.name,
            role: newUser.role,
        };
        console.log(`${userData.name} user joined`);
        const token = await generateToken(data4token);
        res.cookie("token", token, cookieOptions);
        res.status(201).json({
            newUser,
            success: true,
            message: `Account for ${userData.name.toUpperCase()} created successfully`,
        });
    } catch (error) {
        console.log("user signup : ", error);
        next(error);
    }
};

const userLogin = async (req, res, next) => {
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
        const isUserExist = await User.findOne({ email: email });
        if (!isUserExist) {
            return res
                .status(404)
                .json({ success: false, message: "user does not exist" });
        }
        //compares hashed userpassword with normal login password
        const passMatch = bcrypt.compareSync(password, isUserExist.password);
        if (!passMatch) {
            return res.status(401).json({ message: "incorrect password" });
        }
        //generating token
        const data4token = {
            _id: isUserExist._id,
            name: isUserExist.name,
            email: isUserExist.email,
            role: isUserExist.role,
        };
        const token = await generateToken(data4token);
        res.cookie("token", token, cookieOptions);
        res.status(200).json({
            user: isUserExist,
            success: true,
            message: `Welcome ${data4token.name} you are logged in`,
        });
        console.log(`${data4token.name} logged in`);
    } catch (error) {
        console.log("Userlogin : ", error);
        next(error);
    }
};

const userUpdate = async (req, res, next) => {
    try {
        let imageUrl;
        const newDetails = req.body;
        if (!newDetails || Object.keys(newDetails).length === 0)
            return res.status(400).json({ message: "no details are given" });
        const isUserExist = await User.findById(req.params.userId);
        if (!isUserExist)
            return res.status(404).json({ messsage: "failed to update" });
        if (newDetails?.email !== isUserExist.email) {
            //check the new mail is already in use
            const isMailTaken = await User.findOne({
                email: newDetails?.email,
            });
            if (isMailTaken) {
                return res.status(400).json({
                    message: `mail-id ${newDetails?.email?.toUpperCase()} is in use, Can't change from ${isUserExist?.email?.toUpperCase()}`,
                });
            }
        }
        if (req.file) {
            imageUrl = await handleImageUpload(req.file.path);
            deleteFile(req.file.path);
        }
        const updatedUser = await User.findByIdAndUpdate(
            isUserExist._id,
            {
                ...newDetails,
                ...(imageUrl && { profile: imageUrl }),
            },
            { new: true, runValidators: true }
        );
        //generating new token
        const data4token = {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        };
        const token = await generateToken(data4token);
        res.cookie("token", token, cookieOptions);
        res.status(200).json({
            user: updatedUser,
            message: "Successfully updated details",
        });
    } catch (error) {
        console.log("update user : ", error);
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);

        await Order.findOneAndDelete({ user: user._id });
        await Cart.findOneAndDelete({ user: user._id });

        res.status(200).json({
            deletedUser: user,
            success: true,
            message: "your account deletion successful",
        });
    } catch (error) {
        console.log("deleteUser : ", error);
        next(error);
    }
};

module.exports = {
    allUsers,
    userSignup,
    userLogin,
    userUpdate,
    deleteUser,
};
