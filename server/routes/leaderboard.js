const express = require("express");
const jwt = require("jsonwebtoken");

const Score = require("../models/Score");
const User = require("../models/User");

const router = express.Router();


// Get the logged-in user from the JWT token
async function getLoggedInUser(req) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return null;
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    return await User.findById(decoded.userId);
}


// Submit or update the player's best score
router.post("/submit", async (req, res) => {
    try {
        const user = await getLoggedInUser(req);

        if (!user) {
            return res.status(401).json({
                message: "Please log in."
            });
        }

        const score = Number(req.body.score);

        if (!Number.isSafeInteger(score) || score < 0) {
            return res.status(400).json({
                message: "Invalid score."
            });
        }

        // Keep the highest score for this player
        const savedScore = await Score.findOneAndUpdate(
            { user: user._id },
            {
                $max: {
                    score: score
                },
                $set: {
                    username: user.username
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.json({
            message: "Score saved successfully.",
            bestScore: savedScore.score
        });

    } catch (error) {
        console.error("Score submission error:", error);

        res.status(500).json({
            message: "Could not save score."
        });
    }
});


// Get the logged-in player's best score
router.get("/best", async (req, res) => {
    try {
        const user = await getLoggedInUser(req);

        if (!user) {
            return res.status(401).json({
                message: "Please log in."
            });
        }

        const savedScore = await Score.findOne({
            user: user._id
        });

        res.json({
            bestScore: savedScore ? savedScore.score : 0
        });

    } catch (error) {
        console.error("Get best score error:", error);

        res.status(500).json({
            message: "Could not load best score."
        });
    }
});


// Get the top 10 players
router.get("/top", async (req, res) => {
    try {
        const scores = await Score.find()
            .sort({
                score: -1,
                createdAt: 1
            })
            .limit(10)
            .select("username score -_id");

        res.json(scores);

    } catch (error) {
        console.error("Leaderboard error:", error);

        res.status(500).json({
            message: "Could not load leaderboard."
        });
    }
});

module.exports = router;
