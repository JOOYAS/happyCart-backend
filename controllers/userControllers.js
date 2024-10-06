const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { generateToken, cookieOptions } = require("../utils/generateToken");
const handleImageUpload = require("../utils/imageUpload");
const deleteFile = require("../utils/deleteFile");

const allUsers = async (req, res, next) => {
    //access only after middleware isAdmin
    try {
        const users = await User.find({}).select("name _id email orders");
        if (users) return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const userSignup = async (req, res, next) => {
    try {
        let imageUrl;
        const userData = req.body;
        const isUserExist = await User.findOne({ email: userData.email });
        if (isUserExist) {
            return res.status(400).json({ message: "user already exist" });
        }

        if (req.file) {
            imageUrl = await handleImageUpload(req.file.path);
            deleteFile(req.file.path);
        }
        //encrypting password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

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
            email: userData.email,
            role: newUser.role,
        };
        console.log(`${userData.name} user joined`);
        const token = await generateToken(data4token);
        res.cookie("token", token, cookieOptions);
        res.status(201).json({
            ...data4token,
            success: true,
            message: `account for ${userData.name} created successfully`,
        });
    } catch (error) {
        console.log("some error in signup");
        next(error);
    }
};

const userLogin = async (req, res, next) => {
    try {
        const loginData = req.body;
        if (!loginData) {
            return res
                .status(400)
                .json({ message: "incomplete username or password" });
        }
        //if got loginData
        const isUserExist = await User.findOne({ email: loginData.email });
        if (!isUserExist) {
            return res
                .status(404)
                .json({ success: false, message: "user does not exist" });
        }
        //compares hashed userpassword with normal login password
        const passMatch = bcrypt.compareSync(
            loginData.password,
            isUserExist.password
        );
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
            user: data4token,
            success: true,
            message: `Welcome ${data4token.name} you are logged in`,
        });
        console.log(`${data4token.name} logged in`);
    } catch (error) {
        console.log("some error in login:", error);
        next(error);
    }
};

const userUpdate = async (req, res, next) => {
    try {
        let imageUrl;
        const newDetails = req.body;
        if (!newDetails)
            return res.status(400).json({ message: "no deails given" });
        const isUserExist = await User.findById(req.params.userId);
        if (!isUserExist)
            return res.status(404).json({ messsage: "failed to update" });

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
            message: "Successfully updated details",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const isUserToDelete = await User.findByIdAndDelete(req.params.userId);

        if (!isUserToDelete)
            return res.status(400).json({
                success: false,
                message: "this user not exist",
            });
        res.status(200).json({
            success: true,
            message: "your account successfully deleted",
        });
    } catch (error) {
        console.log(error);
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
