const express = require("express");
const {
    addNewItem,
    updateItem,
    removeItem,
    listItemsOfAUser,
    viewItem,
} = require("../../../controllers/cartControllers");
const validateObjectId = require("../../../middlewares/validateObjectId");
const userAuth = require("../../../middlewares/userAuth");
const isUserOrAdminAuth = require("../../../middlewares/isUserOrAdminAuth");

const router = express.Router();

router.post("/", userAuth, addNewItem);
router.get(
    "/user/:userId",
    isUserOrAdminAuth,
    validateObjectId,
    listItemsOfAUser
); // to get cart of user
router.get("/:cartId", userAuth, validateObjectId, viewItem); // not required/ this is unwanted
router.patch("/:cartId", userAuth, validateObjectId, updateItem);
router.delete("/:cartId", userAuth, validateObjectId, removeItem);

module.exports = { cartRoutes: router };
