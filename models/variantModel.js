const variantSchema = new mongoose.Schema({
    real: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    variantType: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    images: [String],
});

const Variant = mongoose.model("Variant", variantSchema);

module.exports = Variant;
