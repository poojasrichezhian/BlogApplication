// Temporary blog storage
let blogs = [];

// Create Blog
const createBlog = (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const newBlog = {
            id: Date.now().toString(),
            title,
            content,
            author: req.user.name,
            createdAt: new Date()
        };

        blogs.push(newBlog);

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

// Get All Blogs
const getBlogs = (req, res) => {
    res.status(200).json({
        success: true,
        blogs
    });
};

module.exports = {
    createBlog,
    getBlogs
};