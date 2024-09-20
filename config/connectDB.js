const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_LINK);
        console.log("✅mongoDB");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        throw new Error("MongoDB connection failed");
    }
};

module.exports = connectDB;
