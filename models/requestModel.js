// const mongoose = require("mongoose");

// const RequestSchema = new mongoose.Schema({
//     seller: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Seller",
//         required: true,
//     },
//     serviceDetails: {
//         name: { type: String, required: true },
//         description: { type: String, required: true },
//         category: { type: String, required: true },
//         price: { type: Number, required: true },
//     },
//     status: {
//         type: String,
//         enum: ["pending", "approved", "rejected"],
//         default: "pending",
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// module.exports = mongoose.model("Request", RequestSchema);
