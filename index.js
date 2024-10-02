const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { apiRouter } = require("./route-versions");
const handleError = require("./utils/error");
const connectDB = require("./config/connectDB");
const upload = require("./middlewares/multer");
const port = 3000;

const app = express();
//middlewares
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

//route paths
app.get("/", (req, res) => {
    res.send("happycart backend working fine");
});
app.use("/api", apiRouter);

app.use(handleError);
app.all("*", (req, res) => {
    res.status(501).json({ message: "end point does not exist" });
});

app.listen(port, () => {
    console.log(`started, on port ${port}`);
});
