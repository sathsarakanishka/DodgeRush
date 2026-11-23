
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Score = require("../models/Score");

const router = express.Router();

// Check password strength
function isStrongPassword(password) {
    return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9\s]).{8,}$/.test(password);
}

// Create a JWT token
function createToken(user) {
    return jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );
}

// Return safe user information
function publicUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email
    };
}

// Authenticate the user using JWT
async function authenticateToken(req, res, next) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Please log in."
            });
        }

        const token = authorization.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User account not found."
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired session. Please log in again."
        });
    }
}

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const username = String(req.body.username || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({
                message: "Username must be between 3 and 20 characters."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and contain one uppercase letter and one special symbol."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Registration successful!",
            user: publicUser(newUser)
        });

    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email is already registered."
            });
        }

        res.status(500).json({
            message: "Registration failed."
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const email = String(req.body.email || "").trim().toLowerCase();
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = createToken(user);

        res.json({
            message: "Login successful!",
            token,
            user: publicUser(user)
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed."
        });
    }
});

// GET LOGGED-IN USER PROFILE
router.get("/me", authenticateToken, (req, res) => {
    res.json({
        user: publicUser(req.user)
    });
});

// UPDATE USERNAME AND EMAIL
router.patch("/profile", authenticateToken, async (req, res) => {
    try {
        const username = String(req.body.username || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();

        if (!username || !email) {
            return res.status(400).json({
                message: "Username and email are required."
            });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({
                message: "Username must be between 3 and 20 characters."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        const existingUser = await User.findOne({
            email,
            _id: { $ne: req.user._id }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "This email is already used by another account."
            });
        }

        req.user.username = username;
        req.user.email = email;

        await req.user.save();

        // Update the player's leaderboard username
        await Score.updateOne(
            { user: req.user._id },
            { $set: { username } }
        );

        res.json({
            message: "Profile updated successfully!",
            user: publicUser(req.user)
        });

    } catch (error) {
        console.error("Profile update error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email is already registered."
            });
        }

        res.status(500).json({
            message: "Could not update profile."
        });
    }
});

// CHANGE PASSWORD
router.patch("/change-password", authenticateToken, async (req, res) => {
    try {
        const currentPassword = String(req.body.currentPassword || "");
        const newPassword = String(req.body.newPassword || "");

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Please enter both passwords."
            });
        }

        // Check new password strength
        if (!isStrongPassword(newPassword)) {
            return res.status(400).json({
                message: "New password must be at least 8 characters and contain one uppercase letter and one special symbol."
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(
            currentPassword,
            req.user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect."
            });
        }

        // Prevent reusing the same password
        const samePassword = await bcrypt.compare(
            newPassword,
            req.user.password
        );

        if (samePassword) {
            return res.status(400).json({
                message: "Choose a different password."
            });
        }

        req.user.password = await bcrypt.hash(newPassword, 12);

        await req.user.save();

        res.json({
            message: "Password changed successfully. Please log in again."
        });

    } catch (error) {
        console.error("Password update error:", error);

        res.status(500).json({
            message: "Could not change password."
        });
    }
});

module.exports = router;
