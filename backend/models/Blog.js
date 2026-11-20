const mongoose = require("mongoose");

// Blog schema: describes what a blog post looks like in the database
const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true
        },
        content: {
            type: String,
            required: [true, "Content is required"]
        },
        // Author's name (shown on the frontend as "By ...")
        author: {
            type: String,
            required: true
        },
        // Link to the user who wrote the blog
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model("Blog", blogSchema);
