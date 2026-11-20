const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const { SECRET } = require("../controllers/authController");

const {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

// Authentication Middleware
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
            message: "Invalid or expired token"
        });
    }
};

// Get all blogs
router.get("/", getBlogs);

// Create a blog (Login required)
router.post("/", auth, createBlog);

// Get one blog by ID
router.get("/:id", getBlogById);

// Update a blog (Login required, author only)
router.put("/:id", auth, updateBlog);

// Delete a blog (Login required, author only)
router.delete("/:id", auth, deleteBlog);

module.exports = router;