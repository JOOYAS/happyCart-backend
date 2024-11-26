const Cart = require("../models/cartModel");
const User = require("../models/userModel");

const addNewItem = async (req, res, next) => {
    try {
        const { product } = req.body;
        if (!product || !req.user)
            return res.status(400).json({ message: "retry" });
        const isInCart = await Cart.findOne({
            product,
            user: req.user._id,
        });
        if (isInCart) {
            return res.status(400).json({ message: "product already in Cart" });
        }
        const newItem = new Cart({
            ...req.body,
            user: req.user._id,
        });
        await newItem.save();

        res.status(200).json({
            success: true,
            message: "added to cart",
        });
    } catch (error) {
        console.log("newCartItem : ", error);
        next(error);
    }
};

//access only to the user
const listItemsOfAUser = async (req, res, next) => {
    try {
        const cartItems = await Cart.find({ user: req.params.userId });
        if (!cartItems) {
            return res
                .status(404)
                .json({ message: "couldn't find items in your cart" });
        }
        if (!cartItems.length)
            return res
                .status(200)
                .json({ message: "Empty cart, time to shop!" });

        res.status(200).json(cartItems);
    } catch (error) {
        console.log("cartItemsofUser : ", error);
        next(error);
    }
};

//access only to the  user
const viewItem = async (req, res, next) => {
    try {
        const item = await Cart.findById(req.params.cartId);
        if (!item)
            return res.status(400).json({ message: "invalid cart item" });

        res.status(200).json(item);
    } catch (error) {
        console.log("viewCartItem : ", error);
        next(error);
    }
};

const updateItem = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0)
            return res
                .status(400)
                .json({ message: "no details given to update" });
        const updated = await Cart.findByIdAndUpdate(
            req.params.cartId,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!updated)
            return res
                .status(500)
                .json({ message: "couldn't find the item to update" });
        res.status(200).json({
            updated,
            success: true,
            message: "cart Item updated",
        });
    } catch (error) {
        console.log("updateCartItem : ".error);
        next(error);
    }
};

//access only for the user
const removeItem = async (req, res, next) => {
    try {
        const removedItem = await Cart.findByIdAndDelete(req.params.cartId);
        if (!removedItem)
            return res.status(400).json({
                message: "the item you tried to remove does not exist",
            });

        res.status(200).json({ message: "item removed " });
    } catch (error) {
        console.log("removeCartItem : ", error);
        next(error);
    }
};

module.exports = {
    addNewItem,
    updateItem,
    listItemsOfAUser,
    viewItem,
    removeItem,
};
