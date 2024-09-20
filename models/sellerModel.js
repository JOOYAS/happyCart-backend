const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
    {
        sellerName: {
            type: String,
            required: true,
        },
        logo: String,
        verified: {
            type: Boolean,
            default: false,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        details: String,
        address: {
            buildingNo: String,
            street: String,
            pin: String,
            state: String,
        },
        contactNumber: String,
        contactEmail: String,
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
    },
    { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
