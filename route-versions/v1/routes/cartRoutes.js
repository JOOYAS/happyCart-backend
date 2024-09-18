const express = require("express");
const {
    addNewItem,
    updateItem,
    removeItem,
    listItemsOfAUser,
    viewItem,
} = require("../../../controllers/cartControllers");

const router = express.Router();

router.post("/", addNewItem);
router.get("/:userId/list", listItemsOfAUser);
router.get("/:cartId", viewItem);
router.patch("/:cartId", updateItem);
router.delete("/:cartId", removeItem);

module.exports = { cartRoutes: router };
