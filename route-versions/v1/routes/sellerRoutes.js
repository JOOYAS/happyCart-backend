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

const router = express.Router();

// for admin
router.get("/", allsellers);
router.delete("/:sellerId", deleteSeller);
router.get("/verify/:sellerId", verifySeller);

router.post("/signup", upload.single("logo"), sellerJoin);
router.post("/login", sellerLogin);
router.get("/logout", logout);
router.patch("/:sellerId", upload.single("logo"), sellerUpdate);

module.exports = { sellerRoutes: router };
