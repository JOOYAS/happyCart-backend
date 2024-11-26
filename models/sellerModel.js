const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        sellerName: {
            type: String,
            required: true,
        },
        brand: {
            type: Boolean,
            default: false,
        },
        logo: String,
        verified: {
            type: Boolean,
            default: false,
        },
        info: String,
        address: {
            buildingNo: String,
            street: String,
            pin: String,
            state: String,
        },
        contact: {
            number: String,
            email: String,
        },
    },
    { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
