
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Score = require("../models/Score");

const router = express.Router();

// Verify the player's login token
async function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Please login first."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired login session."
        });
    }
}

// Submit a player's score
router.post("/submit", verifyToken, async (req, res) => {
    try {
        const score = Number(req.body.score);

        if (!Number.isSafeInteger(score) || score < 0) {
            return res.status(400).json({
                message: "Invalid score."
            });
        }

        // Save the player's highest score
        const savedScore = await Score.findOneAndUpdate(
            { user: req.user._id },
            {
                $max: { score: score },
                $set: { username: req.user.username }
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        res.json({
            message: "Score submitted successfully!",
            score: savedScore.score
        });

    } catch (error) {
        console.error("Score submission error:", error);

        res.status(500).json({
            message: "Could not submit score."
        });
    }
});

// Get the top 10 players
router.get("/top", async (req, res) => {
    try {
        const leaderboard = await Score.find()
            .sort({ score: -1, createdAt: 1 })
            .limit(10)
            .select("username score -_id");

        res.json(leaderboard);

    } catch (error) {
        console.error("Leaderboard error:", error);

        res.status(500).json({
            message: "Could not load leaderboard."
        });
    }
});

module.exports = router;
