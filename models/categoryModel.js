const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
