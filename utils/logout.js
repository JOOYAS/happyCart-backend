const logout = async (req, res, next) => {
    try {
        res.clearCookie("token");
        res.status(200).json({
            message: "logged out successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = logout;
