const { AppError } = require("../utils/AppError");
const { normalizeArray } = require("../utils/normalizeArray");

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new AppError('Unauthorized user', 401);
        }
        const role = req.user?.role;
        console.log("role---->", role);
        if (!role) {
            throw new AppError("User role not found", 403);
        }
        if (!allowedRoles) {
            throw new AppError('Roles not configured', 500);
        }
        const normalizedUserRole = role.trim().toLowerCase();
        console.log("normalizedUserRole-->", normalizedUserRole);
        if (normalizedUserRole.length === 0) {
            throw new AppError('User role not found', 403);
        }
        const normalizedAllowedRoles = normalizeArray(allowedRoles, "lower");
        console.log("normalizedAllowedRoles--->", normalizedAllowedRoles);
        if (normalizedAllowedRoles.length === 0) {
            throw new AppError("Invalid roles configuration", 500);
        }
        if (normalizedAllowedRoles.includes(normalizedUserRole)) {
            return next();
        }
        throw new AppError("Forbidden", 403);
    }
}

module.exports = {
    authorize
}