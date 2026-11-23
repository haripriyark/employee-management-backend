const { AppError } = require("../utils/AppError");
const { normalizeArray } = require("../utils/normalizeArray");

const authorizePermission = (...allowedPermissions) => {
    return (req, res, next) => {
        if (!req.user) {
            throw new AppError('Unauthorized request', 401);
        }
        if (allowedPermissions.length === 0) {
            throw new AppError('Permissions not configured', 500);
        }
        const userPermissions = req.user?.permissions || [];
        // normalize user permissions
        const normalizedPermissions = normalizeArray(userPermissions);
        // normalize allowed permissions
        const normalizedAllowedPermissions = normalizeArray(allowedPermissions);

        const userPermissionSet = new Set(normalizedPermissions);
        const isAllowed = normalizedAllowedPermissions.every(permission => userPermissionSet.has(permission));
        if (!isAllowed) {
            throw new AppError('Access Denied', 403);
        }
        next();
    }
}
module.exports = {
    authorizePermission
}