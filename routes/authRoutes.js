const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authenticate");
const {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    getCurrentUser
} = require("../controllers/authController");
const { refreshToken } = require("../controllers/refreshToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", authenticate, logoutUser);
router.patch("/change-password", authenticate, changePassword);
router.get("/me", authenticate, getCurrentUser);

module.exports = router;