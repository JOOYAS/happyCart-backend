const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Seller = require("../models/sellerModel");
const User = require("../models/userModel");

const newOrder = async (req, res, next) => {
    try {
        const newOrderData = req.body;
        const user = req.user;
        const { product } = newOrderData;
        if (!product || !user)
            return res
                .status(400)
                .json({ message: "incomplete order details" });

        const isProduct = await Product.findById(product).select("stock");
        if (!isProduct)
            return res.status(404).json({ message: "invalid product" });
        if (isProduct.stock == 0)
            return res.status(403).json({ message: " out of stock" });
        const newOrder = new Order({
            ...newOrderData,
            user: user._id,
            statusList: [
                {
                    status: "order placed",
                },
            ],
        });
        await newOrder.save();
        if (isProduct.stock >= 1) {
            isProduct.stock -= 1;

            await isProduct.save();
        }
        res.status(200).json({
            success: true,
            message: "Order placed successfully",
            newOrder,
        });
    } catch (error) {
        console.log("newOrder : ", error);
        next(error);
    }
};

//access only for seller and user(cancel & return)
const changeOrderStatus = async (req, res, next) => {
    try {
        if (!req.body.status || !Object.keys(req.body).length)
            return res.status(400).json({ message: "no new status given" });
        const order = await Order.findById(req.params?.orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Check if the status already exists in the statusList
        const statusExists = order.statusList.some(
            (s) => s.status === req?.body?.status
        );

        if (statusExists) {
            return res.status(200).json({
                message: `Status "${req?.body?.status.toUpperCase()}"already added`,
            });
        }
        // const newStatusAdded = await Order.findByIdAndUpdate(
        //     order?._id,
        //     { $push: { statusList: req.body.status } },
        //     { new: true, runValidators: true }
        // );
        order.statusList.push({ status: req.body.status });
        const newStatusAdded = await order.save();
        if (!newStatusAdded)
            return res.status(400).json({ message: "couldn't change status" });
        if (
            newStatusAdded &&
            req.body.status == "cancelled" &&
            order.stock > 0
        ) {
            await Product.findByIdAndUpdate(newOrder.productId, {
                $inc: { stock: +1 }, //dont know work or not
            });
        }
        res.status(200).json({
            success: true,
            message: `new status = "${req?.body?.status.toUpperCase()}"`,
            newStatusAdded,
        });
    } catch (error) {
        console.log("orderStatusUpdate : ", error);
        next(error);
    }
};

const viewOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req?.params?.orderId);
        if (!order)
            return res.status(400).json({ message: "couldn't find the order" });

        res.status(200).json(order);
    } catch (error) {
        console.log("viewOrder : ", error);
        next(error);
    }
};

//orders of a user
const getOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req?.params?.userId });
    if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "no orders, time to shop!" });
    }

    res.status(200).json(orders);
    try {
    } catch (error) {
        console.log("ordersByUser : ", error);
        next(error);
    }
};

//orders of a seller
const getOrdersForSeller = async (req, res, next) => {
    const orders = await Order.find({}).populate({
        path: "product",
        select: "seller",
    });
    if (!orders) return;
    const ordersForSeller = orders.filter(
        (order) => order.product.seller == req.params.sellerId
    );
    if (!ordersForSeller || ordersForSeller.length === 0) {
        return res.status(404).json({ message: "No orders yet" });
    }

    res.status(200).json(ordersForSeller);
    try {
    } catch (error) {
        console.log("orders for seller : ", error);
        next(error);
    }
};

//admin only
const getAllOrders = async (req, res, next) => {
    const orders = await Order.find({});
    if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders at all" });
    }

    res.status(200).json(orders);
    try {
    } catch (error) {
        console.log("all orders Admin : ", error);
        next(error);
    }
};

module.exports = {
    newOrder,
    changeOrderStatus,
    viewOrder,
    getOrders,
    getAllOrders,
    getOrdersForSeller,
};
