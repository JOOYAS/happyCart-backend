const CartItem = require("../models/cartmodel");
const User = require("../models/userModel");

const addNewItem = async (req, res, next) => {
    try {
        const newItemData = req.body;
        if (!newItemData)
            return res
                .status(400)
                .json({ message: "no details found to add to cart" });
        const newItem = new CartItem(newItemData);
        await newItem.save();

        await User.findByIdAndUpdate(newItem.userId, {
            $push: { cart: newItem._id },
        });
        res.status(200).json({
            success: true,
            message: "added item to cart",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateItem = async (req, res, next) => {
    try {
        const updated = await CartItem.findByIdAndUpdate(
            req.params.cartId,
            req.body,
            {
                runValidators: true,
            }
        );
        if (!updated)
            return res
                .status(500)
                .json({ message: "couldn't find and update the item" });
        res.status(200).json({
            updated,
            success: true,
            message: "status updated successfully",
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const listItemsOfAUser = async (req, res, next) => {
    try {
        const cartItems = await CartItem.find({ userId: req.params.userId });
        if (!cartItems) {
            return res.status(404).json({ message: "product not exist" });
        }
        if (!cartItems.length)
            return res
                .status(200)
                .json({ message: "Empty cart, time to shop!" });

        res.status(200).json(cartItems);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const viewItem = async (req, res, next) => {
    try {
        const item = await CartItem.findById(req.params.cartId);
        if (!item)
            return res.status(400).json({ message: "invalid cart item" });

        res.status(200).json(item);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const removeItem = async (req, res, next) => {
    try {
        const removedItem = await CartItem.findByIdAndDelete(req.params.cartId);
        if (!removedItem)
            return res
                .status(400)
                .json({ message: "couldn't remove the item" });

        res.status(200).json({ message: "item deleted successfully" });
    } catch (error) {
        console.log(error);
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
