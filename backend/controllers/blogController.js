const mongoose = require("mongoose");
const Blog = require("../models/Blog");

// Helper: check that an ID looks like a valid MongoDB ID
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create Blog (login required)
const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const newBlog = await Blog.create({
            title,
            content,
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
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });

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
        const { title, content } = req.body;

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

        if (title) blog.title = title;
        if (content) blog.content = content;

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
