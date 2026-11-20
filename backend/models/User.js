const mongoose = require("mongoose");

// User schema: describes what a user looks like in the database
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,       // No two users can have the same email
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
            // Stores the bcrypt HASH, never the plain password
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt automatically
    }
);

module.exports = mongoose.model("User", userSchema);
