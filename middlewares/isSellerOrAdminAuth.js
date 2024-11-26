const wrapMiddleware = require("../utils/middlewareWrapper");
const adminAuth = require("./adminAuth");
const sellerAuth = require("./sellerAuth");

const isSellerOrAdminAuth = async (req, res, next) => {
    const wrappedSellerAuth = wrapMiddleware(sellerAuth);
    const wrappedAdminAuth = wrapMiddleware(adminAuth);

    const isSeller = await wrappedSellerAuth(req, res);
    const isAdmin = await wrappedAdminAuth(req, res);

    console.log(`${isSeller},${isAdmin}`);
    if (isSeller || isAdmin) {
        return next();
    }

    return res.status(403).json({ message: "Access denied." });
};

module.exports = isSellerOrAdminAuth;
