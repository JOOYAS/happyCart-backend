const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
        address: {
            type: Object,
            required: true,
        },
        statusList: [
            {
                status: {
                    type: String,
                    enum: [
                        "order placed",
                        "product shipped",
                        "out for delivery",
                        "delivered",
                        "cancelled",
                        "returned",
                    ],
                },
                timestamp: {
                    type: Date,
                    default: Date.now, // Automatically sets the current date and time
                },
            },
        ],
        price: {
            type: Number,
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
