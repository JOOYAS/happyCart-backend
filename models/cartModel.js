const mongoose = require("mongoose");

const cart = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cart);

module.exports = Cart;
