const mongoose = require("mongoose");
const Blog = require("../models/Blog");

// Helper: check that an ID looks like a valid MongoDB ID
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Allowed blog categories
const CATEGORIES = ["General", "Technology", "Travel", "Food", "Lifestyle", "Education", "Health"];

// Helper: make search text safe to use inside a search pattern
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Create Blog (login required)
const createBlog = async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        if (category && !CATEGORIES.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }

        const newBlog = await Blog.create({
            title,
            content,
            category: category || "General",
            author: req.user.name,
            authorId: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Blog created successfully!",
            blog: newBlog
        });

    } catch (error) {
        console.error("Create blog error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get All Blogs (newest first)
// Optional filters: /api/blogs?search=word&category=Travel
const getBlogs = async (req, res) => {
    try {
        const { search, category } = req.query;

        const filter = {};

        // Search in title OR content (not case-sensitive)
        if (search && search.trim()) {
            const pattern = new RegExp(escapeRegex(search.trim()), "i");
            filter.$or = [
                { title: pattern },
                { content: pattern }
            ];
        }

        // Filter by category
        if (category && category !== "All") {
            // Older blogs without a category count as "General"
            filter.category = category === "General"
                ? { $in: ["General", null] }
                : category;
        }

        const blogs = await Blog.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs
        });

    } catch (error) {
        console.error("Get blogs error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get One Blog by ID
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            blog
        });

    } catch (error) {
        console.error("Get blog error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Update Blog (only the author can update)
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category } = req.body;

        if (!isValidId(id)) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        if (blog.authorId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own blogs"
            });
        }

        if (category && !CATEGORIES.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            });
        }

        if (title) blog.title = title;
        if (content) blog.content = content;
        if (category) blog.category = category;

        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog updated successfully!",
            blog
        });

    } catch (error) {
        console.error("Update blog error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Delete Blog (only the author can delete)
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        if (blog.authorId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own blogs"
            });
        }

        await blog.deleteOne();

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully!"
        });

    } catch (error) {
        console.error("Delete blog error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};
