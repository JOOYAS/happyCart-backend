const express = require("express");
const {
    userSignup,
    userUpdate,
    userLogin,
    allUsers,
    deleteUser,
} = require("../../../controllers/userControllers");
const logout = require("../../../utils/logout");
const upload = require("../../../middlewares/multer");
const userAuth = require("../../../middlewares/userAuth");
const adminAuth = require("../../../middlewares/adminAuth");

const router = express.Router();
// for admin
router.get("/", adminAuth, allUsers);

router.post("/signup", upload.single("image"), userSignup);
router.post("/login", userLogin);
router.get("/logout", userAuth, logout);
router.patch("/:userId", userAuth, upload.single("image"), userUpdate);
router.delete("/:userId", userAuth, deleteUser);

module.exports = { userRoutes: router };
