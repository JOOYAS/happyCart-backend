const express = require("express");
const { userRoutes } = require("./routes/userRoutes");
const { sellerRoutes } = require("./routes/sellerRoutes");
const { categoryRoutes } = require("./routes/categoryRoutes");
const { productRoutes } = require("./routes/productRoutes");
const { orderRoutes } = require("./routes/orderRoutes");
const { cartRoutes } = require("./routes/cartRoutes");
const { reviewRoutes } = require("./routes/reviewRoutes");
const { variantRoutes } = require("./routes/variantRouter");

const v1Router = express.Router();

v1Router.get("/", (req, res) => res.send("happycart version 1.0"));
v1Router.use("/user", userRoutes);
v1Router.use("/seller", sellerRoutes);
v1Router.use("/product", productRoutes);
v1Router.use("/order", orderRoutes);
v1Router.use("/cart", cartRoutes);
v1Router.use("/review", reviewRoutes);
v1Router.use("/category", categoryRoutes);
v1Router.use("/variant", variantRoutes);

module.exports = v1Router;
