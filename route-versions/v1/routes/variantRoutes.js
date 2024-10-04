const express = require("express");
const {
    newVariant,
    viewVariant,
    editVariant,
    removeVariant,
} = require("../../../controllers/variantControllers");

const router = express.Router();

router.post("/:productId", newVariant);
router.get("/:variantId", viewVariant);
router.patch("/:variantId", editVariant);
router.delete("/:variantId", removeVariant);

module.exports = { variantRoutes: router };
