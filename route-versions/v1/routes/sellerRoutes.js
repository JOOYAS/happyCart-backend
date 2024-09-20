const express = require("express");
const {
    sellerJoin,
    sellerLogin,
    verifySeller,
    sellerUpdate,
    allsellers,
    deleteSeller,
} = require("../../../controllers/sellerControllers");
const logout = require("../../../utils/logout");
const upload = require("../../../middlewares/multer");
const adminAuth = require("../../../middlewares/adminAuth");

const router = express.Router();

// for admin
router.get("/", adminAuth, allsellers);
router.get("/verify/:sellerId", adminAuth, verifySeller);

router.post("/signup", upload.single("image"), sellerJoin);
router.post("/login", sellerLogin);
router.get("/logout", logout);
router.patch("/:sellerId", upload.single("image"), sellerUpdate);
router.delete("/:sellerId", deleteSeller);

module.exports = { sellerRoutes: router };
