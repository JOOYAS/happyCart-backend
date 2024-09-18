const mongoose = require("mongoose");

const cartItem = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const CartItem = mongoose.model("CartItem", cartItem);

module.exports = CartItem;