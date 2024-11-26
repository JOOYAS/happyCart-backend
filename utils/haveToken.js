const haveToken = async (req, res) => {
    const { token } = req.cookies;

    if (token) {
        res.status(401).json({
            message: "you are logged in with an account, logout and try again",
        });
        return true;
    }

    return false;
};

module.exports = haveToken;
