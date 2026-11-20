const jwt = require("jsonwebtoken");

const { SECRET } = require("../controllers/authController");

// Authentication Middleware
// Checks the JWT token sent in the "Authorization: Bearer <token>" header.
// If valid, the logged-in user's info is saved in req.user.
const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please login first"
        });
    }

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token. Please login again."
        });
    }
};

module.exports = auth;
