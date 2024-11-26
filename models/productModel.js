const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            max: {
                type: Number,
                required: true,
            },
            sale: {
                type: Number,
                required: true,
            },
        },
        images: [
            {
                type: String,
            },
        ],
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        brand: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },

        stock: {
            type: Number,
            default: 0,
        },
        tags: {
            type: [String],
        },
        rating: {
            type: Number,
            default: 0,
        },
        variants: [
            {
                variantType: { type: String, required: true }, // e.g., "Size", "Color"
                variantValue: { type: String, required: true }, // e.g., "M", "Blue"
                price: { type: Number, required: true },
                stock: { type: Number, default: 0 },
                images: [String],
            },
        ],
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
