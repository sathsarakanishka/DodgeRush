const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/leaderboard", require("./routes/leaderboard"));

// Test route
app.get("/", (req, res) => {
    res.send("Car Dodge API is running!");
});


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );
    });