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

const router = express.Router();
// for admin
router.get("/", allUsers);
router.delete("/:userId", (req, res) => {
    res.send("deleted user userId");
});

router.post("/signup", upload.single("image"), userSignup);
router.post("/login", userLogin);
router.get("/logout", logout);
router.patch("/update/:userId", upload.single("image"), userUpdate);
router.delete("/delete/:userId", deleteUser);

module.exports = { userRoutes: router };
