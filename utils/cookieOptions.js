const cookieOptions = {
    httpOnly: true,
    secure: process.env.ENVIRONMENT !== "development",
    sameSite: "None",
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
};

module.exports = cookieOptions;
