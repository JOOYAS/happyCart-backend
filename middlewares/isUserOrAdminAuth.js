const wrapMiddleware = require("../utils/middlewareWrapper");
const adminAuth = require("./adminAuth");
const userAuth = require("./userAuth");

const isUserOrAdminAuth = async (req, res, next) => {
    const wrappedUserAuth = wrapMiddleware(userAuth);
    const wrappedAdminAuth = wrapMiddleware(adminAuth);

    const isUser = await wrappedUserAuth(req, res);
    const isAdmin = await wrappedAdminAuth(req, res);

    console.log(`${isUser},${isAdmin}`);
    if (isUser || isAdmin) {
        return next();
    }

    return res.status(403).json({ message: "Access denied." });
};

module.exports = isUserOrAdminAuth;
