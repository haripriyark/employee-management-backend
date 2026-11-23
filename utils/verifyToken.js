const jwt = require("jsonwebtoken");
const { AppError } = require("./AppError");

const verifyToken = (incomingToken, type) => {
    let secret;
    const tokenType = type.toLowerCase();
    if (tokenType === "access") {
        secret = process.env.JWT_ACCESS_SECRET;
    }
    else if (tokenType === "refresh") {
        secret = process.env.JWT_REFRESH_SECRET;
    }
    else {
        throw new AppError("Invalid token type", 500);
    }
    if (!secret) {
        throw new AppError(
            "JWT secret configuration missing",
            500
        );
    }
    try {
        return jwt.verify(incomingToken, secret);
    }
    catch (err) {
        throw new AppError(
            "Invalid or expired token",
            401
        );
    }
}
module.exports = { verifyToken };