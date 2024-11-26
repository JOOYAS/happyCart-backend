const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        phone: String,

        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user",
        },
        name: {
            type: String,
            required: true,
        },
        profilePicture: String,

        address: [
            {
                name: String,
                houseNo: String,
                street: String,
                city: String,
                pin: String,
                state: String,
            },
        ],
        wishList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        cart: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Cart",
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
