<<<<<<< Updated upstream

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
=======
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

>>>>>>> Stashed changes
        const score = Number(req.body.score);

        if (!Number.isSafeInteger(score) || score < 0) {
            return res.status(400).json({
                message: "Invalid score."
            });
        }

<<<<<<< Updated upstream
        // Save the player's highest score
        const savedScore = await Score.findOneAndUpdate(
            { user: req.user._id },
            {
                $max: { score: score },
                $set: { username: req.user.username }
=======
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
>>>>>>> Stashed changes
            },
            {
                new: true,
                upsert: true,
<<<<<<< Updated upstream
                setDefaultsOnInsert: true
=======
                runValidators: true
>>>>>>> Stashed changes
            }
        );

        res.json({
<<<<<<< Updated upstream
            message: "Score submitted successfully!",
            score: savedScore.score
=======
            message: "Score saved successfully.",
            bestScore: savedScore.score
>>>>>>> Stashed changes
        });

    } catch (error) {
        console.error("Score submission error:", error);

        res.status(500).json({
<<<<<<< Updated upstream
            message: "Could not submit score."
=======
            message: "Could not save score."
>>>>>>> Stashed changes
        });
    }
});

<<<<<<< Updated upstream
// Get the top 10 players
router.get("/top", async (req, res) => {
    try {
        const leaderboard = await Score.find()
            .sort({ score: -1, createdAt: 1 })
            .limit(10)
            .select("username score -_id");

        res.json(leaderboard);
=======

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
>>>>>>> Stashed changes

    } catch (error) {
        console.error("Leaderboard error:", error);

        res.status(500).json({
            message: "Could not load leaderboard."
        });
    }
});

<<<<<<< Updated upstream
module.exports = router;
=======
module.exports = router;
>>>>>>> Stashed changes
