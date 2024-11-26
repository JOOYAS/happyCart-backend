const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
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
                .json({ success: false, message: "token used is invalid" });
        }

        req.user = verifiedToken;

        next();
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error",
        });
    }
};

module.exports = userAuth;
