const jwt = require("jsonwebtoken");
const { AppError } = require("./AppError");

const generateAuthTokens = (user) => {
    const accessPayload = {
        userId: user._id,
        role: user.role,
        accessTokenVersion: user.accessTokenVersion
    }
    const accessToken = generateToken(accessPayload, "access");
    const refreshPayload = {
        userId: user._id,
        refreshTokenVersion: user.refreshTokenVersion
    }
    const refreshToken = generateToken(refreshPayload, "refresh");
    return { accessToken, refreshToken };
}

const generateToken = (payload, type) => {
    const tokenType = type.toLowerCase();
    let secret;
    let expire;

    if (tokenType === "access") {
        secret = process.env.JWT_ACCESS_SECRET;
        expire = process.env.JWT_ACCESS_EXPIRES_IN;
    }
    else if (tokenType === "refresh") {
        secret = process.env.JWT_REFRESH_SECRET;
        expire = process.env.JWT_REFRESH_EXPIRES_IN;
    }
    else {
        throw new AppError("Invalid token type", 500);
    }

    return jwt.sign(
        payload,
        secret,
        { expiresIn: expire }
    );
}

module.exports = {
    generateAuthTokens,
    generateToken
}