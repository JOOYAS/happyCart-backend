const jwt = require("jsonwebtoken");

const generateToken = async (data) => {
    try {
        var token = await jwt.sign(data, process.env.SECRET_KEY);
        return token;
    } catch (error) {
        console.log("couldn't create token:", error);
    }
};

const isSecureRequest = (req) =>
    req.secure || req.headers["x-forwarded-proto"] === "https";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.ENVIRONMENT === "production" && isSecureRequest(req), // Ensures secure cookie only for production and HTTPS
    sameSite: process.env.ENVIRONMENT === "production" ? "None" : "Lax",
    path: "/",
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
};

module.exports = {
    generateToken,
    cookieOptions,
};
