const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Temporary user storage
let users = [];

const SECRET = "blog_application_secret_key";

// User Registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword
        };

        users.push(newUser);

        res.status(201).json({
            success: true,
            message: "Registration successful!",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = users.find(
            user => user.email === email
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name
            },
            SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    users,
    SECRET
};