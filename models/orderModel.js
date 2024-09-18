const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
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
                        "delivered",
                        "cancelled",
                        "returned",
                    ],
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now, // Automatically sets the current date and time
                },
            },
        ],
        orderPrice: {
            type: Number,
            required: true,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
