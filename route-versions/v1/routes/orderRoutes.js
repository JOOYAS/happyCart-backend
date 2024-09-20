const express = require("express");
const {
    newOrder,
    viewOrder,
    changeOrderStatus,
    getOrders,
    getAllOrders,
} = require("../../../controllers/ordercontrollers");
const adminAuth = require("../../../middlewares/adminAuth");

const router = express.Router();

router.post("/", newOrder);
router.get("/all", adminAuth, getAllOrders);
router.get("/:orderId", viewOrder);
router.get("/byuser/:userId", getOrders);
//access only to its seller
router.patch("/status/:orderId", changeOrderStatus);

//access only admin

module.exports = { orderRoutes: router };
