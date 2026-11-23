const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");
const { generateAuthTokens } = require("../utils/generateToken");
const { verifyToken } = require("../utils/verifyToken");
const { AppError } = require("../utils/AppError");

const refreshToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.body?.refreshToken;
    if (!incomingRefreshToken) {
        throw new AppError("Token not found", 401);
    }
    const refreshSecret = process.env.JWT_REFRESH_SECRET
    if (!refreshSecret) {
        throw new AppError('JWT_REFRESH_SECRET is missing', 500);
    }
    let decoded;
    try {
        decoded = verifyToken(incomingRefreshToken, "refresh");
    }
    catch (err) {
        throw new AppError("Invalid or expired token", 401);
    }
    const user = await User.findById(decoded.userId)
    if (!user) {
        throw new AppError("User not found", 401);
    }
    if (!user.isActive) {
        throw new AppError("User account is inactive", 403);
    }
    if (user.refreshTokenVersion !== decoded.refreshTokenVersion) {
        throw new AppError("Session is no longer valid. Please log-in again", 401);
    }
    const { accessToken, refreshToken } = generateAuthTokens(user);

    res.status(200).json({
        message: "Token refreshed successfully",
        success: true,
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            role: user.role,
        }
    })
})
module.exports = { refreshToken }