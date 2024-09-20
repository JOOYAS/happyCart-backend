const jwt = require("jsonwebtoken");

const sellerAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "you are not logged in" });
        }
        const tokenVerified = jwt.verify(token, process.env.SECRET_KEY);
        if (!tokenVerified) {
            return res
                .status(401)
                .json({ success: false, message: "invalid token" });
        }

        console.log("tokenVerified===", tokenVerified);

        if (tokenVerified.role !== "seller" && tokenVerified.role !== "admin") {
            return res
                .status(401)
                .json({ success: false, message: "you are not a seller" });
        }

        req.user = tokenVerified;

        next();
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            message: error.message || "sellerAuth error",
        });
    }
};

module.exports = sellerAuth;
