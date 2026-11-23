const User = require("../models/User")
const { asyncHandler } = require("../utils/asyncHandler");
const { verifyToken } = require("../utils/verifyToken");
const { AppError } = require("../utils/AppError");

const authenticate = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers?.authorization;
    if (!authHeader) {
        throw new AppError('Unauthorized request', 401);
    }
    const [scheme, token] = authHeader.split(" ")
    if (scheme !== "Bearer" || !token) {
        throw new AppError('Unauthorized request', 401);
    }
    if (!process.env.JWT_ACCESS_SECRET) {
        throw new AppError('Server configuration error', 500);
    }
    let userId, accessTokenVersion;
    try {
        decoded = verifyToken(token, "access");
        userId = decoded.userId;
        accessTokenVersion = decoded.accessTokenVersion;
    } catch (err) {
        throw new AppError('Invalid or expired token', 401);
    }
    const user = await User.findById(userId).select("_id role permissions isActive accessTokenVersion");
    if (!user) {
        throw new AppError('Unauthorized request', 401);
    }
    if (!user.isActive) {
        throw new AppError('Account has been disabled', 403);
    }
    if (user.accessTokenVersion !== accessTokenVersion) {
        throw new AppError('Session is no longer valid. Please log-in again', 401);
    }
    req.user = {
        id: user._id,
        role: user.role,
        permissions: user.permissions
    };
    next();
});
module.exports = { authenticate };