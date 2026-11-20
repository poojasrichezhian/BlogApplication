const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile
} = require("../controllers/authController");

const auth = require("../middleware/auth");

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Get logged-in user's profile (Login required)
router.get("/me", auth, getProfile);

module.exports = router;