const express = require("express");
const {
    newOrder,
    viewOrder,
    changeOrderStatus,
    getOrders,
    getAllOrders,
    getOrdersForSeller,
} = require("../../../controllers/ordercontrollers");
const adminAuth = require("../../../middlewares/adminAuth");
const validateObjectId = require("../../../middlewares/validateObjectId");
const userAuth = require("../../../middlewares/userAuth");

const router = express.Router();

//access only admin
router.get("/all", adminAuth, getAllOrders);

router.post("/", userAuth, newOrder);
router.get("/:orderId", validateObjectId, viewOrder);
router.patch("/:orderId/status", validateObjectId, changeOrderStatus);
router.get("/user/:userId", validateObjectId, getOrders);
router.get("/seller/:sellerId", validateObjectId, getOrdersForSeller);




module.exports = { orderRoutes: router };
