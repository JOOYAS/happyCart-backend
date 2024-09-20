const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;
        console.log(token);
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

        req.user = tokenVerified;

        next();
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error",
        });
    }
};

module.exports = userAuth;
