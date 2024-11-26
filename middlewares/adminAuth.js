const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "you are not logged in" });
        }
        const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!verifiedToken) {
            return res
                .status(401)
                .json({ success: false, message: "invalid token" });
        }

        if (verifiedToken.role !== "admin") {
            return res
                .status(401)
                .json({ success: false, message: "you are not an admin" });
        }

        req.user = verifiedToken;

        next();
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            message: error.message || "adminAuth error",
        });
    }
};

module.exports = adminAuth;
