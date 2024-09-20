const logout = async (req, res, next) => {
    try {
        if (req.cookies.token) {
            res.clearCookie("token", {
                httpOnly: true,
                secure: process.env.ENVIRONMENT !== "development",
                sameSite: "None",
            });
            res.status(200).json({
                message: "Logged out successfully",
                success: true,
            });
        } else {
            res.status(400).json({
                message: "you are not logged in",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = logout;
