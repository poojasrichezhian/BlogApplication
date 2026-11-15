const express = require("express");
const cors = require("cors");

const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("My Blog Backend Server is Running Successfully!");
});

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Backend API is working successfully!"
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Blog routes
app.use("/api/blogs", blogRoutes);

// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});