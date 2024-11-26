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
const validateObjectId = require("../../../middlewares/validateObjectId");

const router = express.Router();
// for admin
router.get("/all", adminAuth, allUsers);

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/logout", userAuth, logout);
router.patch(
    "/:userId",
    validateObjectId,
    userAuth,
    upload.single("image"),
    userUpdate
);
router.delete("/:userId", validateObjectId, userAuth, deleteUser);

module.exports = { userRoutes: router };
