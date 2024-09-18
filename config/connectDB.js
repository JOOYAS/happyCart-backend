const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_LINK);
        console.log("connected to mongoDB");
    } catch (error) {
        console.log("backend error in connecting mongoDB", error);
        throw new Error("MongoDB connection failed");
    }
};

module.exports = connectDB;
