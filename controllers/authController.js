const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");
const { generateAuthTokens } = require("../utils/generateToken");
const { isValidEmail } = require("../utils/validateEmail");
const { AppError } = require("../utils/AppError");

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new AppError("Name, email and password are required", 400);
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!isValidEmail(normalizedEmail)) {
        throw new AppError("Please provide a valid email address", 400);
    }
    if (password !== trimmedPassword) {
        throw new AppError("Password cannot start or end with spaces", 400);
    }
    if (trimmedPassword.length < 6) {
        throw new AppError("Password should contain minimum 6 characters", 400);
    }
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
        throw new AppError("User already exists", 409);
    }
    const newUser = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        password
    })
    return res.status(201).json({
        message: 'New user created successfully',
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        },
        success: true
    })
})
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    if (!isValidEmail(normalizedEmail)) {
        throw new AppError("Please provide a valid email address", 400);
    }
    if (password !== trimmedPassword) {
        throw new AppError("Password cannot start or end with spaces", 400);
    }
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }
    // Check for password match
    const isMatch = await user.comparePassword(trimmedPassword);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }
    if (!user.isActive) {
        throw new AppError("Account has been disabled", 403);
    }
    // generate jwt
    const { accessToken, refreshToken } = generateAuthTokens(user);
    // Refresh token persistence/rotation will be implemented later.
    res.status(200).json({
        message: "Login successful",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken,
        },
        success: true
    });
})

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError("Unauthorized user", 401);
    }
    const user = await User.findById(userId).select("isActive");
    if (!user) {
        throw new AppError("Account does not exist", 401);
    }
    if (!user.isActive) {
        throw new AppError("Account has been disabled", 403);
    }
    await User.findByIdAndUpdate(userId, {
        $inc: {
            accessTokenVersion: 1,
            refreshTokenVersion: 1
        }
    });
    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
})

const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError("Unauthorized user", 401);
    }
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new AppError("Insufficient details", 400);
    }
    const trimmedPassword = newPassword.trim();
    if (oldPassword.trim() === trimmedPassword) {
        throw new AppError(
            "New password must be different from the current password",
            400
        );
    }
    if (newPassword !== trimmedPassword) {
        throw new AppError("Password cannot start or end with spaces", 400);
    }
    if (trimmedPassword.length < 6) {
        throw new AppError("Password should contain minimum 6 characters", 400);
    }
    const user = await User.findById(userId).select("+password isActive refreshTokenVersion accessTokenVersion");
    if (!user) {
        throw new AppError("User not found", 401);
    }
    if (!user.isActive) {
        throw new AppError("Account has been disabled", 403);
    }
    // Check for password match
    const isMatch = await user.comparePassword(oldPassword.trim());
    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }
    user.password = trimmedPassword;
    user.accessTokenVersion++;
    user.refreshTokenVersion++;
    await user.save();
    return res.status(200).json({
        message: "Password updated successfully. Please log in again.",
        success: true
    })
})
const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError("Unauthorized user", 401);
    }
    const user = await User.findById(userId).select("name email role permissions isActive");
    if (!user) {
        throw new AppError("User not found", 401);
    }
    if (!user.isActive) {
        throw new AppError("Account has been disabled", 403);
    }
    return res.status(200).json({
        success: true,
        message: "User details fetched successfully",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions
            }
        }
    })

})
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    getCurrentUser
}