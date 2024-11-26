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
const validateObjectId = require("../../../middlewares/validateObjectId");

const router = express.Router();

// for admin
router.get("/all", adminAuth, allsellers);
router.get("/:sellerId/verify", validateObjectId, adminAuth, verifySeller);

router.post("/signup", upload.single("image"), sellerJoin);
router.post("/login", sellerLogin);
router.get("/logout", logout);
router.patch(
    "/:sellerId",
    validateObjectId,
    upload.single("image"),
    sellerUpdate
);
router.delete("/:sellerId", validateObjectId, deleteSeller);

module.exports = { sellerRoutes: router };