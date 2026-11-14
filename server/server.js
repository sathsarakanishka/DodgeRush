const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", require("./routes/auth"));

// Leaderboard routes
app.use("/api/leaderboard", require("./routes/leaderboard"));

// Test route
app.get("/", (req, res) => {
    res.send("Car Dodge API is running!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(process.env.PORT || 5000, () => {
            console.log("Server running on port 5000");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });