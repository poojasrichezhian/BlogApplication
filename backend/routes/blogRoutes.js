const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
    createBlog,
    getBlogs,
    getMyBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

// Get all blogs
router.get("/", getBlogs);

// Get only the logged-in user's blogs (Login required)
// NOTE: this must come BEFORE "/:id"
router.get("/my", auth, getMyBlogs);

// Create a blog (Login required)
router.post("/", auth, createBlog);

// Get one blog by ID
router.get("/:id", getBlogById);

// Update a blog (Login required, author only)
router.put("/:id", auth, updateBlog);

// Delete a blog (Login required, author only)
router.delete("/:id", auth, deleteBlog);

module.exports = router;