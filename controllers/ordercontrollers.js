const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Seller = require("../models/sellerModel");
const User = require("../models/userModel");

const newOrder = async (req, res, next) => {
    try {
        const newOrderData = req.body;
        if (!newOrderData)
            return res.status(400).json({ message: "no order details" });
        const product = await Product.findById(newOrderData.productId).select(
            "stock"
        );
        if (product.stock == 0)
            return res.status(403).json({ message: " out of stock" });
        const newOrder = new Order(newOrderData);
        await newOrder.save();

        await User.findByIdAndUpdate(newOrder.userId, {
            $push: { orders: newOrder._id },
        });
        await Seller.findByIdAndUpdate(newOrder.sellerId, {
            $push: { orders: newOrder._id },
        });
        await Product.findByIdAndUpdate(newOrder.productId, {
            $inc: { stock: -1 },
        });
        res.status(200).json({
            success: true,
            message: "Order placed successfully",
            newOrder,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const changeOrderStatus = async (req, res, next) => {
    //access only for seller
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Check if the status already exists in the statusList
        const statusExists = order.statusList.some(
            (s) => s.status === req.body.status
        );

        if (statusExists) {
            return res
                .status(200)
                .json({ message: `Status "${req.body.status}"already added` });
        }
        const newStatus = await Order.findByIdAndUpdate(
            orderId,
            { $push: { statusList: req.body } },
            { new: true, runValidators: true }
        );
        if (!newStatus)
            return res.status(400).json({ message: "couldn't change status" });

        res.status(200).json({
            success: true,
            message: `new status =successfully = "${req.body.status}"`,
            newStatus,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const viewOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order)
            return res.status(400).json({ message: "couldn't find the order" });

        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const getOrders = async (req, res, next) => {
    const orders = await Order.find({ userId: req.params.userId });
    if (!orders || orders.length === 0) {
        return res
            .status(404)
            .json({ message: "No orders found for this user." });
    }

    res.status(200).json(orders);
    try {
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const getAllOrders = async (req, res, next) => {
    const orders = await Order.find({});
    if (!orders || orders.length === 0) {
        return res
            .status(404)
            .json({ message: "No one used your app to order🥱" });
    }

    res.status(200).json(orders);
    try {
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = {
    newOrder,
    changeOrderStatus,
    viewOrder,
    getOrders,
    getAllOrders,
};
